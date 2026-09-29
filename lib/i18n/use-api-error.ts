"use client";

import { useTranslations } from "next-intl";
import type messages from "@/messages/en.json";

type ErrorCode = keyof (typeof messages)["Errors"];

// API routes answer { error, code }; show the message for `code` in the
// visitor's language, or the generic message for anything unexpected.
export function useApiErrorMessage() {
  const t = useTranslations("Errors");
  return (data: { code?: unknown } | null | undefined): string => {
    const code = data?.code;
    return typeof code === "string" && t.has(code as ErrorCode) ? t(code as ErrorCode) : t("generic");
  };
}
