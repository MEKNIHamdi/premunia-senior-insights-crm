import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { marketingApi } from '@/lib/marketing-api';
import { 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Send,
  Copy,
  FileText,
  Settings
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  nom: string;
  type: string;
  sujet: string;
  contenu_html: string;
  contenu_text?: string;
  variables?: Record<string, string>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export function EmailTemplates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    type: 'prospection',
    sujet: '',
    contenu_html: '',
    contenu_text: '',
    variables: {} as Record<string, string>
  });

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['email-templates'],
    queryFn: marketingApi.getEmailTemplates
  });

  const createMutation = useMutation({
    mutationFn: marketingApi.createEmailTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({ title: 'Template créé avec succès' });
      resetForm();
    },
    onError: (error) => {
      toast({ 
        title: 'Erreur lors de la création', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<EmailTemplate>) => 
      marketingApi.updateEmailTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({ title: 'Template mis à jour avec succès' });
      setIsEditing(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: marketingApi.deleteEmailTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({ title: 'Template supprimé avec succès' });
    }
  });

  const resetForm = () => {
    setFormData({
      nom: '',
      type: 'prospection',
      sujet: '',
      contenu_html: '',
      contenu_text: '',
      variables: {}
    });
    setSelectedTemplate(null);
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && selectedTemplate) {
      updateMutation.mutate({
        id: selectedTemplate.id,
        ...formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      nom: template.nom,
      type: template.type,
      sujet: template.sujet,
      contenu_html: template.contenu_html,
      contenu_text: template.contenu_text || '',
      variables: template.variables || {}
    });
    setIsEditing(true);
  };

  const handlePreview = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const generatePreviewContent = (template: EmailTemplate) => {
    const mockData = {
      prenom: 'Jean',
      nom: 'Dupont',
      email: 'jean.dupont@example.com',
      commercial_nom: 'Marie Martin',
      commercial_telephone: '01.23.45.67.89'
    };

    let content = template.contenu_html;
    Object.entries(mockData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, value);
    });

    return { __html: content };
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Templates Email</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos modèles d'emails pour les campagnes marketing
          </p>
        </div>
        <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {template.nom}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {template.sujet}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {template.type}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <div className="flex items-center mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Variables: {Object.keys(template.variables || {}).length}
                </div>
                <p className="text-xs text-gray-500">
                  Créé le: {new Date(template.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(template)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Aperçu
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(template)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteMutation.mutate(template.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => {
        setIsEditing(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? 'Modifier le template' : 'Nouveau template'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du template</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Ex: Email de bienvenue"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospection">Prospection</SelectItem>
                    <SelectItem value="relance">Relance</SelectItem>
                    <SelectItem value="bienvenue">Bienvenue</SelectItem>
                    <SelectItem value="suivi">Suivi</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sujet">Sujet</Label>
              <Input
                id="sujet"
                value={formData.sujet}
                onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                placeholder="Sujet de l'email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenu_html">Contenu HTML</Label>
              <Textarea
                id="contenu_html"
                value={formData.contenu_html}
                onChange={(e) => setFormData({ ...formData, contenu_html: e.target.value })}
                placeholder="Contenu HTML de l'email avec variables {{nom}}, {{prenom}}, etc."
                rows={10}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenu_text">Contenu texte (optionnel)</Label>
              <Textarea
                id="contenu_text"
                value={formData.contenu_text}
                onChange={(e) => setFormData({ ...formData, contenu_text: e.target.value })}
                placeholder="Version texte de l'email"
                rows={5}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Annuler
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {selectedTemplate ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu du template</DialogTitle>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold">Sujet:</h3>
                <p className="text-gray-700">{selectedTemplate.sujet}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Contenu:</h3>
                <div 
                  className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={generatePreviewContent(selectedTemplate)}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
