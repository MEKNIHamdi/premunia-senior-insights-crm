
import { SupabaseDebug } from '@/components/debug/SupabaseDebug';
import { ConnectionTester } from '@/components/debug/ConnectionTester';

export default function Debug() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Debug & Tests</h1>
        <p className="text-gray-600 mt-2">
          Outils de diagnostic pour tester la connexion Supabase et les fonctionnalités
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConnectionTester />
        <SupabaseDebug />
      </div>
    </div>
  );
}
