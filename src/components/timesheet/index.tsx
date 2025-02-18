import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimesheetForm } from "./timesheet-form";
import { TimesheetDashboard } from "./timesheet-dashboard";
import { TimesheetPersonal } from "./timesheet-personal";
import { Header } from "@/components/header";
import { useAuth } from "@/lib/auth";

export function TimesheetSystem() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
          Sistema de Ponto Eletrônico
        </h1>

        <Tabs defaultValue="form" className="space-y-6">
          <TabsList>
            <TabsTrigger value="form">Registrar Ponto</TabsTrigger>
            <TabsTrigger value="personal">Meu Relatório</TabsTrigger>
            {useAuth().userRole === "admin" && (
              <TabsTrigger value="dashboard">Relatório Geral</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="form">
            <TimesheetForm />
          </TabsContent>

          <TabsContent value="personal">
            <TimesheetPersonal />
          </TabsContent>

          <TabsContent value="dashboard">
            <TimesheetDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
