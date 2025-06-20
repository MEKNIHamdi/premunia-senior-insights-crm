
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, Mail, Gift, Phone, TrendingUp } from 'lucide-react';
import { emailTemplatesApi, EmailTemplate } from '@/lib/marketing-api';
import { toast } from '@/hooks/use-toast';

export function EmailTemplates() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    sujet: '',
    contenu_html: '',
    contenu_text: '',
    type: 'bienvenue' as EmailTemplate['type']
  });

  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['email-templates'],
    queryFn: emailTemplatesApi.getAll
  });

  const createMutation = useMutation({
    mutationFn: emailTemplatesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({ title: "Template créé avec succès" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<EmailTemplate> }) =>
      emailTemplatesApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      setEditingTemplate(null);
      resetForm();
      toast({ title: "Template mis à jour avec succès" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      nom: '',
      sujet: '',
      contenu_html: '',
      contenu_text: '',
      type: 'bienvenue'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTemplate) {
      updateMutation.mutate({ id: editingTemplate.id, updates: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getTemplateIcon = (type: EmailTemplate['type']) => {
    switch (type) {
      case 'bienvenue': return <Mail className="h-4 w-4" />;
      case 'relance': return <Phone className="h-4 w-4" />;
      case 'anniversaire': return <Gift className="h-4 w-4" />;
      case 'cross_selling': return <TrendingUp className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getTemplateLabel = (type: EmailTemplate['type']) => {
    switch (type) {
      case 'bienvenue': return 'Bienvenue';
      case 'relance': return 'Relance';
      case 'anniversaire': return 'Anniversaire';
      case 'cross_selling': return 'Cross-selling';
      case 'personnalise': return 'Personnalisé';
      default: return type;
    }
  };

  const getDefaultTemplates = () => ({
    bienvenue: {
      sujet: 'Bienvenue chez Premunia - Votre devis mutuelle santé',
      contenu_html: `
        <h2>Bonjour {{prenom}} {{nom}},</h2>
        <p>Merci d'avoir fait confiance à Premunia pour votre recherche de mutuelle santé.</p>
        <p>Nous avons bien reçu votre demande de devis et notre équipe d'experts va étudier votre dossier dans les plus brefs délais.</p>
        <p>Vous recevrez votre comparatif d'offres personnalisé sous 24h à 48h maximum.</p>
        <p><strong>En attendant, voici ce qui va se passer :</strong></p>
        <ul>
          <li>✅ Analyse de votre profil et de vos besoins</li>
          <li>✅ Sélection des meilleures offres du marché</li>
          <li>✅ Envoi de votre comparatif personnalisé</li>
          <li>✅ Accompagnement personnalisé par votre conseiller</li>
        </ul>
        <p>Cordialement,<br>L'équipe Premunia</p>
      `
    },
    relance: {
      sujet: 'Votre devis mutuelle santé vous attend - {{prenom}}',
      contenu_html: `
        <h2>Bonjour {{prenom}},</h2>
        <p>Nous avons tenté de vous joindre concernant votre demande de devis mutuelle santé.</p>
        <p>Votre comparatif personnalisé est prêt et nous aimerions vous le présenter.</p>
        <p><strong>Pourquoi nous choisir ?</strong></p>
        <ul>
          <li>🏆 Les meilleures offres du marché</li>
          <li>💰 Jusqu'à 40% d'économies</li>
          <li>🤝 Accompagnement gratuit et sans engagement</li>
          <li>⚡ Souscription en ligne en 5 minutes</li>
        </ul>
        <p>Contactez-nous au <strong>01 XX XX XX XX</strong> ou répondez à cet email.</p>
        <p>Cordialement,<br>{{commercial_nom}}</p>
      `
    },
    anniversaire: {
      sujet: 'Joyeux anniversaire {{prenom}} ! 🎉',
      contenu_html: `
        <h2>🎉 Joyeux anniversaire {{prenom}} ! 🎂</h2>
        <p>Toute l'équipe Premunia vous souhaite un très joyeux anniversaire !</p>
        <p>En cette occasion spéciale, nous tenions à vous remercier pour votre confiance.</p>
        <p><strong>Profitez de notre offre anniversaire :</strong></p>
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>🎁 Offre spéciale anniversaire</h3>
          <p><strong>-20% sur votre prochaine cotisation</strong></p>
          <p>Valable jusqu'au {{date_fin_offre}}</p>
        </div>
        <p>Contactez votre conseiller {{commercial_nom}} pour en profiter !</p>
        <p>Encore bon anniversaire !<br>L'équipe Premunia</p>
      `
    },
    cross_selling: {
      sujet: 'Complétez votre protection avec nos solutions {{prenom}}',
      contenu_html: `
        <h2>Bonjour {{prenom}},</h2>
        <p>Nous espérons que vous êtes satisfait(e) de votre mutuelle santé Premunia.</p>
        <p>Saviez-vous que nous proposons d'autres solutions pour compléter votre protection ?</p>
        <p><strong>Nos solutions complémentaires :</strong></p>
        <ul>
          <li>🏠 <strong>Assurance habitation</strong> - À partir de 15€/mois</li>
          <li>🚗 <strong>Assurance auto</strong> - Devis gratuit en 2 minutes</li>
          <li>💼 <strong>Prévoyance</strong> - Protection de vos revenus</li>
          <li>🏦 <strong>Assurance vie</strong> - Préparez votre avenir</li>
        </ul>
        <p>En tant que client Premunia, bénéficiez de <strong>tarifs préférentiels</strong> sur toutes nos solutions.</p>
        <p>Contactez {{commercial_nom}} au {{commercial_telephone}} pour un devis gratuit.</p>
        <p>Cordialement,<br>L'équipe Premunia</p>
      `
    }
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement des templates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Templates d'emails</h2>
          <p className="text-gray-600">Gérez vos modèles d'emails pour l'automatisation</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingTemplate(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Modifier le template' : 'Créer un nouveau template'}
              </DialogTitle>
              <DialogDescription>
                Configurez votre modèle d'email pour l'automatisation marketing
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom du template</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Ex: Email bienvenue prospects"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Type de template</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: EmailTemplate['type']) => {
                      const defaultTemplates = getDefaultTemplates();
                      const defaultTemplate = defaultTemplates[value];
                      
                      setFormData({ 
                        ...formData, 
                        type: value,
                        ...(defaultTemplate && !editingTemplate ? {
                          sujet: defaultTemplate.sujet,
                          contenu_html: defaultTemplate.contenu_html
                        } : {})
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bienvenue">Bienvenue</SelectItem>
                      <SelectItem value="relance">Relance</SelectItem>
                      <SelectItem value="anniversaire">Anniversaire</SelectItem>
                      <SelectItem value="cross_selling">Cross-selling</SelectItem>
                      <SelectItem value="personnalise">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sujet">Sujet de l'email</Label>
                <Input
                  id="sujet"
                  value={formData.sujet}
                  onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                  placeholder="Ex: Bienvenue chez Premunia - {{prenom}}"
                  required
                />
              </div>
              
              <Tabs defaultValue="html" className="w-full">
                <TabsList>
                  <TabsTrigger value="html">Contenu HTML</TabsTrigger>
                  <TabsTrigger value="text">Contenu texte (optionnel)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="html" className="space-y-2">
                  <Label htmlFor="contenu_html">Contenu HTML</Label>
                  <Textarea
                    id="contenu_html"
                    value={formData.contenu_html}
                    onChange={(e) => setFormData({ ...formData, contenu_html: e.target.value })}
                    placeholder="Contenu HTML de votre email..."
                    rows={12}
                    required
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Variables disponibles: {{prenom}}, {{nom}}, {{email}}, {{commercial_nom}}, {{commercial_telephone}}
                  </p>
                </TabsContent>
                
                <TabsContent value="text" className="space-y-2">
                  <Label htmlFor="contenu_text">Contenu texte</Label>
                  <Textarea
                    id="contenu_text"
                    value={formData.contenu_text}
                    onChange={(e) => setFormData({ ...formData, contenu_text: e.target.value })}
                    placeholder="Version texte de votre email (optionnel)..."
                    rows={8}
                  />
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setEditingTemplate(null);
                    resetForm();
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingTemplate ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTemplateIcon(template.type)}
                  <CardTitle className="text-lg">{template.nom}</CardTitle>
                </div>
                <Badge variant="secondary">
                  {getTemplateLabel(template.type)}
                </Badge>
              </div>
              <CardDescription className="line-clamp-1">{template.sujet}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="text-sm text-gray-500 mb-4">
                Créé le {new Date(template.created_at).toLocaleDateString()}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPreviewTemplate(template)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Aperçu
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingTemplate(template);
                    setFormData({
                      nom: template.nom,
                      sujet: template.sujet,
                      contenu_html: template.contenu_html,
                      contenu_text: template.contenu_text || '',
                      type: template.type
                    });
                    setIsCreateDialogOpen(true);
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de prévisualisation */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu - {previewTemplate?.nom}</DialogTitle>
            <DialogDescription>
              Sujet: {previewTemplate?.sujet}
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-lg p-4 bg-white">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: (previewTemplate?.contenu_html || '')
                  .replace(/\{\{prenom\}\}/g, 'Jean')
                  .replace(/\{\{nom\}\}/g, 'Dupont')
                  .replace(/\{\{email\}\}/g, 'jean.dupont@email.com')
                  .replace(/\{\{commercial_nom\}\}/g, 'Marie Martin')
                  .replace(/\{\{commercial_telephone\}\}/g, '01 23 45 67 89')
                  .replace(/\{\{date_fin_offre\}\}/g, new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString())
              }} 
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => setPreviewTemplate(null)}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {templates.length === 0 && (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>Aucun template configuré</CardTitle>
            <CardDescription>
              Créez votre premier template d'email pour commencer l'automatisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
