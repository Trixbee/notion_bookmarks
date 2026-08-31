'use client';

import { Link } from '@/types';
import { IconExternalLink } from '@tabler/icons-react';
import React, { useState, useEffect, memo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import {
  FALLBACK_ICON_SRC,
  getFailedIconState,
  getInitialIconState,
  getLinkIconUrl,
  getLoadedIconState,
} from '@/lib/link-icon';

interface LinkCardProps {
  link: Link;
  className?: string;
  eager?: boolean;
}

const ICON_RETRY_DELAYS = [1000, 2000] as const;

function Tooltip({ content, show, x, y }: { content: string; show: boolean; x: number; y: number }) {
  if (!show || typeof window === 'undefined' || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed p-2 rounded-lg bg-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/85 border shadow-lg max-w-xs z-[100] pointer-events-none animate-in fade-in zoom-in-95 duration-200"
      style={{ left: x, top: y - 8, transform: 'translateY(-100%)' }}
    >
      <p className="text-sm text-popover-foreground whitespace-normal">{content}</p>
    </div>,
    document.body
  );
}

const OptimisedLinkIcon = memo(function OptimisedLinkIcon({
  src,
  alt,
  eager,
  loaded,
  retryKey,
  onLoad,
  onError
}: {
  src: string;
  alt: string;
  eager: boolean;
  loaded: boolean;
  retryKey: number;
  onLoad?: () => void;
  onError: () => void;
}) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (!image?.complete) return;

    if (image.naturalWidth > 0) onLoad?.();
    else onError();
  }, [src, retryKey, onLoad, onError]);

  return (
    <>
      {!loaded && src !== FALLBACK_ICON_SRC && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={FALLBACK_ICON_SRC}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain opacity-45"
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={`${src}-${retryKey}`}
        ref={imageRef}
        src={src}
        alt={alt}
        className={cn(
          'relative w-full h-full object-contain transition-opacity duration-150',
          loaded || src === FALLBACK_ICON_SRC ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={onLoad}
        onError={onError}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority="auto"
        referrerPolicy="no-referrer"
      />
    </>
  );
}, (prev, next) => (
  prev.src === next.src &&
  prev.alt === next.alt &&
  prev.eager === next.eager &&
  prev.loaded === next.loaded &&
  prev.retryKey === next.retryKey
));

const LinkCard = memo(function LinkCard({ link, className, eager = false }: LinkCardProps) {
  const [titleTooltip, setTitleTooltip] = useState({ show: false, x: 0, y: 0 });
  const [descTooltip, setDescTooltip] = useState({ show: false, x: 0, y: 0 });
  const [iconState, setIconState] = useState(() => getInitialIconState(link));
  const [iconRetryKey, setIconRetryKey] = useState(0);
  const previousIconSourceRef = useRef(getLinkIconUrl(link));
  const iconRetryCountRef = useRef(0);
  const iconRetryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearIconRetryTimer = useCallback(() => {
    if (iconRetryTimerRef.current !== null) {
      clearTimeout(iconRetryTimerRef.current);
      iconRetryTimerRef.current = null;
    }
  }, []);

  const handleImageError = useCallback(() => {
    if (iconState.src === FALLBACK_ICON_SRC || iconRetryTimerRef.current !== null) return;

    const retryDelay = ICON_RETRY_DELAYS[iconRetryCountRef.current];
    if (retryDelay !== undefined) {
      iconRetryCountRef.current += 1;
      iconRetryTimerRef.current = setTimeout(() => {
        iconRetryTimerRef.current = null;
        setIconRetryKey((key) => key + 1);
      }, retryDelay);
      return;
    }

    setIconState((state) => {
      if (state.src === FALLBACK_ICON_SRC) return state;
      return getFailedIconState();
    });
  }, [iconState.src]);

  const handleImageLoad = useCallback(() => {
    clearIconRetryTimer();
    setIconState((state) => {
      if (state.isLoaded) return state;
      return getLoadedIconState(state);
    });
  }, [clearIconRetryTimer]);

  const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLElement>, isTitle: boolean) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const setter = isTitle ? setTitleTooltip : setDescTooltip;
    setter({ show: true, x: rect.left, y: rect.top });
  }, []);

  const handleMouseLeave = useCallback((isTitle: boolean) => {
    const setter = isTitle ? setTitleTooltip : setDescTooltip;
    setter({ show: false, x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const currentSource = getLinkIconUrl(link);
    if (previousIconSourceRef.current === currentSource) return;

    clearIconRetryTimer();
    iconRetryCountRef.current = 0;
    setIconRetryKey(0);
    previousIconSourceRef.current = currentSource;
    setIconState(getInitialIconState(link));
  }, [link.iconfile, link.iconlink, link, clearIconRetryTimer]);

  useEffect(() => () => clearIconRetryTimer(), [clearIconRetryTimer]);

  return (
    <>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "relative group flex h-full flex-col p-4 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-[transform,border-color,box-shadow] duration-200 hover:scale-[1.02] active:scale-[0.98]",
          "hover:shadow-lg hover:shadow-primary/5",
          "w-full max-w-full",
          className
        )}
      >
        <div className="flex flex-col h-full gap-2">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden transition-all shrink-0 bg-muted/50 p-1.5 border border-border/50">
              <div className="icon-container relative w-full h-full">
                <OptimisedLinkIcon
                  src={iconState.src}
                  alt={link.name}
                  eager={eager}
                  loaded={iconState.isLoaded}
                  retryKey={iconRetryKey}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0 relative">
              <div className="relative" onMouseEnter={(e) => handleMouseEnter(e, true)} onMouseLeave={() => handleMouseLeave(true)}>
                <h3 className="link-card-title text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1 pr-6">{link.name}</h3>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <IconExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>

          {link.desc && (
            <div className="relative flex-1 min-h-0" onMouseEnter={(e) => handleMouseEnter(e, false)} onMouseLeave={() => handleMouseLeave(false)}>
              <p className="text-sm text-foreground/80 group-hover:text-foreground line-clamp-2 transition-colors">{link.desc}</p>
            </div>
          )}

          {link.tags && link.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto flex-shrink-0">
              {link.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={cn('link-tag inline-flex items-center px-2 py-0.5 text-xs rounded-md bg-muted/40 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary/90 transition-colors', tag.includes('力荐') && 'link-tag-featured')} title={tag}>
                  <span className="link-tag-label truncate max-w-[80px]">{tag}</span>
                </span>
              ))}
              {link.tags.length > 3 && (
                <span className="link-tag inline-flex items-center px-2 py-0.5 text-xs rounded-md bg-muted/40 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary/90 transition-colors shrink-0">+{link.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>

        <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-primary/5 group-hover:via-primary/2 group-hover:to-transparent transition-colors duration-500" />
      </a>

      <Tooltip content={link.name} show={titleTooltip.show} x={titleTooltip.x} y={titleTooltip.y} />
      {link.desc && <Tooltip content={link.desc} show={descTooltip.show} x={descTooltip.x} y={descTooltip.y} />}
    </>
  );
}, (prev, next) => {
  const prevTags = prev.link.tags ?? [];
  const nextTags = next.link.tags ?? [];

  return (
    prev.link.id === next.link.id &&
    prev.link.name === next.link.name &&
    prev.link.desc === next.link.desc &&
    prev.link.url === next.link.url &&
    prev.link.iconfile === next.link.iconfile &&
    prev.link.iconlink === next.link.iconlink &&
    prevTags.length === nextTags.length &&
    prevTags.every((tag, index) => tag === nextTags[index]) &&
    prev.eager === next.eager &&
    prev.className === next.className
  );
});

export default LinkCard;
