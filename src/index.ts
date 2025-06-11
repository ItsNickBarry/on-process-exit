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
const handlers: { [id: number]: () => void } = {};

const runHandlers = () =>
  Object.values(handlers).forEach((handler) => handler());

events.forEach((event) => process.on(event, runHandlers));

export const registerExitHandler = (callback: () => void): number => {
  const handlerId = ++lastHandlerId;
  handlers[handlerId] = callback;
  return handlerId;
};

export const deregisterExitHandler = (handlerId: number): void => {
  delete handlers[handlerId];
};
