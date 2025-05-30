const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const { Worker } = require('worker_threads');
const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');

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
// urL: https://camera.sparkspaceapi.cc
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
  { name: 'camera098', url: `rtsp://admin:djs123456@${ipC}:554/cam/realmonitor?channel=23&subtype=0` },
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
  { name: 'camera108', url: `rtsp://admin:djs123456@${ipD}:554/cam/realmonitor?channel=18&subtype=0` },
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
  { name: 'camera135', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=13&subtype=0` },
  { name: 'camera130', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=14&subtype=0` },
  { name: 'camera118', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=15&subtype=0` },
  { name: 'camera126', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=16&subtype=0` },
  { name: 'camera131', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=17&subtype=0` },
  { name: 'camera123', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=18&subtype=0` },
  { name: 'camera119', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=19&subtype=0` },
  { name: 'camera134', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=20&subtype=0` },
  { name: 'camera122', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=21&subtype=0` },
  { name: 'camera128', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=22&subtype=0` },
  { name: 'camera56', url: `rtsp://admin:djs123456@${ipE}:554/cam/realmonitor?channel=23&subtype=0` },
];

// 從 ID 中提取數字
function extractNumber(id) {
    // 移除所有英文字母，只保留數字
    return id.replace(/[A-Za-z]/g, '');
}

// 根據 cameraId 篩選串流
function filterStreamsByActiveCameras(activeCameraIds) {
    // 先將所有 activeCameraIds 轉換為純數字
    const activeNumbers = activeCameraIds.map(id => extractNumber(id));
    console.log('轉換後的櫃位編號:', activeNumbers);

    return rtspStreams.filter(stream => {
        // 從 camera001 格式中提取數字
        const cameraNumber = stream.name.replace('camera', '');
        const isActive = activeNumbers.includes(cameraNumber);
        
        console.log(`比對攝影機 ${stream.name} (${cameraNumber}) 是否在使用中: ${isActive}`);
        return isActive;
    });
}

// 獲取租用中的櫃位
async function getRentingCabinets() {
    try {
        const response = await axios.get('https://storehouse-backend.vercel.app/api/admin/cabinets?limit=1000');
        const rentingCabinets = response.data.data.filter(cabinet => cabinet.status === 'renting');
        const cabinetIds = rentingCabinets.map(cabinet => cabinet.cabinet_number);
        console.log('租用中的櫃位:', cabinetIds);
        return cabinetIds;
    } catch (error) {
        console.error('獲取櫃位資訊失敗:', error);
        return [];
    }
}

