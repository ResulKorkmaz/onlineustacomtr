// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AdminLogsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
        <p className="mt-2 text-gray-600">
          Admin aktivitelerini ve sistem loglarını görüntüleyin
        </p>
      </div>

      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <p className="text-lg font-medium text-gray-900">Yakında</p>
        <p className="mt-2 text-sm text-gray-500">
          Activity logs paneli çok yakında eklenecek
        </p>
      </div>
    </div>
  );
}

