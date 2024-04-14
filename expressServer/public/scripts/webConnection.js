class WebConnection extends EventTarget {
  /** @type {RTCPeerConnection} */
  #pc;
  /** @type {RTCDataChannel} */
  #dataChannel;
  /** @type {MediaStream} */
  #stream;
  #id = "";
  #isHost = false;

  constructor() {
    super();
    this.#id = Date.now() + Math.random();
  }

  get id() {
    return this.#id;
  }

  /**
   * Create the WebRTC connection between the host and client peers
   * @param { boolean } asHost True if this is the hosting peer
   */
  async create(asHost) {
    this.#isHost = asHost;

    const rtc = RTCPeerConnection;
    this.#pc = new rtc(webRTCConfig, webRTCConnection);

    const searchParams = new URLSearchParams(window.location.search);
    console.log(searchParams);
    console.log(searchParams.get("videoID"));
    
    // Host is assigned the audio and video source to share
    if (this.#isHost) {
      console.log("Welcome Host");
      //get a video stream
      if (searchParams.get("type") == "Video" || searchParams.get("type") == "AudioVideo") {
        console.log("Video stream");
        //console.log(navigator.mediaDevices.getSupportedConstraints());
        this.#stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {mandatory: {
            chromeMediaSource: "desktop",
              chromeMediaSourceId: searchParams.get("videoID"),
          },
        }});

        //add video track to streams
        for (const track of this.#stream.getTracks()) {
          this.#pc.addTrack(track, this.#stream);
        }

        //display host video element
        console.log("tracks",this.#stream.getTracks())
        const video = document.getElementById("hostVideo");
        video.autoplay = true;
        video.srcObject = this.#stream;
        video.muted = true;
        video.classList.remove("hide");
      }
      
      //get audio stream
      if (searchParams.get("type") == "Audio" || searchParams.get("type") == "AudioVideo") {
        console.log("Audio stream");
        this.#stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: searchParams.get("audioID") },
          video: false,
        });
        console.log(this.#stream);
        
        //add hostaudio to stream
        for (const track of this.#stream.getTracks()) {
          this.#pc.addTrack(track, this.#stream);
        }
      }
              
      const link = document.getElementById("clientLink");

      link.innerHTML = `URL for OBS Browser<br> http://localhost:${Number(
        window.location.port
      )}/indexp5.html`;
      link.classList.remove("hide");
      link.classList.add("client");
      console.log("Host tracks added: ",this.#stream.getTracks())
    }

    

    // Forward any ice candidates to the server
    this.#pc.onicecandidate = (e) => {
      if (!e || !e.candidate) {
        return;
      }

      const candidate = e.candidate;
      this.#sendToWebSocket("candidate", candidate);
    };

    // Add tracks to the remote video element
    this.#pc.ontrack = (e) => {
      this.#stream = new MediaStream();
      this.#stream.addTrack(e.track);
      console.log(e.track)
      if(e.track.kind == "video"){
        const video = document.getElementById("video");
        video.autoplay = true;
        video.srcObject = this.#stream;
        console.log("video source object",video.srcObject)
        console.log("video element", video)
        video.classList.remove("hide");
      }
      if(e.track.kind == "audio"){
       const audio = document.getElementById("audio");
       //audio.autoplay = true;
       audio.srcObject = this.#stream;
       console.log("audio source object", audio.srcObject)
       console.log("audio element", audio)  
      audio.classList.remove("hide");
      }
      this.dispatchEvent(
        new CustomEvent("connected", { detail: this.#dataChannel })
      );
    };
    
    // Offer the connection as a host
    // A client joining will just recieve the offer via the cache in the server
    // TODO: Support multiple clients
    if (this.#isHost) {
      const sdpConstraints = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      };
      const sdp = await this.#pc.createOffer(sdpConstraints);
      await this.#pc.setLocalDescription(sdp);
      this.#sendToWebSocket("offer", sdp);
    }
    
    this.dispatchEvent(
      new CustomEvent("connected", { detail: this.#dataChannel })
    );
  }
  
  async onOffer(from, offer) {
    await this.#pc.setRemoteDescription(new RTCSessionDescription(offer));
    const sdp = await this.#pc.createAnswer();
    await this.#pc.setLocalDescription(sdp);
    this.#sendToWebSocket("answer", sdp);
  }
  
  async onIceCandidate(from, candidate) {
    await this.#pc.addIceCandidate(new RTCIceCandidate(candidate));
  }
  
  async onAnswer(from, answer) {
    await this.#pc.setRemoteDescription(new RTCSessionDescription(answer));
  }
  
  #sendToWebSocket(action, data) {
    this.dispatchEvent(
      new CustomEvent("signal", { detail: { id: this.#id, action, data } })
    );
  }
  
  #display(e) {
    this.dispatchEvent(new CustomEvent("display", { detail: e.data }));
  }
  
  #log(data) {
    this.dispatchEvent(new CustomEvent("log", { detail: data }));
  }
}

