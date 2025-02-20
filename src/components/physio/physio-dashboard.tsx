import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/use-toast";
import { exportToExcel, formatPhysioData } from "@/lib/export-utils";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

interface PhysioIndicator {
  id: number;
  date: string;
  mechanical_ventilation_days: number;
  vap_cases: number;
  extubations: number;
  failed_extubations: number;
  physiotherapy_treatments: number;
  admissions: number;
  discharges: number;
  calculated_average_los: number;
  calculated_occupancy_rate: number;
  calculated_weaning_rate: number;
  beds_occupied: number;
  early_mobilization_rate: number;
  reintubation_rate: number;
  vap_rate: number;
}

export function PhysioDashboard() {
  const [indicators, setIndicators] = useState<PhysioIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i,
  );
  const months = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];

  const fetchIndicators = async () => {
    try {
      const { data, error } = await supabase
        .from("physiotherapy_indicators")
        .select("*")
        .eq("month", selectedMonth)
        .eq("year", selectedYear)
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
      setIndicators(data || []);
    } catch (error) {
      console.error("Error fetching indicators:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndicators();
  }, [selectedMonth, selectedYear]);

  const renderIndicatorCard = (
    title: string,
    value: number | string,
    suffix: string = "",
  ) => (
    <Card className="p-4 bg-white shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold mt-1">
        {value}
        {suffix}
      </p>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calcular totais e médias do mês
  const currentData =
    indicators.length > 0
      ? {
          mechanical_ventilation_days:
            indicators.length > 0
              ? indicators.reduce(
                  (sum, i) => sum + i.mechanical_ventilation_days,
                  0,
                ) /
                  indicators.reduce(
                    (sum, i) =>
                      sum + (i.mechanical_ventilation_days > 0 ? 1 : 0),
                    0,
                  ) || 0
              : 0,
          adverse_events: indicators.reduce(
            (sum, i) => sum + (i.adverse_events || 0),
            0,
          ),
          pressure_ulcers: indicators.reduce(
            (sum, i) => sum + (i.pressure_ulcers || 0),
            0,
          ),
          protocol_adherence_rate:
            indicators.reduce(
              (sum, i) => sum + (i.protocol_adherence_rate || 0),
              0,
            ) / (indicators.length || 1),
          mobilization_48h_rate:
            indicators.reduce(
              (sum, i) => sum + (i.mobilization_48h_rate || 0),
              0,
            ) / (indicators.length || 1),
          vap_cases: indicators.reduce((sum, i) => sum + i.vap_cases, 0),
          extubations: indicators.reduce((sum, i) => sum + i.extubations, 0),
          failed_extubations: indicators.reduce(
            (sum, i) => sum + i.failed_extubations,
            0,
          ),
          physiotherapy_treatments: indicators.reduce(
            (sum, i) => sum + i.physiotherapy_treatments,
            0,
          ),
          admissions: indicators.reduce((sum, i) => sum + i.admissions, 0),
          discharges: indicators.reduce((sum, i) => sum + i.discharges, 0),
          calculated_average_los:
            indicators.reduce((sum, i) => sum + i.calculated_average_los, 0) /
            (indicators.length || 1),
          calculated_occupancy_rate:
            indicators.reduce(
              (sum, i) => sum + i.calculated_occupancy_rate,
              0,
            ) / (indicators.length || 1),
          calculated_weaning_rate:
            indicators.reduce((sum, i) => sum + i.calculated_weaning_rate, 0) /
            (indicators.length || 1),
          beds_occupied:
            indicators.reduce((sum, i) => sum + i.beds_occupied, 0) /
            (indicators.length || 1),
          early_mobilization_rate:
            (indicators.reduce((sum, i) => sum + i.early_mobilization_rate, 0) /
              indicators.reduce((sum, i) => sum + i.admissions, 0)) *
              100 || 0,
          reintubation_rate:
            (indicators.reduce((sum, i) => sum + i.failed_extubations, 0) /
              indicators.reduce((sum, i) => sum + i.extubations, 0)) *
              100 || 0,
          vap_rate:
            (indicators.reduce((sum, i) => sum + i.vap_cases, 0) /
              indicators.reduce(
                (sum, i) => sum + i.mechanical_ventilation_days,
                0,
              )) *
              1000 || 0,
        }
      : {
          mechanical_ventilation_days: 0,
          vap_cases: 0,
          extubations: 0,
          failed_extubations: 0,
          physiotherapy_treatments: 0,
          admissions: 0,
          discharges: 0,
          calculated_average_los: 0,
          calculated_occupancy_rate: 0,
          calculated_weaning_rate: 0,
          beds_occupied: 0,
          early_mobilization_rate: 0,
          reintubation_rate: 0,
          vap_rate: 0,
          adverse_events: 0,
          pressure_ulcers: 0,
          protocol_adherence_rate: 0,
          mobilization_48h_rate: 0,
        };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex gap-4 items-center">
          <div className="space-y-2 flex-1">
            <Label>Mês</Label>
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 flex-1">
            <Label>Ano</Label>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 self-end">
            <ConfirmDialog
              title="Resetar Dados"
              description="Tem certeza que deseja apagar todos os dados de indicadores? Esta ação não pode ser desfeita."
              trigger={
                <Button variant="outline" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Resetar Dados
                </Button>
              }
              onConfirm={async () => {
                try {
                  const { error } = await supabase
                    .from("physiotherapy_indicators")
                    .delete()
                    .neq("id", 0);
                  if (error) throw error;
                  await fetchIndicators();
                  toast({
                    title: "Dados resetados com sucesso",
                    description: "Todos os dados de indicadores foram apagados",
                  });
                } catch (error) {
                  console.error("Error resetting data:", error);
                  toast({
                    title: "Erro ao resetar dados",
                    description: "Ocorreu um erro ao tentar apagar os dados",
                    variant: "destructive",
                  });
                }
              }}
            />
            <Button
              onClick={() => {
                const exportData = formatPhysioData(indicators);
                exportToExcel(
                  exportData,
                  `indicadores-fisio-${months[selectedMonth - 1].label}-${selectedYear}`,
                  "Indicadores Fisio",
                );
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            Taxa de PAV e Mobilização Precoce
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={indicators}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="vap_rate"
                  name="Taxa de PAV"
                  stroke="#ef4444"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="early_mobilization_rate"
                  name="Taxa Mobilização"
                  stroke="#22c55e"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Extubações e Falhas</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={indicators}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="extubations" name="Extubações" fill="#3b82f6" />
                <Bar
                  dataKey="failed_extubations"
                  name="Falhas"
                  fill="#f97316"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Admissões e Altas</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={indicators}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="admissions" name="Admissões" fill="#0ea5e9" />
                <Bar dataKey="discharges" name="Altas" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderIndicatorCard("Eventos Adversos", currentData.adverse_events)}
        {renderIndicatorCard(
          "Úlceras por Pressão",
          currentData.pressure_ulcers,
        )}
        {renderIndicatorCard(
          "Adesão a Protocolos",
          currentData.protocol_adherence_rate.toFixed(1),
          "%",
        )}
        {renderIndicatorCard(
          "Mobilização em 48h",
          currentData.mobilization_48h_rate.toFixed(1),
          "%",
        )}
        {renderIndicatorCard(
          "Dias de Ventilação Mecânica",
          currentData.mechanical_ventilation_days,
          " dias",
        )}
        {renderIndicatorCard("Casos de PAV", currentData.vap_cases)}
        {renderIndicatorCard(
          "Taxa de PAV",
          currentData.vap_rate.toFixed(2),
          "/1000 dias-VM",
        )}
        {renderIndicatorCard("Extubações", currentData.extubations)}
        {renderIndicatorCard(
          "Falhas de Extubação",
          currentData.failed_extubations,
        )}
        {renderIndicatorCard(
          "Taxa de Reintubação",
          currentData.reintubation_rate.toFixed(2),
          "%",
        )}
        {renderIndicatorCard(
          "Atendimentos de Fisioterapia",
          currentData.physiotherapy_treatments,
        )}
        {renderIndicatorCard("Admissões", currentData.admissions)}
        {renderIndicatorCard("Altas", currentData.discharges)}
        {renderIndicatorCard(
          "Tempo Médio de Internação",
          currentData.calculated_average_los.toFixed(1),
          " dias",
        )}
        {renderIndicatorCard(
          "Taxa de Ocupação",
          currentData.calculated_occupancy_rate.toFixed(1),
          "%",
        )}
        {renderIndicatorCard(
          "Taxa de Desmame Bem-sucedido",
          currentData.calculated_weaning_rate.toFixed(1),
          "%",
        )}
        {renderIndicatorCard(
          "Taxa de Mobilização Precoce",
          currentData.early_mobilization_rate.toFixed(1),
          "%",
        )}
      </div>
    </div>
  );
}
