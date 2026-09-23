# Cherry Tree Agency — Landing Page PRD

## Original problem statement
High-converting premium landing page for a contractor marketing agency ("Cherry Tree Agency"). Goal: get qualified contractors ($2M+ revenue) to watch a VSL and book a strategy call.

## Product requirements
- Aesthetic: premium dark mode, black bg, white type, royal blue accent `#285EE0` (Apple/Stripe/Linear feel)
- Fonts: CocoGoose Pro (headings, local), Poppins (body, Google Fonts)
- Stack: React + TailwindCSS + Framer Motion + Lenis smooth scroll
- Sections: Hero (VSL) → Trust Bar → Video Testimonials → Why Different → Process Timeline → Offer/Feature Grid → FAQ → 3-step Appointment Form
- Videos: self-hosted MP4s (VSL + 4 testimonials), transcoded to 1080p with faststart + poster frames
- Mobile sticky CTA: "Call Us Now! (9am-5pm)" → tel:+16474903782

## Architecture (CHANGED 2026-09-18)
FRONTEND-ONLY deployment. The owner deploys just the static React build; there is NO backend in production.
- Lead capture: browser POSTs directly to two LeadConnector (GHL) webhooks (CORS-open, verified):
  - FORM SUBMIT (`REACT_APP_LEAD_WEBHOOK_URL`, ...cbf1d880...): fires on Step 2 Continue. Payload = all form fields + `lead_stage: "form_submitted"` + `submitted_at`. Captures drop-offs who never pick a time.
  - APPOINTMENT REQUEST (`REACT_APP_APPOINTMENT_WEBHOOK_URL`, ...c5849cc5...): fires on Step 3 submit. Payload = all fields + preferred_date/time + `lead_stage: "appointment_requested"`. Success screen shows only after 200.
- FastAPI + MongoDB backend still exists in the preview repo (/app/backend/server.py) but the frontend no longer calls it. GET /api/leads is protected by X-Admin-Key (see backend/.env) if the backend is ever used.

## Implemented (changelog)
- 2026-09-23: WhyDifferent copy revised per user: left "Other marketing agencies" (4 X items incl. generic forms + disorganized leads), right CHERRYTREE (5 checks: fly to you, film team, customized landing pages, custom CRM setup, entire funnel you never touch). WhoThisIsFor section now blue-highlighted (brand border/gradient + glow). WeFilmIt strip is now a compact horizontal AUTO-SCROLLING marquee (left→right, .marquee-track-reverse in index.css, hover-pause, reduced-motion safe, w-52/sm:w-64 cards, exactly 4 visible via max-w-[1096px] viewport, deep edge-fade masks so cards fade in/out while rotating).
- 2026-09-23: Testimonial outcome stats moved BELOW each video card (bold brand-blue display line with trending icon, data-testid testimonial-stat-N): Stephen Cruey "15 Projects in 5 Months", Emilio Talavera/Roofing Monkeys "Over 100 Roofs Sold", Clint Roberts "Over $400K in Revenue Generated", Ali Vafaeian/CFC "Over 30 Million Views Generated".
- 2026-09-23: PAGE REORGANIZED to sales-argument order: Hero → StatsBand → TrustBar → VideoTestimonials → WeFilmIt (NEW) → WhyDifferent → CTABand → SystemFlow (was FeatureGrid) → ProcessTimeline → WhoThisIsFor → FAQ → Apply. Chapters renumbered 01-08.
- 2026-09-23: CTA REPOSITIONING: all CTAs now "Apply To Work With Cherrytree" (was "Book Your Strategy Call"). Form: heading "See if we're a fit", buttons "Continue Application"/"Submit Application", success "Application received" + embedded confirmation video (public/confirmation/next-steps.mp4, 720p SDR tone-mapped from 4K HDR source, + poster). GHL auto-text should match this promise.
- 2026-09-23: WhyDifferent rewritten as high-contrast 5v5 comparison (TYPICAL MARKETING AGENCY X-list vs CHERRYTREE check-list). WeFilmIt uses 4 real stills extracted from user's testimonial/VSL footage (public/film-stills/) — swap for real BTS shoot photos when available. ProcessTimeline compacted to 3x2 numbered grid. FeatureGrid replaced by horizontal system flow CONTENT→ADS→LANDING PAGE→CRM→FOLLOW-UP→APPOINTMENT→SALE. Verified iteration_10 (100%).
- 2026-09-23: Hero subheadline tightened to "…by building and running their entire acquisition system — professionally filmed ads, paid media, landing pages, CRM and follow-up. We fly to you. We build it. We run it."
- 2026-09-23: Changed launch promise from 7 days to 30 days ("30-Day Launch" stats band, "Campaigns live in ~30 days" form badge).
- 2026-09-23: Form CRO copy update — success box now sets call expectation ("Keep your phone nearby — we'll be calling you shortly", call-from number +1 (647) 885-0384, "Can't talk right now?" text-reply fallback). Above-form subtitle now pre-frames the follow-up call; submit CTA reads "Request My Strategy Call"; under-CTA microcopy "Takes 60 seconds • No long-term contracts • We'll call you shortly after you apply".
- 2026-09-23: Meta Pixel installed (ID 1071617615485156, base code in public/index.html, PageView on load). Standard `Schedule` event fires on successful booking (AppointmentForm). Custom events `VSL_25/50/75/100` fire at VSL watch milestones (VideoPlayer vslTracking prop, hero only) for retargeting audiences. Safe wrapper in src/lib/pixel.js (no-op if blocked). Verified via fbq spy (simulated milestones + real booking).
- 2026-09-18: Frontend-only dual-webhook wiring (step 2 → form webhook, step 3 → appointment webhook). Verified via network interception (iteration_9, 100% pass).
- 2026-09-18: Hero VSL frame border changed white/10 → brand blue (#285EE0/50 wrapper, /40 player) on mobile + desktop.
- 2026-09-18: Backend: /api/leads/partial + upsert-by-email + secured GET /api/leads (kept for preview only).
- Earlier: full page build, CRO reorder, video transcoding, custom VSL player (click-to-play, no controls), 3-step form, $2M qualifier, mobile hero fixes, CFC testimonial (Ali Vafaeian, CFC Contracting, Toronto), sticky call CTA.

## Test reports
/app/test_reports/iteration_1..7.json (old backend flow), iteration_9.json (frontend-only flow — current source of truth)

## Backlog (prioritized)
- P1 (owner action): PUBLISH the Appointment Request workflow in GHL — it answered "test request received" (draft mode) during testing.
- P1 (owner action): In Meta Ads Manager, build Custom Audiences from the VSL_25 / VSL_50 / VSL_75 / VSL_100 events (Audiences → Create Custom Audience → Website → pick event). Events appear in Events Manager ~20 min after first firing.
- P2: Desktop "Call Us" CTA in header (tel:+16474903782) — awaiting user confirmation.
- P2: Replace step-3 date/time picker with a real GHL calendar embed (true availability, works frontend-only).