if (cluster.isMaster) {
    console.log(`主進程 ${process.pid} 正在運行`);
    
    // 確保輸出目錄���在
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`創建輸出目錄: ${outputDir}`);
    }

    // 確保目錄有寫入權限
    try {
        fs.accessSync(outputDir, fs.constants.W_OK);
        console.log(`輸出目錄 ${outputDir} 具有寫入權限`);
    } catch (err) {
        console.error(`輸出目錄 ${outputDir} 沒有寫入權限:`, err);
        process.exit(1);
    }
    
    let currentWorkers = new Set();
    let currentGroupIndex = 0;
    let streamGroups = [];

    // 啟動特定組的串流
    function startGroupStreams(groupStreams) {
        // 清理現有的 workers
        const cleanupPromises = Array.from(currentWorkers).map(worker => {
            return new Promise((resolve) => {
                worker.on('exit', () => {
                    resolve();
                });
                
                worker.postMessage('stop');
                
                // 設置超時，以防 worker 沒有正確退出
                setTimeout(() => {
                    worker.terminate();
                    resolve();
                }, 5000);
            });
        });

        // 等待所有 worker 清理完成後再啟動新的
        Promise.all(cleanupPromises).then(() => {
            currentWorkers.clear();
            console.log('所有舊進程已清理完成，開始啟動新進程');

            groupStreams.forEach(stream => {
                const worker = new Worker('./ffmpeg-worker.js', {
                    workerData: {
                        streamName: stream.name,
                        streamUrl: stream.url,
                        outputDir: outputDir
                    }
                });

                currentWorkers.add(worker);

                worker.on('message', (message) => {
                    // console.log(`Worker ${stream.name}: ${message}`);
                });

                worker.on('error', (error) => {
                    console.error(`Worker ${stream.name} error:`, error);
                    currentWorkers.delete(worker);
                });

                worker.on('exit', (code) => {
                    console.log(`Worker ${stream.name} exited with code ${code}`);
                    currentWorkers.delete(worker);
                });
            });
        });
    }

    // 從 ID 中提取數字
    function extractNumber(id) {
        return id.replace(/[A-Za-z]/g, '');
    }

    // 根據 cameraId 篩選串流
    function filterStreamsByActiveCameras(activeCameraIds) {
        const activeNumbers = activeCameraIds.map(id => extractNumber(id));
        console.log('���換後的櫃位編號:', activeNumbers);

        return rtspStreams.filter(stream => {
            // 從 camera001 格式中提取數字
            const cameraNumber = stream.name.replace('camera', '');
            const isActive = activeNumbers.includes(cameraNumber);
            
            console.log(`比對攝影機 ${stream.name} (${cameraNumber}) 是否在使用中: ${isActive}`);
            return isActive;
        });
    }

    // 每16個分組
    function groupStreams(streams) {
        const groups = [];
        for (let i = 0; i < streams.length; i += 16) {
            groups.push(streams.slice(i, i + 16));
        }
        return groups;
    }

    async function updateActiveStreams() {
        try {
            // 獲取租用中的櫃位攝影機
            const activeCameraIds = await getRentingCabinets();
            console.log('租用中的攝影機:', activeCameraIds);

            // 篩選出需要開啟的串流
            const activeStreams = filterStreamsByActiveCameras(activeCameraIds);
            console.log(`需要開啟 ${activeStreams.length} 個攝影機串流`);

            // 將串流分組
            const groups = groupStreams(activeStreams);
            console.log(`分成 ${groups.length} 組，每組最多16個攝影機`);

            return groups;
        } catch (error) {
            console.error('更新串流失敗:', error);
            return [];
        }
    }

    // 每分鐘更新串流狀態
    setInterval(async () => {
        streamGroups = await updateActiveStreams();
        if (streamGroups.length > 0) {
            console.log('切換到下一組攝影機');
            currentGroupIndex = (currentGroupIndex + 1) % streamGroups.length;
            startGroupStreams(streamGroups[currentGroupIndex]);
        }
    }, 60000);

    // 初始化
    (async () => {
        streamGroups = await updateActiveStreams();
        if (streamGroups.length > 0) {
            startGroupStreams(streamGroups[currentGroupIndex]);
        }
    })();

    // 為每個 CPU 核心創建工作進程
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作進程 ${worker.process.pid} 已退出`);
    });
} else {
    // 工作進程共享同一個 TCP 連接
    const app = express();
    console.log('app', 'not master');

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

    // 添加截圖功能的路由
    app.get('/screenshot', async (req, res) => {
        const { url } = req.query;
        console.log('url', url);
        if (!url) {
            return res.status(400).json({ error: '需要提供串流 URL' });
        }

        try {
            // 創建臨時文件路徑
            const tempFilePath = path.join(outputDir, `temp_${Date.now()}.jpg`);

            // 使用 ffmpeg 進行截圖
            await new Promise((resolve, reject) => {
                ffmpeg(url)
                    .screenshots({
                        timestamps: ['00:00:00.000'],
                        filename: path.basename(tempFilePath),
                        folder: path.dirname(tempFilePath),
                        size: '1280x720'
                    })
                    .on('end', () => resolve())
                    .on('error', (err) => reject(err));
            });

            // 讀取截圖文件
            const screenshot = await fs.promises.readFile(tempFilePath);

            // 刪除臨時文件
            await fs.promises.unlink(tempFilePath);

            // 設置響應頭並返回圖片
            res.set('Content-Type', 'image/jpeg');
            res.send(screenshot);

        } catch (error) {
            console.error('截圖失敗:', error);
            res.status(500).json({ error: '截圖失敗', details: error.message });
        }
    });

    app.listen(port, () => {
        console.log(`工作進程 ${process.pid} 正在監聽端口 ${port}`);
    });
}