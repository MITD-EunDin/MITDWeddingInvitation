# Wedding Invitation - Enhanced Features

## 🎉 New Features Added

Based on the reference design document, the following enhancements have been implemented:

### 1. Particle Effects (Floating Hearts) 🎈
- **Canvas-based animation** (`src/components/common/Particles.tsx`)
- Floating hearts, sparkles, and petals with physics-based movement
- Respects `prefers-reduced-motion` accessibility setting
- Customizable count, colors, and performance optimized

### 2. Floating Action Elements 📌
- **FloatingHeart** - Bottom-right heart button with real-time count, burst animation on click
- **FloatingMusic** - Top-right music player (existing, enhanced)
- **FloatingWishesBar** - Bottom bar showing wish count + latest wish preview
- All floating elements have smooth Framer Motion animations

### 3. Real-time Backend Abstraction 🔄
Created `src/services/realtime.ts` with support for:
- **Mock** (default) - In-memory, works immediately
- **Firebase** - Real-time via Firestore listeners
- **Supabase** - Real-time via Postgres changes

Services available:
- `getRealtimeWishesService()` - Real-time guestbook
- `getRealtimeHeartsService()` - Live heart counter
- `getRealtimeRsvpService()` - RSVP submissions

### 4. Updated Wishes Section
- Now uses real-time subscription (auto-updates when others post)
- Shows timestamp for each wish
- Added `id="wishes"` for smooth scroll from floating bar

## 🔧 Configuration

### Environment Variables (`.env.local`)
```bash
# Backend type: mock | firebase | supabase
VITE_BACKEND_TYPE=mock

# Firebase (if using)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Supabase (if using)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

### Firebase Setup (for real-time)
1. Create Firebase project
2. Enable Firestore Database
3. Add web app and copy config to `.env.local`
4. Set Firestore rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wishes/{doc} {
      allow read: if true;
      allow create: if request.auth == null; // Public write
    }
    match /counters/{doc} {
      allow read: if true;
      allow update: if request.auth == null; // Public increment
    }
    match /rsvps/{doc} {
      allow read: if true;
      allow create: if request.auth == null;
    }
  }
}
```

### Supabase Setup
1. Create Supabase project
2. Run SQL:
```sql
create table wishes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

create table counters (
  id text primary key,
  count int default 0
);
insert into counters (id, count) values ('hearts', 206);

create table rsvps (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  attendance boolean not null,
  guests int not null,
  message text,
  created_at timestamp with time zone default now()
);

-- RPC for atomic heart increment
create or replace function increment_hearts()
returns int language plpgsql as $$
begin
  update counters set count = count + 1 where id = 'hearts'
  returning count;
end $$;
```
3. Enable Realtime on tables: Dashboard > Replication > Enable for `wishes`, `counters`, `rsvps`

## 🎨 Customization

### Particle Colors
Edit in `App.tsx`:
```tsx
<Particles
  count={12}
  primaryColor={wedding.theme.colors.primary}     // Champagne gold
  secondaryColor={wedding.theme.colors.secondary} // Lighter gold
/>
```

### Floating Elements Position
```tsx
<FloatingHeart position="bottom-right" />  // or bottom-left
<FloatingMusic position="top-right" />     // or top-left
<FloatingWishesBar position="bottom" />    // or top
```

### Heart Initial Count
```tsx
getRealtimeHeartsService(206)  // Change initial value
```

## 📱 Mobile Optimizations
- Touch-friendly tap targets (44px minimum)
- Reduced motion support
- Smooth scroll to wishes section
- Backdrop blur for glassmorphism effect

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```
Add environment variables in Vercel dashboard.

### Netlify
```bash
npm run build
# Deploy dist/ folder
```

### Firebase Hosting
```bash
npm i -g firebase-tools
firebase init hosting
npm run build
firebase deploy
```

## 📦 Bundle Size Impact
- Particles: ~3KB gzipped (canvas, no deps)
- FloatingActions: ~2KB gzipped
- Realtime services: Tree-shaken (only used backend included)
- Total added: ~5-8KB gzipped

## ♿ Accessibility
- All floating elements keyboard navigable
- ARIA labels and live regions
- Respects `prefers-reduced-motion`
- Focus visible states
- Screen reader announcements for heart/wish actions