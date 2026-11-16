import { template as newInquiry } from "./new-inquiry";
import type { ComponentType } from "react";

export type TemplateData = Record<string, unknown>;

export interface TemplateEntry<P = TemplateData> {
  component: ComponentType<P>;
  subject: string | ((data: P) => string);
  displayName?: string;
  previewData?: Partial<P>;
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string;
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 *
 * Example:
 *   import { template as welcomeTemplate } from './welcome'
 *   // then add to TEMPLATES: 'welcome': welcomeTemplate
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  "new-inquiry": newInquiry,
  // Add templates here as they are created, e.g.:
  // 'welcome': welcomeTemplate,
};
