import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    action: {
      default_icon: 'icon/16.png',
    },
    side_panel: {
      default_path: 'sidebar.html',
      // default_width: 350,
    },
    permissions: ['sidePanel']
  },
});
