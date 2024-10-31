const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const { Worker } = require('worker_threads');
const express = require('express');
const path = require('path');
const fs = require('fs');

const port = 8001;
const outputDir = path.join(__dirname, 'public');


const ipA = '192.168.1.71';
const ipB = '192.168.1.72';
const ipC = '192.168.1.73';
const ipD = '192.168.1.74';
const ipE = '192.168.1.75';
// A + B 區 192.168.1.71:554
// B + C 區 192.168.1.72:554
// C + D 區 192.168.1.73:554
// D + E 區 192.168.1.74:554
// E + F 區 192.168.1.75:554
// RTSP 連結列表

// 缺
// 56 
// 108
// 128
// 135
// 重複
// 97
const rtspStreams = [
  // ipA (192.168.1.71) - 按channel排序
  { name: 'camera012', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=1&subtype=0` },
  { name: 'camera017', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=2&subtype=0` },
  { name: 'camera002', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=3&subtype=0` },
  { name: 'camera020', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=4&subtype=0` },
  { name: 'camera011', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=5&subtype=0` },
  { name: 'camera019', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=6&subtype=0` },
  { name: 'camera151', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=7&subtype=0` },
  { name: 'camera004', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=8&subtype=0` },
  { name: 'camera008', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=9&subtype=0` },
  { name: 'camera036', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=10&subtype=0` },
  { name: 'camera005', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=11&subtype=0` },
  { name: 'camera013', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=12&subtype=0` },
  { name: 'camera007', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=13&subtype=0` },
  { name: 'camera006', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=14&subtype=0` },
  { name: 'camera009', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=15&subtype=0` },
  { name: 'camera003', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=16&subtype=0` },
  { name: 'camera016', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=17&subtype=0` },
  { name: 'camera018', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=18&subtype=0` },
  { name: 'camera015', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=19&subtype=0` },
  { name: 'camera001', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=20&subtype=0` },
  { name: 'camera014', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=21&subtype=0` },
  { name: 'camera010', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=22&subtype=0` },
  { name: 'camera039', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=23&subtype=0` },
  { name: 'camera030', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=24&subtype=0` },
  { name: 'camera053', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=25&subtype=0` },
  { name: 'camera028', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=26&subtype=0` },
  { name: 'camera042', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=27&subtype=0` },
  { name: 'camera025', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=28&subtype=0` },
  { name: 'camera024', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=29&subtype=0` },
  { name: 'camera022', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=30&subtype=0` },
  { name: 'camera023', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=31&subtype=0` },
  { name: 'camera038', url: `rtsp://admin:djs123456@${ipA}:554/cam/realmonitor?channel=32&subtype=0` },

  // ipB (192.168.1.72) - 按channel排序
  { name: 'camera029', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=1&subtype=0` },
  { name: 'camera041', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=2&subtype=0` },
  { name: 'camera027', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=3&subtype=0` },
  { name: 'camera080', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=4&subtype=0` },
  { name: 'camera031', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=5&subtype=0` },
  { name: 'camera081', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=6&subtype=0` },
  { name: 'camera086', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=7&subtype=0` },
  { name: 'camera085', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=8&subtype=0` },
  { name: 'camera059', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=9&subtype=0` },
  { name: 'camera052', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=10&subtype=0` },
  { name: 'camera069', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=11&subtype=0` },
  { name: 'camera021', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=12&subtype=0` },
  { name: 'camera026', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=13&subtype=0` },
  { name: 'camera032', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=14&subtype=0` },
  { name: 'camera033', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=15&subtype=0` },
  { name: 'camera037', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=16&subtype=0` },
  { name: 'camera055', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=17&subtype=0` },
  { name: 'camera034', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=18&subtype=0` },
  { name: 'camera035', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=19&subtype=0` },
  { name: 'camera078', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=20&subtype=0` },
  { name: 'camera043', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=21&subtype=0` },
  { name: 'camera079', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=22&subtype=0` },
  { name: 'camera083', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=23&subtype=0` },
  { name: 'camera087', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=24&subtype=0` },
  { name: 'camera070', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=25&subtype=0` },
  { name: 'camera082', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=26&subtype=0` },
  { name: 'camera057', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=27&subtype=0` },
  { name: 'camera061', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=28&subtype=0` },
  { name: 'camera060', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=29&subtype=0` },
  { name: 'camera054', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=30&subtype=0` },
  { name: 'camera051', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=31&subtype=0` },
  { name: 'camera058', url: `rtsp://admin:djs123456@${ipB}:554/cam/realmonitor?channel=32&subtype=0` },

  // ipC (192.168.1.73) - 按channel排序
  { name: 'camera067', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=1&subtype=0` },
  { name: 'camera074', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=2&subtype=0` },
  { name: 'camera063', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=3&subtype=0` },
  { name: 'camera044', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=4&subtype=0` },
  { name: 'camera072', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=5&subtype=0` },
  { name: 'camera040', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=6&subtype=0` },
  { name: 'camera068', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=7&subtype=0` },
  { name: 'camera048', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=8&subtype=0` },
  { name: 'camera066', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=9&subtype=0` },
  { name: 'camera076', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=10&subtype=0` },
  { name: 'camera062', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=11&subtype=0` },
  { name: 'camera077', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=12&subtype=0` },
  { name: 'camera075', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=13&subtype=0` },
  { name: 'camera049', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=14&subtype=0` },
  { name: 'camera065', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=15&subtype=0` },
  { name: 'camera045', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=16&subtype=0` },
  { name: 'camera046', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=17&subtype=0` },
  { name: 'camera071', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=18&subtype=0` },
  { name: 'camera050', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=19&subtype=0` },
  { name: 'camera064', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=20&subtype=0` },
  { name: 'camera073', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=21&subtype=0` },
  { name: 'camera047', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=22&subtype=0` },
  { name: 'camera097', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=23&subtype=0` },
  { name: 'camera102', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=24&subtype=0` },
  { name: 'camera106', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=25&subtype=0` },
  { name: 'camera093', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=26&subtype=0` },
  { name: 'camera109', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=27&subtype=0` },
  { name: 'camera107', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=28&subtype=0` },
  { name: 'camera099', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=29&subtype=0` },
  { name: 'camera100', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=30&subtype=0` },
  { name: 'camera117', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=31&subtype=0` },
  { name: 'camera110', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=32&subtype=0` },

  // ipD (192.168.1.74) - 按channel排序
  { name: 'camera104', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=1&subtype=0` },
  { name: 'camera105', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=2&subtype=0` },
  { name: 'camera096', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=3&subtype=0` },
  { name: 'camera113', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=4&subtype=0` },
  { name: 'camera094', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=5&subtype=0` },
  { name: 'camera103', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=6&subtype=0` },
  { name: 'camera112', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=7&subtype=0` },
  { name: 'camera095', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=8&subtype=0` },
  { name: 'camera090', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=9&subtype=0` },
  { name: 'camera097', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=10&subtype=0` },
  { name: 'camera114', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=11&subtype=0` },
  { name: 'camera092', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=12&subtype=0` },
  { name: 'camera101', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=13&subtype=0` },
  { name: 'camera115', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=14&subtype=0` },
  { name: 'camera088', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=15&subtype=0` },
  { name: 'camera116', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=16&subtype=0` },
  { name: 'camera089', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=17&subtype=0` },
  { name: 'camera098', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=18&subtype=0` },
  { name: 'camera091', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=19&subtype=0` },
  { name: 'camera111', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=20&
  subtype=0` },
  { name: 'camera150', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=21&
  subtype=0` },
  { name: 'camera142', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=22&subtype=0` },
  { name: 'camera149', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=23&subtype=0` },
  { name: 'camera084', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=24&subtype=0` },
  { name: 'camera148', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=25&subtype=0` },
  { name: 'camera143', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=26&subtype=0` },
  { name: 'camera144', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=27&subtype=0` },
  { name: 'camera145', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=28&subtype=0` },
  { name: 'camera146', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=29&subtype=0` },
  { name: 'camera147', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=30&subtype=0` },
  { name: 'camera140', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=31&subtype=0` },
  { name: 'camera141', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=32&subtype=0` },

  // ipE (192.168.1.75) - 按channel排序
  { name: 'camera127', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=1&subtype=0` },
  { name: 'camera136', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=2&subtype=0` },
  { name: 'camera129', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=3&subtype=0` },
  { name: 'camera133', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=4&subtype=0` },
  { name: 'camera120', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=5&subtype=0` },
  { name: 'camera124', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=6&subtype=0` },
  { name: 'camera121', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=7&subtype=0` },
  { name: 'camera125', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=8&subtype=0` },
  { name: 'camera132', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=9&subtype=0` },
  { name: 'camera137', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=10&subtype=0` },
  { name: 'camera138', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=11&subtype=0` },
  { name: 'camera139', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=12&subtype=0` },
  { name: 'camera130', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=14&subtype=0` },
  { name: 'camera118', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=15&subtype=0` },
  { name: 'camera126', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=16&subtype=0` },
  { name: 'camera131', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=17&subtype=0` },
  { name: 'camera123', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=18&subtype=0` },
  { name: 'camera119', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=19&subtype=0` },
  { name: 'camera134', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=20&subtype=0` },
  { name: 'camera122', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=21&subtype=0` },
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