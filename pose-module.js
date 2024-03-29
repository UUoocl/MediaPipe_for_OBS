import {
    PoseLandmarker,
    FilesetResolver,
    DrawingUtils,
  } from "./node_modules/@mediapipe/tasks-vision/vision_bundle.mjs";
  console.log("Module started");
  setTimeout(startTask, 2000);
  let poseLandmarker = undefined;

  const createPoseLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "./node_modules/@mediapipe/tasks-vision/wasm"
    );
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `./mediapipe_models/pose_landmarker_full.task`,
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numPoses: 1,
      outputSegmentationMasks: 0,
    });
  };
  createPoseLandmarker();

  function startTask() {
    console.log("called on settime");

    var lastVideoTime = -1;

    const video = document.getElementById("projector");
    const canvasElement = document.getElementById("output_canvas");
    const canvasCtx = canvasElement.getContext("2d");
    const drawingUtils = new DrawingUtils(canvasCtx);

    renderLoop();

    function renderLoop() {
      let startTimeMs = performance.now();
      if (video.currentTime !== lastVideoTime) {
        let poseLandmarkerResult = poseLandmarker.detectForVideo(
          video,
          startTimeMs
        );
        poseLandmarkerResult = poseLandmarkerResult.landmarks[0];
        //Draw landmarks on screen.
        lastVideoTime = video.currentTime;
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        drawingUtils.drawLandmarks(poseLandmarkerResult);
        drawingUtils.drawConnectors(
          poseLandmarkerResult,
          PoseLandmarker.POSE_CONNECTIONS
        );

        //processResults(poseLandmarkerResult.landmarks[0]);
        //send results to OBS Browser Source
        obs.call("CallVendorRequest", {
          vendorName: "obs-browser",
          requestType: "emit_event",
          requestData: {
            event_name: "pose-landmarks",
            event_data: { poseLandmarkerResult},
          },
        });
        
        //send results to Advanced Scene Switcher
        const AdvancedSceneSwitcherMessage = JSON.stringify(poseLandmarkerResult)
        obs.call("CallVendorRequest", {
          vendorName: "AdvancedSceneSwitcher",
          requestType: "AdvancedSceneSwitcherMessage",
          requestData: {
            "message": AdvancedSceneSwitcherMessage,
          },
        });

        console.log(poseLandmarkerResult);
        __electronLog.info(JSON.stringify(poseLandmarkerResult));
      }
      canvasCtx.restore();
      window.requestAnimationFrame(renderLoop);
    }
  }