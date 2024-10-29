module.exports = {
  apps: [{
    name: "rtsp-hls-server",
    script: "./main.js",
    instances: "max",
    exec_mode: "cluster",
    watch: true,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}