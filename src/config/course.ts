/**
 * Course configuration for the template.
 *
 * When a new course is created from this template, the course author edits this
 * single file to configure title, description, sections, difficulty, tags, and
 * theming. All UI, layout, and interactive components read from this config.
 *
 * DO NOT add university-specific, professor-specific, or institutional branding.
 * The only permanent identity is Danial Rashidi.
 */

import type { CourseConfig } from '../lib/types';

export const courseConfig: CourseConfig = {
  // --- Identity (course-specific) ---
  title: 'فیزیک ۲، قدم‌به‌قدم',
  // Header lockup shows the short wordmark only (owner direction 2026-10-07).
  headerTitle: 'فیزیک ۲',
  headerMark: 'atom',
  tagline: 'از بار الکتریکی تا قانون آمپر — با مثال حل‌شده، فرمول دقیق و آزمایشگاه تعاملی',
  description:
    'درس‌نامهٔ آزاد و قدم‌به‌قدم فیزیک ۲: الکتریسیته و مغناطیس از پایه. هر مفهوم با شهود ساده، هر فرمول با توضیح دقیق و هر بخش با تمرین و آزمایشگاه تعاملی.',
  shortDescription: 'درس‌نامهٔ قدم‌به‌قدم فیزیک ۲: الکتریسیته و مغناطیس',
  locale: 'fa',
  direction: 'rtl',

  // --- Course metadata ---
  difficulty: 'beginner',
  estimatedDuration: 'خودآموز',
  difficultyLevel: 2, // 1–5 scale
  tags: ['فیزیک', 'الکتریسیته', 'مغناطیس', 'فیزیک ۲'],
  category: 'آموزشی',

  // --- Sections (navigation groups) ---
  // One section per lecture-note part, plus a lab collecting the interactives.
  sections: [
    {
      id: 'charge-field',
      title: 'بار الکتریکی و میدان',
      description: 'بار، قانون کولن، میدان بار نقطه‌ای و دوقطبی',
      order: 1,
    },
    {
      id: 'gauss',
      title: 'توزیع پیوستهٔ بار و قانون گاوس',
      description: 'چگالی بار، شار و کاربرد گاوس در تقارن‌ها',
      order: 2,
    },
    {
      id: 'potential',
      title: 'پتانسیل الکتریکی و خازن',
      description: 'اختلاف پتانسیل، انرژی و خازن‌های سری و موازی',
      order: 3,
    },
    {
      id: 'circuits',
      title: 'جریان، مدار و RC',
      description: 'قانون اهم، توان، کیرشهف و شارژ و تخلیهٔ خازن',
      order: 4,
    },
    {
      id: 'magnetism',
      title: 'مغناطیس و قانون آمپر',
      description: 'نیروی مغناطیسی، حرکت دایره‌ای و میدان جریان‌ها',
      order: 5,
    },
    {
      id: 'lab',
      title: 'آزمایشگاه',
      description: 'همهٔ شبیه‌سازی‌های تعاملی دوره در یک‌جا',
      order: 6,
    },
  ],

  // --- Course-specific theming ---
  // `themePreset` selects a shared preset from `src/lib/themes.ts`; inline
  // `theme.colors` still wins when both are set, so a course can start from a
  // preset and adjust one role. Never fork `src/styles/theme.css` per course.
  themePreset: 'physics',
  theme: {
    name: 'physics',
    // Refined Physics II palette (owner-approved direction, 2026-10-07):
    // vivid-laboratory indigo primary with the amber accent. Roles come
    // from the `physics` preset; only primary/deep are overridden here —
    // never fork theme.css. Measured (WCAG 2.2 relative luminance):
    // white on #4F46E5 = 6.3:1, #4338CA on paper #FAF7F0 = 7.4:1,
    // accent #B45309 on paper = 4.7:1 — all light-theme text pairs pass.
    // Known limitation: the single-hex override also applies in dark mode,
    // where filled-button text stays near-black (see docs/DESIGN.md).
    colors: { primary: '#4F46E5', primaryHover: '#4338CA' },
    typography: 'traditional',
    motif: 'geometric',
  },

  // --- Feature flags ---
  // Every capability defaults to enabled when omitted. Turn a flag off to
  // hide its UI (nav item, island, section) without editing components.
  features: {
    search: true,
    commandPalette: true,
    formulas: true,
    glossary: true,
    practice: true,
    progress: true,
    simulations: true,
    toc: true,
    related: true,
    courseMap: true,
  },
};
