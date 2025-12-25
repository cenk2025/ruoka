# 🍽️ Ruoka-analysaattori (Food Analyzer)

Modern Finnish food analyzer application powered by Google Gemini AI and Supabase.

## ✨ Features

- 📸 **AI-Powered Food Analysis** - Upload food images and get detailed nutritional information
- 🔐 **User Authentication** - Secure login with Google via Supabase Auth
- 📊 **Personal Dashboard** - Save and manage your food analyses
- 🌍 **Bilingual Support** - Finnish and English languages
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ☁️ **Cloud Storage** - Images stored securely in Supabase Storage

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI**: Google Gemini API
- **Backend**: Supabase (Auth, Database, Storage)
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js (v18 or higher)
- Supabase account
- Google Gemini API key

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase-schema.sql`
3. Enable Google OAuth in Authentication > Providers
4. Update `supabaseConfig.ts` with your project credentials

### 3. Set Environment Variables

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the App

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🗄️ Database Setup

Run the SQL commands in `supabase-schema.sql` in your Supabase SQL Editor to:

- Create the `food_analyses` table
- Set up Row Level Security (RLS) policies
- Configure the `food-images` storage bucket
- Set up storage policies

## 🔐 Authentication Setup

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Providers**
3. Enable **Google** provider
4. Add your Google OAuth credentials
5. Add authorized redirect URLs:
   - `http://localhost:5173` (development)
   - Your production URL

## 📦 Build for Production

```bash
npm run build
```

## 🚢 Deployment

The app can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Make sure to:
1. Set environment variables in your hosting platform
2. Update Supabase redirect URLs with your production domain

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ using React, Supabase, and Google Gemini AI
