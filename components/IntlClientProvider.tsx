"use client";

// next-intl's client provider, used directly with explicit props. The server
// version of NextIntlClientProvider reads formats, `now` and the time zone
// from the request when they aren't passed, which can make pages dynamic.
export { NextIntlClientProvider as default } from "next-intl";
