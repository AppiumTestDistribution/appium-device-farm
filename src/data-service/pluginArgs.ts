import { CLIArgs } from './db';

async function addCLIArgs(args: any) {
  CLIArgs.insert(args);
}

function getCLIArgs() {
  return CLIArgs.chain().find().data();
}

export { addCLIArgs, getCLIArgs };
