# 🍽️ Ruoka-analysaattori (Food Analyzer)

Modern Finnish food analyzer application powered by Google Gemini AI and Supabase.

## ✨ Features

- 📸 **AI-Powered Food Analysis** - Upload food images and get detailed nutritional information
- 🔐 **User Authentication** - Secure email/password authentication via Supabase
- 💪 **Health Tests** - BMI, BMR, TDEE, and Ideal Weight calculators
- 📊 **Personal Dashboard** - Save and manage your food analyses and health test results
- 🌍 **Bilingual Support** - Finnish and English languages
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ☁️ **Cloud Storage** - Images stored securely in Supabase Storage

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI**: DeepSeek API (Vision + Chat)
- **Backend**: Supabase (Auth, Database, Storage)
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js (v18 or higher)
- Supabase account
- DeepSeek API key

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase-schema.sql`
3. Enable Email authentication in Authentication > Providers
4. Update `supabaseConfig.ts` with your project credentials

### 3. Set Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your DeepSeek API key:

```env
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

**Get your DeepSeek API key from**: https://platform.deepseek.com/api_keys

### 4. Run the App

```bash
npm run dev
```

The app will be available at `http://localhost:3001`

## 🗄️ Database Setup

Run the SQL commands in `supabase-schema.sql` in your Supabase SQL Editor to:

- Create the `food_analyses` table
- Create the `health_tests` table
- Set up Row Level Security (RLS) policies
- Configure the `food-images` storage bucket
- Set up storage policies

## 🔐 Authentication Setup

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Providers**
3. Enable **Email** provider
4. Disable email confirmation for development (optional)
5. Add authorized redirect URLs:
   - `http://localhost:3001` (development)
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
1. Set `VITE_DEEPSEEK_API_KEY` environment variable in your hosting platform
2. Update Supabase redirect URLs with your production domain

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Powered by [Voon IQ](https://vooniq.com)** - AI & Technology Solutions

Made with ❤️ using React, Supabase, and DeepSeek AI
