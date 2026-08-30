// src/app/page.tsx
import LinkContainer from '@/components/layout/LinkContainer';
import Navigation from '@/components/layout/Navigation';
import { getLinks, getCategories, getWebsiteConfig } from '@/lib/notion';
import Footer from '@/components/layout/Footer';
import React from 'react';

// 测试阶段保留 60 秒刷新周期。
export const revalidate = 60;

export default async function HomePage() {
  const [notionCategories, links, config] = await Promise.all([
    getCategories(), getLinks(), getWebsiteConfig(),
  ]);

  const enabledCategories = new Set(notionCategories.map(cat => cat.name));
  const subCategoriesByCategory = new Map<string, Set<string>>();
  const processedLinks = [] as typeof links;

  // 单次遍历完成兜底分类、启用分类过滤和二级分类索引，
  // 避免之后每个一级分类再次扫描全部链接。
  for (const link of links) {
    const normalizedLink = {
      ...link,
      category1: link.category1 || '未分类',
      category2: link.category2 || '默认',
    };

    if (!enabledCategories.has(normalizedLink.category1)) continue;

    processedLinks.push(normalizedLink);
    let subCategories = subCategoriesByCategory.get(normalizedLink.category1);
    if (!subCategories) {
      subCategories = new Set<string>();
      subCategoriesByCategory.set(normalizedLink.category1, subCategories);
    }
    subCategories.add(normalizedLink.category2);
  }

  const activeCategories = notionCategories.filter(category => subCategoriesByCategory.has(category.name));
  const categoriesWithSubs = activeCategories.map(category => ({
    ...category,
    subCategories: Array.from(subCategoriesByCategory.get(category.name) ?? []).map(subCat => ({
      id: subCat.toLowerCase().replace(/\s+/g, '-'),
      name: subCat,
    })),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Navigation 内部已经分别处理移动端与桌面端响应式布局，只挂载一个实例即可。 */}
      <Navigation categories={categoriesWithSubs} config={config} />

      {/* 手机顶部：Logo 64 + 一级 48 + 二级 40 = 152px。 */}
      <main className="ml-0 lg:ml-[300px] pt-[152px] lg:pt-4 min-h-screen flex flex-col">
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
