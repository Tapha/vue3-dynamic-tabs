<template>
  <div v-if="true" style="">
    This is the DynamicTabSettings component that sets up your tabs. You have
    not entered your props correctly.
  </div>
</template>

<script>
import expiringStorage from "../expiringStorage";
import store from "../store/dynamicTabs";
import { onMounted, provide, toRefs } from "vue";

export default {
  props: {
    cacheLifetime: {
      default: 5,
    },
    options: {
      type: Object,
      required: false,
      default: () => ({
        useUrlFragment: true,
        defaultTabHash: null,
      }),
    },
  },

  emits: ["changed", "clicked"],

  setup(props, context) {
    onMounted(() => {
      store.state.cacheLifetime = props.cacheLifetime;
      store.state.useUrlFragment = props.options.useUrlFragment;
      store.state.defaultTabHash = props.options.defaultTabHash;

      const storageKey = `vue3-dynamic-tabs.cache.${window.location.host}${window.location.pathname}`;
      store.state.storageKey = storageKey;

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

      store.selectTab(store.state.tabs[0].hash, Event, context);
    });
    console.log(store);
    return {
      // ...toRefs(state),
      // selectTab,
      // findTab
    };
  },
};
</script>
