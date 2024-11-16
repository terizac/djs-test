const { workerData, parentPort } = require('worker_threads');
const { spawn } = require('child_process');
const path = require('path');

const { streamName, streamUrl, outputDir } = workerData;

function startFFmpeg() {
  const outputFile = path.join(outputDir, `${streamName}.m3u8`);
  parentPort.postMessage(`Starting FFmpeg for ${streamName}, output: ${outputFile}`);

  const ffmpeg = spawn('ffmpeg', [
    '-i', streamUrl,
    '-fflags', 'nobuffer',
    '-flags', 'low_delay',
    '-max_delay', '5000000',
    '-rtsp_transport', 'tcp',
    '-stimeout', '5000000',
    
    '-hls_time', '2',
    '-hls_list_size', '5',
    '-hls_flags', 'delete_segments+omit_endlist',
    
    '-vcodec', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-acodec', 'aac',
    
    '-b:v', '500k',
    '-s', '320x240',
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