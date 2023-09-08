const fetchCode = () => fetch(chrome.runtime.getURL("src/pages/vmIntercept/index.js")).then(res => res.text());
fetchCode().then(code => {
    const div = document.createElement('div');
    div.innerText = code;
    div.id = '_mp_vm_override_';
    div.setAttribute('style', 'width:0;height:0;overflow:hidden;');
    document.body.appendChild(div);
});
