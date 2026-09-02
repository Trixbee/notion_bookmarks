// src/components/LinkContainer.tsx
import React from "react";
import LinkCard from "@/components/ui/LinkCard";
import { getCategoryIcon } from '@/lib/category-icons';
import { Link, Category } from '@/types';

interface LinkContainerProps {
  initialLinks: Link[];
  enabledCategories: Set<string>;
  categories: Category[];
}

const EAGER_ICON_COUNT = 10;

const formatDate = (date: Date) => date.toLocaleString('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
}).replace(/\//g, '-');

export default function LinkContainer({
  initialLinks,
  enabledCategories,
  categories,
}: LinkContainerProps) {
  const linksByCategory = initialLinks.reduce((acc, link) => {
    const cat1 = link.category1;
    const cat2 = link.category2;

    if (enabledCategories.has(cat1)) {
      if (!acc[cat1]) acc[cat1] = {};
      if (!acc[cat1][cat2]) acc[cat1][cat2] = [];
      acc[cat1][cat2].push(link);
    }
    return acc;
  }, {} as Record<string, Record<string, Link[]>>);

  let latestTimestamp = 0;
  for (const link of initialLinks) {
    const timestamp = new Date(link.created).getTime();
    if (Number.isFinite(timestamp) && timestamp > latestTimestamp) latestTimestamp = timestamp;
  }
  const latestUpdate = latestTimestamp > 0 ? formatDate(new Date(latestTimestamp)) : null;

  let renderedLinkCount = 0;

  return (
    <div className="space-y-16 pb-12 w-full min-w-0">
      {categories.map((category, categoryIndex) => {
        const categoryLinks = linksByCategory[category.name];
        if (!categoryLinks) return null;
        const IconComponent = getCategoryIcon(category.iconName);

        return (
          <section
            key={category.id}
            id={category.id}
            className={categoryIndex === 0
              ? 'space-y-8'
              : 'space-y-8 [content-visibility:auto] [contain-intrinsic-size:auto_900px]'}
          >
            <div className="section-heading flex items-center gap-3 pb-2 border-b">
              {IconComponent ? (
                <div className="section-heading-icon w-7 h-7 p-1 rounded-lg bg-primary/5 text-primary">
                  <IconComponent className="w-5 h-5" />
                </div>
              ) : null}
              <h2 className="section-heading-title text-2xl font-bold tracking-tight">{category.name}</h2>
            </div>

            <div className="space-y-12">
              {Object.entries(categoryLinks).map(([subCategory, links]) => {
                const sectionId = `${category.id}-${subCategory.toLowerCase().replace(/\s+/g, "-")}`;
                return (
                  <div key={sectionId} id={sectionId} className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 rounded-full bg-primary"></div>
                      <h3 className="subcategory-heading-title text-lg font-medium text-foreground/90">{subCategory}</h3>
                      <div className="text-sm text-muted-foreground">({links.length})</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 w-full">
                      {links.map((link) => {
                        const eager = renderedLinkCount < EAGER_ICON_COUNT;
                        renderedLinkCount += 1;
                        return (
                          <LinkCard
                            key={link.id}
                            link={link}
                            className="w-full"
                            eager={eager}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
      {latestUpdate && (
        <div className="mt-12 text-center text-sm text-muted-foreground">
          最近更新：{latestUpdate}
        </div>
      )}
    </div>
  );
}
