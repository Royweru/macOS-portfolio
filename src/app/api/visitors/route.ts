import { NextResponse } from 'next/server';

const VISITOR_KEY = 'weru97:visitors';
const localState = globalThis as typeof globalThis & { __weru97Visitors?: number };

const hasKv = () => Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

const getKv = async () => {
  if (!hasKv()) return undefined;
  return (await import('@vercel/kv')).kv;
};

export async function GET() {
  try {
    const kv = await getKv();
    const count = kv ? Number(await kv.get<number>(VISITOR_KEY) ?? 0) : (localState.__weru97Visitors ?? 0);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: localState.__weru97Visitors ?? 0, persistent: false });
  }
}

export async function POST() {
  try {
    const kv = await getKv();
    const count = kv ? await kv.incr(VISITOR_KEY) : (localState.__weru97Visitors = (localState.__weru97Visitors ?? 0) + 1);
    return NextResponse.json({ count, visitorNumber: count, persistent: Boolean(kv) });
  } catch {
    const count = (localState.__weru97Visitors = (localState.__weru97Visitors ?? 0) + 1);
    return NextResponse.json({ count, visitorNumber: count, persistent: false });
  }
}
