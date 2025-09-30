#!/bin/bash
set -e

echo "🔧 Tailwind class'larını düzeltiyorum..."

# Tüm border-gray-200'leri border-gray-300 yap (varsayılan Tailwind)
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/border-gray-200/border-gray-300/g' {} \;

# border-border'ı border-gray-300 yap
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/border-border/border-gray-300/g' {} \;

echo "✅ Düzeltmeler tamamlandı!"
