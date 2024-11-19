const { workerData, parentPort } = require("worker_threads");
const { spawn } = require("child_process");
const path = require("path");

const { streamName, streamUrl, outputDir } = workerData;

let ffmpegProcess = null; // 保存 ffmpeg 進程引用

function startFFmpeg() {
  const outputFile = path.join(outputDir, `${streamName}.m3u8`);
  parentPort.postMessage(
    `Starting FFmpeg for ${streamName}, output: ${outputFile}`
  );

  ffmpegProcess = spawn("ffmpeg", [
    "-i",
    streamUrl,
    "-fflags",
    "flush_packets",
    "-max_delay",
    "5000000",
    "-flags",
    "-global_header",
    "-hls_time",
    "10", // 每個片段最多10秒
    "-hls_list_size",
    "5", // 播放列表最多包含5個片段
    "-hls_flags",
    "delete_segments", // 刪除不在播放列表中的舊片段
    "-vcodec",
    "libx264",
    "-acodec",
    "aac",
    "-f",
    "hls",

    "-b:v",
    "500k", // 設定視訊比特率為1000 kbps
    "-s",
    "320x240", // 設定解析度為320x240
    outputFile,
  ]);

  ffmpegProcess.stderr.on("data", (data) => {
    parentPort.postMessage(`FFmpeg ${streamName} stderr: ${data}`);
  });

  ffmpegProcess.on("close", (code) => {
    parentPort.postMessage(
      `FFmpeg process for ${streamName} exited with code ${code}`
    );
  });
}

// 監聽來自主線程的消息
parentPort.on("message", (message) => {
  if (message === "stop") {
    if (ffmpegProcess) {
      ffmpegProcess.kill("SIGTERM"); // 使用 SIGTERM 信號終止進程
      parentPort.postMessage(`Stopping FFmpeg for ${streamName}`);
    }
  }
});

startFFmpeg();
