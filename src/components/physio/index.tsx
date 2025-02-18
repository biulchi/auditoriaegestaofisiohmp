import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhysioForm } from "./physio-form";
import { PhysioDashboard } from "./physio-dashboard";
import { Header } from "@/components/header";

export function PhysioSystem() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
          Gestão de Fisioterapia
        </h1>

        <Tabs defaultValue="form" className="space-y-6">
          <TabsList>
            <TabsTrigger value="form">Novo Registro</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <PhysioForm />
          </TabsContent>

          <TabsContent value="dashboard">
            <PhysioDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
