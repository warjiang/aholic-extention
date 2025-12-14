import { init } from "react-grab/core";
import type { ReactGrabAPI, Options } from "react-grab";
import TurndownService from "turndown";

declare global {
  interface Window {
    __REACT_GRAB__?: ReactGrabAPI;
  }
}

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname.endsWith(".localhost");


const turndownService = new TurndownService();

let extensionApi: ReactGrabAPI | null = null;
let isExtensionEnabled = true;

const LOCALHOST_INIT_DELAY_MS = 500;


const createExtensionApi = () => {
  const options: Options = { enabled: isExtensionEnabled };

  if (!isLocalhost) {
    options.getContent = (elements) => {
      const combinedHtml = elements.map((element) => element.outerHTML).join("\n\n");
      return turndownService.turndown(combinedHtml);
    };
  }

  extensionApi = init(options);
  window.__REACT_GRAB__ = extensionApi;
};

const initializeReactGrab = () => {
  if (window.__REACT_GRAB__) {
    extensionApi = window.__REACT_GRAB__;
    return;
  }

  if (isLocalhost) {
    // HACK: Wait for page's react-grab to initialize first on localhost
    setTimeout(() => {
      if (window.__REACT_GRAB__) {
        extensionApi = window.__REACT_GRAB__;
        return;
      }
      createExtensionApi();
    }, LOCALHOST_INIT_DELAY_MS);
  } else {
    createExtensionApi();
  }
};



const handleToggle = (enabled: boolean) => {
  isExtensionEnabled = enabled;

  if (enabled) {
    if (!extensionApi) {
      initializeReactGrab();
    } else {
      extensionApi.activate();
    }
  } else {
    if (extensionApi) {
      extensionApi.deactivate();
    }
  }
};


export default defineContentScript({
    matches: ['<all_urls>'], // 👈 必须指定！
    runAt: 'document_start',
    main(ctx) {
        console.log('injected scripts')
        window.addEventListener("react-grab:init", (event) => {
            const pageApi = (event as CustomEvent).detail as ReactGrabAPI;
            if (extensionApi && extensionApi !== pageApi) {
                extensionApi.dispose();
            }
            extensionApi = pageApi;
            window.__REACT_GRAB__ = pageApi;
        });


        
        
        browser.runtime.onMessage.addListener((message) => {
            console.log('message', message)
            if (message.type === "REACT_GRAB_TOGGLE") {
                handleToggle(message.enabled);
            }
        });

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initializeReactGrab);
        } else {
            initializeReactGrab();
        }
    },
});