
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, Euro, Target, PhoneCall, Mail, Calendar, BarChart3 } from 'lucide-react';
import { performanceStatsApi, commercialObjectivesApi, marketingEventsApi } from '@/lib/marketing-api';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function MarketingReporting() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30'); // 30 jours par défaut
  const [selectedCommercial, setSelectedCommercial] = useState('all');

  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - parseInt(selectedPeriod));
  const dateTo = new Date();

  // Récupération des données
  const { data: performanceStats = [] } = useQuery({
    queryKey: ['performance-stats', selectedPeriod, selectedCommercial],
    queryFn: () => {
      if (selectedCommercial === 'all') {
        return performanceStatsApi.getAllStats(dateFrom.toISOString().split('T')[0], dateTo.toISOString().split('T')[0]);
      } else {
        return performanceStatsApi.getByCommercial(selectedCommercial, dateFrom.toISOString().split('T')[0], dateTo.toISOString().split('T')[0]);
      }
    }
  });

  const { data: objectives = [] } = useQuery({
    queryKey: ['objectives-current'],
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

  const { data: marketingEvents = [] } = useQuery({
    queryKey: ['marketing-events'],
    queryFn: () => marketingEventsApi.getRecentEvents(100)
  });

  // Calculs des métriques globales
  const globalMetrics = performanceStats.reduce((acc, stat) => ({
    totalProspects: acc.totalProspects + stat.prospects_nouveaux,
    totalConversions: acc.totalConversions + stat.prospects_convertis,
    totalCA: acc.totalCA + stat.ca_genere,
    totalAppels: acc.totalAppels + stat.appels_effectues,
    totalEmails: acc.totalEmails + stat.emails_envoyes,
    totalRDV: acc.totalRDV + stat.rdv_planifies,
    totalRDVHonores: acc.totalRDVHonores + stat.rdv_honores
  }), {
    totalProspects: 0,
    totalConversions: 0,
    totalCA: 0,
    totalAppels: 0,
    totalEmails: 0,
    totalRDV: 0,
    totalRDVHonores: 0
  });

  const tauxConversion = globalMetrics.totalProspects > 0 
    ? (globalMetrics.totalConversions / globalMetrics.totalProspects * 100).toFixed(1)
    : '0';

  const tauxRDV = globalMetrics.totalRDV > 0 
    ? (globalMetrics.totalRDVHonores / globalMetrics.totalRDV * 100).toFixed(1)
    : '0';

  // Données pour les graphiques
  const chartData = performanceStats.map(stat => ({
    date: new Date(stat.date_stat).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    prospects: stat.prospects_nouveaux,
    conversions: stat.prospects_convertis,
    ca: stat.ca_genere,
    taux_conversion: stat.taux_conversion || 0
  }));

  // Données par commercial (pour les admins/managers)
  const commercialData = user?.role === 'admin' || user?.role === 'manager' 
    ? performanceStats.reduce((acc, stat) => {
        const commercial = profiles.find(p => p.id === stat.commercial_id);
        const name = commercial ? `${commercial.first_name} ${commercial.last_name}` : 'Inconnu';
        
        if (!acc[name]) {
          acc[name] = {
            name,
            prospects: 0,
            conversions: 0,
            ca: 0,
            rdv: 0
          };
        }
        
        acc[name].prospects += stat.prospects_nouveaux;
        acc[name].conversions += stat.prospects_convertis;
        acc[name].ca += stat.ca_genere;
        acc[name].rdv += stat.rdv_planifies;
        
        return acc;
      }, {} as Record<string, any>)
    : {};

  const commercialChartData = Object.values(commercialData);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const canViewAllData = user?.role === 'admin' || user?.role === 'manager';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reporting Marketing</h2>
          <p className="text-gray-600">Tableau de bord des performances commerciales</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 derniers jours</SelectItem>
              <SelectItem value="30">30 derniers jours</SelectItem>
              <SelectItem value="90">90 derniers jours</SelectItem>
              <SelectItem value="365">Cette année</SelectItem>
            </SelectContent>
          </Select>

          {canViewAllData && (
            <Select value={selectedCommercial} onValueChange={setSelectedCommercial}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les commerciaux</SelectItem>
                {profiles
                  .filter(profile => profile.role === 'commercial' || profile.role === 'courtier')
                  .map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.first_name} {profile.last_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prospects</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalMetrics.totalProspects}</div>
            <p className="text-xs text-gray-600 mt-1">
              Taux conversion: {tauxConversion}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
            <Euro className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalMetrics.totalCA.toLocaleString()}€</div>
            <p className="text-xs text-gray-600 mt-1">
              {globalMetrics.totalConversions} conversions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rendez-vous</CardTitle>
            <PhoneCall className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalMetrics.totalRDV}</div>
            <p className="text-xs text-gray-600 mt-1">
              Taux présence: {tauxRDV}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activité</CardTitle>
            <Mail className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalMetrics.totalEmails}</div>
            <p className="text-xs text-gray-600 mt-1">
              {globalMetrics.totalAppels} appels
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="evolution" className="space-y-6">
        <TabsList>
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
          {canViewAllData && <TabsTrigger value="commerciaux">Par commercial</TabsTrigger>}
          <TabsTrigger value="objectifs">Objectifs</TabsTrigger>
          <TabsTrigger value="activite">Activité marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="evolution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des prospects et conversions</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="prospects" fill="#3B82F6" name="Prospects" />
                    <Bar dataKey="conversions" fill="#10B981" name="Conversions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Évolution du chiffre d'affaires</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}€`, 'CA']} />
                    <Line type="monotone" dataKey="ca" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Taux de conversion par jour</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Taux conversion']} />
                  <Line type="monotone" dataKey="taux_conversion" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {canViewAllData && (
          <TabsContent value="commerciaux" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance par commercial</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={commercialChartData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="prospects" fill="#3B82F6" name="Prospects" />
                      <Bar dataKey="conversions" fill="#10B981" name="Conversions" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition du CA par commercial</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={commercialChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="ca"
                      >
                        {commercialChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}€`, 'CA']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Détail par commercial</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commercialChartData.map((commercial, index) => (
                    <div key={commercial.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div>
                          <p className="font-medium">{commercial.name}</p>
                          <p className="text-sm text-gray-600">
                            {commercial.prospects} prospects • {commercial.conversions} conversions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{commercial.ca.toLocaleString()}€</p>
                        <p className="text-sm text-gray-600">{commercial.rdv} RDV</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="objectifs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {objectives
              .filter(obj => user?.role === 'admin' || user?.role === 'manager' || obj.commercial_id === user?.id)
              .map((objective) => {
                const commercial = profiles.find(p => p.id === objective.commercial_id);
                const caProgress = objective.objectif_ca ? (objective.ca_realise / objective.objectif_ca * 100) : 0;
                const prospectsProgress = objective.objectif_prospects ? (objective.prospects_realises / objective.objectif_prospects * 100) : 0;

                return (
                  <Card key={objective.id}>
                    <CardHeader>
                      <CardTitle>
                        {commercial ? `${commercial.first_name} ${commercial.last_name}` : 'Commercial inconnu'}
                      </CardTitle>
                      <CardDescription>
                        {objective.periode_valeur} • {objective.periode_type}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {Math.round(caProgress)}%
                          </div>
                          <div className="text-sm text-blue-800">CA réalisé</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {objective.ca_realise.toLocaleString()}€ / {objective.objectif_ca?.toLocaleString()}€
                          </div>
                        </div>
                        
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {Math.round(prospectsProgress)}%
                          </div>
                          <div className="text-sm text-green-800">Prospects</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {objective.prospects_realises} / {objective.objectif_prospects}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">
                            {objective.conversions_realisees}
                          </div>
                          <div className="text-sm text-purple-800">Conversions</div>
                        </div>
                        
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-lg font-bold text-orange-600">
                            {objective.rdv_realises}
                          </div>
                          <div className="text-sm text-orange-800">RDV</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="activite" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activité marketing récente</CardTitle>
              <CardDescription>Événements d'automatisation des derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketingEvents.slice(0, 20).map((event, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      event.type_evenement.includes('email') ? 'bg-blue-500' :
                      event.type_evenement.includes('call') ? 'bg-green-500' :
                      event.type_evenement.includes('rdv') ? 'bg-orange-500' :
                      'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium">{event.type_evenement}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(event.date_evenement).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {event.prospect_id ? 'Prospect' : event.client_id ? 'Client' : 'Système'}
                    </Badge>
                  </div>
                ))}
                
                {marketingEvents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune activité marketing récente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
