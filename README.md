# Task Cut Video
#Створити API server з ендпойнтом
#POST /video
#Eндпойнт приймає параметр:
#video - відеофайл фомату .mp4 або .avi.
#На сервері відео обрізається до співвідношення сторін 1:1. Область що обрізається
#повинна бути по центру відео.
#У респонс має формат
#{
# croppedVideoUrl: "http://…"
#}
#croppedVideoUrl містить посилання на обрізане відео розміщене на сервері.
#Для обрізання відео використовувати утиліту командного рядка ffmpeg

1. Add ffmpeg on your PC (http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/)
2. git clone https://github.com/YuriyPro/Task.git
3. npm install
4. npm start
5. in browser open : http://localhost:8000/
6. select video file from folder in project (sample video for test) or download from https://www.learningcontainer.com/mp4-sample-video-files-download/
7. press "To cut video"
8. after cut will return croppedVideoUrl: "http://…"
