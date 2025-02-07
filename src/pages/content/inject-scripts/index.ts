// import "./xhook";
// 注入 manifest/web_accessible_resources/xx.js到页面中
function injectScript(path: string, st: string) {
  const node = document.querySelector(st);
  const script = document.createElement("script");
  //   script.setAttribute("type", "text/javascript");
  script.setAttribute("src", path);
  script.setAttribute("class", "#eder");
  node.appendChild(script);
}

injectScript(chrome.runtime.getURL("xhook.min.js"), "head");
injectScript(chrome.runtime.getURL("src/pages/headScript/index.js"), "head");
injectScript(chrome.runtime.getURL("src/pages/bodyScript/index.js"), "body");
