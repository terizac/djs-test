const Stream = require('node-rtsp-stream');
const stream = new Stream({
  name: 'name_of_stream', // 任意名称
  // streamUrl: 'rtsp://admin:dh123456@192.168.68.72:554/cam/realmonitor?channel=1&subtype=0', // 替换为你的RTSP URL
  streamUrl: 'rtsp://rtspstream:03530b2fa3f8859a9322f5638aa3232c@zephyr.rtsp.stream/pattern',
  // streamUrl: 'rtsp://127.0.0.1:6554/stream',
  wsPort: 9999, // WebSocket端口
  ffmpegOptions: {
    '-stats': '', // ffmpeg的选项
    '-r': 30 // 设置帧率为30
  }
});



console.log('Streaming is available at ws://localhost:9999');

// stream = new Stream({
//   name: 'name',
//   streamUrl: 'rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov',
//   wsPort: 9999,
//   ffmpegOptions: { // options ffmpeg flags
//     '-stats': '', // an option with no neccessary value uses a blank string
//     '-r': 30 // options with required values specify the value after the key
//   }
// })
// notification
// streaming
// 跳 ip, 有沒有設定ip的 API


// rtsp://帳號:密碼@ip:port/cam/realmonitor?channel=頻道&subtype=0
// rtsp://admin:dh123456@192.168.68.70:554/cam/realmonitor?channel=2&subtype=0

// 例如 ：
// rtsp://admin:djs123456@192.168.1.108:554/cam/realmonitor?channel=1&subtype=1

// subtype=0 主碼流
// subtype=1  副碼流