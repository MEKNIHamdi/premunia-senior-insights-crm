
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Target, TrendingUp, TrendingDown, Users, Euro, Calendar, PhoneCall } from 'lucide-react';
import { commercialObjectivesApi, CommercialObjective } from '@/lib/marketing-api';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export function ObjectivesManagement() {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<CommercialObjective | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'mensuel' | 'trimestriel' | 'annuel'>('mensuel');
  const [formData, setFormData] = useState({
    commercial_id: '',
    periode_type: 'mensuel' as CommercialObjective['periode_type'],
    periode_valeur: '',
    objectif_ca: 0,
    objectif_prospects: 0,
    objectif_conversions: 0,
    objectif_rdv: 0,
    ca_realise: 0,
    prospects_realises: 0,
    conversions_realisees: 0,
    rdv_realises: 0
  });

  const queryClient = useQueryClient();

  const { data: objectives = [], isLoading } = useQuery({
    queryKey: ['commercial-objectives', selectedPeriod],
    queryFn: () => commercialObjectivesApi.getAll()
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      return data || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: commercialObjectivesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commercial-objectives'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({ title: "Objectif créé avec succès" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CommercialObjective> }) =>
      commercialObjectivesApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commercial-objectives'] });
      setEditingObjective(null);
      resetForm();
      toast({ title: "Objectif mis à jour avec succès" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  const resetForm = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    setFormData({
      commercial_id: '',
      periode_type: 'mensuel',
      periode_valeur: `${currentYear}-${currentMonth.toString().padStart(2, '0')}`,
      objectif_ca: 0,
      objectif_prospects: 0,
      objectif_conversions: 0,
      objectif_rdv: 0,
      ca_realise: 0,
      prospects_realises: 0,
      conversions_realisees: 0,
      rdv_realises: 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingObjective) {
      updateMutation.mutate({ id: editingObjective.id, updates: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const generatePeriodValue = (type: CommercialObjective['periode_type']) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const currentQuarter = Math.ceil(currentMonth / 3);

    switch (type) {
      case 'mensuel':
        return `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
      case 'trimestriel':
        return `${currentYear}-T${currentQuarter}`;
      case 'annuel':
        return currentYear.toString();
      default:
        return '';
    }
  };

  const formatPeriodValue = (type: CommercialObjective['periode_type'], value: string) => {
    switch (type) {
      case 'mensuel':
        const [year, month] = value.split('-');
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
      case 'trimestriel':
        return value.replace('T', 'T');
      case 'annuel':
        return value;
      default:
        return value;
    }
  };

  const calculateProgress = (realized: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((realized / target) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredObjectives = objectives.filter(obj => obj.periode_type === selectedPeriod);

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement des objectifs...</div>;
  }

  // Seuls les admins peuvent créer/modifier les objectifs
  const canManageObjectives = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des objectifs</h2>
          <p className="text-gray-600">
            {canManageObjectives 
              ? 'Définissez et suivez les objectifs de vos commerciaux' 
              : 'Consultez vos objectifs et votre progression'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select 
            value={selectedPeriod} 
            onValueChange={(value: 'mensuel' | 'trimestriel' | 'annuel') => setSelectedPeriod(value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensuel">Objectifs mensuels</SelectItem>
              <SelectItem value="trimestriel">Objectifs trimestriels</SelectItem>
              <SelectItem value="annuel">Objectifs annuels</SelectItem>
            </SelectContent>
          </Select>

          {canManageObjectives && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setEditingObjective(null); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel objectif
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingObjective ? 'Modifier l\'objectif' : 'Créer un nouvel objectif'}
                  </DialogTitle>
                  <DialogDescription>
                    Définissez les objectifs pour un commercial sur une période donnée
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="commercial">Commercial</Label>
                      <Select
                        value={formData.commercial_id}
                        onValueChange={(value) => setFormData({ ...formData, commercial_id: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un commercial" />
                        </SelectTrigger>
                        <SelectContent>
                          {profiles
                            .filter(profile => profile.role === 'commercial' || profile.role === 'courtier')
                            .map((profile) => (
                              <SelectItem key={profile.id} value={profile.id}>
                                {profile.first_name} {profile.last_name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="periode_type">Type de période</Label>
                      <Select
                        value={formData.periode_type}
                        onValueChange={(value: CommercialObjective['periode_type']) => {
                          setFormData({ 
                            ...formData, 
                            periode_type: value,
                            periode_valeur: generatePeriodValue(value)
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mensuel">Mensuel</SelectItem>
                          <SelectItem value="trimestriel">Trimestriel</SelectItem>
                          <SelectItem value="annuel">Annuel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="periode_valeur">Période</Label>
                    <Input
                      id="periode_valeur"
                      value={formData.periode_valeur}
                      onChange={(e) => setFormData({ ...formData, periode_valeur: e.target.value })}
                      placeholder="Ex: 2024-01, 2024-T1, 2024"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="objectif_ca">Objectif CA (€)</Label>
                      <Input
                        id="objectif_ca"
                        type="number"
                        value={formData.objectif_ca}
                        onChange={(e) => setFormData({ ...formData, objectif_ca: parseFloat(e.target.value) || 0 })}
                        placeholder="50000"
                        min="0"
                        step="100"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="objectif_prospects">Objectif prospects</Label>
                      <Input
                        id="objectif_prospects"
                        type="number"
                        value={formData.objectif_prospects}
                        onChange={(e) => setFormData({ ...formData, objectif_prospects: parseInt(e.target.value) || 0 })}
                        placeholder="100"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="objectif_conversions">Objectif conversions</Label>
                      <Input
                        id="objectif_conversions"
                        type="number"
                        value={formData.objectif_conversions}
                        onChange={(e) => setFormData({ ...formData, objectif_conversions: parseInt(e.target.value) || 0 })}
                        placeholder="10"
                        min="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="objectif_rdv">Objectif RDV</Label>
                      <Input
                        id="objectif_rdv"
                        type="number"
                        value={formData.objectif_rdv}
                        onChange={(e) => setFormData({ ...formData, objectif_rdv: parseInt(e.target.value) || 0 })}
                        placeholder="25"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsCreateDialogOpen(false);
                        setEditingObjective(null);
                        resetForm();
                      }}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingObjective ? 'Mettre à jour' : 'Créer'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredObjectives.map((objective) => {
          const commercial = profiles.find(p => p.id === objective.commercial_id);
          const caProgress = calculateProgress(objective.ca_realise, objective.objectif_ca || 0);
          const prospectsProgress = calculateProgress(objective.prospects_realises, objective.objectif_prospects || 0);
          const conversionsProgress = calculateProgress(objective.conversions_realisees, objective.objectif_conversions || 0);
          const rdvProgress = calculateProgress(objective.rdv_realises, objective.objectif_rdv || 0);

          return (
            <Card key={objective.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {commercial ? `${commercial.first_name} ${commercial.last_name}` : 'Commercial inconnu'}
                    </CardTitle>
                    <CardDescription>
                      {formatPeriodValue(objective.periode_type, objective.periode_valeur)}
                    </CardDescription>
                  </div>
                  {canManageObjectives && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingObjective(objective);
                        setFormData({
                          commercial_id: objective.commercial_id,
                          periode_type: objective.periode_type,
                          periode_valeur: objective.periode_valeur,
                          objectif_ca: objective.objectif_ca || 0,
                          objectif_prospects: objective.objectif_prospects || 0,
                          objectif_conversions: objective.objectif_conversions || 0,
                          objectif_rdv: objective.objectif_rdv || 0,
                          ca_realise: objective.ca_realise,
                          prospects_realises: objective.prospects_realises,
                          conversions_realisees: objective.conversions_realisees,
                          rdv_realises: objective.rdv_realises
                        });
                        setIsCreateDialogOpen(true);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* CA */}
                {objective.objectif_ca && objective.objectif_ca > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Euro className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Chiffre d'affaires</span>
                      </div>
                      <Badge variant={caProgress >= 100 ? 'default' : 'secondary'}>
                        {Math.round(caProgress)}%
                      </Badge>
                    </div>
                    <Progress value={caProgress} className={`h-2 ${getProgressColor(caProgress)}`} />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{objective.ca_realise.toLocaleString()}€ réalisé</span>
                      <span>Objectif: {objective.objectif_ca.toLocaleString()}€</span>
                    </div>
                  </div>
                )}

                {/* Prospects */}
                {objective.objectif_prospects && objective.objectif_prospects > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Prospects</span>
                      </div>
                      <Badge variant={prospectsProgress >= 100 ? 'default' : 'secondary'}>
                        {Math.round(prospectsProgress)}%
                      </Badge>
                    </div>
                    <Progress value={prospectsProgress} className={`h-2 ${getProgressColor(prospectsProgress)}`} />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{objective.prospects_realises} prospects</span>
                      <span>Objectif: {objective.objectif_prospects}</span>
                    </div>
                  </div>
                )}

                {/* Conversions */}
                {objective.objectif_conversions && objective.objectif_conversions > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">Conversions</span>
                      </div>
                      <Badge variant={conversionsProgress >= 100 ? 'default' : 'secondary'}>
                        {Math.round(conversionsProgress)}%
                      </Badge>
                    </div>
                    <Progress value={conversionsProgress} className={`h-2 ${getProgressColor(conversionsProgress)}`} />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{objective.conversions_realisees} conversions</span>
                      <span>Objectif: {objective.objectif_conversions}</span>
                    </div>
                  </div>
                )}

                {/* RDV */}
                {objective.objectif_rdv && objective.objectif_rdv > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <PhoneCall className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">Rendez-vous</span>
                      </div>
                      <Badge variant={rdvProgress >= 100 ? 'default' : 'secondary'}>
                        {Math.round(rdvProgress)}%
                      </Badge>
                    </div>
                    <Progress value={rdvProgress} className={`h-2 ${getProgressColor(rdvProgress)}`} />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{objective.rdv_realises} RDV</span>
                      <span>Objectif: {objective.objectif_rdv}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredObjectives.length === 0 && (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>Aucun objectif défini</CardTitle>
            <CardDescription>
              {canManageObjectives 
                ? `Créez des objectifs ${selectedPeriod}s pour vos commerciaux`
                : `Aucun objectif ${selectedPeriod} n'a été défini`
              }
            </CardDescription>
          </CardHeader>
          {canManageObjectives && (
            <CardContent>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un objectif
              </Button>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
