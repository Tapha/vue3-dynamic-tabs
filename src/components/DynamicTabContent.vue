<template>
  <component
    :is="tag"
    v-show="isActive"
    :aria-hidden="!isActive"
    :id="tab.computedId"
    role="tabpanel"
  >
    <slot/>
  </component>
</template>

<script>
import { inject, watch, ref, onMounted } from "vue";
import store from "../store/dynamicTabs";
export default {
  name: "DynamicTabContent",
  props: {
    tag: {
      type: String,
      default: "section",
    },
    tabName: {
      type: String,
      required: true,
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

  setup(props) {
    const isActive = ref(false);
    let tab = store.methods.findTabByName(props.tabName);

    watch(
      () => store.state.activeTabHash,
      () => {
        tab = store.methods.findTabByName(props.tabName);
        isActive.value = tab.hash === store.state.activeTabHash;
      }
    );

    onMounted(() => {
      tab = store.methods.findTabByName(props.tabName);
      isActive.value = tab.hash === store.state.activeTabHash;
    });

    return {
      tab,
      isActive,
    };
  },
};
</script>
