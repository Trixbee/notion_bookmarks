// src/app/page.tsx
import LinkContainer from '@/components/layout/LinkContainer';
import Navigation from '@/components/layout/Navigation';
import { getLinks, getCategories, getWebsiteConfig } from '@/lib/notion';
import Footer from '@/components/layout/Footer';
import React from 'react';
import HomeWidgets from '@/components/widgets/HomeWidgets';

export const revalidate = 60;

export default async function HomePage() {
  const [notionCategories, links, config] = await Promise.all([
    getCategories(), getLinks(), getWebsiteConfig(),
  ]);

  const enabledCategories = new Set(notionCategories.map(cat => cat.name));
  const processedLinks = links
    .map(link => ({ ...link, category1: link.category1 || '未分类', category2: link.category2 || '默认' }))
    .filter(link => enabledCategories.has(link.category1));

  const categoriesWithLinks = new Set(processedLinks.map(link => link.category1));
  const activeCategories = notionCategories.filter(category => categoriesWithLinks.has(category.name));

  const categoriesWithSubs = activeCategories.map(category => {
    const subCategories = new Set(
      processedLinks.filter(link => link.category1 === category.name).map(link => link.category2)
    );
    return {
      ...category,
      subCategories: Array.from(subCategories).map(subCat => ({
        id: subCat.toLowerCase().replace(/\s+/g, '-'),
        name: subCat
      }))
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="lg:hidden">
        <Navigation categories={categoriesWithSubs} config={config} />
      </div>
      <aside className="fixed left-0 top-0 w-[300px] h-screen z-20 hidden lg:block pb-24">
        <Navigation categories={categoriesWithSubs} config={config} />
      </aside>
      {/* 手机顶部：Logo 64 + 一级 48 + 二级 40 = 152px。 */}
      <main className="ml-0 lg:ml-[300px] pt-[152px] lg:pt-4 min-h-screen flex flex-col">
        {config.WIDGET_CONFIG && (
          <div className="w-full"><HomeWidgets config={config} /></div>
        )}
        <div className="flex-1 w-full min-w-0 overflow-x-hidden px-4 py-4 lg:pt-0 pb-24">
          <LinkContainer
            initialLinks={processedLinks}
            enabledCategories={enabledCategories}
            categories={activeCategories}
          />
        </div>
      </main>
      <Footer config={config} className="fixed left-0 right-0 bottom-0 z-30" />
    </div>
  );
}
