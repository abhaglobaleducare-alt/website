# University campus images

Drop clean campus/building photos here to power the **University Explorer**
gallery on destination pages (`/destinations/georgia`, `/destinations/timor-leste`).

## How to add a gallery for a university

1. Put 2–4 photos in the matching slug folder, e.g.
   `caucasus-university/campus-1.jpg`, `caucasus-university/campus-2.jpg`.
2. Register the paths in [`src/data/universityImages.ts`](../../../src/data/universityImages.ts)
   under that slug.
3. Optimise first: **max width 1920px, compress to < 300 KB** each.

Universities with no photos listed simply show their courses table directly
(graceful fallback) — no gallery, no broken images.

Slug = kebab-case of the university name (no spaces, no parentheses), matching
`universitySlug()` in `src/data/courses.ts`.
