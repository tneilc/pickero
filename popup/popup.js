var colorPicker = new iro.ColorPicker("#picker", {
  width: 200,
  layout: [
    {
      component: iro.ui.Box,
    },
    {
      component: iro.ui.Slider,
      options: {
        id: "hue-slider",
        sliderType: "hue",
      },
    },
  ],
});

var hex = document.getElementById("hex");
var rgb = document.getElementById("rgb");
var selectedColor = document.getElementById("color");

colorPicker.on(["color:init", "color:change"], function (color) {
  hex.value = color.hexString;
  rgb.value = color.rgbString
  selectedColor.style.backgroundColor = color.hexString;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message == "change_color") {
      colorPicker.color.hexString = request.data;
      text.value = request.data;
 
  }
  return true;
});


