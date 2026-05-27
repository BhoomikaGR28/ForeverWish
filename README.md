# 💝 ForeverWish

> **"Create wishes that last forever."**

ForeverWish is a premium full-stack web app for creating personalized celebration pages — beautiful, shareable, and emotional. Perfect for birthdays, anniversaries, proposals, friendships, and every moment worth remembering forever.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 8 Premium Themes | Rose Garden, Lavender Mist, Golden Hour, Midnight Magic + 4 more |
| 🤖 AI Wish Generator | Claude-powered wishes in 8 styles: Romantic, Funny, Emotional, etc. |
| 📸 Photo Gallery | Upload memories in a cinematic animated carousel |
| ⏰ Countdown Timer | Live countdown to the special day |
| 📅 Memory Timeline | Visual story of shared moments |
| 🎊 Confetti & Animations | Burst on open, floating hearts, typewriter reveals |
| 🔗 Unique Share Links | One link for WhatsApp, Instagram, anywhere |
| 🔒 Password Protection | Private surprises (Premium) |
| 📱 Mobile-First | Stunning on every screen size |
| 👑 Admin Dashboard | User management, analytics, moderation |

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/yourusername/foreverwish.git
cd foreverwish

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# → Fill in Firebase + Anthropic + Razorpay keys

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔥 Firebase Setup

### 1. Create Project
Go to [Firebase Console](https://console.firebase.google.com/) → Add project → name it `foreverwish`

### 2. Enable Authentication
Authentication → Sign-in method → Enable **Email/Password** + **Google**

### 3. Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /projects/{projectId} {
      allow read: if resource.data.isPublic == true ||
                     (request.auth != null && request.auth.uid == resource.data.userId);
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
                               request.auth.uid == resource.data.userId;
    }
  }
}
```

### 4. Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 50 * 1024 * 1024;
    }
  }
}
```

### 5. Get Config Keys
Project Settings → General → Web app → Copy `firebaseConfig` values into `.env.local`

---

## 🤖 Anthropic AI Setup

1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. API Keys → Create key
3. Add as `ANTHROPIC_API_KEY` in `.env.local`

---

## 💳 Razorpay Setup

1. Sign up at [razorpay.com](https://razorpay.com)
2. Settings → API Keys → Generate Test Keys
3. Add key ID and secret to `.env.local`

---

## 🌐 Vercel Deployment

```bash
# Push to GitHub
git add . && git commit -m "🎉 Launch ForeverWish" && git push

# Then: vercel.com → New Project → Import repo → Add env vars → Deploy
```

After deploying, add your Vercel URL to Firebase Auth → Authorized Domains.

---

## 📁 Project Structure

```
foreverwish/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── auth/page.tsx               # Login / Signup
│   ├── dashboard/page.tsx          # User dashboard
│   ├── create/
│   │   ├── page.tsx                # Suspense wrapper
│   │   └── CreatePageInner.tsx     # Multi-step wish builder
│   ├── wish/[slug]/page.tsx        # Public shareable wish page
│   ├── admin/page.tsx              # Admin panel
│   └── api/generate-wish/route.ts  # AI wish API
├── components/
│   ├── layout/   Navbar, Footer
│   ├── landing/  Hero, Features, HowItWorks, Pricing, Testimonials, FAQ, CTA
│   ├── wish/     CountdownTimer
│   └── shared/   FloatingParticles
├── lib/
│   ├── firebase.ts       Firebase init
│   ├── auth-context.tsx  Auth provider
│   ├── db.ts             Firestore CRUD
│   ├── utils.ts          Helpers
│   └── constants.ts      Themes, categories, pricing, AI styles
├── types/index.ts
├── .env.example
└── README.md
```

---

## 🗄️ Firestore Schema

```
users/{uid}
  email, displayName, photoURL, isPremium, wishCount, createdAt

projects/{id}
  userId, recipientName, senderName, message
  theme, category, photos[], videos[], voiceNotes[]
  backgroundMusic, countdownDate, timeline[]
  customFont, primaryColor, isPublic, isPasswordProtected
  password?, slug (unique), viewCount
  createdAt, updatedAt, publishedAt
```

---

## 🎨 Themes

| Theme | Free/Premium |
|-------|-------------|
| 🌹 Rose Garden | Free |
| 💜 Lavender Mist | Free |
| ✨ Golden Hour | Free |
| 🌙 Midnight Magic | Free |
| 🌊 Ocean Dream | Premium |
| 🌸 Cherry Blossom | Premium |
| ⭐ Starry Night | Premium |
| 🌴 Tropical Paradise | Premium |

---

## 💰 Pricing

| | Free | Premium ₹299/mo |
|--|------|----------------|
| Wish pages | 3 | Unlimited |
| Photos | 5/page | Unlimited |
| Themes | 4 | All 8 |
| AI Generator | ❌ | ✅ |
| Music | ❌ | ✅ |
| Custom URL | ❌ | ✅ |
| Watermark | Yes | Removed |

---

## 🔐 Admin Panel

1. Get your Firebase UID from Firebase Console → Authentication
2. Open `app/admin/page.tsx`
3. Replace `'YOUR_ADMIN_UID_HERE'` in `ADMIN_UIDS` with your UID
4. Visit `/admin` when logged in

---

## 🛠️ Tech Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · Framer Motion · Firebase (Auth + Firestore + Storage) · Anthropic Claude API · Razorpay · Vercel

---

Made with 💝 for moments that matter forever.
