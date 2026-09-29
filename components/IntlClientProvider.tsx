"use client";

// next-intl's client provider, used directly with explicit props. The server
// version of NextIntlClientProvider reads formats, `now` and the time zone
// from the request, which makes app/not-found.tsx (rendered outside
// [locale]) and every page that includes it dynamic.
export { NextIntlClientProvider as default } from "next-intl";
