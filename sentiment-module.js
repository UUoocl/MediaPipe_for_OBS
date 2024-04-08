import {
  TextClassifier,
  FilesetResolver,
} from "./node_modules/@mediapipe/tasks-text/text_bundle.mjs";
console.log("Module started");
let poseLandmarker = undefined;

// Get the required elements
const input = document.getElementById("input");
const output = document.getElementById("output");
const submit = document.getElementById("submit");
const defaultTextButton = document.getElementById("populate-text");
const demosSection = document.getElementById("demos");
const text = []

let textClassifier;
// Create the TextClassifier object upon page load
const createTextClassifier = async () => {
  const text = await FilesetResolver.forTextTasks(
    "./node_modules/@mediapipe/tasks-text/wasm/"
  );
  textClassifier = await TextClassifier.createFromOptions(text, {
    baseOptions: {
      modelAssetPath: `./mediapipe_models/bert_classifier.tflite`,
      delegate: "GPU",
    },
    maxResults: 5,
  });

  // Show demo section now model is ready to use.
  demosSection.classList.remove("invisible");
};
createTextClassifier();

   //listen for Advanced Scene Switcher websocket events
   obs.on('CustomEvent', function(event) {
    console.log(event.event_name)
     if(event.event_name ==="localVocal"){
       text.push(event.event_data)
       console.log(event.event_data) 
       console.log(text) 
       processText()
      }
    })

// Add a button click listener that classifies text on click
async function processText(){
  input.innerText = text.shift()
  output.innerText = "Classifying...";

  await sleep(5);
  const result = textClassifier.classify(input.value);
  await displayClassificationResult(result);
  sendBrowserWebSocket(result)
  sendAdvSSWebSocket(result)

}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sendBrowserWebSocket(result){
  //send results to OBS Browser Source
  obs.call("CallVendorRequest", {
    vendorName: "obs-browser",
    requestType: "emit_event",
    requestData: {
      event_name: "sentimentResult",
      event_data: { result },
    },
  });
}

function sendAdvSSWebSocket(result){
      //send results to Advanced Scene Switcher
      const AdvancedSceneSwitcherMessage = JSON.stringify(result);
      obs.call("CallVendorRequest", {
        vendorName: "AdvancedSceneSwitcher",
        requestType: "AdvancedSceneSwitcherMessage",
        requestData: {
          message: "hi",
        },
      });
    }



// Iterate through the sentiment categories in the TextClassifierResult object, then display them in #output
async function displayClassificationResult(result) {
  if (result.classifications[0].categories.length > 0) {
    output.innerText = "";
  } else {
    output.innerText = "Result is empty";
  }
  const categories = [];
  // Single-head model.
  for (const category of result.classifications[0].categories) {
    const categoryDiv = document.createElement("div");
    categoryDiv.innerText = `${category.categoryName}: ${category.score.toFixed(
      2
    )}`;
    // highlight the likely category
    if (category.score.toFixed(2) > 0.5) {
      categoryDiv.style.color = "#12b5cb";
    }
    output.appendChild(categoryDiv);
  }
}

//Send results to OBS browser
