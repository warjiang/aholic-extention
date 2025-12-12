export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  // On extension install, configure the sidebar behavior
  browser.runtime.onInstalled.addListener(async () => {
    try {
      // Check if browser supports setPanelBehavior (Chrome 114+)
      if ('sidePanel' in browser && typeof browser.sidePanel?.setPanelBehavior === 'function') {
        // Configure Chrome to open the sidebar when the action button is clicked
        await browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
        console.log('Sidebar configured to open on action button click');
      }
    } catch (error) {
      console.error('Failed to configure sidebar on install:', error);
    }
  });

  // Listen for extension action button click
  // This is a fallback in case setPanelBehavior doesn't work as expected
  browser.action.onClicked.addListener(async () => {
    try {
      // Get current tab ID
      const [currentTab] = await browser.tabs.query({ active: true, currentWindow: true });

      // Check if browser has sidePanel.open API
      if ('sidePanel' in browser && typeof browser.sidePanel?.open === 'function' && currentTab?.id) {
        try {
          await browser.sidePanel.open({ tabId: currentTab.id });
          console.log('Sidebar opened via fallback API');
        } catch (openError) {
          // Ignore errors if sidebar is already open
          console.log('Sidebar open error (likely already open):', openError);
        }
      }
    } catch (error) {
      console.error('Failed to handle action button click:', error);
    }
  });
});
