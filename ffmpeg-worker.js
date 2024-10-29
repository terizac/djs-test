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
    '-max_delay', '10',
    '-flags', '-global_header',
    '-hls_time', '10',
    '-hls_list_size', '6',
    '-vcodec', 'libx264',
    '-acodec', 'aac',
    '-f', 'hls',
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