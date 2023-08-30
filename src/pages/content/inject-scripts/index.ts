// import "./xhook";

function injectScript(path: string, st: string) {
  const node = document.querySelector(st);
  const script = document.createElement("script");
  //   script.setAttribute("type", "text/javascript");
  script.setAttribute("src", path);
  script.setAttribute("class", "#eder");
  node.appendChild(script);
}

injectScript(chrome.runtime.getURL("xhook.min.js"), "head");
injectScript(chrome.runtime.getURL("src/pages/inject/index.js"), "head");
