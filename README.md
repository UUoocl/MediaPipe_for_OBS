# MediaPipe_for_OBS
An Electron App to send MediaPipe data to OBS. Landmark positions from the MediaPipe pose model are sent to an OBS Text Soure.   
The Text Source can be read by the Advanced Scene Switcher or a Browser Source.  
```mermaid
graph TD;
subgraph OBS
A(Sources)-->B(Video Projector Window);
A<-->D[Advanced Scene Switcher];
end

B(Projector Window)--> C(MediaPipe for OBS);

C <---> |WebSocket|A;
```

## OBS Setup
To work the MediaPipe for OBS app needs 
1. the OBS Web Socket Server and
2. 2 OBS sources, and
3. a Projector window   
![image](https://github.com/UUoocl/MediaPipe_for_OBS/assets/99063397/a6927c6b-2894-44f5-bdb5-6c33a798555b)


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


### Create a Text Source
Name the the Text Source **KeyPointValues**
The landmarks will be stored in this Text Source in JSON format.  
![image](https://github.com/UUoocl/MediaPipe_for_OBS/assets/99063397/c163f4b1-0455-41b0-9709-605d32f31a69)

Each Landmark has an X, Y and Z coordinate.  


## Using MediaPipe for OBS
Download the latest [release](https://github.com/UUoocl/MediaPipe_for_OBS/releases)
![image](https://github.com/UUoocl/MediaPipe_for_OBS/assets/99063397/093f216d-4c09-4cec-8c47-b659178a49d9)

- ### Enter the OBS WebSocket details 

- ### Choose a projector window
- ### press the "Start MediaPipe" Button
![image](https://github.com/UUoocl/MediaPipe_for_OBS/assets/99063397/eb79cb1e-82ab-4351-abbe-862b0245964e)


## Dev install
```
npm install electron --save-dev
```
```
npm run start
```


```
npm install --save-dev @electron-forge/cli
npx electron-forge import
```

```
npm run make
```
