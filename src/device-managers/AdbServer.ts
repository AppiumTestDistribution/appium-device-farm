import { spawn } from 'child_process';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
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
  console.log('Script completed with sleep.');
}, 5000);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
