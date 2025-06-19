
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Play, Pause, Mail, Phone, Gift, TrendingUp } from 'lucide-react';
import { automationScenariosApi, AutomationScenario } from '@/lib/marketing-api';
import { toast } from '@/hooks/use-toast';

export function AutomationScenarios() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<AutomationScenario | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    type: 'email_bienvenue' as AutomationScenario['type'],
    statut: 'brouillon' as AutomationScenario['statut'],
    delai_minutes: 0
  });

  const queryClient = useQueryClient();

  const { data: scenarios = [], isLoading } = useQuery({
    queryKey: ['automation-scenarios'],
    queryFn: automationScenariosApi.getAll
  });

  const createMutation = useMutation({
    mutationFn: automationScenariosApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-scenarios'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({ title: "Scénario créé avec succès" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<AutomationScenario> }) =>
      automationScenariosApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-scenarios'] });
      setEditingScenario(null);
      resetForm();
      toast({ title: "Scénario mis à jour avec succès" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: automationScenariosApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-scenarios'] });
      toast({ title: "Scénario supprimé avec succès" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
      type: 'email_bienvenue',
      statut: 'brouillon',
      delai_minutes: 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingScenario) {
      updateMutation.mutate({ id: editingScenario.id, updates: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getScenarioIcon = (type: AutomationScenario['type']) => {
    switch (type) {
      case 'email_bienvenue': return <Mail className="h-4 w-4" />;
      case 'relance_email': return <Phone className="h-4 w-4" />;
      case 'anniversaire': return <Gift className="h-4 w-4" />;
      case 'cross_selling': return <TrendingUp className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getScenarioLabel = (type: AutomationScenario['type']) => {
    switch (type) {
      case 'email_bienvenue': return 'Email de bienvenue';
      case 'relance_email': return 'Relance email';
      case 'anniversaire': return 'Email anniversaire';
      case 'cross_selling': return 'Cross-selling';
      case 'personnalise': return 'Personnalisé';
      default: return type;
    }
  };

  const getStatusColor = (statut: AutomationScenario['statut']) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'inactif': return 'bg-gray-100 text-gray-800';
      case 'brouillon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement des scénarios...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Scénarios d'automatisation</h2>
          <p className="text-gray-600">Configurez vos campagnes marketing automatisées</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingScenario(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau scénario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingScenario ? 'Modifier le scénario' : 'Créer un nouveau scénario'}
              </DialogTitle>
              <DialogDescription>
                Configurez les paramètres de votre scénario d'automatisation marketing
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom du scénario</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Ex: Email de bienvenue prospects"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Type de scénario</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: AutomationScenario['type']) => 
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email_bienvenue">Email de bienvenue</SelectItem>
                      <SelectItem value="relance_email">Relance email</SelectItem>
                      <SelectItem value="anniversaire">Email anniversaire</SelectItem>
                      <SelectItem value="cross_selling">Cross-selling</SelectItem>
                      <SelectItem value="personnalise">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez l'objectif de ce scénario..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delai">Délai (minutes)</Label>
                  <Input
                    id="delai"
                    type="number"
                    value={formData.delai_minutes}
                    onChange={(e) => setFormData({ ...formData, delai_minutes: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="statut">Statut</Label>
                  <Select
                    value={formData.statut}
                    onValueChange={(value: AutomationScenario['statut']) => 
                      setFormData({ ...formData, statut: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brouillon">Brouillon</SelectItem>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="inactif">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setEditingScenario(null);
                    resetForm();
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingScenario ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getScenarioIcon(scenario.type)}
                  <CardTitle className="text-lg">{scenario.nom}</CardTitle>
                </div>
                <Badge className={getStatusColor(scenario.statut)}>
                  {scenario.statut}
                </Badge>
              </div>
              <CardDescription>{getScenarioLabel(scenario.type)}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {scenario.description || 'Aucune description'}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Délai: {scenario.delai_minutes}min</span>
                <span>Créé le {new Date(scenario.created_at).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingScenario(scenario);
                      setFormData({
                        nom: scenario.nom,
                        description: scenario.description || '',
                        type: scenario.type,
                        statut: scenario.statut,
                        delai_minutes: scenario.delai_minutes
                      });
                      setIsCreateDialogOpen(true);
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Modifier
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newStatut = scenario.statut === 'actif' ? 'inactif' : 'actif';
                      updateMutation.mutate({ 
                        id: scenario.id, 
                        updates: { statut: newStatut } 
                      });
                    }}
                  >
                    {scenario.statut === 'actif' ? (
                      <Pause className="h-3 w-3 mr-1" />
                    ) : (
                      <Play className="h-3 w-3 mr-1" />
                    )}
                    {scenario.statut === 'actif' ? 'Désactiver' : 'Activer'}
                  </Button>
                </div>
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm('Êtes-vous sûr de vouloir supprimer ce scénario ?')) {
                      deleteMutation.mutate(scenario.id);
                    }
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {scenarios.length === 0 && (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>Aucun scénario configuré</CardTitle>
            <CardDescription>
              Créez votre premier scénario d'automatisation marketing pour commencer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un scénario
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
