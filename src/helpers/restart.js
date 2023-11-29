function restart() {
  setTimeout(function () {
    process.on("exit", function () {
        require("child_process").spawn(process.argv.shift(), process.argv, {
            cwd: process.cwd(),
            detached : true,
            stdio: "inherit"
        });
    });
    console.log("[REBOOT] Restarting now... Byebye!")    
    process.exit();
  }, 5000);
}

module.exports = {restart}
