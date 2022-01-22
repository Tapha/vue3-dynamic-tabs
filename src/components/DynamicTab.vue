<template>
  <component
    :is="tag"
    :aria-controls="tab.hash"
    :aria-selected="tab.isActive"
    @click="store.selectTab(tab.hash, $event)"
    :href="tab.hash"
    :class="[
      navItemLinkClass,
      tab.isDisabled ? navItemLinkDisabledClass : '',
      tab.isActive ? navItemLinkActiveClass : '',
    ]"
    role="tab"
  >
    <span v-if="tabName">{{ tabName }}</span>
    <slot v-if="!tabName" />
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
} from "vue";

export default {
  name: "DynamicTab",
  props: {
    panelClass: {
      type: String,
      default: "tabs-component-panel",
    },
    tag: {
      type: String,
      default: "button",
    },
    id: {
      type: String,
      default: null,
    },
    tabName: {
      type: String,
      default: null,
    },
    prefix: {
      type: String,
      default: "",
    },
    suffix: {
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
    const uuid = uuidv4();

    const isActive = ref(false);

    const header = props.prefix + props.tabName + props.suffix;
    const computedId = props.id
      ? props.id
      : props.tabName.toLowerCase().replace(/ /g, "-");
    const hash = "#" + (!props.isDisabled ? computedId : "");

    const tab = {
      name: props.tabName,
      header: header,
      isDisabled: props.isDisabled,
      hash: hash,
      index: store.tabs?.length,
      computedId: computedId,
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

    onBeforeMount(() => {
      store.methods.addTab(tab);
    });

    onBeforeUnmount(() => {
      store.methods.deleteTab(computedId);
    });

    onMounted(() => {
      if (!store.state.tabs.length) {
        return;
      }

      window.addEventListener("hashchange", () =>
        store.selectTab(window.location.hash, Event, context)
      );

      if (store.methods.findTab(window.location.hash)) {
        store.selectTab(window.location.hash, Event, context);
        return;
      }

      const previousSelectedTabHash = expiringStorage.get(
        store.state.storageKey
      );

      if (store.methods.findTab(previousSelectedTabHash)) {
        store.selectTab(previousSelectedTabHash, Event, context);
        return;
      }

      if (
        store.state.defaultTabHash &&
        store.methods.findTab("#" + store.state.defaultTabHash)
      ) {
        store.selectTab("#" + store.state.defaultTabHash, Event, context);
        return;
      }

      store.selectTab(state.tabs[0].hash, Event, context);
    });

    return {
      tab,
      store,
      // ...toRefs(state),
      // selectTab,
      // findTab
    };
  },
};
</script>
