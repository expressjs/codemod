import { defineTest } from 'jscodeshift/src/testUtils';

import { readdirSync } from 'node:fs';
import { join } from 'path';

const fixtureDir = 'magic-redirect'
const fixtureDirPath = join(__dirname, '..', '__testfixtures__', fixtureDir)
const fixtures = readdirSync(fixtureDirPath)
  .filter(file => file.endsWith('.input.ts'))
  .map(file => file.replace('.input.ts', ''))


for (const fixture of fixtures) {
    const prefix = `${fixtureDir}/${fixture}`;
    defineTest(__dirname, fixtureDir,  null, prefix, { parser: 'ts' });
}