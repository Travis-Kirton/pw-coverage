import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { test as baseTest } from '@playwright/test';

const istanbulCLIOutput = path.join(process.cwd(), '.nyc_output');

export function generateUUID() {
  return crypto.randomBytes(16).toString('hex');
}

export const coverage = baseTest.extend({
  context: async ({ context }, use) => {
    console.log('COVERAGE');
    await context.addInitScript(() =>
      window.addEventListener('beforeunload', () => {
        console.log('unloaded');
        (window).collectIstanbulCoverage(JSON.stringify((window).__coverage__))
      }
      ),
    );
    await fs.promises.mkdir(istanbulCLIOutput, { recursive: true });
    await context.exposeFunction('collectIstanbulCoverage', (coverageJSON) => {
      console.log('COVERAGE 2: ', coverageJSON);  
      if (coverageJSON)
        fs.writeFileSync(path.join(istanbulCLIOutput, `playwright_coverage_${generateUUID()}.json`), coverageJSON);
    });
    await use(context);
    for (const page of context.pages()) {
      await page.evaluate(() => (window).collectIstanbulCoverage(JSON.stringify((window).__coverage__)))
    }
  }
});