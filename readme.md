# Setup

- open a terminal and clone the repository

`git clone https://github.com/kikko/android-audioinput-videoplayer.git`

- add a [WebM](http://www.webmproject.org/) video called `output.webm` inside the `www/res` folder

- back in the terminal, navigate to the created folder

`cd android-audioinput-videoplayer`

- install cordova and the cordova-icon tool

```
brew install cordova
brew install node
npm install -g cordova-icon
```

- configure the android platform :

`cordova platform add android`

- install the app on the phone using :

`cordova run android`


# Troubleshooting

**The microphone doesn't work**

if the microphone doesn't work, make sure the microphone permission is enabled
in the phone settings : `Settings > Apps > Permissions > Microphone`

**My video is not in WebM format**

You can convert a mp4 video to webm using ffmpeg :

```
brew install libvpx
brew install ffmpeg --with-libvpx --with-libvorbis
ffmpeg -i input.mp4 -c:v libvpx -qmin 0 -qmax 20 -crf 5 -b:v 4M -an output.webm
```

:warning: `-an` parameter is used to remove audio
