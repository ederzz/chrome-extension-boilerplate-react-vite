import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

console.log("background loaded");

var connections = {};

// https://developer.chrome.com/docs/extensions/mv3/messaging/
// https://developer.chrome.com/docs/extensions/mv3/devtools/#content-script-to-devtools
chrome.runtime.onConnect.addListener(function (port) {
  var extensionListener = function (message) {

    // The original connection event doesn't include the tab ID of the
    // DevTools page, so we need to send it explicitly.
    console.log('eder message', message)
    if (message.name == "init") {
      connections[message.tabId] = port;
      return;
    }

    // other message handling
  }

  // Listen to messages sent from the DevTools page
  port.onMessage.addListener(extensionListener);

  port.onDisconnect.addListener(function (port) {
    port.onMessage.removeListener(extensionListener);

    var tabs = Object.keys(connections);
    for (var i = 0, len = tabs.length; i < len; i++) {
      if (connections[tabs[i]] == port) {
        delete connections[tabs[i]]
        break;
      }
    }
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('eder request', request, sender, connections);
  sendResponse();
  // Messages from content scripts should have sender.tab set
  // if (sender.tab) {
  //   var tabId = sender.tab.id;
  //   if (tabId in connections) {
      connections['chrome.devtools.inspectedWindow.tabId'].postMessage(request);
  //   } else {
  //     console.log("Tab not found in connection list.");
  //   }
  // } else {
  //   console.log("sender.tab not defined.");
  // }
  return true;
});
