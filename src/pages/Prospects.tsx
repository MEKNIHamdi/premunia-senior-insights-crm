import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { prospectsApi } from '@/lib/prospects-api';
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

const statutColors = {
  'new': 'bg-blue-100 text-blue-800',
  'qualified': 'bg-purple-100 text-purple-800',
  'interested': 'bg-yellow-100 text-yellow-800',
  'negotiating': 'bg-orange-100 text-orange-800',
  'converted': 'bg-green-100 text-green-800',
  'lost': 'bg-red-100 text-red-800'
};

const statutLabels = {
  'new': 'Nouveau',
  'qualified': 'Qualifié',
  'interested': 'Intéressé',
  'negotiating': 'Négociation',
  'converted': 'Converti',
  'lost': 'Perdu'
};

export default function Prospects() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showImportDialog, setShowImportDialog] = useState(false);
  
  const { data: prospects = [], isLoading, error } = useQuery({
    queryKey: ['prospects'],
    queryFn: prospectsApi.getAll
  });

  const filteredProspects = prospects.filter(prospect => {
    const fullName = `${prospect.first_name} ${prospect.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         (prospect.email && prospect.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || prospect.status === statusFilter;
    const matchesAssignee = user?.role === 'commercial' ? prospect.assigned_to === user.id : true;
    
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const getScoreColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <h3 className="text-red-800 font-medium mb-2">Erreur de chargement</h3>
            <p className="text-red-700 text-sm">{error.message}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <SelectItem value="new">Nouveau</SelectItem>
                <SelectItem value="qualified">Qualifié</SelectItem>
                <SelectItem value="interested">Intéressé</SelectItem>
                <SelectItem value="negotiating">Négociation</SelectItem>
                <SelectItem value="converted">Converti</SelectItem>
                <SelectItem value="lost">Perdu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prospects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProspects.map((prospect) => {
          const age = calculateAge(prospect.birth_date);
          const mockProspectForComparator = {
            id: prospect.id,
            nom: prospect.last_name,
            prenom: prospect.first_name,
            email: prospect.email,
            telephone: prospect.phone,
            date_naissance: prospect.birth_date ? new Date(prospect.birth_date).toLocaleDateString('fr-FR') : undefined,
            age: age,
            statut: prospect.status || 'nouveau',
            score: 75, // Mock score
            budget_max: prospect.expected_revenue || 200,
            type_contrat: 'individuel',
            commercial_id: prospect.assigned_to,
            date_creation: prospect.created_at,
            derniere_activite: prospect.updated_at || prospect.created_at
          };

          return (
            <Card key={prospect.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold">
                        {prospect.first_name?.[0]}{prospect.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {prospect.first_name} {prospect.last_name}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {age && `${age} ans`}
                        {prospect.interest_type && ` • ${prospect.interest_type}`}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Status and Priority */}
                <div className="flex items-center justify-between">
                  <Badge className={`${statutColors[prospect.status] || statutColors['new']} border-0`}>
                    {statutLabels[prospect.status] || 'Nouveau'}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className={`w-4 h-4 ${getScoreColor(prospect.priority || 'medium')}`} />
                    <span className={`text-sm font-medium ${getScoreColor(prospect.priority || 'medium')}`}>
                      {prospect.priority || 'medium'}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  {prospect.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{prospect.email}</span>
                    </div>
                  )}
                  {prospect.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{prospect.phone}</span>
                    </div>
                  )}
                </div>

                {/* Expected Revenue */}
                {prospect.expected_revenue && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Revenus attendus:</span>
                    <span className="font-semibold text-gray-900">€{prospect.expected_revenue}</span>
                  </div>
                )}

                {/* Actions */}
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
                    prospect={mockProspectForComparator}
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
                  Créé le: {new Date(prospect.created_at).toLocaleDateString('fr-FR')}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProspects.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun prospect trouvé</h3>
            <p className="text-gray-600 mb-4">
              {prospects.length === 0 
                ? "Aucun prospect dans la base de données. Utilisez le bouton Debug pour créer des données de test."
                : "Aucun prospect ne correspond à vos critères de recherche."
              }
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