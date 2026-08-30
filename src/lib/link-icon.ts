export const FALLBACK_ICON_SRC = '/globe.svg';

type LinkIconSource = {
  iconfile?: string | null;
  iconlink?: string | null;
};

export type IconLoadState = {
  src: string;
  isLoaded: boolean;
  hasFailed: boolean;
  showFallback: boolean;
  showSpinner: boolean;
};

export function getLinkIconUrl(link: LinkIconSource): string {
  if (link.iconfile) {
    return link.iconfile;
  }

  if (link.iconlink) {
    return link.iconlink;
  }

  return FALLBACK_ICON_SRC;
}

export function getInitialIconState(link: LinkIconSource): IconLoadState {
  const src = getLinkIconUrl(link);

  return {
    src,
    isLoaded: src === FALLBACK_ICON_SRC,
    hasFailed: false,
    showFallback: false,
    // 小图标加载期间保持稳定的图标容器，不显示持续旋转的 loading 动画。
    showSpinner: false,
  };
}

export function getLoadedIconState(state: IconLoadState): IconLoadState {
  return {
    ...state,
    isLoaded: true,
    showFallback: false,
    showSpinner: false,
  };
}

export function getFailedIconState(): IconLoadState {
  return {
    src: FALLBACK_ICON_SRC,
    isLoaded: true,
    hasFailed: true,
    showFallback: false,
    showSpinner: false,
  };
}
