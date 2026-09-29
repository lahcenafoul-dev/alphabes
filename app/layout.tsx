// The real root layout, with <html lang>, lives in app/[locale]/layout.tsx.
// This pass-through exists because app/not-found.tsx needs a parent layout.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
