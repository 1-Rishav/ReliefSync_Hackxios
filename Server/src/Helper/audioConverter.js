const ffmpegPath = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

ffmpeg.setFfmpegPath(ffmpegPath);

function convertWebmToMp3(inputPath) {
    return new Promise((resolve, reject) => {
        const outName = `${path.basename(inputPath)}.mp3`; // keep uniqueness
        const outPath = path.join(path.dirname(inputPath), outName);

        ffmpeg(inputPath)
            .outputOptions([
                "-vn",               // no video
                "-ar 44100",         // sampling rate
                "-ac 2",             // stereo
                "-b:a 128k"          // bitrate
            ])
            .toFormat("mp3")
            .on("error", (err) => {
                console.error("FFmpeg conversion error:", err);
                reject(err);
            })
            .on("end", () => {
                // ensure file exists
                resolve(outPath);
            })
            .save(outPath);
    });
}

module.exports = { convertWebmToMp3 };