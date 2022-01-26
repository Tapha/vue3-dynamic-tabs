# A Vue component to easily render tabs dynamically

[![Latest Version on NPM](https://img.shields.io/npm/v/vue3-dynamic-tabs.svg?style=flat-square)](https://npmjs.com/package/vue3-dynamic-tabs)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![npm](https://img.shields.io/npm/dt/vue3-dynamic-tabs.svg?style=flat-square)](https://www.npmjs.com/package/vue3-dynamic-tabs)

The package contains a [Vue 3](https://vuejs.org/) component to easily display tabs, dynamically.

### Vue 3 Dynamic Tabs allows you to:

- Set content of tabs to be whatever you want.
- Set tab buttons to be wherever you want.
- Style tabs and tab content areas to look however you want.

Its goal is to be the most open-ended, flexible tab system you can find.

# This is how it can be used:

```html
<div>
  <!-- Your Tab Settings -->
  <dynamic-tab-settings
    :options="{
        useUrlFragment: true,
        defaultTabHash: 'test-1'
      }"
  />
  <!-- Your Tabs -->
  <dynamic-tab tag="a" tabName="tab 1" />
  <dynamic-tab tag="a" tabName="tab 2" />
  <!-- Your Tab Content -->
  <dynamic-tab-content tabName="tab 1">
    This is the content of the first tab
  </dynamic-tab-content>
  <dynamic-tab-content tabName="tab 2">
    This is the content of the second tab
  </dynamic-tab-content>
</div>
```

Be sure to include the components in the correct order, as seen above to get the components to work as intended. These can be placed anywhere on the page, as long as they follow this order.

`<dynamic-tab-settings>` is where the other components are initialized so be sure to always include that first.

Then you add the `<dynamic-tab>` components, followed by the `<dynamic-tab-content>` components. Both of these again, in correct order.

`<dynamic-tab>` and `<dynamic-tab-content>` components are linked by `'tabName'` attributes.

When reloading the page the component will automatically [display the tab that was previously opened](https://github.com/Tapha/vue3-dynamic-tabs#disable-modifying-the-url-fragment).

The rendered output adheres to [the ARIA specification](http://heydonworks.com/practical_aria_examples/#tab-interface).

## Installation

You can install the package via yarn:

```bash
yarn add vue3-dynamic-tabs
```

or npm:

```bash
npm install vue3-dynamic-tabs --save
```

## Usage

The most common use case is to register the components globally:

```js
import { createApp } from "vue";
import {
  DynamicTab,
  DynamicTabContent,
  DynamicTabSettings,
} from "vue3-dynamic-tabs";

createApp(App)
  .component("dynamic-tab", DynamicTab)
  .component("dynamic-tab-content", DynamicTabContent)
  .component("dynamic-tab-settings", DynamicTabSettings)
  .mount("#app");
```

Alternatively you can do this to register the components:

```js
import Vue from "vue";
import {
  DynamicTab,
  DynamicTabContent,
  DynamicTabSettings,
} from "vue3-dynamic-tabs";

Vue.component("dynamic-tab", DynamicTab);
Vue.component("dynamic-tab-content", DynamicTabContent);
Vue.component("dynamic-tab-settings", DynamicTabSettings);
```

On your page you can now use html like this to render tabs:

```html
<div>
  <dynamic-tab-settings
    :options="{
        useUrlFragment: true,
        defaultTabHash: 'tab-1'
      }"
  />
  <dynamic-tab id="tab-1" tag="a" tabName="tab 1" />
  <dynamic-tab id="tab-2" tag="a" tabName="tab 2" />
  <dynamic-tab-content tabName="tab 1">
    This is the content of the first tab
  </dynamic-tab-content>
  <dynamic-tab-content tabName="tab 2">
    This is the content of the second tab
  </dynamic-tab-content>
</div>
```

By default, it will show the first tab.

If you click on a tab a `href` representation of the name will be append to the url. For example clicking on the tab `Second tab` will append `#second-tab` to the url.

When loading a page with a fragment that matches the `href` of a tab, it will open up that tab. For example visiting `/#third-tab` will open up the tab with name `Third tab`.

### Remembering the last opened tab

By default, the component will remember which was the last open tab for 5 minutes. If you, for instance, click on `Third tab` and then visit `/` the third tab will be opened.

You can change the cache lifetime by passing the lifetime in minutes in the `cache-lifetime` property of the `dynamic-tab-settings` component.

```html
<dynamic-tab-settings cache-lifetime="10" />
```

### Disable modifying the url fragment

When using with other libraries that use the url fragment, you can disable modifying the url fragment by passing the `useUrlFragment` options. This helps using it with vue-router, or using vue3-tabs-component twice in the same page.

```html
<dynamic-tab-settings :options="{ useUrlFragment: false }" />
```

### Callbacks

Tabs have two events to which you can bind: `changed` and `clicked`

```html
<dynamic-tab @clicked="tabClicked" @changed="tabChanged"> ... </dynamic-tab>
```

For example:

```js
export default {
  methods: {
    tabClicked(selectedTab) {
      console.log("Current tab re-clicked:" + selectedTab.tab.name);
    },
    tabChanged(selectedTab) {
      console.log("Tab changed to:" + selectedTab.tab.name);
    },
  },
};
```

`changed` is emitted when the tab changes and can be used as handle to load data on request.
`clicked` is emitted when an active tab is re-clicked and can be used to e.g. reload the data in the current tab.

### Setting a html element tag to tabs or tab-content

You can set the type of html element you want either tabs or tab-components to be by applying the 'tag' attribute to any of these two components. For example: `<dynamic-tab tag='a'>`, which will set the component to be an anchor link element. By defult `<dynamic-tab>` components are `button` elements and `<dynamic-tab-content>` components are `section` elements.

### Adding a suffix and a prefix to the tab name

You can add a suffix and a prefix to the tab by using the `suffix` and `prefix` attributes, which can contain HTML.

```html
<dynamic-tab prefix="my prefix - " name="First tab" suffix=" - my suffix">
  First tab content
</dynamic-tab>
```

The title of the tab will now be `my prefix - First tab - my suffix`.

The fragment that's added to the url when clicking the tab will only be based on the `name` of a tab, the `name-prefix` and `name-suffix` attributes will be ignored.

### Customizing fragments

When clicking on a tab it's name will be used as a fragment in the url. For example clicking on the `Second tab` will append `#second-tab` to the current url.

You can customize that fragment by using the `id` attribute.

```html
<div>
  <dynamic-tab id="custom-fragment" name="My tab">
    First tab content
  </dynamic-tab>
</div>
```

Clicking on `My tab` will then append `#custom-fragment` to the url.

### Setting a default tab

When disabling the cache, it can be useful to specify a default tab to load which is not the first one. You can select this by passing the `defaultTabHash` option.

```html
<dynamic-tab-settings
  :options="{
        defaultTabHash: 'tab-1'
      }"
/>
<dynamic-tab id="tab-1" tag="a" tabName="tab 1" />
<dynamic-tab id="tab-2" tag="a" tabName="tab 2" />
<dynamic-tab-content tabName="tab 1">
  This is the content of the first tab
</dynamic-tab-content>
<dynamic-tab-content tabName="tab 2">
  This is the content of the second tab
</dynamic-tab-content>
```

### CSS

You can add your own styles to the tag and tag content components by simply adding your own css classes to them, like this:

```html
<dynamic-tab
  id="tab-1"
  tabName="Preview"
  class="h-8 px-3 py-1 text-sm font-medium text-gray-600 transition border border-gray-200 rounded-r-none shadow active:shadow-inner rounded-l-md focus:outline-none bg-gray-50 hover:bg-gray-100 active:bg-gray-200"
>
  Preview
</dynamic-tab>
```

TailwindCSS classes can also be used, as in the above example.

## Security

If you discover any security related issues, please contact [Tapha](https://github.com/Tapha) instead of using the issue tracker.

## Credits

- [Spatie](https://spatie.be)
- [Freek Van der Herten](https://github.com/freekmurze)
- [Willem Van Bockstal](https://github.com/willemvb)
- [Sebastian De Deyne](https://github.com/sebastiandedeyne)
- [Jakub Potocký](https://github.com/jacobs63)
- [All Contributors](../../contributors)

**This package is a fork of a fork of the popular `spatie/vue-tabs-component` Vue 2 package, which has been discontinued by Spatie. As well as most recently, the `jacobs63/vue3-tabs-component` fork of that library, by [Jakub Potocký](https://github.com/jacobs63).**

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
