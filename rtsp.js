const RtspServer = require('rtsp-streaming-server').default;
const { Writable } = require('stream');
const ffmpeg = require('fluent-ffmpeg');

const server = new RtspServer({
  serverPort: 5554,
  clientPort: 6554,
  rtpPortStart: 10000,
  rtpPortCount: 10000
});

const mount = '/stream';
// const url = 'rtsp://admin:dh123456@192.168.68.72:554/cam/realmonitor?channel=1&subtype=0';
const url = 'rtsp://rtspstream:03530b2fa3f8859a9322f5638aa3232c@zephyr.rtsp.stream/pattern'

// console.log(encodeURIComponent(url))

// server.on('clientConnected', (client) => {
//   console.log('客戶端已連接:', client.id);
// });

// server.on('clientDisconnected', (client) => {
//   console.log('客戶端已斷開連接:', client.id);
// });

// server.on('mount', (id) => {
//   console.log('新的串流已掛載:', id);
// });

// server.on('unmount', (id) => {
//   console.log('串流已卸載:', id);
// });

async function start() {
  try {
    await server.start();
    console.log('RTSP 服務器已啟動');

    const stream = new Writable({
      write(chunk, encoding, callback) {
        // 這裡可以處理串流數據
        callback();
      }
    });

    ffmpeg(url)
      .inputOptions([
        '-rtsp_transport udp',
        '-buffer_size 102400'
      ])
      .outputOptions([
        '-f rtsp',
        '-rtsp_transport udp',
        '-c copy'  // 直接複製輸入流的編碼
      ])
      .output(`rtsp://127.0.0.1:${5554}${mount}`)
      .on('start', (commandLine) => {
        console.log('FFmpeg 命令:', commandLine);
        console.log('FFmpeg 已開始串流');
        console.log(`路徑：rtsp://127.0.0.1:${6554}${mount}`);
      })
      .on('error', (err, stdout, stderr) => {
        console.error('FFmpeg 錯誤:', err.message);
        console.error('FFmpeg 標準輸出:', stdout);
        console.error('FFmpeg 錯誤輸出:', stderr);
      })
      .on('end', () => {
        console.log('FFmpeg 處理結束');
      })
      .run();

  } catch (err) {
    console.error('啟動服務器時出錯:', err);
  }
}

start();