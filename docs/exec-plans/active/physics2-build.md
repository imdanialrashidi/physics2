# Physics II — active execution plan

Goal: complete Physics II course site from scratch on the study template,
from the five raw note files in `Lecture notes/`. No code from the old project.

## Acceptance criteria → evidence

1. Homepage states the Physics II course, 5-part structure, real counts, one
   dominant start action → visual-qa captures at 1360 + 390, inspected.
2. Lesson reading renders KaTeX plates, quiz grades with explanations, an
   embedded island hydrates and computes → interaction-qa + inspected captures
   at 360 + 1360, zero console errors, no page-level overflow.
3. Discovery works through the shared engine: search finds a formula, course
   map lists all sections, prev/next and related links resolve →
   `validate:links` green + browser spot-check.
4. Static build under `/physics2/` passes validation, typecheck, tests,
   budgets → `npm run check` + `BASE_PATH=/physics2 npm run build`.
5. All five note files substantively represented, validator green, deterministic
   numeric examples match hand computation → coverage table in final report.

## Work order

- [x] Read AI-CONTENT-PROMPT, CONTENT-CONTRACT, product/design/quality/arch.
- [x] course.ts → Physics II, 6 sections, physics preset.
- [x] Remove calculus sample content; write Physics II content (lessons,
      concepts, formulas, examples, questions, glossary).
- [x] 8 course islands + registry + Astro wrappers + mdx map.
- [x] Lab lesson collecting all islands; embed islands in lessons.
- [x] Update route-dependent checks (build-output path, visual-qa ROUTES,
      interaction-qa quiz oracle) to the new course's representative routes.
- [x] validate/test/build/budgets/links; browser QA at 360/390/430/768/1024/1360.
- [x] Fix, re-verify, report PASS/FAIL/UNPROVEN per criterion.

## Follow-up fixes applied during QA

- Homepage hero plate replaced with subject-neutral geometry (was teaching
  calculus on a physics site); listing-page SEO descriptions (lessons,
  concepts, formulas, examples, practice, glossary, map, about) now derive
  from courseConfig instead of hard-coded calculus copy. Both logged in
  docs/DESIGN.md; no engine subject-coupling introduced.

## 2026-10-07 dev-run fix ("problem to run")

- Killed stale servers left from QA (astro preview :4321, python :4322) that
  stole the dev ports and served obsolete builds.
- Cleared corrupt Vite optimizeDeps cache (node_modules/.vite/deps): mixed
  ?v-hash chunks loaded TWO React copies in dev browser, so every island
  crashed with null useState and hydration wiped island content. After a
  clean re-optimization: dev serves all routes, 41/41 interaction checks pass
  in dev, zero browser errors.
- Note for developers: use http://localhost:4321 (127.0.0.1 goes through the
  environment proxy and fails). If dev islands ever crash with invalid-hook
  errors again, stop dev, delete node_modules/.vite/deps, restart.
- Remaining dev-SSR "Invalid hook call" terminal warning is pre-existing
  template behavior (fires on /search which touches none of the new code),
  does not affect SSR HTML, browser, or the production build.

## 2026-10-07 mobile menu fix (hamburger sometimes won't open)

- Root cause: the header script bound click directly to the menu button, but
  bundled scripts run only once while View Transitions swaps the header on
  every client-side navigation — after the first in-app navigation the
  button was dead until a full reload. Reproduced, then fixed with event
  delegation on document (survives swaps, single listener, no double-fire).
- Same root cause also killed the theme toggle after navigation; fixed in
  the same pass. Added X/☰ icon swap for open-state affordance plus Escape
  to close. Verified: open/close/Escape/post-nav open/theme-after-nav/
  second-nav open, zero page errors; interaction-qa 41/41; open-menu crop
  inspected at 390px.

## Coverage map (notes → content)

- Part1 (بار و میدان): lesson charge-and-electric-field; concepts
  electric-charge, conductor-insulator, electric-field, electric-dipole;
  formulas charge-quantization, coulomb-law, point-charge-field,
  dipole-axis-field; examples triangle-three-charges, square-zero-net-force,
  charges-on-axes, field-at-square-center, dipole-axis-derivation.
- Part2/f1 (پیوسته و گاوس): lesson continuous-charge-and-gauss; concepts
  charge-density, electric-flux; formulas ring-charge-field, plane-charge-field,
  gauss-law, charged-sphere-field, long-wire-field; example gauss-sphere.
- Part2/f2 (پتانسیل و خازن): lesson potential-and-capacitors; concepts
  electric-potential, capacitor; formulas point-charge-potential,
  parallel-plate-capacitor, capacitor-energy; example capacitor-combination.
- Part2/f3 (جریان و مدار و RC): lesson current-circuits-and-rc; concepts
  electric-current, kirchhoff-rc; formulas ohm-law, electric-power, rc-charging;
  example rc-charging-numbers.
- Part2/f4 (مغناطیس و آمپر): lesson magnetism-and-ampere; concept
  magnetic-field (+ampere-law folded into lesson); formulas
  magnetic-force-charge, cyclotron-radius, straight-wire-field, ampere-law,
  solenoid-field; example cyclotron-numbers.
- Glossary: 14 terms across all parts. Questions: 5 sets, one per part.
