import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/lib/notion';
import { isNotionLinkPage, toLink } from '@/types';
import { getIconUrlExpiry, isIconUrlExpired } from '@/lib/link-icon';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SERVER_ICON_CACHE_MS = 15_000;
const MAX_CACHE_ENTRIES = 500;
const pageIdPattern = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

const iconCache = new Map<string, { url: string; expiresAt: number }>();
const inFlight = new Map<string, Promise<string>>();

async function fetchIcon(pageId: string): Promise<string> {
  const cached = iconCache.get(pageId);
  if (cached && cached.expiresAt > Date.now() && !isIconUrlExpired(cached.url)) return cached.url;

  const existing = inFlight.get(pageId);
  if (existing) return existing;

  const request = (async () => {
    const page = await notion.pages.retrieve({ page_id: pageId });
    if (!isNotionLinkPage(page)) return '';

    const link = toLink(page);
    const url = link.iconfile || link.iconlink || '';
    if (iconCache.size >= MAX_CACHE_ENTRIES) iconCache.delete(iconCache.keys().next().value!);
    const expiry = getIconUrlExpiry(url);
    if (url && !isIconUrlExpired(url)) {
      iconCache.set(pageId, { url, expiresAt: Math.min(Date.now() + SERVER_ICON_CACHE_MS, expiry ?? Infinity) });
    }
    return url;
  })().finally(() => inFlight.delete(pageId));

  inFlight.set(pageId, request);
  return request;
}

export async function GET(request: NextRequest) {
  const pageId = request.nextUrl.searchParams.get('id') || '';
  if (!pageIdPattern.test(pageId)) {
    return NextResponse.json({ error: 'Invalid page id' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const url = await fetchIcon(pageId);
    return NextResponse.json({ url }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('刷新 Notion 图标地址失败:', error);
    return NextResponse.json({ error: '刷新图标地址失败' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
