
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ObjectivesWidget } from "@/components/dashboard/ObjectivesWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { 
  Users, 
  TrendingUp, 
  Calendar,
  Phone,
  Mail,
  Target,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  // Données simulées pour la démo
  const stats = {
    prospects: 156,
    conversions: 23,
    rdvPlanifies: 12,
    tauxConversion: 14.7
  };

  const recentActivities = [
    {
      id: 1,
      type: 'prospect',
      title: 'Nouveau prospect ajouté',
      description: 'Marie Dubois - Mutuelle famille',
      time: 'Il y a 2h',
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      type: 'rdv',
      title: 'RDV confirmé',
      description: 'Jean Martin - Demain 14h30',
      time: 'Il y a 3h',
      icon: Calendar,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 3,
      type: 'email',
      title: 'Email de suivi envoyé',
      description: 'Relance automatique prospects',
      time: 'Il y a 5h',
      icon: Mail,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 4,
      type: 'conversion',
      title: 'Nouvelle conversion',
      description: 'Sophie Laurent - Contrat signé',
      time: 'Hier',
      icon: TrendingUp,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  const tasks = [
    {
      id: 1,
      title: 'Rappeler M. Durand',
      priority: 'high',
      dueDate: 'Aujourd\'hui 15h',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Préparer devis Mme Bernard',
      priority: 'medium',
      dueDate: 'Demain',
      status: 'in_progress'
    },
    {
      id: 3,
      title: 'Relance prospects inactifs',
      priority: 'low',
      dueDate: 'Cette semaine',
      status: 'pending'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <AlertCircle className="h-4 w-4 text-orange-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour {user?.name?.split(' ')[0] || 'Utilisateur'} 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Voici un aperçu de votre activité commerciale
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {user?.role === 'admin' ? 'Administrateur' : 
             user?.role === 'manager' ? 'Manager' : 'Commercial'}
          </Badge>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Prospects"
          value={stats.prospects}
          change="+12%"
          trend="up"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Conversions"
          value={stats.conversions}
          change="+8%"
          trend="up"
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title="RDV planifiés"
          value={stats.rdvPlanifies}
          change="+3"
          trend="up"
          icon={Calendar}
          color="purple"
        />
        <MetricCard
          title="Taux conversion"
          value={`${stats.tauxConversion}%`}
          change="+2.1%"
          trend="up"
          icon={Target}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Objectifs du mois - Visible pour tous les rôles */}
        <div className="lg:col-span-1">
          <ObjectivesWidget />
        </div>

        {/* Activité récente */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>
                Dernières actions et événements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${activity.color}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tâches à faire */}
        <Card>
          <CardHeader>
            <CardTitle>Tâches à faire</CardTitle>
            <CardDescription>
              Vos tâches prioritaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.dueDate}</p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority === 'high' ? 'Urgent' : 
                     task.priority === 'medium' ? 'Moyen' : 'Faible'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prochains RDV */}
        <Card>
          <CardHeader>
            <CardTitle>Prochains rendez-vous</CardTitle>
            <CardDescription>
              Planning des prochains jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Jean Martin</p>
                    <p className="text-sm text-gray-600">Demain 14h30 - Appel téléphonique</p>
                  </div>
                </div>
                <Badge variant="outline">Confirmé</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 text-green-600 rounded-full">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Sophie Bernard</p>
                    <p className="text-sm text-gray-600">Jeudi 10h00 - Visioconférence</p>
                  </div>
                </div>
                <Badge variant="outline">Planifié</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Famille Dubois</p>
                    <p className="text-sm text-gray-600">Vendredi 16h00 - Rendez-vous bureau</p>
                  </div>
                </div>
                <Badge variant="outline">Confirmé</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
