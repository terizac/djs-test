const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const { Worker } = require('worker_threads');
const express = require('express');
const path = require('path');
const fs = require('fs');

const port = 8001;
const outputDir = path.join(__dirname, 'public');

// RTSP 連結列表
const rtspStreams = [
  { name: 'camera1', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=1&subtype=0' },
  { name: 'camera2', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=2&subtype=0' },
  { name: 'camera3', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=3&subtype=0' },
  { name: 'camera4', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=4&subtype=0' },
  { name: 'camera5', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=5&subtype=0' },
  { name: 'camera6', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=6&subtype=0' },
  //　一個 ip 32　個 channel
  // 往下添加其他 camera
];

if (cluster.isMaster) {
  console.log(`主進程 ${process.pid} 正在運行`);

  // 確保輸出目錄存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 啟動 Worker Threads 處理 RTSP 流
  rtspStreams.forEach(stream => {
    const worker = new Worker('./ffmpeg-worker.js', {
      workerData: {
        streamName: stream.name,
        streamUrl: stream.url,
        outputDir: outputDir
      }
    });

    worker.on('message', (message) => {
      console.log(`Worker ${stream.name}: ${message}`);
    });

    worker.on('error', (error) => {
      console.error(`Worker ${stream.name} error:`, error);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker ${stream.name} stopped with exit code ${code}`);
      }
    });
  });

  // 為每個 CPU 核心創建一個工作進程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作進程 ${worker.process.pid} 已退出`);
  });
} else {
  // 工作進程共享同一個 TCP 連接
  const app = express();

  // 設置靜態文件服務
  app.use(express.static(outputDir));

  // API 路由來獲取所有流的列表
  app.get('/streams', (req, res) => {
    const streamList = rtspStreams.map(stream => ({
      name: stream.name,
      url: `/${stream.name}.m3u8`
    }));
    res.json(streamList);
  });

  app.listen(port, () => {
    console.log(`工作進程 ${process.pid} 正在監聽端口 ${port}`);
  });
}