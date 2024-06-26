# MediaPipe_for_OBS
An Electron App to send MediaPipe data to OBS. Landmark positions from the MediaPipe pose model are sent to OBS Browser Source and the Advanced Scene Switcher Plugin.   

How to set up MediaPipe for OBS
[![Get started using MediaPipe for OBS](https://github.com/UUoocl/MediaPipe_for_OBS/assets/99063397/9883bafc-fc2d-416a-ab4c-a4cb85643e69)](https://youtu.be/S-IjFVj6zyE)

https://youtu.be/S-IjFVj6zyE

```mermaid
graph LR;
subgraph OBS
  direction LR
  A(Video Source)-->B(Video Projector Window);
  D[Advanced Scene Switcher];
  E[Browser]
end

B(Projector Window)--> C(MediaPipe for OBS);

C ---> |WebSocket|E;
C ---> |WebSocket|D;

```

## OBS Setup
MediaPipe for OBS app requirements
1. Enable the OBS Web Socket Server ,
2. an OBS Video source with a projector window
3. A Browser or Advanced Scene Switcher to receive the landmark data



### Turn on OBS WebSocket Server
- In OBS menu bar, click Tools --> WebSocket Server Settings
- Check "Enable WebSocket server"
- Press the "Show Connect Info" button.
  - Copy the Server Password

### Create a Video Capture Device Source
- Create a "Video Capture Device" source to bring a camera into OBS. In the Video Capture Device Properties set the "Resolution Type" to `Custom`

![image](https://github.com/UUoocl/MediaPipe_for_OBS/assets/99063397/bf046b53-b8b9-403c-88d7-69c601a672ab)

- Open a Windowed Projector by  Right clicking (control+click for Mac) on the Video Capture Device source.
  - click Windowed Projector  
 ![image](https://github.com/UUoocl/MediaPipe_for_OBS/assets/99063397/dc80a9f6-c6a9-454c-af02-fcfe1d437be4)


### Create a Browser Source
Load a local html file with an event listener. 
The landmarks will be sent as an evnt named "pose-landmarks".  
See the creative example folder for example HTML pages.  
![image](https://github.com/UUoocl/MediaPipe_for_OBS/assets/99063397/6d158908-8a9d-41de-b0e1-e775edab998c)


Each Landmark has an X, Y, Z and Visability value.  

Messages are also sent the Advanced Scene Switcher Plugin with the values as the message

## Using MediaPipe for OBS
Download the latest

[release](https://github.com/UUoocl/MediaPipe_for_OBS/releases)

<img width="411" alt="image" src="https://github.com/UUoocl/MediaPipe_for_OBS/assets/99063397/59be3636-5a43-4232-8748-e6c66fe82628">



**MacOS note: Before using the MediaPipe for OBS, Add permissions in Settings-->Privacy & Security-->Screen Recording & System Audio. 

- ### Enter the OBS WebSocket details, and press the "Connect to OBS" button

- ### Choose a projector window
- ### press the "Start MediaPipe" Button
![image](https://github.com/UUoocl/MediaPipe_for_OBS/assets/99063397/eb79cb1e-82ab-4351-abbe-862b0245964e)

A log file of the landmarks is saved to the folder "~/Library/Logs/MediaPipe_for_OBS/"

## Dev install
Steps to setup a developement environment. 
```
npm install electron --save-dev
npm install --save-dev @electron-forge/cli
npm install --save-dev @electron-forge/plugin-fuses
```
```
npm run start
```


```
npx electron-forge import
```

```
npm run make
```


# OBS Connections
MediaPipe for OBS is a part of a meeting and presentation automation project. 

```mermaid
flowchart LR
PTZ[PTZ \nCamera Data]
GC[Game 🎮\n Controllers]
MP["MediaPipe\nfor OBS"]
GAS["Google \n Apps \n Scripts"]
GS["Google \n 🗃️"]
Midi["Midi 🎹 \n Devices"]
ZOSC[ZoomOSC]
spw["Source\nProjector\nWindow"]

PTZ-->MP
GC-->MP
Midi--"midi"-->MP
spw-->MP
ZOSC<--"osc"-->MP
MP <--"ws"-->wss
obs-b<--"js"-->GAS
GAS<--gs-->GS
obs-b<--"webRTC"-->MP

subgraph OBS[OBS]
    direction LR
    obs-b[browser]
    wss["WebSocket \nServer"]

    obs-b<--"ws"-->wss
    
    
end

linkStyle default stroke-width:4px,fill:none,stroke:green;
linkStyle 0,1,2,3 stroke-width:4px,fill:none,stroke:blue;

```
