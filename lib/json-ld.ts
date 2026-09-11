export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildLearningResourceJsonLd(worksheet: {
  title: string;
  description: string;
  url: string;
  skills: string[];
  ageLevelLabel: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: worksheet.title,
    description: worksheet.description,
    url: worksheet.url,
    learningResourceType: "Worksheet",
    educationalLevel: worksheet.ageLevelLabel,
    teaches: worksheet.skills.join(", "),
    isAccessibleForFree: true,
  };
}

export function buildArticleJsonLd(article: {
  headline: string;
  description: string;
  url: string;
  author: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    url: article.url,
    mainEntityOfPage: article.url,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: "AlphaBes" },
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
  };
}
