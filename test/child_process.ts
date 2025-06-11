import { registerExitHandler, deregisterExitHandler } from '../src/index.js';

// this function is called via `eval`
deregisterExitHandler;

registerExitHandler((event: string) => {
  process.send!(`exited with: ${event}`);
});

const listener = (data: any) => {
  data.eval && eval(data.eval);
};

// keep process alive while awaiting signals from parent
process.addListener('message', listener);

// signal to the test suite that handlers are registered
process.send!('ready');

// end process naturally
setTimeout(() => {
  process.removeListener('message', listener);
}, 100);
