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
  const [tabId, setTabId] = useState<string | number>('tabId');
  useEffect(() => {
    function init(id: number) {
      const bgConnection = chrome.runtime.connect({
        name: id ? id.toString() : undefined,
      });
      bgConnection.onMessage.addListener(
        msg => {
          setMsgs(prev => ([...prev, ({ msg, mark: 'eder' })]));
        }
      );
    }

    init(chrome.devtools.inspectedWindow.tabId);

    chrome.runtime.onMessage.addListener(function (msg, sender, response) {
      setMsgs(prev => ([...prev, msg]));
      response();
    });
  }, []);
  return (
    <div className="container">
      <h1 className="text-lime-400">Dev Tools Panel</h1>
      <h1>{tabId}</h1>
      <div>
        {
          msgs.map(d => JSON.stringify(d))
        }
      </div>
    </div>
  );
};

export default Panel;
