/**
 * override miniapp vmcode via http-intercept
 */

console.log("init script:override miniapp vmcode via http-intercept");

window.xhook.after(function (request, response) {
  // if (request.url.match(/to-agree\\/count\\/v2/)) {
    // response.text = 'test';
    console.log('eder22', response);
  // }
});
// TODO: 绑定endpoint （manifest.json）
// TODO: 是否能在web page直接拦截
