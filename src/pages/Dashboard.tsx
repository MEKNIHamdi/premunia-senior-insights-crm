
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Users,
  DollarSign,
  TrendingUp,
  Target,
  Mail,
  Phone,
  Calendar,
  Award
} from 'lucide-react';

const monthlyData = [
  { name: 'Jan', value: 120 },
  { name: 'Fév', value: 135 },
  { name: 'Mar', value: 148 },
  { name: 'Avr', value: 156 },
  { name: 'Mai', value: 189 },
  { name: 'Juin', value: 201 },
  { name: 'Juil', value: 178 },
  { name: 'Août', value: 165 },
  { name: 'Sept', value: 188 },
  { name: 'Oct', value: 205 },
  { name: 'Nov', value: 187 },
  { name: 'Déc', value: 198 },
];

const pipelineData = [
  { name: 'Nouveau', value: 45, color: '#3B82F6' },
  { name: 'Qualifié', value: 32, color: '#8B5CF6' },
  { name: 'Négociation', value: 28, color: '#F59E0B' },
  { name: 'Signature', value: 18, color: '#10B981' },
];

const campaignData = [
  { name: 'Email Juin', ouverture: 38, conversion: 8 },
  { name: 'SMS Seniors', ouverture: 42, conversion: 12 },
  { name: 'Appels Découverte', ouverture: 85, conversion: 25 },
];

export default function Dashboard() {
  const { user } = useAuth();

  const getMetricsForRole = () => {
    if (user?.role === 'admin') {
      return [
        {
          title: "Chiffre d'affaires",
          value: "€158,420",
          subtitle: "Ce mois",
          icon: DollarSign,
          trend: { value: 12.5, label: "vs mois dernier" },
          color: 'green' as const
        },
        {
          title: "Nouveaux prospects",
          value: "1,247",
          subtitle: "Ce trimestre",
          icon: Users,
          trend: { value: 8.2, label: "vs trimestre dernier" },
          color: 'blue' as const
        },
        {
          title: "Taux de conversion",
          value: "38%",
          subtitle: "Moyenne 12 mois",
          icon: TrendingUp,
          trend: { value: 5.1, label: "amélioration" },
          color: 'purple' as const
        },
        {
          title: "Conversions",
          value: "342",
          subtitle: "Contrats signés",
          icon: Award,
          trend: { value: 15.3, label: "vs objectif" },
          color: 'orange' as const
        }
      ];
    } else if (user?.role === 'manager') {
      return [
        {
          title: "Prospects équipe",
          value: "284",
          subtitle: "En cours",
          icon: Users,
          trend: { value: 6.8, label: "cette semaine" },
          color: 'blue' as const
        },
        {
          title: "CA équipe",
          value: "€89,350",
          subtitle: "Ce mois",
          icon: DollarSign,
          trend: { value: 9.2, label: "vs objectif" },
          color: 'green' as const
        },
        {
          title: "Objectif mensuel",
          value: "78%",
          subtitle: "Atteint",
          icon: Target,
          trend: { value: 12, label: "en avance" },
          color: 'purple' as const
        },
        {
          title: "Performance équipe",
          value: "4.2/5",
          subtitle: "Note moyenne",
          icon: Award,
          color: 'orange' as const
        }
      ];
    } else {
      return [
        {
          title: "Mes prospects",
          value: "47",
          subtitle: "Actifs",
          icon: Users,
          trend: { value: 4.5, label: "cette semaine" },
          color: 'blue' as const
        },
        {
          title: "Mon CA",
          value: "€24,580",
          subtitle: "Ce mois",
          icon: DollarSign,
          trend: { value: 15.2, label: "vs objectif" },
          color: 'green' as const
        },
        {
          title: "Appels planifiés",
          value: "12",
          subtitle: "Cette semaine",
          icon: Phone,
          color: 'purple' as const
        },
        {
          title: "RDV confirmés",
          value: "8",
          subtitle: "Prochains jours",
          icon: Calendar,
          color: 'orange' as const
        }
      ];
    }
  };

  const metrics = getMetricsForRole();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard {user?.role === 'admin' ? 'Administrateur' : user?.role === 'manager' ? 'Manager' : 'Commercial'}
        </h1>
        <p className="text-gray-600 mt-1">
          Vue d'ensemble de votre activité Premunia CRM
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card className="shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Performance mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pipeline Distribution */}
        <Card className="shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Répartition du pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      {(user?.role === 'admin' || user?.role === 'manager') && (
        <Card className="shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              Performance des campagnes récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ouverture" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Taux d'ouverture (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="conversion" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Taux de conversion (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
