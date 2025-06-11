// event list found here:
// https://stackoverflow.com/questions/40574218/how-to-perform-an-async-operation-on-exit
const events = [
  'beforeExit',
  'uncaughtException',
  'unhandledRejection',
  'SIGHUP',
  'SIGINT',
  'SIGQUIT',
  'SIGILL',
  'SIGTRAP',
  'SIGABRT',
  'SIGBUS',
  'SIGFPE',
  'SIGUSR1',
  'SIGSEGV',
  'SIGUSR2',
  'SIGTERM',
];

let lastHandlerId = 0;
const handlers: { [id: number]: (event: string) => void } = {};

const runHandlers = (event: string) => {
  for (const handlerId in handlers) {
    handlers[handlerId](event);
    deregisterExitHandler(parseInt(handlerId));
  }
};

events.forEach((event) =>
  process.on(event, runHandlers.bind(undefined, event)),
);

export const registerExitHandler = (
  callback: (event: string) => void,
): number => {
  const handlerId = ++lastHandlerId;
  handlers[handlerId] = callback;
  return handlerId;
};

export const deregisterExitHandler = (handlerId: number): void => {
  delete handlers[handlerId];
};
