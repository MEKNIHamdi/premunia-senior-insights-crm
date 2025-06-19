
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Scale, ExternalLink } from 'lucide-react';
import { Prospect } from '@/types';

interface OggoComparatorProps {
  prospect: Prospect;
  trigger?: React.ReactNode;
}

export function OggoComparator({ prospect, trigger }: OggoComparatorProps) {
  useEffect(() => {
    // Charger le script Oggo s'il n'est pas déjà présent
    if (!document.querySelector('script[src*="oggo-data.net"]')) {
      const script = document.createElement('script');
      script.src = 'https://cks.oggo-data.net/icomparator/health.js';
      script.type = 'text/javascript';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const formatDateForOggo = (dateNaissance?: string) => {
    if (!dateNaissance) return '';
    // Si la date est au format DD/MM/YYYY, on la convertit
    const parts = dateNaissance.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return dateNaissance;
  };

  const defaultTrigger = (
    <Button 
      variant="outline" 
      size="sm" 
      className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100"
    >
      <Scale className="w-4 h-4 mr-2" />
      Comparateur
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-green-600" />
            <span>Comparateur Oggo - {prospect.nom}</span>
            <div className="ml-auto flex items-center text-sm text-gray-500">
              {prospect.age && <span>{prospect.age} ans</span>}
              {prospect.date_naissance && (
                <span className="ml-2">({prospect.date_naissance})</span>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Informations prospect</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Nom:</span>
                <p className="font-medium">{prospect.nom} {prospect.prenom}</p>
              </div>
              <div>
                <span className="text-gray-500">Budget max:</span>
                <p className="font-medium">€{prospect.budget_max}/mois</p>
              </div>
              <div>
                <span className="text-gray-500">Type contrat:</span>
                <p className="font-medium capitalize">{prospect.type_contrat}</p>
              </div>
              <div>
                <span className="text-gray-500">Date naissance:</span>
                <p className="font-medium">{prospect.date_naissance || 'Non renseignée'}</p>
              </div>
            </div>
          </div>

          {/* Container pour le comparateur Oggo */}
          <div className="w-full h-[600px] border rounded-lg overflow-hidden bg-white">
            <div 
              id="oggodata-icomparator-health" 
              style={{ width: '100%', height: '100%' }}
              data-prospect-age={prospect.age}
              data-prospect-birthdate={formatDateForOggo(prospect.date_naissance)}
              data-contract-type={prospect.type_contrat}
              data-budget={prospect.budget_max}
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Comparateur powered by Oggo Data
            </p>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-blue-600 hover:text-blue-800"
              onClick={() => window.open('https://oggo-data.net', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Oggo Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
