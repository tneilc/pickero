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
  return true;
});
