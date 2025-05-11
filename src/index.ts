import { spawn } from 'child_process';
import path from 'path';

spawn(
  'node',
  ['--max-old-space-size=4096', path.join(__dirname, 'resolution.js')],
  {
    env: {
      ...process.env,
    },
    stdio: 'inherit',
  }
);
spawn('node', ['--max-old-space-size=4096', path.join(__dirname, 'dpll.js')], {
  env: {
    ...process.env,
  },
  stdio: 'inherit',
});
spawn('node', ['--max-old-space-size=4096', path.join(__dirname, 'dp.js')], {
  env: {
    ...process.env,
  },
  stdio: 'inherit',
});
