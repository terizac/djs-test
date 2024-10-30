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
  // {name: 'camera001', url: 'rtsp://rtspstream:03530b2fa3f8859a9322f5638aa3232c@zephyr.rtsp.stream/pattern'},
  { name: 'camera001', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=20&subtype=0' },
  { name: 'camera002', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=3&subtype=0' },
  { name: 'camera003', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=16&subtype=0' },
  { name: 'camera004', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=8&subtype=0' },
  { name: 'camera005', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=11&subtype=0' },
  { name: 'camera006', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=14&subtype=0' },
  { name: 'camera007', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=13&subtype=0' },
  { name: 'camera008', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=9&subtype=0' },
  { name: 'camera009', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=15&subtype=0' },
  { name: 'camera010', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=22&subtype=0' },
  { name: 'camera011', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=5&subtype=0' },
  { name: 'camera012', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=1&subtype=0' },
  { name: 'camera013', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=12&subtype=0' },
  { name: 'camera014', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=21&subtype=0' },
  { name: 'camera015', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=19&subtype=0' },
  { name: 'camera016', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=17&subtype=0' },
  { name: 'camera017', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=2&subtype=0' },
  { name: 'camera018', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=18&subtype=0' },
  { name: 'camera019', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=6&subtype=0' },
  { name: 'camera020', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=4&subtype=0' },
  { name: 'camera151', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=7&subtype=0' },
  { name: 'camera036', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=10&subtype=0' },
  { name: 'camera022', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=30&subtype=0' },
  { name: 'camera023', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=31&subtype=0' },
  { name: 'camera024', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=29&subtype=0' },
  { name: 'camera025', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=28&subtype=0' },
  { name: 'camera028', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=26&subtype=0' },
  { name: 'camera030', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=24&subtype=0' },
  { name: 'camera038', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=32&subtype=0' },
  { name: 'camera039', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=23&subtype=0' },
  { name: 'camera042', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=27&subtype=0' },
  { name: 'camera053', url: 'rtsp://admin:djs123456@192.168.1.71:554/cam/realmonitor?channel=25&subtype=0' }
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