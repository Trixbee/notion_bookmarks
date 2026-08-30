'use client'

import React, { useState, useEffect, memo, useCallback, useMemo, useRef } from 'react'
import { cn } from '@/lib/utils'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'
import * as Icons from 'lucide-react'
import { WebsiteConfig } from '@/types'

interface Category {
  id: string
  name: string
  iconName?: string
  subCategories: {
    id: string
    name: string
  }[]
}

interface NavigationProps {
  categories: Category[]
  config: WebsiteConfig
}

const defaultConfig: WebsiteConfig = {
  SOCIAL_GITHUB: '', SOCIAL_BLOG: '', SOCIAL_X: '', SOCIAL_JIKE: '', SOCIAL_WEIBO: ''
}

const Navigation = memo(function Navigation({ categories, config = defaultConfig }: NavigationProps) {
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [mobileCategoryId, setMobileCategoryId] = useState<string>('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [isMobileSubNavVisible, setIsMobileSubNavVisible] = useState(true)
  const lastScrollYRef = useRef(0)
  const scrollDirectionDistanceRef = useRef(0)
  const lastScrollDirectionRef = useRef<'up' | 'down' | null>(null)
  const suppressAutoHideRef = useRef(false)
  const suppressAutoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const mobileCategory = useMemo(
    () => categories.find(category => category.id === mobileCategoryId) || categories[0],
    [categories, mobileCategoryId]
  )

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) next.delete(categoryId)
      else next.add(categoryId)
      return next
    })
  }, [])

  const scrollToElement = useCallback((elementId: string) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    const element = document.getElementById(elementId)
    if (element) {
      const rect = element.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      window.scrollTo({ top: rect.top + scrollTop - 148, behavior: 'smooth' })
    }
  }, [])

  const handleNavClick = useCallback((categoryId: string, subCategoryId?: string) => {
    const elementId = subCategoryId ? `${categoryId}-${subCategoryId}` : categoryId
    setActiveCategory(elementId)
    scrollToElement(elementId)
  }, [scrollToElement])

  const handleMobileCategoryClick = useCallback((categoryId: string) => {
    setMobileCategoryId(categoryId)
    setIsMobileSubNavVisible(true)
    scrollDirectionDistanceRef.current = 0
    lastScrollDirectionRef.current = null
    suppressAutoHideRef.current = true
    if (suppressAutoHideTimerRef.current) clearTimeout(suppressAutoHideTimerRef.current)
    handleNavClick(categoryId)
  }, [handleNavClick])

  const handleCategoryToggle = useCallback((categoryId: string) => {
    toggleCategory(categoryId)
    handleNavClick(categoryId)
  }, [handleNavClick, toggleCategory])

  useEffect(() => {
    if (categories.length > 0 && activeCategory === '') setActiveCategory(categories[0].id)
    if (categories.length > 0 && mobileCategoryId === '') setMobileCategoryId(categories[0].id)
  }, [categories, activeCategory, mobileCategoryId])

  useEffect(() => {
    if (typeof window === 'undefined') return

    lastScrollYRef.current = window.scrollY

    const handleScroll = () => {
      if (window.innerWidth >= 1024) return

      const currentScrollY = Math.max(window.scrollY, 0)
      const delta = currentScrollY - lastScrollYRef.current
      lastScrollYRef.current = currentScrollY

      if (suppressAutoHideRef.current) {
        setIsMobileSubNavVisible(true)
        scrollDirectionDistanceRef.current = 0
        lastScrollDirectionRef.current = null
        if (suppressAutoHideTimerRef.current) clearTimeout(suppressAutoHideTimerRef.current)
        suppressAutoHideTimerRef.current = setTimeout(() => {
          suppressAutoHideRef.current = false
          lastScrollYRef.current = Math.max(window.scrollY, 0)
        }, 180)
        return
      }

      if (currentScrollY <= 20) {
        setIsMobileSubNavVisible(true)
        scrollDirectionDistanceRef.current = 0
        lastScrollDirectionRef.current = null
        return
      }

      if (Math.abs(delta) < 1) return

      const direction = delta > 0 ? 'down' : 'up'
      if (lastScrollDirectionRef.current !== direction) {
        lastScrollDirectionRef.current = direction
        scrollDirectionDistanceRef.current = 0
      }
      scrollDirectionDistanceRef.current += Math.abs(delta)

      if (direction === 'down' && scrollDirectionDistanceRef.current >= 100) {
        setIsMobileSubNavVisible(false)
        scrollDirectionDistanceRef.current = 0
      } else if (direction === 'up' && scrollDirectionDistanceRef.current >= 24) {
        setIsMobileSubNavVisible(true)
        scrollDirectionDistanceRef.current = 0
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (suppressAutoHideTimerRef.current) clearTimeout(suppressAutoHideTimerRef.current)
    }
  }, [])

  return (
    <>
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-20 border-b bg-background">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
            <span className="neon-title">{config.SITE_TITLE}</span>
          </div>
          {config.SHOW_THEME_SWITCHER !== 'false' && <ThemeSwitcher />}
        </div>

        <div className="overflow-x-auto flex items-center h-12 border-t scrollbar-none">
          <div className="flex px-4 min-w-max gap-2">
            {categories.map(category => {
              const isActive = mobileCategory?.id === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => handleMobileCategoryClick(category.id)}
                  className={cn(
                    'mobile-nav-category-button whitespace-nowrap px-3 py-1.5 text-sm rounded-full transition-colors shrink-0',
                    isActive
                      ? 'mobile-nav-category-active bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >{category.name}</button>
              )
            })}
          </div>
        </div>

        {mobileCategory && mobileCategory.subCategories.length > 0 && (
          <div
            className={cn(
              'overflow-hidden transition-[height,opacity] duration-200 ease-out',
              isMobileSubNavVisible ? 'h-10 opacity-100 border-t' : 'h-0 opacity-0 border-t-0'
            )}
          >
            <div className="overflow-x-auto flex items-center h-10 scrollbar-none">
              <div className="flex px-4 min-w-max gap-2">
                {mobileCategory.subCategories.map(subCategory => {
                  const subId = `${mobileCategory.id}-${subCategory.id}`
                  const isActive = activeCategory === subId
                  return (
                    <button
                      key={subCategory.id}
                      onClick={() => handleNavClick(mobileCategory.id, subCategory.id)}
                      className={cn(
                        'mobile-nav-subcategory-button whitespace-nowrap px-3 py-1 text-xs rounded-full transition-colors shrink-0',
                        isActive
                          ? 'mobile-nav-subcategory-active bg-primary text-primary-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      )}
                    >{subCategory.name}</button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      <nav className="desktop-sidebar hidden lg:block w-[280px] flex-shrink-0 h-screen sticky top-0 p-4 overflow-y-auto border-r">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
            <span className="neon-title">{config.SITE_TITLE}</span>
          </div>
          {config.SHOW_THEME_SWITCHER !== 'false' && <ThemeSwitcher />}
        </div>

        <ul className="space-y-1 pb-24">
          {categories.map(category => {
            const IconComponent = category.iconName && category.iconName in Icons
              ? (Icons[category.iconName as keyof typeof Icons] as React.ComponentType)
              : Icons.Globe
            const isCategoryActive = activeCategory === category.id || activeCategory.startsWith(`${category.id}-`)
            const isCategoryExpanded = expandedCategories.has(category.id)

            return (
              <li key={category.id}>
                <div className="flex flex-col">
                  <button
                    onClick={() => handleCategoryToggle(category.id)}
                    className={cn(
                      'nav-category-button w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors',
                      isCategoryActive
                        ? 'nav-category-active bg-primary text-primary-foreground font-medium'
                        : isCategoryExpanded
                        ? 'nav-category-expanded bg-accent'
                        : 'hover:bg-accent/50'
                    )}
                  >
                    <div className="flex items-center space-x-2"><IconComponent className="w-4 h-4" /><span>{category.name}</span></div>
                    <Icons.ChevronDown className={cn('w-4 h-4 transition-transform', isCategoryExpanded ? 'rotate-180' : '')} />
                  </button>

                  {isCategoryExpanded && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {category.subCategories.map(subCategory => (
                        <li key={subCategory.id}>
                          <button
                            onClick={() => handleNavClick(category.id, subCategory.id)}
                            className={cn(
                              'nav-subcategory-button w-full text-left px-4 py-2 rounded-lg transition-colors text-sm',
                              activeCategory === `${category.id}-${subCategory.id}`
                                ? 'nav-subcategory-active bg-primary text-primary-foreground font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            )}
                          >{subCategory.name}</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
})

export default Navigation
