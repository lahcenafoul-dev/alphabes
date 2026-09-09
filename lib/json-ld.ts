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
