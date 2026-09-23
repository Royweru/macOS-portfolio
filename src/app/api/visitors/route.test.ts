import { afterEach, describe, expect, it } from 'vitest';
import { GET, POST } from './route';

const previousUrl = process.env.KV_REST_API_URL;
const previousToken = process.env.KV_REST_API_TOKEN;

afterEach(() => {
  if (previousUrl === undefined) delete process.env.KV_REST_API_URL;
  else process.env.KV_REST_API_URL = previousUrl;
  if (previousToken === undefined) delete process.env.KV_REST_API_TOKEN;
  else process.env.KV_REST_API_TOKEN = previousToken;
});

describe('visitor route local fallback', () => {
  it('increments an in-memory visitor count when KV is unavailable', async () => {
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    const before = await (await GET()).json() as { count: number };
    const response = await (await POST()).json() as { count: number; visitorNumber: number; persistent: boolean };
    expect(response.count).toBe(before.count + 1);
    expect(response.visitorNumber).toBe(response.count);
    expect(response.persistent).toBe(false);
  });
});
