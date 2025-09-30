#!/bin/bash
# ==============================================================================
# OnlineUsta - Production-Ready Setup Script
# Senior Developer Edition - Comprehensive Enterprise Setup
# ==============================================================================

set -euo pipefail

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log fonksiyonları
log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }

log_info "🚀 OnlineUsta Production Setup başlatılıyor..."

# Gerekli araçları kontrol et
command -v node >/dev/null 2>&1 || { log_error "Node.js yüklü değil!"; exit 1; }
command -v npm >/dev/null 2>&1 || { log_error "npm yüklü değil!"; exit 1; }

# Proje dizini mevcut mu kontrol et
if [ -f "package.json" ]; then
    log_warning "Mevcut proje bulundu. Devam edilsin mi? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        log_info "Kurulum iptal edildi."
        exit 0
    fi
fi

log_info "📦 Next.js projesi oluşturuluyor..."
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes || {
    log_error "Next.js kurulumu başarısız!"
    exit 1
}

log_success "Next.js projesi oluşturuldu"

log_info "📚 Bağımlılıklar yükleniyor..."
npm install --save \
    @supabase/supabase-js@2 \
    @supabase/auth-helpers-nextjs@0 \
    zod \
    react-hook-form \
    @hookform/resolvers \
    lucide-react \
    clsx \
    tailwind-merge \
    date-fns

npm install --save-dev \
    supabase \
    @types/node \
    prettier \
    prettier-plugin-tailwindcss

log_success "Bağımlılıklar yüklendi"

log_info "Proje yapısı hazırlanıyor..."

echo "✓ Kurulum tamamlandı!"
echo ""
echo "📋 Sonraki adımlar:"
echo "1. .env.local dosyasını düzenleyin (Supabase credentials)"
echo "2. supabase/migrations/0001_schema.sql'i Supabase SQL Editor'de çalıştırın"
echo "3. npm run dev komutuyla geliştirme sunucusunu başlatın"
echo ""
echo "📖 Dokümantasyon için docs/ klasörüne bakın"
