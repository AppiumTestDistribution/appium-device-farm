import { ADTDatabase } from './db';

async function addCLIArgs(args: any) {
  ADTDatabase.instance().CLIArgs.insert(args);
}

function getCLIArgs() {
  return ADTDatabase.instance().CLIArgs.chain().find().data();
}

export { addCLIArgs, getCLIArgs };
