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
