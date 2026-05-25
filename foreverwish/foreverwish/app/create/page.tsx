import { Suspense } from 'react';
import CreatePageInner from './CreatePageInner';
import { Loader2 } from 'lucide-react';

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
      </div>
    }>
      <CreatePageInner />
    </Suspense>
  );
}
