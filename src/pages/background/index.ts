import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

console.log("eder background loaded");

// 缓存通信链接
const connections = {};

// https://developer.chrome.com/docs/extensions/mv3/messaging/
// https://developer.chrome.com/docs/extensions/mv3/devtools/#content-script-to-devtools
// 同devtool建立连接
chrome.runtime.onConnect.addListener(function (port) {
  const extensionListener = function (message) {
    if (message.name == "init") {
      connections[message.tabId] = port;
      return;
    }
  }
  port.onMessage.addListener(extensionListener);
  port.onDisconnect.addListener(function (port) {
    port.onMessage.removeListener(extensionListener);
    const tabs = Object.keys(connections);
    for (let i = 0, len = tabs.length; i < len; i++) {
      if (connections[tabs[i]] == port) {
        delete connections[tabs[i]]
        break;
      }
    }
  });
});

// 接收content-script消息
chrome.runtime.onMessage.addListener(function (request, sender) {
  if (sender.tab) {
    const tabId = sender.tab.id;
    if (tabId in connections) {
      // 发送消息到devtool面板中
      connections[tabId].postMessage(request);
    } else {
      console.log("Tab not found in connection list.");
    }
  } else {
    console.log("sender.tab not defined.");
  }
  return true;
});
