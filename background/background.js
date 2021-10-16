chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message == "screen") {
    chrome.tabs.captureVisibleTab(
      chrome.windows.WINDOW_ID_CURRENT,
      function (result) {
        sendResponse({ src: result, message: "successful" });
        return true;
      }
    );
  }
  else if(request.message == "change_color"){
    saveColor(request.data);
  }
  return true;
});

function saveColor(color) {
  chrome.storage.local.get({ colors: [] }, function (data) {
    var colors = data.colors
    if (colors.length == 10) {
      colors = [];
      colors.push(color);
    } else {
      colors.push(color);
    }

    chrome.storage.local.set({ colors }, function () {
      if (typeof callback === "function") {
        //If there was no callback provided, don't try to call it.
        callback();
      }
    });
  });
}




