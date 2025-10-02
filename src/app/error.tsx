"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Bir Hata Oluştu
        </h2>
        <p className="mb-6 text-gray-600">
          Üzgünüz, beklenmeyen bir hata meydana geldi.
        </p>
        <Button onClick={reset}>Tekrar Dene</Button>
      </div>
    </div>
  );
}

