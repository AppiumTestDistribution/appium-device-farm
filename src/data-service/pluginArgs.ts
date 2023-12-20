import { ADTDatabase } from './db';

async function addCLIArgs(args: any) {
  (await ADTDatabase.CLIArgs).insert(args);
}

async function getCLIArgs() {
  return (await ADTDatabase.CLIArgs).chain().find().data();
}

export { addCLIArgs, getCLIArgs };
