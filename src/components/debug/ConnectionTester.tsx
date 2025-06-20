
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Loader2, Database, User, Settings } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  details?: any;
}

export function ConnectionTester() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = async () => {
    setIsRunning(true);
    setTests([]);
    
    const testResults: TestResult[] = [];
    
    // Test 1: Connexion basique
    try {
      const { data, error } = await supabase.from('profiles').select('count(*)').limit(1);
      if (error) throw error;
      testResults.push({
        name: 'Connexion Supabase',
        status: 'success',
        message: 'Connexion réussie à la base de données',
        details: data
      });
    } catch (error) {
      testResults.push({
        name: 'Connexion Supabase',
        status: 'error',
        message: error.message || 'Erreur de connexion',
        details: error
      });
    }
    
    // Test 2: Tables existantes
    try {
      const tables = ['profiles', 'prospects', 'commercial_objectives', 'automation_scenarios'];
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select('count(*)').limit(1);
          if (error) throw error;
          testResults.push({
            name: `Table ${table}`,
            status: 'success',
            message: `Table ${table} accessible`
          });
        } catch (error) {
          testResults.push({
            name: `Table ${table}`,
            status: 'error',
            message: `Erreur table ${table}: ${error.message}`
          });
        }
      }
    } catch (error) {
      testResults.push({
        name: 'Test des tables',
        status: 'error',
        message: 'Erreur lors du test des tables'
      });
    }
    
    // Test 3: Authentification
    try {
      const { data: { user } } = await supabase.auth.getUser();
      testResults.push({
        name: 'Authentification',
        status: user ? 'success' : 'error',
        message: user ? `Utilisateur connecté: ${user.email}` : 'Aucun utilisateur connecté',
        details: user
      });
    } catch (error) {
      testResults.push({
        name: 'Authentification',
        status: 'error',
        message: `Erreur auth: ${error.message}`
      });
    }
    
    // Test 4: RLS Policies
    try {
      const { data, error } = await supabase.from('prospects').select('*').limit(1);
      testResults.push({
        name: 'Politiques RLS',
        status: error ? 'error' : 'success',
        message: error ? `Erreur RLS: ${error.message}` : 'Politiques RLS fonctionnelles',
        details: { recordCount: data?.length || 0 }
      });
    } catch (error) {
      testResults.push({
        name: 'Politiques RLS',
        status: 'error',
        message: `Erreur RLS: ${error.message}`
      });
    }
    
    setTests(testResults);
    setIsRunning(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
      default:
        return <Database className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Succès</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Erreur</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Test...</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">En attente</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Test de Connexion</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button 
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center space-x-2"
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            <span>Relancer les tests</span>
          </Button>
        </div>

        {tests.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Résultats des tests:</h4>
            {tests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <span className="font-medium">{test.name}</span>
                    <p className="text-sm text-gray-600">{test.message}</p>
                    {test.details && (
                      <pre className="text-xs text-gray-500 mt-1 max-w-md overflow-hidden">
                        {JSON.stringify(test.details, null, 2).substring(0, 200)}
                      </pre>
                    )}
                  </div>
                </div>
                {getStatusBadge(test.status)}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-800 mb-2">Configuration Supabase:</h5>
          <div className="text-sm text-blue-700 space-y-1">
            <p>URL: {import.meta.env.VITE_SUPABASE_URL || 'https://wkmmnhqudzsswxwqrwhg.supabase.co'}</p>
            <p>Clé: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurée' : 'eyJhbG...px0 (configurée)'}</p>
            <p>Project ID: wkmmnhqudzsswxwqrwhg</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
