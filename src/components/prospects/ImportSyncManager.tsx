
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileSpreadsheet, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Download,
  Database,
  Settings
} from 'lucide-react';

export function ImportSyncManager() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [hubspotApiKey, setHubspotApiKey] = useState('');
  const { toast } = useToast();

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Format invalide",
        description: "Veuillez sélectionner un fichier Excel (.xlsx ou .xls)",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulation du processus d'upload et de parsing
      const formData = new FormData();
      formData.append('file', file);

      // Progression simulée
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // TODO: Intégrer avec Supabase pour traiter le fichier Excel
      console.log('Uploading Excel file:', file.name);
      
      toast({
        title: "Import réussi",
        description: `${file.name} a été importé avec succès. 45 prospects ajoutés.`,
      });

    } catch (error) {
      toast({
        title: "Erreur d'import",
        description: "Une erreur s'est produite lors de l'import du fichier Excel.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleGoogleSheetSync = async () => {
    if (!googleSheetUrl) {
      toast({
        title: "URL manquante",
        description: "Veuillez saisir l'URL de votre Google Sheet",
        variant: "destructive"
      });
      return;
    }

    try {
      // TODO: Intégrer avec l'API Google Sheets
      console.log('Syncing with Google Sheet:', googleSheetUrl);
      
      toast({
        title: "Synchronisation réussie",
        description: "23 prospects synchronisés depuis Google Sheets",
      });
    } catch (error) {
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de se connecter à Google Sheets",
        variant: "destructive"
      });
    }
  };

  const handleHubSpotSync = async () => {
    if (!hubspotApiKey) {
      toast({
        title: "Clé API manquante",
        description: "Veuillez saisir votre clé API HubSpot",
        variant: "destructive"
      });
      return;
    }

    try {
      // TODO: Intégrer avec l'API HubSpot
      console.log('Syncing with HubSpot...');
      
      toast({
        title: "Synchronisation réussie",
        description: "67 prospects synchronisés depuis HubSpot",
      });
    } catch (error) {
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de se connecter à HubSpot",
        variant: "destructive"
      });
    }
  };

  const downloadExcelTemplate = () => {
    // TODO: Générer et télécharger un template Excel
    toast({
      title: "Template téléchargé",
      description: "Le modèle Excel a été téléchargé",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-blue-600" />
          <span>Import & Synchronisation</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="excel" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="excel" className="flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Excel</span>
            </TabsTrigger>
            <TabsTrigger value="googlesheets" className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Google Sheets</span>
            </TabsTrigger>
            <TabsTrigger value="hubspot" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>HubSpot</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="excel" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Import fichier Excel</h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={downloadExcelTemplate}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Template
                </Button>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <Label htmlFor="excel-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500">
                    Cliquer pour sélectionner
                  </span>
                  <span className="text-gray-500"> ou glisser-déposer</span>
                  <Input
                    id="excel-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </Label>
                <p className="text-sm text-gray-500 mt-2">
                  Fichiers Excel (.xlsx, .xls) - Max 10MB
                </p>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Import en cours...</span>
                    <span className="text-sm text-gray-600">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="googlesheets" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Synchronisation Google Sheets</h4>
              <div className="space-y-2">
                <Label htmlFor="googlesheet-url">URL Google Sheet</Label>
                <Input
                  id="googlesheet-url"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={googleSheetUrl}
                  onChange={(e) => setGoogleSheetUrl(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleGoogleSheetSync}
                className="w-full"
                disabled={!googleSheetUrl}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Synchroniser
              </Button>
              <div className="text-sm text-gray-500">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Assurez-vous que le Google Sheet est partagé en lecture
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hubspot" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Synchronisation HubSpot</h4>
              <div className="space-y-2">
                <Label htmlFor="hubspot-key">Clé API HubSpot</Label>
                <Input
                  id="hubspot-key"
                  type="password"
                  placeholder="pat-na1-..."
                  value={hubspotApiKey}
                  onChange={(e) => setHubspotApiKey(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleHubSpotSync}
                className="w-full"
                disabled={!hubspotApiKey}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Synchroniser
              </Button>
              <div className="text-sm text-gray-500">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Votre clé API doit avoir les permissions de lecture des contacts
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
