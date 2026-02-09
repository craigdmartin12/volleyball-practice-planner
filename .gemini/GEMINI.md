# 🏐 Skyhawk Practice - Project Documentation

## 🦅 Project Overview
**Skyhawk Practice** is a premium, multi-tenant volleyball practice planning application designed for Stonehill College Athletics. It allows coaches to manage a library of drills and build chronological practice plans using a drag-and-drop interface.

---

## 🛠 Tech Stack
- **Frontend**: Vite + React (TypeScript)
- **Styling**: Tailwind CSS v3 + PostCSS (Stonehill Theme)
- **Backend/DB**: Supabase (PostgreSQL + Auth + Row Level Security)
- **State Management**: Zustand
- **Drag & Drop**: `@dnd-kit`
- **Deployment**: Vercel (GitHub integration)

---

## 📂 Architecture Structure

### 1. Components (`src/components/`)
- `Auth.tsx`: High-contrast login/signup with glassmorphism. Handled by Supabase Auth.
- `Navbar.tsx`: Sticky navigation with Stonehill logo and user session management.
- `Dashboard.tsx`: The "Drill Library." Supports searching, filtering, and creating new drills via a modal.
- `DrillCard.tsx`: Visual representation of a drill with badges for difficulty and duration.
- `PracticeBuilder.tsx`: The "Canvas." Features a draggable timeline where drills from the library can be organized.

### 2. State & Data
- `src/store/useStore.ts`: Global Zustand store managing the list of drills, practices, and loading/error states.
- `src/services/supabase.ts`: Centralized Supabase client and `api` object for typed CRUD operations.

### 3. Database (`supabase_schema.sql`)
- **Tables**: `drills`, `practices`, `practice_items` (join table for sorting).
- **Security**: Row Level Security (RLS) is enabled on all tables. Users only see data where `user_id = auth.uid()`.

---

## 🎨 Design System (Stonehill College)
- **Primary Purple**: `#2F2975` (Class: `text-stonehill-purple`, `bg-stonehill-purple`)
- **Accent Gold**: `#C79900` (Class: `text-stonehill-gold`, `bg-stonehill-gold`)
- **Typography**: Inter (Sans-serif)
- **Visuals**: Athletic high-contrast, rounded corners (`rounded-xl`), and subtle glassmorphism (`glass` class).

---

## 🚀 Development Workflow

### Environment Variables
The `.env` file MUST contain:
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
*Note: These are also configured in Vercel for production.*

### Commands
- `npm run dev`: Start local development server.
- `npm run build`: Production build and type checking (PostCSS compiles Tailwind).
- `git push origin main`: Triggers automatic deployment to Vercel.

---

## 📝 Instructions for Future Sessions
1. **Adding Data**: When adding new tables to Supabase, update `supabase_schema.sql` and run it in the Supabase SQL editor.
2. **Icons**: Use `lucide-react` for all UI icons.
3. **Responsive Design**: Always test the **Practice Builder** on mobile vs desktop, as the drag-and-drop experience differs.
4. **Auth Redirects**: Ensure the Supabase Dashboard "Site URL" matches the Vercel deployment URL for email authentication to work.

---
*Created by Antigravity AI*
