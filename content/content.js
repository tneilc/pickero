
document.addEventListener("click", clickEventHandler, false);

var text = document.getElementById("popo");
function clickEventHandler(event) {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");

  chrome.runtime.sendMessage({ message: "screen" }, (ss) => {
    let image = new Image();
    image.src = ss.src;
    image.onload = function () {
      //naturalWidth: it is the original width of the image used in tag.
      //width: it is the value/default value of width attribute of tag.

      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;
      context.drawImage(image, 0, 0);

      let x = event.clientX * window.devicePixelRatio;
      let y = event.clientY * window.devicePixelRatio;

      let colors = context.getImageData(x, y, 1, 1).data;

      console.log([colors[0], colors[1], colors[2]]);
      console.log(rgbToHex(colors[0], colors[1], colors[2]));

      chrome.runtime.sendMessage({
        message: "change_color",
        data: rgbToHex(colors[0], colors[1], colors[2]),
      });
    };
  });
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
