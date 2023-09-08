import "@pages/panel/Panel.css";
import React, { useEffect, useState } from "react";

const getActiveTab = (callback) => {
  let queryOptions = { active: true, currentWindow: true };
  chrome.tabs.query(queryOptions, ([tab]) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    }
    callback(tab && tab.id);
  });
};

// getActiveTab((id: number) => {
//   setTabId(id);
//   setInterval(() => {
//     chrome.tabs.sendMessage(id, {
//       source: '@devtool/otherpart/send2contentscript'
//     }, function () {
//       console.log("收到响应");
//     })
//   }, 2e3);
// });

const Panel: React.FC = () => {
  const [msgs, setMsgs] = useState([]);
  const [tabId, setTabId] = useState<string | number>(chrome.devtools.inspectedWindow.tabId);
  useEffect(() => {
    var backgroundPageConnection = chrome.runtime.connect({
      name: "panel"
    });

    backgroundPageConnection.postMessage({
      name: 'init',
      tabId: 'chrome.devtools.inspectedWindow.tabId'
    });
    backgroundPageConnection.onMessage.addListener((msg, port) => {
      setMsgs(prev => ([...prev, msg]));
    });
  }, []);
  return (
    <div className="container">
      <h1 className="text-lime-400">Dev Tools Panel</h1>
      <h1>{tabId}</h1>
      <div>
        {
          msgs.map(d => {
            return (
              <div>{d.ns}</div>
            );
          })
        }
      </div>
    </div>
  );
};

export default Panel;
