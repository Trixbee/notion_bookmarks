import { type ThemeConfig } from '@/types/theme';
import './style.css';

// 简约主题配置
export const simpleTheme: ThemeConfig = {
  name: 'simple',
  displayName: '简约',
  modes: ['light', 'dark'],
  styles: {
    light: {
      // 基础颜色
      primary: 'hsl(0 0% 12%)',
      'primary-foreground': 'hsl(0 0% 98%)',
      background: 'hsl(0 0% 100%)',
      'background-foreground': 'hsl(222.2 47.4% 11.2%)',
      muted: 'hsl(210 40% 96.1%)',
      'muted-foreground': 'hsl(215.4 16.3% 46.9%)',
      accent: 'hsl(210 40% 96.1%)',
      'accent-foreground': 'hsl(222.2 47.4% 11.2%)',
      card: 'hsl(0 0% 100%)',
      'card-foreground': 'hsl(222.2 47.4% 11.2%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      popover: 'hsl(0 0% 100%)',
      'popover-foreground': 'hsl(222.2 47.4% 11.2%)',
      
      // 字体相关
      'font-family': 'var(--font-geist-sans), system-ui, sans-serif',
      'font-size-base': '1rem',
      'font-size-sm': '0.875rem',
      'font-size-lg': '1.125rem',
      'font-weight-normal': '400',
      'font-weight-medium': '500',
      'font-weight-bold': '700',
      'line-height': '1.5',
      
      // 卡片样式
      'card-padding': '1.25rem',
      'card-radius': '0.75rem',
      'card-shadow': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
      'card-hover-shadow': '0 4px 12px rgba(0,0,0,0.1)',
      'card-border-width': '1px',
      'card-border-style': 'solid',
      
      // 边框和圆角
      'border-radius-sm': '0.375rem',
      'border-radius-md': '0.5rem',
      'border-radius-lg': '0.75rem',
      'border-width': '1px',
      'border-style': 'solid',
      
      // 间距
      'spacing-xs': '0.5rem',
      'spacing-sm': '0.75rem',
      'spacing-md': '1rem',
      'spacing-lg': '1.5rem',
      'spacing-xl': '2rem',
      
      // 动画和过渡
      'transition-duration': '200ms',
      'transition-timing': 'ease-out',
      
      // 阴影
      'shadow-sm': '0 1px 2px rgba(0,0,0,0.05)',
      'shadow-md': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
      'shadow-lg': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
      'shadow-hover': '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
    },

    dark: {
      // ==============================
      // 基础颜色 - 中性黑灰深色
      // ==============================

      // 主要颜色
      primary: 'hsl(0 0% 92%)',
      'primary-foreground': 'hsl(0 0% 8%)',

      // 页面背景
      // 约等于 #121212
      background: 'hsl(0 0% 7%)',
      'background-foreground': 'hsl(0 0% 92%)',

      // 次级背景
      // 约等于 #242424
      muted: 'hsl(0 0% 14%)',
      'muted-foreground': 'hsl(0 0% 62%)',

      // Hover / 强调背景
      // 约等于 #292929
      accent: 'hsl(0 0% 16%)',
      'accent-foreground': 'hsl(0 0% 95%)',

      // 网站卡片
      // 约等于 #1A1A1A
      card: 'hsl(0 0% 10%)',
      'card-foreground': 'hsl(0 0% 92%)',

      // 边框
      // 约等于 #2E2E2E
      border: 'hsl(0 0% 18%)',

      // 弹出层
      popover: 'hsl(0 0% 10%)',
      'popover-foreground': 'hsl(0 0% 92%)',
      
      // ==============================
      // 字体相关
      // ==============================

      'font-family': 'var(--font-geist-sans), system-ui, sans-serif',
      'font-size-base': '1rem',
      'font-size-sm': '0.875rem',
      'font-size-lg': '1.125rem',
      'font-weight-normal': '400',
      'font-weight-medium': '500',
      'font-weight-bold': '700',
      'line-height': '1.5',
      
      // ==============================
      // 卡片样式
      // ==============================

      'card-padding': '1.25rem',
      'card-radius': '0.75rem',

      // 深色背景应该使用黑色阴影，
      // 不再使用原主题的白色发光阴影
      'card-shadow':
        '0 1px 3px rgba(0,0,0,0.32), 0 1px 2px rgba(0,0,0,0.24)',

      'card-hover-shadow':
        '0 6px 18px rgba(0,0,0,0.38)',

      'card-border-width': '1px',
      'card-border-style': 'solid',
      
      // ==============================
      // 边框和圆角
      // ==============================

      'border-radius-sm': '0.375rem',
      'border-radius-md': '0.5rem',
      'border-radius-lg': '0.75rem',
      'border-width': '1px',
      'border-style': 'solid',
      
      // ==============================
      // 间距
      // ==============================

      'spacing-xs': '0.5rem',
      'spacing-sm': '0.75rem',
      'spacing-md': '1rem',
      'spacing-lg': '1.5rem',
      'spacing-xl': '2rem',
      
      // ==============================
      // 动画和过渡
      // ==============================

      'transition-duration': '200ms',
      'transition-timing': 'ease-out',
      
      // ==============================
      // 阴影
      // ==============================

      'shadow-sm':
        '0 1px 2px rgba(0,0,0,0.24)',

      'shadow-md':
        '0 4px 6px -1px rgba(0,0,0,0.28), 0 2px 4px -1px rgba(0,0,0,0.18)',

      'shadow-lg':
        '0 10px 15px -3px rgba(0,0,0,0.32), 0 4px 6px -2px rgba(0,0,0,0.22)',

      'shadow-hover':
        '0 14px 28px rgba(0,0,0,0.38)'
    }
  }
};
