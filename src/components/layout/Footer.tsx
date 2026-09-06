'use client'

import React, { memo } from 'react'
import { WebsiteConfig } from '@/types'
import { FaGithub, FaXTwitter, FaWeibo } from 'react-icons/fa6'
import { FaBlogger } from 'react-icons/fa'
import { cn } from '@/lib/utils'

interface FooterProps {
  config: WebsiteConfig
  className?: string
}

const Footer = memo(function Footer({ config, className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        'relative bg-background border-t py-2.5 lg:fixed lg:bottom-0 lg:left-0 lg:right-0 lg:z-10 lg:py-4',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:flex-nowrap lg:justify-between">
          <div className="flex items-center space-x-3 lg:space-x-4">
            {config.SOCIAL_GITHUB && (
              <a
                href={config.SOCIAL_GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="GitHub"
              >
                <FaGithub className="w-5 h-5" />
              </a>
            )}
            {config.SOCIAL_BLOG && (
              <a
                href={config.SOCIAL_BLOG}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Blog"
              >
                <FaBlogger className="w-5 h-5" />
              </a>
            )}
            {config.SOCIAL_X && (
              <a
                href={config.SOCIAL_X}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="X (Twitter)"
              >
                <FaXTwitter className="w-5 h-5" />
              </a>
            )}
            {config.SOCIAL_JIKE && (
              <a
                href={config.SOCIAL_JIKE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="即刻"
              >
                <img
                  src="/logo_jike.png"
                  alt="即刻"
                  width={20}
                  height={20}
                  className={cn('filter-muted hover:filter-none transition-all')}
                  loading="lazy"
                  decoding="async"
                />
              </a>
            )}
            {config.SOCIAL_WEIBO && (
              <a
                href={config.SOCIAL_WEIBO}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="微博"
              >
                <FaWeibo className="w-5 h-5" />
              </a>
            )}
            {config.SOCIAL_XIAOHONGSHU && (
              <a
                href={config.SOCIAL_XIAOHONGSHU}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="小红书"
              >
                <img
                  src="/xhs_logo.svg"
                  alt="小红书"
                  width={20}
                  height={20}
                  className={cn('filter-muted hover:filter-none transition-all')}
                  loading="lazy"
                  decoding="async"
                />
              </a>
            )}
          </div>

          <p className="whitespace-nowrap text-xs text-muted-foreground lg:text-sm">
            © {currentYear} Bee Tech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
});

export default Footer;
