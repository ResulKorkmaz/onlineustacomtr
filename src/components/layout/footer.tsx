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
