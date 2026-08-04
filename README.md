# 🌟 Spark Kids Learning Platform

An adaptive, visual math and reading platform designed with **Apple-like simplicity** for kids aged 4–8.

---

## 🚀 Features

- **Multi-Interest Themes**: Switch between **🦕 Dino Rescue**, **⚽ Sports League**, **🧱 Lego Builders**, and **🚜 Construction Crew**.
- **Active Manipulative Ten-Frame Math**: Singapore Math & Montessori CPA model for place-value decomposition ($10 + N$).
- **Phonics & CVC Sight Words**: Interactive letter tiles with Speech Synthesis sound synthesis.
- **Procedural Level Generation**: Dynamically synthesizes infinite math problems and phonics challenges on the fly.
- **Progress Saving**: Persistence via `localStorage` and Supabase PostgreSQL database.
- **Supabase Auth**: Frictionless parent Google Sign-In with Row Level Security (RLS).
- **Next.js 14 App Router & TypeScript**: Built for production deployment on Railway.

---

## 🛠️ Local Development

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🚢 Deployment (Railway + Supabase)

1. **Supabase**: Run `supabase/schema.sql` in your Supabase SQL Editor.
2. **Railway**: Link this GitHub repository (`spark-kids-learning`) to Railway for automatic deployments on `git push`.
