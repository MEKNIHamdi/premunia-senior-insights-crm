import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { testSupabaseConnection, createTestProfile, createTestData } from '@/lib/supabase-test';
import { Database, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function SupabaseDebug() {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isCreatingData, setIsCreatingData] = useState(false);

  const runConnectionTest = async () => {
    setConnectionStatus('testing');
    setTestResults([]);
    
    try {
      // Test de connexion
      const connectionResult = await testSupabaseConnection();
      setTestResults(prev => [...prev, { 
        test: 'Connexion Supabase', 
        ...connectionResult 
      }]);
      
      if (connectionResult.success) {
        // Test de création de profil
        const profileResult = await createTestProfile();
        setTestResults(prev => [...prev, { 
          test: 'Création profil', 
          ...profileResult 
        }]);
        
        setConnectionStatus('success');
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      setConnectionStatus('error');
      setTestResults(prev => [...prev, { 
        test: 'Test général', 
        success: false, 
        error: error.message 
      }]);
    }
  };

  const createSampleData = async () => {
    setIsCreatingData(true);
    
    try {
      const result = await createTestData();
      setTestResults(prev => [...prev, { 
        test: 'Création données test', 
        ...result 
      }]);
    } catch (error) {
      setTestResults(prev => [...prev, { 
        test: 'Création données test', 
        success: false, 
        error: error.message 
      }]);
    } finally {
      setIsCreatingData(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Debug Supabase</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button 
            onClick={runConnectionTest}
            disabled={connectionStatus === 'testing'}
            className="flex items-center space-x-2"
          >
            {connectionStatus === 'testing' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            <span>Tester la connexion</span>
          </Button>
          
          <Button 
            onClick={createSampleData}
            disabled={isCreatingData || connectionStatus !== 'success'}
            variant="outline"
            className="flex items-center space-x-2"
          >
            {isCreatingData ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>Créer données test</span>
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Résultats des tests:</h4>
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">{result.test}</span>
                <div className="flex items-center space-x-2">
                  {result.success ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Succès
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">
                      <XCircle className="w-3 h-3 mr-1" />
                      Erreur
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            
            {testResults.some(r => !r.success) && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <h5 className="font-medium text-red-800 mb-2">Erreurs détectées:</h5>
                {testResults
                  .filter(r => !r.success)
                  .map((result, index) => (
                    <p key={index} className="text-sm text-red-700">
                      {result.test}: {result.error}
                    </p>
                  ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-800 mb-2">Configuration Supabase:</h5>
          <div className="text-sm text-blue-700 space-y-1">
            <p>URL: {import.meta.env.VITE_SUPABASE_URL || 'Non configurée'}</p>
            <p>Clé: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurée' : 'Non configurée'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}