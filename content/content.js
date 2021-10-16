let div = document.createElement("div");
div.setAttribute("id", "currentColor");
div.style.padding = "20px";
div.style.borderRadius = "10px";
div.style.zIndex = "9999999";
div.style.position = "fixed";
div.style.display = "inline-block";
div.style.backgroundColor = "white";
div.style.boxShadow = "grey 0px 1px 4px";
div.style.top = "10px";
div.style.left = "10px";

function endEyeDrop() {
  document.removeEventListener("click", clickEventHandler, false);
  document.removeEventListener("mousemove", mouseMoveHandler);
  

  // Enable pointer events back
  var children = document.body.children;
  for (let i = 0; i < children.length; i++) {
    children[i].style.pointerEvents = "auto";
  }
}

function clickEventHandler(event) {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");

  chrome.runtime.sendMessage({ message: "screen" }, (ss) => {
    let image = new Image();
    image.src = ss.src;
    image.onload = function () {
      //naturalWidth: it is the original width of the image used in tag.
      //width: it is the value/default value of width attribute of tag.""

      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;
      context.drawImage(image, 0, 0);

      let x = event.clientX * window.devicePixelRatio;
      let y = event.clientY * window.devicePixelRatio;

      let colors = context.getImageData(x, y, 1, 1).data;
      var hexValue = rgbToHex(colors[0], colors[1], colors[2]);

      navigator.clipboard.writeText(hexValue);
      document.getElementById("currentColor").innerText = "Copied To Clipboard"


      chrome.runtime.sendMessage({
        message: "change_color",
        data: hexValue,
      });
    };
  });
  
  endEyeDrop();
  setTimeout(() => {
    document.body.removeChild(div);
  }, 1000);
  
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

let mouseMoveCanvas = document.createElement("canvas");
let mouseMoveContext = mouseMoveCanvas.getContext("2d");

function mouseMoveHandler(e) {
  x = e.offsetX * window.devicePixelRatio;
  y = e.offsetY * window.devicePixelRatio;
  let colors = mouseMoveContext.getImageData(x, y, 1, 1).data;
  var hexValue = rgbToHex(colors[0], colors[1], colors[2]);

  document.getElementById("currentColor").innerText = hexValue;
}

function setupMouseMovement() {
  chrome.runtime.sendMessage({ message: "screen" }, (ss) => {
    let image = new Image();
    image.src = ss.src;
    image.onload = function () {
      mouseMoveCanvas.height = image.naturalHeight;
      mouseMoveCanvas.width = image.naturalWidth;
      mouseMoveContext.drawImage(image, 0, 0);

      document.addEventListener("mousemove", mouseMoveHandler);
    };
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message == "pick") {
    //Disable pointer events to prevent clicking a button
    var children = document.body.children;
    for (let i = 0; i < children.length; i++) {
      if (children[i].id != "pickero") {
        children[i].style.pointerEvents = "none";
      }
    }

    document.body.insertBefore(div, document.body.firstChild);
    setupMouseMovement()

    
    document.addEventListener("click", clickEventHandler, false);
    
  }
  return true;
});
