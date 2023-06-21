// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"8lqZg":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
let video = document.getElementById("webcam");
let webcamCanvas = document.getElementById("canvas");
let webcamCanvasCtx = webcamCanvas.getContext("2d");
//In Memory Canvas used for model prediction
var tempCanvas = document.createElement("canvas");
var tempCanvasCtx = tempCanvas.getContext("2d");
let previousSegmentationComplete = true;
let segmentationProperties = {
    segmentationThreshold: 0.7,
    internalResolution: "full"
};
var model;
bodyPix.load().then(function(loadedModel) {
    model = loadedModel;
});
function main() {
    if (navigator.mediaDevices.getUserMedia) navigator.mediaDevices.getUserMedia({
        video: true
    }).then((stream)=>{
        video.srcObject = stream;
    }).catch((e)=>{
        console.log("Error occurred while getting the video stream");
    });
    video.onloadedmetadata = ()=>{
        webcamCanvas.width = video.videoWidth;
        webcamCanvas.height = video.videoHeight;
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
    };
    video.addEventListener("loadeddata", segmentPersons);
}
function segmentPersons() {
    tempCanvasCtx.drawImage(video, 0, 0);
    if (previousSegmentationComplete) {
        previousSegmentationComplete = false;
        // Now classify the canvas image we have available.
        model.segmentPerson(tempCanvas, segmentationProperties).then((segmentation)=>{
            processSegmentation(segmentation);
            previousSegmentationComplete = true;
        });
    }
    //Call this function repeatedly to perform segmentation on all frames of the video.
    window.requestAnimationFrame(segmentPersons);
}
function processSegmentation(segmentation) {
    var imgData = tempCanvasCtx.getImageData(0, 0, webcamCanvas.width, webcamCanvas.height);
    //Loop through the pixels in the image
    for(let i = 0; i < imgData.data.length; i += 4){
        let pixelIndex = i / 4;
        //Make the pixel transparent if it does not belong to a person using the body-pix model's output data array.
        //This removes all pixels corresponding to the background.
        if (segmentation.data[pixelIndex] == 0) imgData.data[i + 3] = 0;
    }
    //Draw the updated image on the canvas
    webcamCanvasCtx.putImageData(imgData, 0, 0);
}
exports.default = main();

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}]},["8lqZg"], "8lqZg", "parcelRequirea730")

//# sourceMappingURL=index.975ef6c8.js.map
