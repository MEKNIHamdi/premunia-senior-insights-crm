
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Phone, 
  Video, 
  MapPin, 
  Plus,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { Task, Appointment } from '@/types';

// Mock data
const mockTasks: Task[] = [
  {
    id: '1',
    titre: 'Rappeler Marie Martin',
    description: 'Suivi après envoi de devis',
    statut: 'en_attente',
    priorite: 'haute',
    date_echeance: '2024-06-20T10:00:00Z',
    assignee_id: '1',
    prospect_id: '1',
    created_by: '1',
    created_at: '2024-06-19T14:00:00Z'
  },
  {
    id: '2',
    titre: 'Préparer proposition Paul Bernard',
    description: 'Comparer 3 offres mutuelles selon ses critères',
    statut: 'en_cours',
    priorite: 'moyenne',
    date_echeance: '2024-06-22T16:00:00Z',
    assignee_id: '1',
    prospect_id: '2',
    created_by: '1',
    created_at: '2024-06-19T09:00:00Z'
  }
];

const mockAppointments: Appointment[] = [
  {
    id: '1',
    titre: 'RDV téléphonique - Jean Lefort',
    description: 'Présentation des offres sélectionnées',
    date_debut: '2024-06-21T14:30:00Z',
    date_fin: '2024-06-21T15:30:00Z',
    lieu: '',
    type_rdv: 'appel',
    statut: 'planifie',
    commercial_id: '1',
    prospect_id: '4',
    rappel_minutes: 15,
    created_at: '2024-06-19T11:00:00Z'
  },
  {
    id: '2',
    titre: 'Visite à domicile - Lucie Dubois',
    description: 'Signature contrat mutuelle famille',
    date_debut: '2024-06-25T10:00:00Z',
    date_fin: '2024-06-25T11:30:00Z',
    lieu: '15 rue de la Paix, Lyon',
    type_rdv: 'presentiel',
    statut: 'confirme',
    commercial_id: '1',
    prospect_id: '3',
    rappel_minutes: 30,
    created_at: '2024-06-19T16:00:00Z'
  }
];

const prioriteColors = {
  'basse': 'bg-gray-100 text-gray-800',
  'moyenne': 'bg-blue-100 text-blue-800',
  'haute': 'bg-orange-100 text-orange-800',
  'urgente': 'bg-red-100 text-red-800'
};

const statutTaskColors = {
  'en_attente': 'bg-yellow-100 text-yellow-800',
  'en_cours': 'bg-blue-100 text-blue-800',
  'terminee': 'bg-green-100 text-green-800',
  'annulee': 'bg-gray-100 text-gray-800'
};

const typeRdvIcons = {
  'appel': Phone,
  'visio': Video,
  'presentiel': MapPin,
  'autre': Calendar
};

export default function Pipeline() {
  const [selectedTab, setSelectedTab] = useState('tasks');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
  };

  const getUpcomingTasks = () => {
    return mockTasks.filter(task => 
      task.date_echeance && 
      new Date(task.date_echeance) >= new Date() &&
      task.statut !== 'terminee'
    ).sort((a, b) => 
      new Date(a.date_echeance!).getTime() - new Date(b.date_echeance!).getTime()
    );
  };

  const getOverdueTasks = () => {
    return mockTasks.filter(task => 
      task.date_echeance && 
      isOverdue(task.date_echeance) &&
      task.statut !== 'terminee'
    );
  };

  const getUpcomingAppointments = () => {
    return mockAppointments.filter(apt => 
      new Date(apt.date_debut) >= new Date() &&
      apt.statut !== 'annule'
    ).sort((a, b) => 
      new Date(a.date_debut).getTime() - new Date(b.date_debut).getTime()
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Suivi du Pipeline</h1>
          <p className="text-gray-600 mt-1">
            Gestion des tâches et rendez-vous
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle tâche
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-500">
            <Calendar className="w-4 h-4 mr-2" />
            Nouveau RDV
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Tâches en retard</p>
                <p className="text-2xl font-bold text-orange-600">{getOverdueTasks().length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Tâches à venir</p>
                <p className="text-2xl font-bold text-blue-600">{getUpcomingTasks().length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">RDV à venir</p>
                <p className="text-2xl font-bold text-green-600">{getUpcomingAppointments().length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Aujourd'hui</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockAppointments.filter(apt => isToday(apt.date_debut)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Tâches</TabsTrigger>
          <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          {/* Tâches en retard */}
          {getOverdueTasks().length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-red-800 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Tâches en retard ({getOverdueTasks().length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getOverdueTasks().map((task) => (
                  <div key={task.id} className="bg-white p-4 rounded-lg border border-red-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{task.titre}</h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={prioriteColors[task.priorite]}>
                            {task.priorite}
                          </Badge>
                          <span className="text-sm text-red-600 font-medium">
                            Échéance: {formatDate(task.date_echeance!)}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Prochaines tâches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Prochaines tâches</span>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getUpcomingTasks().map((task) => (
                <div key={task.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.titre}</h4>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={prioriteColors[task.priorite]}>
                          {task.priorite}
                        </Badge>
                        <Badge className={statutTaskColors[task.statut]}>
                          {task.statut.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDate(task.date_echeance!)}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Prochains rendez-vous</span>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getUpcomingAppointments().map((appointment) => {
                const TypeIcon = typeRdvIcons[appointment.type_rdv];
                return (
                  <div key={appointment.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TypeIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{appointment.titre}</h4>
                        {appointment.description && (
                          <p className="text-sm text-gray-600 mt-1">{appointment.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>📅 {formatDate(appointment.date_debut)}</span>
                          {appointment.lieu && (
                            <span>📍 {appointment.lieu}</span>
                          )}
                          <Badge variant="outline" className="capitalize">
                            {appointment.statut}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Vue calendrier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Vue calendrier - À développer</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
