# OnlineUsta Mimari Dokümantasyonu

## Genel Bakış

OnlineUsta, modern JAMstack mimarisini takip eden, Next.js 14 ve Supabase ile oluşturulmuş bir platformdur.

## Teknoloji Stack'i

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **State**: React Hooks + Server Components
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

### Backend
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (gelecek)
- **Real-time**: Supabase Realtime
- **Edge Functions**: Supabase Functions

### DevOps
- **Hosting**: Vercel (Frontend)
- **Database**: Supabase Cloud
- **CI/CD**: GitHub Actions
- **Monitoring**: Vercel Analytics + Sentry

## Katmanlar

### 1. Presentation Layer (UI)
- Server Components (default)
- Client Components (interaktif bölümler)
- Responsive design (mobile-first)

### 2. Business Logic Layer
- Server Actions
- API Route Handlers
- Validation (Zod schemas)

### 3. Data Access Layer
- Supabase Client (browser)
- Supabase Server Client (RSC)
- RLS policies

### 4. Database Layer
- PostgreSQL tables
- Indexes
- Triggers
- Functions

## Veri Akışı

\`\`\`
User Action
    ↓
Next.js Server Component / Client Component
    ↓
Supabase Client
    ↓
RLS Policy Check
    ↓
Database Query
    ↓
Response
    ↓
UI Update
\`\`\`

## Güvenlik

- **Authentication**: Magic link (OTP)
- **Authorization**: Row Level Security
- **CSRF**: Next.js built-in protection
- **XSS**: React automatic escaping
- **SQL Injection**: Parametrized queries
- **Rate Limiting**: Vercel + Supabase limits

## Performans

- **SSR**: Server-side rendering default
- **ISR**: Incremental Static Regeneration
- **Image Optimization**: Next.js Image
- **Code Splitting**: Automatic
- **Caching**: Vercel Edge Network

## Skalabilite

- **Horizontal**: Vercel serverless
- **Vertical**: Supabase scaling
- **CDN**: Vercel Edge
- **Database**: Connection pooling

## Monitoring

- **Errors**: Sentry
- **Analytics**: Vercel Analytics
- **Logs**: Vercel Logs
- **Performance**: Web Vitals
