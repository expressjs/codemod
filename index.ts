#!/usr/bin/env node

// Based on https://github.com/vercel/next.js/blob/26a2bab6fa0f0bdf9ff88f85d64342bb5a975658/packages/next-codemod/bin/next-codemod.ts
// @expressjs/codemod optional-name-of-transform optional/path/ [...options]

import { Command } from 'commander'
import { transform } from './commands/transform'
import { upgrade } from './commands/upgrade'
import packageJson from './package.json'

const program = new Command(packageJson.name)
  .version(packageJson.version, '-v, --version', `Output the current version of ${packageJson.name}.`)
  .description(packageJson.description)
  .argument('[codemod]', 'Codemod slug to run')
  .argument('[source]', 'Path to source files or directory to transform.')
  .helpOption('-h, --help', 'Display this help message.')
  .option('-d, --dry', 'Dry run (no changes are made to files)')
  .option('-p, --print', 'Print transformed files to stdout')
  .option('--verbose', 'Show more information about the transform process')
  .option('--silent', "Don't print anything to stdout")
  .usage('[codemod] [source] [options]')
  .action(transform)
  // Why this option is necessary is explained here: https://github.com/tj/commander.js/pull/1427
  .enablePositionalOptions()

program
  .command('upgrade')
  .description('Upgrade your express server to the latest version.')
  .argument('[source]', 'Path to source files or directory to transform.')
  .option('--select', 'Select which codemods to apply (Show a list of available codemods)')
  .action(upgrade)

program.parse(process.argv)
