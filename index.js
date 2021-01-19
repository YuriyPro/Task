//var ffmpeg = require('fluent-ffmpeg');
//var ffmpeg = require('ffmpeg');
const express = require('express');
const Jimp = require("jimp");
const util = require("util");
const bodyParser = require("body-parser");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const exec = util.promisify(require("child_process").exec);
const app = express();
const temp = __dirname+"\\tmp\\";
const allVideos =  __dirname+"\\videos\\";
const testAudio =  __dirname+"\\audios\\";
const movie =  __dirname+"\\movie\\";
const mediainfo = require('node-mediainfo');

app.use(bodyParser.json())




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  })
);


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/video", (req, res) => {
  
  async function convert() {
    try {
      var filename = req.files.file.name;
      console.log(filename);
      var type = filename.split('.').pop();
      console.log(type);
      if(`${movie}${filename}`){
        deleteFile(`${movie}`, `${filename}`);
      }

      if (type == "avi" || type == "mp4") {

        if (type == "mp4") {
          let file = req.files.file;
          file.mv(temp + filename, async function (err) {
            if (err) return res.sendStatus(500).send(err);
            console.log("File Uploaded successfully");

            const result = await mediainfo(temp + filename, function (err, res) {
              if (err) {
                return console.log(err);
              }
              console.log(res);
            });
            console.log("Decoding");
            //console.log(result.media);
            console.log(result.media.track[1].Width);
            console.log(result.media.track[1].Height);
            let width = result.media.track[1].Width;
            let height = result.media.track[1].Height;
            if (width > height) {
              console.log("Crop Mp4 video");
              console.log("Take audio from video file");
              let audio = await exec(`ffmpeg -i ${temp}${filename} -vn -map 0:1 ${testAudio}audio.wav -hide_banner`);
              if (audio.stderr) {
                console.log("Crop video file");
                let cropVideo = await exec(`ffmpeg -i ${temp}${filename} -vf crop=${height}:${height} -c:v libx264 -crf 0 ${allVideos}${filename} -hide_banner`);
                if (cropVideo.stderr) {
                  console.log("Create new video and add audio for him");
                  let fin = await exec(`ffmpeg -i ${allVideos}${filename} -i ${testAudio}audio.wav  -map 0:v -map 1:a  -shortest  ${movie}${filename} -hide_banner`);
                  if (fin.stderr) {
                    console.log("Finish ");
                    deleteFile(`${testAudio}`, 'audio.wav');
                    deleteFile(`${allVideos}`, `${filename}`);
                    deleteFile(`${temp}`, `${filename}`);
                    return res.status(200).send({
                      croppedVideoUrl: "http://" + `${movie}${filename}`,
                    });
                  } else {
                    deleteFile(`${movie}`, `${filename}`);
                  }
                } else {
                  deleteFile(`${allVideos}`, `${filename}`);
                }
              }
              else {
                deleteFile(`${testAudio}`, 'audio.wav');
              }

              // let fin = await exec(`ffmpeg -i ${temp}${filename} -vf crop=${height}:${height} -map 0:0 -map 1:0  ${movie}${filename}`);
              // console.log("finish");
              // if (fin) {
              //   deleteFile(`${temp}`, `${filename}`);
              //   return res.status(200).send({
              //     croppedVideoUrl: "http://" + `${movie}${filename}`,
              //   });
              //   //res.sendFile(`${movie}${filename}`);
              // }
            }
            if (height > width) {
              console.log("Crop Mp4 video");
              console.log("Take audio from video file");
              let audio = await exec(`ffmpeg -i ${temp}${filename} -vn -map 0:1 ${testAudio}audio.wav -hide_banner`);
              if (audio.stderr) {
                console.log("Crop video file");
                let cropVideo = await exec(`ffmpeg -i ${temp}${filename} -vf crop=${width}:${width} -c:v libx264 -crf 0 ${allVideos}${filename} -hide_banner`);
                if (cropVideo.stderr) {
                  console.log("Create new video and add audio for him");
                  let fin = await exec(`ffmpeg -i ${allVideos}${filename} -i ${testAudio}audio.wav  -map 0:v -map 1:a  -shortest  ${movie}${filename} -hide_banner`);
                  if (fin.stderr) {
                    console.log("Finish ");
                    deleteFile(`${testAudio}`, 'audio.wav');
                    deleteFile(`${allVideos}`, `${filename}`);
                    deleteFile(`${temp}`, `${filename}`);
                    return res.status(200).send({
                      croppedVideoUrl: "http://" + `${movie}${filename}`,
                    });
                  } else {
                    deleteFile(`${movie}`, `${filename}`)
                  }
                } else {
                  deleteFile(`${allVideos}`, `${filename}`)
                }
              }
              else {
                deleteFile(`${testAudio}`, 'audio.wav');
              }
            }
            else {
              console.log("Crop Mp4 video");
              console.log("Take audio from video file");
              let audio = await exec(`ffmpeg -i ${temp}${filename} -vn -map 0:1 ${testAudio}audio.wav -hide_banner`);
              if (audio.stderr) {
                console.log("Crop video file");
                let cropVideo = await exec(`ffmpeg -i ${temp}${filename} -vf crop=${width}:${height} -c:v libx264 -crf 0 ${allVideos}${filename} -hide_banner`);
                if (cropVideo.stderr) {
                  console.log("Create new video and add audio for him");
                  let fin = await exec(`ffmpeg -i ${allVideos}${filename} -i ${testAudio}audio.wav  -map 0:v -map 1:a  -shortest  ${movie}${filename} -hide_banner`);
                  if (fin.stderr) {
                    console.log("Finish ");
                    deleteFile(`${testAudio}`, 'audio.wav');
                    deleteFile(`${allVideos}`, `${filename}`);
                    deleteFile(`${temp}`, `${filename}`);
                    return res.status(200).send({
                      croppedVideoUrl: "http://" + `${movie}${filename}`,
                    });
                  } else {
                    deleteFile(`${movie}`, `${filename}`)
                  }
                } else {
                  deleteFile(`${allVideos}`, `${filename}`)
                }
              }
              else {
                deleteFile(`${testAudio}`, 'audio.wav');
              }
            }
          });
        }

        if (type == "avi") {
          let file = req.files.file;
          file.mv(temp + filename, async function (err) {
            if (err) return res.sendStatus(500).send(err);
            console.log("File Uploaded successfully");

            const result = await mediainfo(temp + filename, function (err, ress) {
              if (err) {
                return console.log(err);
              }
              console.log(ress);
            });
            console.log("Decoding");
            //console.log(result.media.track[1].Width);
            //console.log(result.media.track[1].Height);
            //console.log(result.media.track[2].Channels);
            //console.log(result.media.track[2].SamplingRate);
            //console.log(result.media.track[2].BitRate);
            let width = Number(result.media.track[1].Width);
            let height = Number(result.media.track[1].Height);
            //let channels=Number(result.media.track[2].Channels);
            //let rateSimple=Number(result.media.track[2].SamplingRate);
            //let bitRate=Number(result.media.track[2].BitRate);
            if (width > height) {
              console.log("Crop Avi video");
              console.log("Take audio from video file");
              let audio = await exec(`ffmpeg -i ${temp}${filename} -vn -map 0:1 ${testAudio}audio.wav -hide_banner`);
              if (audio.stderr) {
                console.log("Crop video file");
                let cropVideo = await exec(`ffmpeg -ss 0 -i ${temp}${filename} -filter:v crop=${height}:${height} -map 0:0 ${allVideos}${filename} -hide_banner`);
                if (cropVideo.stderr) {
                  console.log("Create new video and add audio for him");
                  let fin = await exec(`ffmpeg -i ${allVideos}${filename} -i ${testAudio}audio.wav  -map 0:v -map 1:a -c copy -shortest  ${movie}${filename} -hide_banner`);
                  if (fin.stderr) {
                    console.log("Finish");
                    deleteFile(`${testAudio}`, 'audio.wav');
                    deleteFile(`${allVideos}`, `${filename}`);
                    deleteFile(`${temp}`, `${filename}`);
                    return res.status(200).send({
                      croppedVideoUrl: "http://" + `${movie}${filename}`,
                    });
                  } else {
                    deleteFile(`${movie}`, `${filename}`)
                  }
                } else {
                  deleteFile(`${allVideos}`, `${filename}`)
                }
              }
              else {
                deleteFile(`${testAudio}`, 'audio.wav');
              }
            }
            if (height > width) {
              
              console.log("Crop Avi video");
              console.log("Take audio from video file");
              let audio = await exec(`ffmpeg -i ${temp}${filename} -vn -map 0:1 ${testAudio}audio.wav -hide_banner`);
              if (audio.stderr) {
                console.log("Crop video file");
                let cropVideo = await exec(`ffmpeg -ss 0 -i ${temp}${filename} -filter:v crop=${width}:${width} -map 0:0 ${allVideos}${filename} -hide_banner`);
                if (cropVideo.stderr) {
                  console.log("Create new video and add audio for him");
                  let fin = await exec(`ffmpeg -i ${allVideos}${filename} -i ${testAudio}audio.wav  -map 0:v -map 1:a -c copy -shortest  ${movie}${filename} -hide_banner`);
                  if (fin.stderr) {
                    console.log("Finish");
                    deleteFile(`${testAudio}`, 'audio.wav');
                    deleteFile(`${allVideos}`, `${filename}`);
                    deleteFile(`${temp}`, `${filename}`);
                    return res.status(200).send({
                      croppedVideoUrl: "http://" + `${movie}${filename}`,
                    });
                  } else {
                    deleteFile(`${movie}`, `${filename}`)
                  }
                } else {
                  deleteFile(`${allVideos}`, `${filename}`)
                }
              }
              else {
                deleteFile(`${testAudio}`, 'audio.wav');
              }
            }
            else {
              console.log("Crop Avi video");
              console.log("Take audio from video file");
              let audio = await exec(`ffmpeg -i ${temp}${filename} -vn -map 0:1 ${testAudio}audio.wav -hide_banner`);
              if (audio.stderr) {
                console.log("Crop video file");
                let cropVideo = await exec(`ffmpeg -ss 0 -i ${temp}${filename} -filter:v crop=${width}:${height} -map 0:0 ${allVideos}${filename} -hide_banner`);
                if (cropVideo.stderr) {
                  console.log("Create new video and add audio for him");
                  let fin = await exec(`ffmpeg -i ${allVideos}${filename} -i ${testAudio}audio.wav  -map 0:v -map 1:a -c copy -shortest  ${movie}${filename} -hide_banner`);
                  if (fin.stderr) {
                    console.log("Finish");
                    deleteFile(`${testAudio}`, 'audio.wav');
                    deleteFile(`${allVideos}`, `${filename}`);
                    deleteFile(`${temp}`, `${filename}`);
                    return res.status(200).send({
                      croppedVideoUrl: "http://" + `${movie}${filename}`,
                    });
                  } else {
                    deleteFile(`${movie}`, `${filename}`)
                  }
                } else {
                  deleteFile(`${allVideos}`, `${filename}`)
                }
              }
              else {
                deleteFile(`${testAudio}`, 'audio.wav');
              }
            }
          });
        }
      }
      else {
        res.status(500).json({ error: 'Error type' })
        return console.log('Error type');
      }

    } catch (error) {
      console.log(error);
    }
  };
  convert();
});

