const { workerData, parentPort } = require('worker_threads');
const { spawn } = require('child_process');
const path = require('path');

const { streamName, streamUrl, outputDir } = workerData;
let ffmpegProcess = null;  // 保存 ffmpeg 進程引用

function startFFmpeg() {
    const outputFile = path.join(outputDir, `${streamName}.m3u8`);
    parentPort.postMessage(`Starting FFmpeg for ${streamName}, output: ${outputFile}`);

    ffmpegProcess = spawn('ffmpeg', [
        '-i', streamUrl,
        '-fflags', 'nobuffer',
        '-flags', 'low_delay',
        '-max_delay', '5000000',
        '-rtsp_transport', 'tcp',
        '-hls_time', '2',
        '-hls_list_size', '3',
        '-hls_flags', 'delete_segments',
        '-vcodec', 'libx264',
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-acodec', 'aac',
        '-b:v', '500k',
        '-s', '320x240',
        '-f', 'hls',
        outputFile
    ]);

    ffmpegProcess.stderr.on('data', (data) => {
        parentPort.postMessage(`FFmpeg ${streamName} stderr: ${data}`);
    });

    ffmpegProcess.on('close', (code) => {
        parentPort.postMessage(`FFmpeg process for ${streamName} exited with code ${code}`);
    });
}

// 監聽來自主線程的消息
parentPort.on('message', (message) => {
    if (message === 'stop') {
        if (ffmpegProcess) {
            ffmpegProcess.kill('SIGTERM');  // 使用 SIGTERM 信號終止進程
            parentPort.postMessage(`Stopping FFmpeg for ${streamName}`);
        }
    }
});

startFFmpeg();