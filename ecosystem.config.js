// Standalone PM2 config for the gym app.
// If you use the shared /projects/ecosystem.config.js instead, add the object
// inside `apps` there and ignore this file.
module.exports = {
  apps: [
    {
      name: "gym",
      cwd: "/projects/gym",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 14000,
        HOST: "127.0.0.1",
      },
      max_memory_restart: "500M",
    },
  ],
};