function deleteFile(pathToFile, fileName) {
  fs.unlink(pathToFile + fileName, function (err) {
    if (err) {
      throw err
    } else {
      console.log("Successfully deleted the file ---" + fileName)
    }
  })
}

// async function cropAvi(width, height, filename) {
//   console.log("Crop Avi video");
//   console.log("take audio from video file");
//   let audio = await exec(`ffmpeg -i ${temp}${filename} -vn -map 0:1 ${testAudio}audio.wav -hide_banner`);
//   if (audio) {
//     console.log("crop video file");
//     let cropVideo = await exec(`ffmpeg -ss 0 -i ${temp}${filename} -filter:v crop=${width}:${height} -map 0:0 ${allVideos}${filename} -hide_banner`);
//     if (cropVideo) {
//       console.log("create new video and audio for him");
//       let fin = await exec(`ffmpeg -i ${allVideos}${filename} -i ${testAudio}audio.wav  -map 0:v -map 1:a -c copy -shortest  ${movie}${filename} -hide_banner`);
//       if (fin) {
//         console.log("finish");
//         return fin;
//       } else {
//         deleteFile(`${movie}`, `${filename}`)
//       }
//     } else {
//       deleteFile(`${allVideos}`, `${filename}`)
//     }
//   }
//   else {
//     deleteFile(`${testAudio}`, 'audio.wav');
//   }

// }

// async function cropMp4(width, height, filename) {
//   console.log("Crop video mp4");
//   let fin = await exec(`ffmpeg -i ${temp}${filename} -vf crop=${width}:${height} -map 0:0 ${movie}${filename}`);
//   if (fin) {
//     console.log("finish");
//     deleteFile(`${temp}`, `${filename}`);
//     return fin;
//   } else {
//     deleteFile(`${movie}`, `${filename}`);
//   }

// }


app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});

