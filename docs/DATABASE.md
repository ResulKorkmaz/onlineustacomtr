# Veritabanı Şeması

## Tablolar

### profiles
Kullanıcı profil bilgileri.

\`\`\`sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role user_role NOT NULL DEFAULT 'customer',
  provider_kind provider_kind,
  full_name TEXT,
  company_name TEXT,
  city TEXT,
  ...
);
\`\`\`

### jobs
İş ilanları.

\`\`\`sql
CREATE TABLE jobs (
  id BIGSERIAL PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  status job_status DEFAULT 'open',
  bid_count INT DEFAULT 0,
  ...
);
\`\`\`

### bids
İlan teklifleri.

\`\`\`sql
CREATE TABLE bids (
  id BIGSERIAL PRIMARY KEY,
  job_id BIGINT REFERENCES jobs(id),
  provider_id UUID REFERENCES profiles(id),
  amount NUMERIC NOT NULL,
  message TEXT NOT NULL,
  status bid_status DEFAULT 'pending',
  ...
);
\`\`\`

### notifications
Kullanıcı bildirimleri.

\`\`\`sql
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  ...
);
\`\`\`

## İlişkiler

\`\`\`
profiles (1) ─────< (N) jobs
profiles (1) ─────< (N) bids
jobs (1) ─────< (N) bids
profiles (1) ─────< (N) notifications
\`\`\`

## İndeksler

- \`idx_jobs_customer\`: jobs(customer_id, created_at DESC)
- \`idx_bids_job\`: bids(job_id, created_at DESC)
- \`idx_bids_provider\`: bids(provider_id, created_at DESC)
- \`idx_notifications_user\`: notifications(user_id, created_at DESC)

## Trigger'lar

### Business Rules
- \`check_daily_bid_limit\`: Günlük 3 teklif limiti
- \`check_job_creation_rules\`: Günlük 1 ilan, 7 gün kuralı

### Counters
- \`increment_bid_count\`: Teklif sayısını artır
- \`decrement_bid_count\`: Teklif sayısını azalt

### Notifications
- \`notify_providers_of_new_job\`: Yeni ilan bildirimi
- \`notify_customer_of_new_bid\`: Yeni teklif bildirimi
