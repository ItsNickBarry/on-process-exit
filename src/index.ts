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

// handlers are assigned sequential ids, starting with 1
let lastHandlerId = 0;
const handlers: { [id: number]: (event: string) => void } = {};

// once an exit event is received, it is tracked here and further handlers
// registrations are cancelled
let eventReceived: string | undefined;

const runHandlers = (event: string) => {
  // some exit events are not mutually exclusive
  // avoid multiple runs of the handlers
  if (eventReceived) return;

  eventReceived = event;

  for (const handlerId in handlers) {
    try {
      handlers[handlerId](event);
    } catch (error) {
      // not much that can be done at this point
    }
  }
};

events.forEach((event) =>
  process.on(event, runHandlers.bind(undefined, event)),
);

export const registerExitHandler = (
  callback: (event: string) => void,
): number => {
  if (eventReceived) {
    callback(eventReceived);
    throw new Error(`Exit already in progress: ${eventReceived}`);
  } else {
    const handlerId = ++lastHandlerId;
    handlers[handlerId] = callback;
    return handlerId;
  }
};

export const deregisterExitHandler = (handlerId: number): void => {
  delete handlers[handlerId];
};
