#!/usr/bin/env node

import { Command } from 'commander'
import packageJson from './package.json'

const program = new Command(packageJson.name)
    .description(packageJson.description)
    .argument(
        '[codemod]',
        'Codemod slug to run'
    )
    .argument(
        '[source]',
        'Path to source files or directory to transform including glob patterns.'
    )
    .usage('[codemod] [source]')
