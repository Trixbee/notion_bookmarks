import { NextResponse } from 'next/server';
import { envConfig } from '@/config';
import { notion } from '@/lib/notion';
import { isNotionLinkPage, toLink } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SERVER_ICON_CACHE_MS = 15_000;
type IconMap = Record<string, string>;

let cachedIcons: { icons: IconMap; expiresAt: number } | null = null;
let iconRefreshRequest: Promise<IconMap> | null = null;

async function fetchFreshIcons(databaseId: string): Promise<IconMap> {
  const now = Date.now();
  if (cachedIcons && cachedIcons.expiresAt > now) return cachedIcons.icons;

  if (!iconRefreshRequest) {
    iconRefreshRequest = (async () => {
      const icons: IconMap = {};
      let hasMore = true;
      let nextCursor: string | undefined;

      while (hasMore) {
        const response = await notion.databases.query({
          database_id: databaseId,
          start_cursor: nextCursor,
        });

        for (const page of response.results) {
          if (!isNotionLinkPage(page)) continue;

          const link = toLink(page);
          const iconUrl = link.iconfile || link.iconlink;
          if (iconUrl) icons[link.id] = iconUrl;
        }

        hasMore = response.has_more;
        nextCursor = response.next_cursor || undefined;
      }

      cachedIcons = {
        icons,
        expiresAt: Date.now() + SERVER_ICON_CACHE_MS,
      };

      return icons;
    })().finally(() => {
      iconRefreshRequest = null;
    });
  }

  return iconRefreshRequest;
}

export async function GET() {
  const databaseId = envConfig.NOTION_LINKS_DB_ID;

  if (!databaseId) {
    return NextResponse.json(
      { icons: {} },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  try {
    const icons = await fetchFreshIcons(databaseId);

    return NextResponse.json(
      { icons },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('刷新 Notion 图标地址失败:', error);
    return NextResponse.json(
      { icons: {}, error: '刷新图标地址失败' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
