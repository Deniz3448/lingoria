# Lingoria

> **English in 5 minutes a day** — an AI-powered language-learning iOS app, built for Turkish speakers learning English from A1 to C2.

[![iOS](https://img.shields.io/badge/iOS-17%2B-000000?logo=apple&logoColor=white)](https://deniz3448.github.io/lingoria)
[![Swift](https://img.shields.io/badge/Swift-5.10-F05138?logo=swift&logoColor=white)](https://swift.org)
[![SwiftUI](https://img.shields.io/badge/SwiftUI-Native-0A84FF?logo=swift&logoColor=white)](https://developer.apple.com/swiftui/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Edge-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![StoreKit 2](https://img.shields.io/badge/StoreKit-2-1D9BF0?logo=apple&logoColor=white)](https://developer.apple.com/storekit/)

🌐 **Website:** [deniz3448.github.io/lingoria](https://deniz3448.github.io/lingoria)
🎮 **Try the demo:** [deniz3448.github.io/lingoria/demo](https://deniz3448.github.io/lingoria/demo)
📬 **Contact:** lingoria.tr@gmail.com

---

## What it does

Lingoria is a four-tab iOS app that takes a Turkish speaker from absolute beginner (A1) to advanced (C2) English. Lessons, exams, an AI tutor and a small library of graded readers — everything lives in one app, works offline, and is designed around short, daily sessions.

### Features

- **Learn** — CEFR-graded lessons (A1 → C2), grammar primers, vocabulary drills, and level-transition exams that decide when you actually move up a level.
- **Practice** — Six interactive mini-games (flashcards, word-match, listening drills, idiom matching, memory game, chapter quiz) backed by spaced repetition.
- **Roadmap** — A visual learning path that tracks XP, streaks, daily goals and achievements.
- **Me** — Profile, subscription, saved words, in-app books and an **AI conversation tutor** for free-form practice.
- **Premium** — Annual subscription unlocks full content + AI tutor. StoreKit 2 with proper renewal, refund and grace-period handling.
- **Offline-first** — Per-user local cache so lessons, books and progress work without network; conflict-free merge on re-sync.

## Tech stack

| Layer | Stack |
|---|---|
| iOS app | Swift 5.10, SwiftUI, async/await, MVVM |
| Auth & data | Supabase — Postgres with Row-Level Security, Edge Functions, Auth |
| Payments | StoreKit 2 + Apple Server Notifications v2 (webhook → Edge Function → DB) |
| AI tutor | LLM-powered conversation flow with structured prompts |
| Books TTS | ElevenLabs streaming voice |
| Distribution | TestFlight (currently), App Store submission in progress |
| Site | Static HTML / CSS, deployed on GitHub Pages |

## Architecture at a glance

- **`AccountStore`** — single source of truth for the signed-in user's local state; survives cold starts and offline.
- **`SubscriptionManager`** — wraps StoreKit 2, owns entitlement state, talks to the `apple-notifications` Edge Function for server-verified renewals.
- **`SyncEngine`** — diff-and-merge sync between local state and Supabase, using `updated_at` for last-write-wins on per-field scope.
- **Per-feature view models** — 50+ unit-tested view models drive 30+ screens; logic lives outside SwiftUI views so it's testable.
- **Postgres** — RLS on every table that touches `user_id`; subscription state derived from a single `subscriptions` row per user with a webhook-driven event log.

## Repository contents

This repository hosts the public-facing pages of Lingoria — landing page, demo, and legal documents — served via GitHub Pages.

```
.
├── index.html      # Landing page (TR/EN, language-aware)
├── demo/           # Interactive in-browser app demo
├── privacy.html    # Privacy Policy
├── terms.html      # Terms of Use
├── support.html    # Support / FAQ / contact
└── style.css       # Shared styles
```

The iOS app source code is currently private.

## Status

- ✅ App built, tested and live on TestFlight
- ✅ Marketing site, legal docs and support page published
- ⏳ App Store submission in progress
- ⏳ More books and B2/C1 content in the pipeline

## License

Site content © 2026 Lingoria. All rights reserved.
