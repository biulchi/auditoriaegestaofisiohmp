import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuditForm } from "./audit-form";
import { AuditDashboard } from "./audit-dashboard";

import { Header } from "@/components/header";

export function AuditSystem() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
          Sistema de Auditoria em Ventilação Mecânica
        </h1>

        <Tabs defaultValue="form" className="space-y-6">
          <TabsList>
            <TabsTrigger value="form">Novo Registro</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <AuditForm />
          </TabsContent>

          <TabsContent value="dashboard">
            <AuditDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
