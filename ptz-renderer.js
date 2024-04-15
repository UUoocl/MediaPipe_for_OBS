
async function handleGetPTZ() {
  let PTdata = await window.electronAPI.handleRunCommand("./uvc-util -I 1 -o pan-tilt-abs");
  let Zdata = await window.electronAPI.handleRunCommand("./uvc-util -I 1 -o zoom-abs");

  //format PTZ data for websocket JSON
  
  //exec('./uvc-util -I 0 -o pan-tilt-abs',(err, stdout, stderr) => {
  // //Tranform uvc-util results
  // let pt = stdout.replace("{pan=", "").replace("}","")
  // let pEnd = pt.search(",") 
  
  // // -- Insta360 min and max pan -500000 to +500000.  Scaled to 0-100
  // // -- OBSBOT Tiny 2 min and max pan -450000 to +450000.  Scaled to 0-100
  // let p = Math.floor(((Number(pt.substring(0,pEnd-1))+450000)/900000)*100)
  // // -- Insta360 min and max tilt -300000 to +300000.  Scaled to 0-100
  // // local t = math.floor(((tonumber(string.sub(pt,pEnd+6))+300000)/600000)*100)
  // let t = Math.floor(((Number(pt.substring(pEnd+6))+450000)/900000)*100)

  
  // console.log("pt",pt,"pEnd", pEnd,"P", p, "t", t);

// //--Get Zoom Value
// command = pwd .. "/uvc-util -I 1 -o zoom-abs"
// obs.script_log(obs.LOG_INFO, "Executing command: " .. command)
// zoomOutput = tonumber(os.capture(command))
// obs.script_log(obs.LOG_INFO, "Zoom Output: " .. zoomOutput)

}
