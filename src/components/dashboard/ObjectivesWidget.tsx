
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Euro, Users, PhoneCall } from 'lucide-react';
import { commercialObjectivesApi, CommercialObjective } from '@/lib/marketing-api';
import { useAuth } from '@/hooks/useAuth';

export function ObjectivesWidget() {
  const { user } = useAuth();
  
  const { data: objectives = [], isLoading } = useQuery({
    queryKey: ['user-objectives', user?.id],
    queryFn: () => {
      if (!user?.id) return [];
      return commercialObjectivesApi.getByCommercial(user.id);
    },
    enabled: !!user?.id
  });

  const currentMonth = new Date().toISOString().slice(0, 7); // Format: 2024-01
  const currentObjective = objectives.find(obj => 
    obj.periode_type === 'mensuel' && obj.periode_valeur === currentMonth
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Mes objectifs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentObjective) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Mes objectifs</span>
          </CardTitle>
          <CardDescription>Objectifs du mois en cours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Aucun objectif défini pour ce mois</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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

  const caProgress = calculateProgress(currentObjective.ca_realise, currentObjective.objectif_ca || 0);
  const prospectsProgress = calculateProgress(currentObjective.prospects_realises, currentObjective.objectif_prospects || 0);
  const conversionsProgress = calculateProgress(currentObjective.conversions_realisees, currentObjective.objectif_conversions || 0);
  const rdvProgress = calculateProgress(currentObjective.rdv_realises, currentObjective.objectif_rdv || 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Mes objectifs</span>
        </CardTitle>
        <CardDescription>
          {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chiffre d'affaires */}
        {currentObjective.objectif_ca && currentObjective.objectif_ca > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Euro className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Chiffre d'affaires</span>
              </div>
              <Badge variant={caProgress >= 100 ? 'default' : 'secondary'} className="text-xs">
                {Math.round(caProgress)}%
              </Badge>
            </div>
            <Progress value={caProgress} className={`h-2 ${getProgressColor(caProgress)}`} />
            <div className="flex justify-between text-xs text-gray-600">
              <span>{currentObjective.ca_realise.toLocaleString()}€</span>
              <span>{currentObjective.objectif_ca.toLocaleString()}€</span>
            </div>
          </div>
        )}

        {/* Prospects */}
        {currentObjective.objectif_prospects && currentObjective.objectif_prospects > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Prospects</span>
              </div>
              <Badge variant={prospectsProgress >= 100 ? 'default' : 'secondary'} className="text-xs">
                {Math.round(prospectsProgress)}%
              </Badge>
            </div>
            <Progress value={prospectsProgress} className={`h-2 ${getProgressColor(prospectsProgress)}`} />
            <div className="flex justify-between text-xs text-gray-600">
              <span>{currentObjective.prospects_realises}</span>
              <span>{currentObjective.objectif_prospects}</span>
            </div>
          </div>
        )}

        {/* Conversions */}
        {currentObjective.objectif_conversions && currentObjective.objectif_conversions > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Conversions</span>
              </div>
              <Badge variant={conversionsProgress >= 100 ? 'default' : 'secondary'} className="text-xs">
                {Math.round(conversionsProgress)}%
              </Badge>
            </div>
            <Progress value={conversionsProgress} className={`h-2 ${getProgressColor(conversionsProgress)}`} />
            <div className="flex justify-between text-xs text-gray-600">
              <span>{currentObjective.conversions_realisees}</span>
              <span>{currentObjective.objectif_conversions}</span>
            </div>
          </div>
        )}

        {/* RDV */}
        {currentObjective.objectif_rdv && currentObjective.objectif_rdv > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PhoneCall className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Rendez-vous</span>
              </div>
              <Badge variant={rdvProgress >= 100 ? 'default' : 'secondary'} className="text-xs">
                {Math.round(rdvProgress)}%
              </Badge>
            </div>
            <Progress value={rdvProgress} className={`h-2 ${getProgressColor(rdvProgress)}`} />
            <div className="flex justify-between text-xs text-gray-600">
              <span>{currentObjective.rdv_realises}</span>
              <span>{currentObjective.objectif_rdv}</span>
            </div>
          </div>
        )}

        {/* Résumé global */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progression globale</span>
            <span className="font-medium">
              {Math.round((caProgress + prospectsProgress + conversionsProgress + rdvProgress) / 4)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
