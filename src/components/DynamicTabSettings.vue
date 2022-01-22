<template>
  <div :class="wrapperClass">
    <ul role="tablist" :class="navClass">
      <li
          v-for="(tab, i) in tabs"
          :key="i"
          :class="[ navItemClass, tab.isDisabled ? navItemDisabledClass : '', tab.isActive ? navItemActiveClass : '' ]"
          role="presentation"
      >
        <a v-html="tab.header"
           :aria-controls="tab.hash"
           :aria-selected="tab.isActive"
           @click="store.selectTab(tab.hash, $event)"
           :href="tab.hash"
           :class="[ navItemLinkClass, tab.isDisabled ? navItemLinkDisabledClass : '', tab.isActive ? navItemLinkActiveClass : '' ]"
           role="tab"
        ></a>
      </li>
    </ul>
    <div :class="panelsWrapperClass">
    </div>
  </div>
</template>

<script>
import expiringStorage from '../expiringStorage';
import store from '../store/dynamicTabs'
import { provide, onMounted, toRefs} from 'vue';

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
    wrapperClass: {
      type: String,
      default: 'tabs-component'
    },
    panelsWrapperClass: {
      type: String,
      default: 'tabs-component-panels'
    },
    navClass: {
      type: String,
      default: 'tabs-component-tabs'
    },
    navItemClass: {
      type: String,
      default: 'tabs-component-tab'
    },
    navItemDisabledClass: {
      type: String,
      default: 'is-disabled'
    },
    navItemActiveClass: {
      type: String,
      default: 'is-active'
    },
    navItemLinkClass: {
      type: String,
      default: 'tabs-component-tab-a'
    },
    navItemLinkActiveClass: {
      type: String,
      default: 'is-active'
    },
    navItemLinkDisabledClass: {
      type: String,
      default: 'is-disabled'
    },
  },

  emits: ['changed', 'clicked'],

  setup(props, context) {
    provide('store', store);

    onMounted(() => {
      store.state.cacheLifetime = props.cacheLifetime;
      store.state.useUrlFragment = props.options.useUrlFragment;
      store.state.defaultTabHash = props.options.defaultTabHash;

      const storageKey = `vue3-dynamic-tabs.cache.${window.location.host}${window.location.pathname}`
      store.state.storageKey = storageKey;

      if (!store.state.tabs.length) {
        return;
      }

      window.addEventListener('hashchange', () => store.selectTab(window.location.hash, Event, context));

      if (store.methods.findTab(window.location.hash)) {
        store.selectTab(window.location.hash, Event, context);
        return;
      }

      const previousSelectedTabHash = expiringStorage.get(store.state.storageKey);

      if (store.methods.findTab(previousSelectedTabHash)) {
        store.selectTab(previousSelectedTabHash, Event, context);
        return;
      }

      if (store.state.defaultTabHash && store.methods.findTab("#" + store.state.defaultTabHash)) {
        store.selectTab("#" + store.state.defaultTabHash, Event, context);
        return;
      }

      store.selectTab(state.tabs[0].hash, Event, context);
    })

    return {
      // ...toRefs(state),
      // selectTab,
      // findTab
    }
  }
}
</script>
