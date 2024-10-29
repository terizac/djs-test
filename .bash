ffmpeg -i "rtsp://admin:dh123456@192.168.68.72:554/cam/realmonitor?channel=1&subtype=0" -fflags flush_packets -max_delay 10 -flags -global_header -hls_time 10 -hls_list_size 6 -vcodec libx264 -acodec aac -f hls output.m3u8


ffmpeg -i "rtsp://admin:dh123456@192.168.68.72:554/cam/realmonitor?channel=1&subtype=0" -fflags flush_packets -max_delay 10 -flags -global_header -hls_time 10 -hls_list_size 6 -vcodec libx264 -acodec aac -f hls output.m3u8

ffmpeg -i "rtsp://rtspstream:03530b2fa3f8859a9322f5638aa3232c@zephyr.rtsp.stream/pattern" -fflags flush_packets -max_delay 10 -flags -global_header -hls_time 10 -hls_list_size 6 -vcodec libx264 -acodec aac -f hls output.m3u8