const { spawn } = require("child_process")
const path = require("path")

module.exports = {
  sync: (io, req, res) => {
    res.end()
    const execFolder = path.resolve(__dirname, "../../assets/bash/mongo-sync")
    const execFile = "mongo-sync.sh"
    const cmd = `${execFolder}/${execFile}`

    const exec = spawn("bash", [cmd, "pull"], { cwd: execFolder })
    // broadcasts bash file execution
    exec.stdout.on("data", (data) => {
      io.sockets.emit("database-log", data + "")
    })

    // broadcasts error if it occurs
    exec.stderr.on("data", (data) => {
      io.sockets.emit("database-log", data + "")
    })

    // code 0 === success
    exec.on("close", (code) => {
      io.sockets.emit("database-sync", code === 0)
    })
  },
}
