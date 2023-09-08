try {
  // 注册devtool面板
  chrome.devtools.panels.create(
    "K-miniapp",
    "icon-34.png",
    "src/pages/devtoolPanel/index.html"
  );
} catch (e) {
  console.error(e);
}
