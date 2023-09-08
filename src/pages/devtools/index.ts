try {
  chrome.devtools.panels.create(
    "K-miniapp",
    "icon-34.png",
    "src/pages/panel/index.html"
  );
} catch (e) {
  console.error(e);
}
