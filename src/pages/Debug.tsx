import { SupabaseDebug } from '@/components/debug/SupabaseDebug';

export default function Debug() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Debug & Tests</h1>
        <p className="text-gray-600 mt-2">
          Outils de diagnostic pour tester la connexion Supabase et les fonctionnalités
        </p>
      </div>

      <div className="flex justify-center">
        <SupabaseDebug />
      </div>
    </div>
  );
}