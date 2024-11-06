#!/usr/bin/env node

import { Command } from 'commander'
import { transform } from './commands/transform'
import packageJson from './package.json'

const program = new Command(packageJson.name)
  .version(packageJson.version, '-v, --version', `Output the current version of ${packageJson.name}.`)
  .description(packageJson.description)
  .argument('[codemod]', 'Codemod slug to run')
  .argument('[source]', 'Path to source files or directory to transform including glob patterns.')
  .helpOption('-h, --help', 'Display this help message.')
  .option('-d, --dry', 'Dry run (no changes are made to files)')
  .usage('[codemod] [source] [options]')
  .action(transform)
  // Why this option is necessary is explained here: https://github.com/tj/commander.js/pull/1427
  .enablePositionalOptions()

program.parse(process.argv)
