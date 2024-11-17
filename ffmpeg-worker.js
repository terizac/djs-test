const { workerData, parentPort } = require('worker_threads');
const { spawn } = require('child_process');
const path = require('path');

const { streamName, streamUrl, outputDir } = workerData;

function startFFmpeg() {
  const outputFile = path.join(outputDir, `${streamName}.m3u8`);
  parentPort.postMessage(`Starting FFmpeg for ${streamName}, output: ${outputFile}`);

  const ffmpeg = spawn('ffmpeg', [
    '-i', streamUrl,
    '-fflags', 'flush_packets',
    '-max_delay', '5000000',
    '-flags', '-global_header',
    '-hls_time', '10',           // 每個片段最多10秒
    '-hls_list_size', '5',       // 播放列表最多包含5個片段
    '-hls_flags', 'delete_segments', // 刪除不在播放列表中的舊片段
    '-vcodec', 'libx264',
    '-acodec', 'aac',
    '-f', 'hls',

    '-b:v', '500k',      // 設定視訊比特率為1000 kbps
    '-s', '320x240',                 // 設定解析度為320x240
    outputFile
  ]);

  ffmpeg.stderr.on('data', (data) => {
    parentPort.postMessage(`FFmpeg ${streamName} stderr: ${data}`);
  });

  ffmpeg.on('close', (code) => {
    parentPort.postMessage(`FFmpeg process for ${streamName} exited with code ${code}`);
    // 可以在這裡添加重啟邏輯
    startFFmpeg(); // 重啟 FFmpeg 進程
  });
}

startFFmpeg();