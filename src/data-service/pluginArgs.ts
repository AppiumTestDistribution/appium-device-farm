import { ATDRepository } from './db';

async function addCLIArgs(args: any) {
  (await ATDRepository.CLIArgs).insert(args);
}

async function getCLIArgs() {
  return (await ATDRepository.CLIArgs).chain().find().data();
}

export { addCLIArgs, getCLIArgs };
