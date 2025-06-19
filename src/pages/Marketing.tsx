
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Bot, Target, BarChart3, Settings, Zap } from 'lucide-react';
import { AutomationScenarios } from '@/components/marketing/AutomationScenarios';
import { EmailTemplates } from '@/components/marketing/EmailTemplates';
import { MarketingReporting } from '@/components/marketing/MarketingReporting';
import { ObjectivesManagement } from '@/components/marketing/ObjectivesManagement';

export default function Marketing() {
  const [activeTab, setActiveTab] = useState('automation');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Automation</h1>
          <p className="text-gray-600 mt-2">
            Automatisation marketing avancée pour prospects et clients
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="automation" className="flex items-center space-x-2">
            <Bot className="h-4 w-4" />
            <span>Scénarios</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="objectives" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Objectifs</span>
          </TabsTrigger>
          <TabsTrigger value="reporting" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Reporting</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="automation" className="space-y-6">
          <AutomationScenarios />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <EmailTemplates />
        </TabsContent>

        <TabsContent value="objectives" className="space-y-6">
          <ObjectivesManagement />
        </TabsContent>

        <TabsContent value="reporting" className="space-y-6">
          <MarketingReporting />
        </TabsContent>
      </Tabs>
    </div>
  );
}
