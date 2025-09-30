#!/bin/bash
set -e

echo "🎨 Core components oluşturuluyor..."

# UI Components klasörü
mkdir -p src/components/ui

# Button component
cat > src/components/ui/button.tsx << 'EOF'
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-sky-500 text-white hover:bg-sky-600",
      outline: "border border-gray-300 bg-white hover:bg-gray-50",
      ghost: "hover:bg-gray-100",
      destructive: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3 text-sm",
      lg: "h-11 px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
EOF

# Input component
cat > src/components/ui/input.tsx << 'EOF'
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
EOF

# Textarea component
cat > src/components/ui/textarea.tsx << 'EOF'
import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };
EOF

# Select component
cat > src/components/ui/select.tsx << 'EOF'
import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          className={cn(
            "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export { Select };
EOF

echo "✓ UI components oluşturuldu"

# Layout components
mkdir -p src/components/layout

cat > src/components/layout/navbar.tsx << 'EOF'
import Link from "next/link";
import { Bell, Menu, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-sky-600">
            OnlineUsta
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/jobs" className="text-sm font-medium hover:text-sky-600">
              İlanlar
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium hover:text-sky-600">
              Nasıl Çalışır?
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-sky-600">
              Kategoriler
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {profile?.role === "customer" && (
                <Link href="/jobs/new">
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">İlan Oluştur</span>
                  </Button>
                </Link>
              )}
              
              <Link href="/dashboard/notifications">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/dashboard">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-medium text-sky-700">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm">Kayıt Ol</Button>
              </Link>
            </>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
EOF

cat > src/components/layout/footer.tsx << 'EOF'
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold text-sky-600">OnlineUsta</h3>
            <p className="text-sm text-gray-600">
              İhtiyacınız olan ustayı bulun, güvenle çalışın.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Hızlı Linkler</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-600 hover:text-sky-600">Hakkımızda</Link></li>
              <li><Link href="/how-it-works" className="text-gray-600 hover:text-sky-600">Nasıl Çalışır?</Link></li>
              <li><Link href="/categories" className="text-gray-600 hover:text-sky-600">Kategoriler</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-sky-600">SSS</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Yasal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal/terms" className="text-gray-600 hover:text-sky-600">Kullanım Şartları</Link></li>
              <li><Link href="/legal/privacy" className="text-gray-600 hover:text-sky-600">Gizlilik Politikası</Link></li>
              <li><Link href="/legal/kvkk" className="text-gray-600 hover:text-sky-600">KVKK</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-sky-600">İletişim</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Sosyal Medya</h4>
            <div className="flex gap-3">
              <a href="https://facebook.com" className="text-gray-600 hover:text-sky-600">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-gray-600 hover:text-sky-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="text-gray-600 hover:text-sky-600">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="text-gray-600 hover:text-sky-600">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} OnlineUsta. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
EOF

cat > src/components/layout/hero.tsx << 'EOF'
import Link from "next/link";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-sky-50 to-blue-100 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            İşinizi Güvenilir Ustalarla Hızla Çözelim
          </h1>
          <p className="mb-8 text-lg text-gray-700">
            İhtiyacınızı yazın, teklifleri görün, en uygun ustayı seçin. Basit, hızlı ve güvenli.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/jobs/new">
              <Button size="lg" className="w-full sm:w-auto">
                İlan Oluştur
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Hizmet Veren Olarak Katıl
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="mb-2 font-semibold">İlan Oluştur</h3>
            <p className="text-sm text-gray-600">
              İhtiyacınızı detaylı olarak anlatın, ustalar size ulaşsın.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100">
              <span className="text-2xl">💼</span>
            </div>
            <h3 className="mb-2 font-semibold">Teklifleri Görün</h3>
            <p className="text-sm text-gray-600">
              Deneyimli ustalar size uygun tekliflerini sunar.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="mb-2 font-semibold">En İyisini Seçin</h3>
            <p className="text-sm text-gray-600">
              En uygun teklifi seçin ve işinizi güvenle tamamlayın.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
EOF

echo "✓ Layout components oluşturuldu"

# Job components
mkdir -p src/components/jobs

cat > src/components/jobs/job-card.tsx << 'EOF'
import Link from "next/link";
import { MapPin, Calendar, DollarSign } from "lucide-react";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import type { Job } from "@/lib/types/database.types";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="rounded-2xl border bg-white p-6 transition-shadow hover:shadow-lg">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-lg font-semibold line-clamp-2">{job.title}</h3>
          <span className="ml-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
            {job.bid_count} Teklif
          </span>
        </div>

        <p className="mb-4 text-sm text-gray-600 line-clamp-3">{job.description}</p>

        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{job.city}{job.district && `, ${job.district}`}</span>
          </div>
          
          {job.budget_min && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>
                {formatCurrency(job.budget_min)} - {formatCurrency(job.budget_max || job.budget_min)}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatRelativeTime(job.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
EOF

echo "✓ Job components oluşturuldu"
echo "✅ Tüm core components hazır!"
