
/** send message to page window from content-script */
function postToPageScript(message: any) {
  window.postMessage(message, '*');
}

/** send message to ext-otherpart from content-script */
function post2devtool(message: any) {
  chrome.runtime.sendMessage(message, resp=> {
    console.log('eder content resp', resp)
  });
}

// window.addEventListener('message', evt => {
//   if (evt.data.source === 'Page2Content') {
//     post2devtool(evt.data);
//   }
// });

const div = document.createElement("div");
div.id = 'edereder'
document.body.appendChild(div);
div.addEventListener('click', () => {
  try {
    const data = JSON.parse(div.getAttribute('data'));
    post2devtool(data);
  } catch (error) {
    console.log('eder send vm message to devtool failed', error);
  }
});
