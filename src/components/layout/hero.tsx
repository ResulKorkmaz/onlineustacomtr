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
