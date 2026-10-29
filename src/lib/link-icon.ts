export const FALLBACK_ICON_SRC = '/globe.svg';

type LinkIconSource = {
  iconfile?: string | null;
  iconlink?: string | null;
};

export type IconLoadState = {
  src: string;
  isLoaded: boolean;
};

export function getLinkIconUrl(link: LinkIconSource): string {
  return link.iconfile || link.iconlink || FALLBACK_ICON_SRC;
}

export function getInitialIconState(link: LinkIconSource): IconLoadState {
  const src = getLinkIconUrl(link);
  return { src, isLoaded: src === FALLBACK_ICON_SRC };
}

export function getLoadedIconState(state: IconLoadState): IconLoadState {
  return state.isLoaded ? state : { ...state, isLoaded: true };
}

export function getFailedIconState(): IconLoadState {
  return { src: FALLBACK_ICON_SRC, isLoaded: true };
}

/** Returns a known signed URL expiry, or null for ordinary image URLs. */
export function getIconUrlExpiry(url: string): number | null {
  try {
    const parsed = new URL(url);
    const params = parsed.searchParams;
    const awsDate = params.get('X-Amz-Date');
    const awsExpires = params.get('X-Amz-Expires');
    if (awsDate && awsExpires && /^\d{8}T\d{6}Z$/.test(awsDate)) {
      const issued = Date.UTC(
        Number(awsDate.slice(0, 4)), Number(awsDate.slice(4, 6)) - 1,
        Number(awsDate.slice(6, 8)), Number(awsDate.slice(9, 11)),
        Number(awsDate.slice(11, 13)), Number(awsDate.slice(13, 15))
      );
      const seconds = Number(awsExpires);
      if (Number.isFinite(seconds) && seconds >= 0) return issued + seconds * 1000;
    }
    const expires = params.get('Expires');
    if (expires && /^\d+$/.test(expires)) {
      const value = Number(expires);
      if (Number.isFinite(value)) return value * 1000;
    }
  } catch {
    // Relative or malformed URLs are treated as ordinary URLs.
  }
  return null;
}

export function isIconUrlExpired(url: string, marginMs = 30_000): boolean {
  const expiry = getIconUrlExpiry(url);
  return expiry !== null && expiry <= Date.now() + marginMs;
}
