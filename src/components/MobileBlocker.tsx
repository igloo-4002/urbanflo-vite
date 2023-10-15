import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export function MobileBlocker() {
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-orange-400 to-red-500 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-3xl font-extrabold mb-4 text-shadow">Oops!</h1>
      <p className="text-lg mb-8 text-center px-6">
        Unfortunately, our app is not available on mobile devices yet. Please
        visit us from your desktop for the full experience.
      </p>
      <div className="bg-white p-2 rounded-full flex items-center justify-center h-16 w-16">
        <ExclamationTriangleIcon className="text-orange-500" />
      </div>
    </div>
  );
}
