<template>
  <div v-if="!store.state.tabs" style="margin: 2em;">
    This is the DynamicTabSettings component that sets up your tabs. You have
    not added any tabs. Please add some by adding the dynamic-tab component.
  </div>
</template>

<script>
import expiringStorage from "../expiringStorage";
import store from "../store/dynamicTabs";
import { onMounted } from "vue";
import DynamicTab from './DynamicTab.vue';

export default {
  components: { DynamicTab },
  props: {
    cacheLifetime: {
      default: 5,
    },
    options: {
      type: Object,
      required: false,
      default: () => ({
        useUrlFragment: false,
        defaultTabHash: null,
      }),
    },
  },

  setup(props, context) {
    store.state.cacheLifetime = props.cacheLifetime;
    store.state.useUrlFragment = props.options.useUrlFragment;
    store.state.defaultTabHash = props.options.defaultTabHash;

    onMounted(() => {
      if (!store.state.tabs.length) {
        return;
      }

      if (store.state.useUrlFragment) {
        window.addEventListener('hashchange', () => store.selectTab(window.location.hash));
        if (store.methods.findTab(window.location.hash)) {
          store.selectTab(window.location.hash);
          return;
        }
      }

      const lastComputedId = expiringStorage.get(
        store.state.storageKey
      );

      const previousSelectedTabHash = store.methods.findTabByComputedId(lastComputedId);

      if (store.methods.findTab(previousSelectedTabHash)) {
        store.selectTab(previousSelectedTabHash, context);
        return;
      }

      if (
        store.state.defaultTabHash &&
        store.methods.findTab("#" + store.state.defaultTabHash)
      ) {
        store.selectTab("#" + store.state.defaultTabHash, context);
        return;
      }

      store.selectTab(store.state.tabs[0].hash, context);
    });
    return {
      store
    };
  },
};
</script>
