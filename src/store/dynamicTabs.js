import expiringStorage from "../expiringStorage";
import { reactive } from "vue";

const storageKey = `vue3-dynamic-tabs.cache.${window.location.host}${window.location.pathname}`;

const state = reactive({
  useUrlFragment: false,
  defaultTabHash: null,
  activeTabHash: "",
  lastActiveTabHash: "",
  cacheLifetime: {
    default: 5,
  },
  storageKey: storageKey,
  tabs: [],
});

function selectTab(selectedTabHash, context, event) {
  if (event && !state.useUrlFragment) {
    event.preventDefault();
  }

  const selectedTab = methods.findTab(selectedTabHash);

  state.storageKey = storageKey + methods.findTab(selectedTabHash).computedId;

  if (!selectedTab) {
    return;
  }

  if (event && selectedTab.isDisabled) {
    event.preventDefault();
    return;
  }

  if (state.lastActiveTabHash === selectedTab.hash) {
    context.emit("clicked", { tab: selectedTab });
    return;
  }

  state.tabs.forEach((tab) => {
    tab.isActive = tab.hash === selectedTab.hash;
  });

  context.emit("changed", { tab: selectedTab });

  state.lastActiveTabHash = state.activeTabHash = selectedTab.hash;

  expiringStorage.set(state.storageKey, selectedTab.hash, state.cacheLifetime);
}

const methods = {
  addTab(tab) {
    state.tabs.push(tab);
  },
  updateTab(computedId, data) {
    let tabIndex = state.tabs.findIndex((tab) => tab.computedId === computedId);

    state.tabs[tabIndex] = data;
  },
  findTab(hash) {
    return state.tabs.find((tab) => tab.hash === hash);
  },
  findTabByName(tabName) {
    return state.tabs.find((tab) => tab.name === tabName);
  },
  deleteTab(computedId) {
    let tabIndex = state.tabs.findIndex((tab) => tab.computedId === computedId);

    state.tabs.splice(tabIndex, 1);
  },
};

export default {
  state,
  methods,
  selectTab,
};
