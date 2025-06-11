# on-process-exit

Register handlers to be run on process exit.

## Installation

```bash
npm install --save on-process-exit
```

## Usage

Register a handler:

```typescript
import { registerExitHandler } from 'on-process-exit';

registerExitHandler(() => console.log('exiting'));
```

Deregister a handler:

```typescript
import { registerExitHandler, deregisterExitHandler } from 'on-process-exit';

const handlerId = registerExitHandler(() => console.log('exiting'));

deregisterExitHandler(handlerId);
```

Respond to different exit event types:

```typescript
import { registerExitHandler } from 'on-process-exit';

registerExitHandler((event) => console.log(`exiting with event: ${event}`));
```

## Development

Install dependencies via pnpm:

```bash
pnpm install
```

Setup Husky to format code on commit:

```bash
pnpm prepare
```
