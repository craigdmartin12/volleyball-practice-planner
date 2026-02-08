# Stonehill Volleyball Practice Manager 🏐

A professional, multi-tenant practice planning application for Volleyball Coaches, built with React, TypeScript, and Supabase.

## 🚀 Features
- **Drill Library**: Manage and filter your volleyball drills.
- **Practice Builder**: Drag-and-drop interface powered by `@dnd-kit`.
- **Stonehill Branding**: Premium collegiate athletics aesthetic (Purple & Gold).
- **Multi-tenant**: Row Level Security (RLS) ensuring coach data privacy.

## 🛠 Tech Stack
- **Frontend**: Vite + React + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (Auth, DB, RLS)
- **State**: Zustand
- **D&D**: @dnd-kit

## 🏃 Getting Started

### 1. Database Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `supabase_schema.sql` and run them.

### 2. Environment Variables
1. Create a `.env` file in the root directory.
2. Copy the keys from your Supabase settings (Project API keys):
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### 3. Installation
```bash
npm install
npm run dev
```

## 🎨 Design Tokens (Stonehill Purple & Gold)
- **Primary Purple**: `#2F2975`
- **Accent Gold**: `#C79900`
- **Theme**: "Skyhawks Athletic"

---
Developed by Antigravity AI
