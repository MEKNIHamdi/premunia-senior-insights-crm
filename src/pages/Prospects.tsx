import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { Prospect } from '@/types';
import { OggoComparator } from '@/components/prospects/OggoComparator';
import { ImportSyncManager } from '@/components/prospects/ImportSyncManager';
import { 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Filter,
  MoreVertical,
  Calendar,
  Star,
  TrendingUp,
  Database,
  Scale
} from 'lucide-react';

// Mock data avec format de date DD/MM/YYYY
const mockProspects: Prospect[] = [
  {
    id: '1',
    nom: 'Marie Martin',
    prenom: 'Marie',
    email: 'marie.martin@email.com',
    telephone: '01.23.45.67.89',
    date_naissance: '15/03/1956',
    age: 68,
    statut: 'qualifie',
    score: 85,
    budget_max: 250,
    type_contrat: 'individuel',
    commercial_id: '1',
    date_creation: '2024-06-15',
    derniere_activite: '2024-06-18'
  },
  {
    id: '2',
    nom: 'Paul Bernard',
    prenom: 'Paul',
    email: 'paul.bernard@email.com',
    telephone: '01.34.56.78.90',
    date_naissance: '22/08/1952',
    age: 72,
    statut: 'interesse',
    score: 75,
    budget_max: 180,
    type_contrat: 'couple',
    commercial_id: '1',
    date_creation: '2024-06-10',
    derniere_activite: '2024-06-17'
  },
  {
    id: '3',
    nom: 'Lucie Dubois',
    prenom: 'Lucie',
    email: 'lucie.dubois@email.com',
    telephone: '01.45.67.89.01',
    date_naissance: '10/12/1959',
    age: 65,
    statut: 'nouveau',
    score: 65,
    budget_max: 320,
    type_contrat: 'individuel',
    commercial_id: '2',
    date_creation: '2024-06-12',
    derniere_activite: '2024-06-16'
  },
  {
    id: '4',
    nom: 'Jean Lefort',
    prenom: 'Jean',
    email: 'jean.lefort@email.com',
    telephone: '01.56.78.90.12',
    date_naissance: '05/07/1955',
    age: 69,
    statut: 'negocie',
    score: 90,
    budget_max: 280,
    type_contrat: 'couple',
    commercial_id: '1',
    date_creation: '2024-06-08',
    derniere_activite: '2024-06-19'
  }
];

const statutColors = {
  'nouveau': 'bg-blue-100 text-blue-800',
  'qualifie': 'bg-purple-100 text-purple-800',
  'interesse': 'bg-yellow-100 text-yellow-800',
  'negocie': 'bg-orange-100 text-orange-800',
  'signe': 'bg-green-100 text-green-800',
  'perdu': 'bg-red-100 text-red-800'
};

const statutLabels = {
  'nouveau': 'Nouveau',
  'qualifie': 'Qualifié',
  'interesse': 'Intéressé',
  'negocie': 'Négociation',
  'signe': 'Signé',
  'perdu': 'Perdu'
};

export default function Prospects() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showImportDialog, setShowImportDialog] = useState(false);
  
  const filteredProspects = mockProspects.filter(prospect => {
    const matchesSearch = prospect.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prospect.statut === statusFilter;
    const matchesCommercial = user?.role === 'commercial' ? prospect.commercial_id === user.id : true;
    
    return matchesSearch && matchesStatus && matchesCommercial;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des prospects</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'commercial' ? 'Vos prospects' : 'Tous les prospects'} - 
            {filteredProspects.length} prospect{filteredProspects.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <Database className="w-4 h-4 mr-2" />
                Import & Sync
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Import et Synchronisation</DialogTitle>
              </DialogHeader>
              <ImportSyncManager />
            </DialogContent>
          </Dialog>
          
          <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter prospect
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 border-gray-200">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="nouveau">Nouveau</SelectItem>
                <SelectItem value="qualifie">Qualifié</SelectItem>
                <SelectItem value="interesse">Intéressé</SelectItem>
                <SelectItem value="negocie">Négociation</SelectItem>
                <SelectItem value="signe">Signé</SelectItem>
                <SelectItem value="perdu">Perdu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prospects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProspects.map((prospect) => (
          <Card key={prospect.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold">
                      {prospect.nom.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {prospect.nom} {prospect.prenom}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {prospect.age} ans • {prospect.type_contrat}
                      {prospect.date_naissance && (
                        <span className="ml-2">• {prospect.date_naissance}</span>
                      )}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Status and Score */}
              <div className="flex items-center justify-between">
                <Badge className={`${statutColors[prospect.statut]} border-0`}>
                  {statutLabels[prospect.statut]}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className={`w-4 h-4 ${getScoreColor(prospect.score)}`} />
                  <span className={`text-sm font-medium ${getScoreColor(prospect.score)}`}>
                    {prospect.score}/100
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">{prospect.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{prospect.telephone}</span>
                </div>
              </div>

              {/* Budget */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Budget max:</span>
                <span className="font-semibold text-gray-900">€{prospect.budget_max}/mois</span>
              </div>

              {/* Actions avec Comparateur intégré */}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Phone className="w-4 h-4 mr-1" />
                  Appeler
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  RDV
                </Button>
                <OggoComparator 
                  prospect={prospect}
                  trigger={
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100"
                    >
                      <Scale className="w-4 h-4 mr-1" />
                      Offres
                    </Button>
                  }
                />
              </div>

              {/* Last Activity */}
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                Dernière activité: {new Date(prospect.derniere_activite).toLocaleDateString('fr-FR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProspects.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun prospect trouvé</h3>
            <p className="text-gray-600 mb-4">
              Aucun prospect ne correspond à vos critères de recherche.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}>
              Effacer les filtres
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
