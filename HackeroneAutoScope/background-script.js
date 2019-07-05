//background-script.js



function sendRequest()
{

      browser.tabs.query({}).then(function(tabs){
      for(let tab of tabs)
      {
        if (tab.highlighted) {
          currentTabID=tab.id;
          browser.tabs.sendMessage(tab.id,{query: "ALERT"});
        }
      }
    });
}


browser.browserAction.onClicked.addListener(sendRequest);
