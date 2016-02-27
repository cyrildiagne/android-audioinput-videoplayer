# install the app on the phone using
cordova run android

if the microphone doesn't work, make sure the microphone permission is enabled
in the phone settings > apps > permission > microphone

# convert a mp4 file to webm :
ffmpeg -i input.mp4 -c:v libvpx -qmin 0 -qmax 20 -crf 5 -b:v 4M -an output.webm
