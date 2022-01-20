import Tab from './components/Tab.vue';
import Tabs from './components/Tabs.vue';
import DynamicTab from './components/DynamicTab.vue';
import DynamicTabContent from './components/DynamicTabContent.vue';

export default {
    install(Vue) {
        Vue.component('tab', Tab);
        Vue.component('tabs', Tabs);
        Vue.component('dynamic-tab', DynamicTab);
        Vue.component('dynamic-tab-content', DynamicTabContent);
    },
};

export { Tab, Tabs, DynamicTab, DynamicTabContent };