<template>
  <component
    :is="tag"
    :aria-controls="tab.hash"
    :aria-selected="tab.isActive"
    @click="store.selectTab(tab.hash, $event)"
    :href="tab.hash"
    :class="[
      tab.isDisabled ? diabledClass : '',
      tab.isActive ? activeClass : '',
    ]"
    role="tab"
  >
    <span v-if="tabName">{{ tabName }}</span>
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
    const uuid = uuidv4();

    const isActive = ref(false);

    const header = props.prefix + props.tabName + props.suffix;
    const computedId = uuid;
    const hash = "#" + props.tabName.replace(/\s+/g, "-");

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
      console.log(tab);
    });

    onBeforeUnmount(() => {
      store.methods.deleteTab(computedId);
    });

    onMounted(() => {
      store.methods.addTab(tab);
      console.log(tab);
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
