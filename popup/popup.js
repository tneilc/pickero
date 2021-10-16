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

document.addEventListener("DOMContentLoaded", function () {
  restoreSavedColors();
});

function restoreSavedColors() {
  console.log("okkk");
  chrome.storage.local.get({ colors: [] }, function (data) {
    colors = data.colors;
    console.log(colors)
    let history = document.getElementsByClassName("history");
    for (let index = 0; index < history.length; index++) {
      history[index].style.backgroundColor = colors[index];
    }
  });
}

var hex = document.getElementById("hex");
var rgb = document.getElementById("rgb");
var selectedColor = document.getElementById("color");
var button = document.getElementById("pick");

hex.addEventListener("click", function (event) {
  hex.select();
  navigator.clipboard.writeText(hex.value);
});

rgb.addEventListener("click", function (event) {
  rgb.select();
  if (rgb.value.startsWith("rgb")) {
    navigator.clipboard.writeText(rgb.value.split("(")[1].slice(0, -1));
  } else {
    navigator.clipboard.writeText(rgb.value);
  }
});

hex.addEventListener("change", function (event) {
  try {
    colorPicker.color.hexString = hex.value;
  } catch (error) {
    console.log(error);
  }
});

rgb.addEventListener("change", function (event) {
  try {
    if (rgb.value.startsWith("rgb(") && rgb.value.endsWith(")")) {
      colorPicker.color.rgbString = rgb.value;
    } else {
      colorPicker.color.rgbString = "rgb(" + rgb.value + ")";
    }
  } catch (error) {
    console.log(error);
  }
});

button.addEventListener("click", function () {
  console.log("done");
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "pick" });
  });
});

colorPicker.on(["color:init", "color:change"], function (color) {
  hex.value = color.hexString;
  rgb.value = color.rgbString;
  selectedColor.style.backgroundColor = color.hexString;
});

function saveColor(color) {
  chrome.storage.local.get({ colors: [] }, function (data) {
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

    let history = document.getElementsByClassName("history");
    for (let index = 0; index < history.length; index++) {
      history[index].style.backgroundColor = colors[index];
    }

  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message == "change_color") {
    colorPicker.color.hexString = request.data;
    saveColor(request.data)
  }
  return true;
});
