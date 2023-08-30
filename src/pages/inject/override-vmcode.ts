/**
 * override miniapp vmcode via http-intercept
 */

console.log("init script:override miniapp vmcode via http-intercept");

const enableExtMark = '?_mpdevtool_=1';

const xhookRules = [
  {
    // 匹配小程序配置文件
    match: (req: any) => req.url.includes('manifest.json'),
    override: (resp: any) => {
      const content = JSON.parse(resp.data);
      // 判定为小程序配置文件
      if (
        content.hasOwnProperty('frame') ||
        content.hasOwnProperty('name') ||
        content.hasOwnProperty('main') ||
        content.hasOwnProperty('version')
      ) {
        content.main += enableExtMark;
        resp.data = JSON.stringify(content);
        resp.text = JSON.stringify(content);
        console.log('eder resp after', resp)
      }
    }
  },
  {
    match: (req: any) => req.url.includes(enableExtMark),
    override: (resp: any) => {
      console.log('eder resp', resp);
      const injectVmCode = `console.log('eder 1122333');`;
      const vmcode = `(function(){${injectVmCode}}());\n` + resp.text;
      resp.data = vmcode;
      resp.text = vmcode;
    }
  }
];

window.xhook.after(function (request, resp) {
  xhookRules.forEach(rule => {
    if (rule.match(request)) {
      rule.override(resp);
    }
  });
});
