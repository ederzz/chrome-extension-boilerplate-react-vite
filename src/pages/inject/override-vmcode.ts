/**
 * override miniapp vmcode via http-intercept
 */

console.log("eder init script:override miniapp vmcode via http-intercept", document.title);

const infoCode = `console.log('Your miniapp is control by miniapp-devtool!1');IDP.UI.toast.warn('Your miniapp is control by miniapp-devtool!1');`;
const enableExtMark = '?_mpdevtool_=1';
let vmInterceptCode: string;
const GetVmIntertceptCode = () => {
  if (!vmInterceptCode) {
    vmInterceptCode = (document.querySelector('#_mp_vm_override_') as any).innerText;
  }
  return vmInterceptCode;
}

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
        content.name += `(control by miniapp-devtool)`;
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
      const vmcode = infoCode + `${GetVmIntertceptCode()};` + resp.text;
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


