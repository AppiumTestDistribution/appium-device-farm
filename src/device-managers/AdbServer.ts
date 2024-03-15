import { execSync, spawn } from 'child_process';

const adbCommand = spawn('adb', ['-a', 'nodaemon', 'server', 'start']);

adbCommand.stdout.on('data', (data: Buffer) => {
  console.log(`stdout: ${data.toString()}`);
});

adbCommand.stderr.on('data', (data: Buffer) => {
  console.error(`stderr: ${data.toString()}`);
});

adbCommand.on('close', (code: number) => {
  console.log(`child process exited with code ${code}`);
});
setTimeout(() => {
  execSync('adb kill-server');
  console.log('ADB Server killed');
}, 5000);
