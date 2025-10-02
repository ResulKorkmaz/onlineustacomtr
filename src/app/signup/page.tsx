"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, Briefcase, ArrowRight } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            OnlineUsta&apos;ya Hoş Geldiniz
          </h1>
          <p className="mb-12 text-lg text-gray-700">
            Kayıt olmak için lütfen hesap tipinizi seçin
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Müşteri Kaydı */}
            <div className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg transition-all hover:border-sky-500 hover:shadow-xl">
              <div className="mb-6 flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-all group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white">
                  <User className="h-12 w-12" />
                </div>
              </div>

              <h2 className="mb-3 text-2xl font-bold text-gray-900">
                Müşteri Olarak Kayıt Ol
              </h2>
              
              <p className="mb-6 text-gray-600">
                İhtiyacınız olan hizmeti bulun, en uygun teklifi alın
              </p>

              <ul className="mb-8 space-y-3 text-left text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                    ✓
                  </div>
                  İlan oluştur
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                    ✓
                  </div>
                  Teklifleri karşılaştır
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                    ✓
                  </div>
                  Güvenle işini tamamlat
                </li>
              </ul>

              <Link href="/customer/register" className="block">
                <Button className="w-full" size="lg">
                  Müşteri Olarak Devam Et
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Hizmet Veren Kaydı */}
            <div className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg transition-all hover:border-sky-500 hover:shadow-xl">
              <div className="mb-6 flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sky-100 text-sky-600 transition-all group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white">
                  <Briefcase className="h-12 w-12" />
                </div>
              </div>

              <h2 className="mb-3 text-2xl font-bold text-gray-900">
                Hizmet Veren Olarak Kayıt Ol
              </h2>
              
              <p className="mb-6 text-gray-600">
                İşlerinizi büyütün, yeni müşteriler kazanın
              </p>

              <ul className="mb-8 space-y-3 text-left text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                    ✓
                  </div>
                  İlanlara teklif ver
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                    ✓
                  </div>
                  Müşteri portföyünü genişlet
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                    ✓
                  </div>
                  Gelirini artır
                </li>
              </ul>

              <Link href="/provider/register" className="block">
                <Button className="w-full" size="lg">
                  Hizmet Veren Olarak Devam Et
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="font-medium text-sky-600 hover:text-sky-700">
              Giriş Yap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


