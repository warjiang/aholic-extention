export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  // Register side panel (Chrome only)
  const chromeApi = (window as any)?.chrome;
  if (chromeApi?.sidePanel) {
    // Configure the side panel
    chromeApi.sidePanel
      .setPanelBehavior({ openPanelOnActionClick: true })
      .catch((error: any) => console.error('Failed to set panel behavior:', error));

    // Set sidebar content on install
    chromeApi.runtime.onInstalled.addListener(() => {
      chromeApi.sidePanel.setOptions({
        path: 'sidebar.html',
        // defaultPanelWidth: 350,
      });
    });
  }
});
