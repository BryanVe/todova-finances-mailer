const { spawn } = require("child_process")
const path = require("path")

module.exports = {
  sync: (socket) => (req, res) => {
    res.end()
    const execFolder = path.resolve(__dirname, "../../assets/bash/mongo-sync")
    const execFile = "mongo-sync.sh"
    const cmd = `${execFolder}/${execFile}`

    const exec = spawn("bash", [cmd, "pull"], { cwd: execFolder })

    // broadcasts bash file execution
    exec.stdout.on("data", (data) => {
      socket.broadcast.emit("database-log", data + "")
    })

    // broadcasts error if it occurs
    exec.stderr.on("data", (data) => {
      socket.broadcast.emit("database-log", data + "")
    })

    // code 0 === success
    exec.on("close", (code) => {
      socket.broadcast.emit("database-sync", code === 0)
    })
  },
}
