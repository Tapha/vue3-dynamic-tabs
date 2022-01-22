import Tab from './components/Tab.vue';
import Tabs from './components/Tabs.vue';
import DynamicTab from './components/DynamicTab.vue';
import DynamicTabContent from './components/DynamicTabContent.vue';
import DynamicTabSettings from './components/DynamicTabSettings.vue';

export default {
    install(Vue) {
        Vue.component('tab', Tab);
        Vue.component('tabs', Tabs);
        Vue.component('dynamic-tab', DynamicTab);
        Vue.component('dynamic-tab-content', DynamicTabContent);
        Vue.component('dynamic-tab-settings', DynamicTabSettings);
    },
};

export { Tab, Tabs, DynamicTab, DynamicTabContent, DynamicTabSettings };