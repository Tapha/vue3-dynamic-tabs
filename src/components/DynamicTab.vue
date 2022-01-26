<template>
  <component
    :is="tag"
    :aria-controls="tab.hash"
    :aria-selected="tab.isActive"
    @click="selectTab(tab.hash, $event, context)"
    :href="tab.hash"
    :class="[
      tab.isDisabled ? diabledClass : '',
      tab.isActive ? activeClass : '',
    ]"
    role="tab"
  >
    <span v-if="!hasDynamicTabSlot">{{ tabName }}</span>
    <slot name="dynamicTabSlot" v-if="hasDynamicTabSlot" />
  </component>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import expiringStorage from "../expiringStorage";
import store from "../store/dynamicTabs";
import {
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  watch,
  inject,
  ref,
  toRefs,
  computed,
} from "vue";

export default {
  name: "DynamicTab",
  props: {
    id: {
      type: String,
      default: null
    },
    tag: {
      type: String,
      default: "button",
    },
    tabName: {
      type: String,
      default: "tab name here",
    },
    prefix: {
      type: String,
      default: "",
    },
    suffix: {
      type: String,
      default: "",
    },
    activeClass: {
      type: String,
      default: "",
    },
    disabledClass: {
      type: String,
      default: "",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["changed", "clicked"],

  setup(props, context) {
    let { slots } = context;

    let hasDynamicTabSlot = computed(() => {
      return !!slots.dynamicTabSlot;
    });

    const uuid = uuidv4();

    const isActive = ref(false);

    const header = props.prefix + props.tabName + props.suffix;
    const computedId = props.id ? props.id : uuid;
    const hash = '#' + (!props.isDisabled ? computedId : '');

    const tab = {
      name: props.tabName,
      header: header,
      isDisabled: props.isDisabled,
      hash: hash,
      index: store.state.tabs.length,
      computedId: computedId,
    };

    store.methods.addTab(tab);

    const selectTab = (selectedTabHash, event) => {
      if (event && !store.state.useUrlFragment) {
        event.preventDefault();
      }

      const selectedTab = store.methods.findTab(selectedTabHash);

      if (!selectedTab) {
        return;
      }

      if (event && selectedTab.isDisabled) {
        event.preventDefault();
        return;
      }

      if (store.state.lastActiveTabHash === selectedTab.hash) {
        context.emit("clicked", { tab: selectedTab });
        return;
      }

      store.state.tabs.forEach((tab) => {
        tab.isActive = tab.hash === selectedTab.hash;
      });

      context.emit("changed", { tab: selectedTab });

      store.state.lastActiveTabHash = store.state.activeTabHash =
        selectedTab.hash;

      expiringStorage.set(
        store.state.storageKey,
        selectedTab.hash,
        store.state.cacheLifetime
      );
    };

    watch(
      () => store.activeTabHash,
      () => {
        isActive.value = hash === store.activeTabHash;
      }
    );

    watch(
      () => Object.assign({}, props),
      () => {
        store.methods.updateTab(computedId, tab);
      }
    );

    onBeforeUnmount(() => {
      store.methods.deleteTab(computedId);
    });

    onMounted(() => {
      if (!store.state.tabs.length) {
        return;
      }

      window.addEventListener("hashchange", () =>
        selectTab(window.location.hash)
      );

      if (store.methods.findTab(window.location.hash)) {
        selectTab(window.location.hash);
        return;
      }

      const previousSelectedTabHash = expiringStorage.get(
        store.state.storageKey
      );

      if (store.methods.findTab(previousSelectedTabHash)) {
        selectTab(previousSelectedTabHash);
        return;
      }

      if (
        store.state.defaultTabHash &&
        store.methods.findTab("#" + store.state.defaultTabHash)
      ) {
        selectTab("#" + store.state.defaultTabHash);
        return;
      }

      selectTab(state.tabs[0].hash);
    });

    return {
      tab,
      store,
      selectTab
    };
  },
};
</script>
