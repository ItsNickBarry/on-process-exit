import assert from 'node:assert';
import child_process from 'node:child_process';
import path from 'node:path';
import { describe, it } from 'node:test';

const fork = async () => {
  const child = child_process.fork(
    path.resolve(import.meta.dirname, './child_process.ts'),
  );

  const ready = new Promise<void>((resolve) => {
    child.on('message', (data) => {
      if (data === 'ready') {
        resolve();
      }
    });
  });

  const result = new Promise<string[]>((resolve) => {
    const messages: string[] = [];
    child.on('message', (data) => {
      if (data !== 'ready') {
        messages.push(data.toString());
      }
    });
    child.on('close', () => resolve(messages));
  });

  await ready;

  return { child, result };
};

describe('registerExitHandler', () => {
  it('runs handler on exit', async () => {
    const { result } = await fork();
    assert.deepStrictEqual(await result, ['exited with: beforeExit']);
  });

  it('runs handler on exit with SIGTERM', async () => {
    const { child, result } = await fork();
    child.kill();
    assert.deepStrictEqual(await result, ['exited with: SIGTERM']);
  });

  it('runs handler on exit with SIGINT', async () => {
    const { child, result } = await fork();
    child.kill('SIGINT');
    assert.deepStrictEqual(await result, ['exited with: SIGINT']);
  });

  it('runs handler on exit with uncaughtException', async () => {
    const { child, result } = await fork();
    child.send({ eval: 'throw()' });
    assert.deepStrictEqual(await result, ['exited with: uncaughtException']);
  });

  it('runs handler on exit with unhandledRejection', async () => {
    const { child, result } = await fork();
    child.send({ eval: 'new Promise((_, reject) => reject())' });
    assert.deepStrictEqual(await result, ['exited with: unhandledRejection']);
  });

  it('does not run handler on exit with SIGKILL', async () => {
    const { child, result } = await fork();
    child.kill('SIGKILL');
    assert.deepStrictEqual(await result, []);
  });
});

describe('deregisterExitHandler', () => {
  it('cancels handler', async () => {
    const { child, result } = await fork();
    child.send({ eval: 'deregisterExitHandler(1)' });
    assert.deepStrictEqual(await result, []);
  });
});
