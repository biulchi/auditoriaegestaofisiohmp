import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { exportToExcel, formatAuditData } from "@/lib/export-utils";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

interface Audit {
  id: number;
  date: string;
  time: string;
  responsible: string;
  observation: string;
  created_at: string;
  spo2: boolean[];
  circuit_positioned: boolean[];
  dp_under_15: boolean[];
  vc_6_8: boolean[];
  humidification: boolean[];
  sfa: boolean[];
  assincronia: boolean[];
  cuff_pressure: boolean[];
}

export function AuditDashboard() {
  const [audits, setAudits] = useState<Audit[]>([]);
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

  const fetchAudits = async () => {
    try {
      const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;
      const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${new Date(selectedYear, selectedMonth, 0).getDate()}`;

      const { data, error } = await supabase
        .from("mechanical_ventilation_audits")
        .select("*")
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: false });

      if (error) throw error;
      setAudits(data || []);
    } catch (error) {
      console.error("Error fetching audits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, [selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          <Button
            onClick={() => {
              const exportData = formatAuditData(audits);
              exportToExcel(
                exportData,
                `auditoria-vm-${months[selectedMonth - 1].label}-${selectedYear}`,
                "Auditoria VM",
              );
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-white shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Últimas Auditorias</h2>
        {audits.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            Nenhuma auditoria encontrada
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Data</th>
                  <th className="text-left p-2">Hora</th>
                  <th className="text-left p-2">Responsável</th>
                  <th className="text-left p-2">Observações</th>
                  <th className="text-left p-2">Conformidade</th>
                </tr>
              </thead>
              <tbody>
                {audits.map((audit) => {
                  const totalChecks = [
                    ...audit.spo2,
                    ...audit.circuit_positioned,
                    ...audit.dp_under_15,
                    ...audit.vc_6_8,
                    ...audit.humidification,
                    ...audit.sfa,
                    ...audit.assincronia,
                    ...audit.cuff_pressure,
                  ].filter(Boolean).length;

                  const totalItems = [
                    ...audit.spo2,
                    ...audit.circuit_positioned,
                    ...audit.dp_under_15,
                    ...audit.vc_6_8,
                    ...audit.humidification,
                    ...audit.sfa,
                    ...audit.assincronia,
                    ...audit.cuff_pressure,
                  ].length;

                  const conformityPercentage = (totalChecks / totalItems) * 100;

                  return (
                    <tr key={audit.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        {new Date(audit.date).toLocaleDateString()}
                      </td>
                      <td className="p-2">{audit.time}</td>
                      <td className="p-2">{audit.responsible}</td>
                      <td className="p-2">{audit.observation || "-"}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${conformityPercentage >= 70 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {conformityPercentage.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Conformidade por Item</h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>≥ 70%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>{"< 70%"}</span>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              { key: "spo2", label: "SPO2" },
              { key: "circuit_positioned", label: "Circuito Posicionado" },
              { key: "dp_under_15", label: "DP < 15" },
              { key: "vc_6_8", label: "VC 6-8" },
              { key: "humidification", label: "Umidificação" },
              { key: "sfa", label: "SFA" },
              { key: "assincronia", label: "Assincronia" },
              { key: "cuff_pressure", label: "Pressão do Cuff" },
            ].map(({ key, label }) => {
              const totalChecks = audits.reduce(
                (sum, audit) =>
                  sum +
                  (audit[key as keyof Audit] as boolean[]).filter(Boolean)
                    .length,
                0,
              );
              const totalItems = audits.reduce(
                (sum, audit) =>
                  sum + (audit[key as keyof Audit] as boolean[]).length,
                0,
              );
              const conformityPercentage =
                totalItems > 0 ? (totalChecks / totalItems) * 100 : 0;

              return (
                <Card
                  key={key}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{label}</span>
                      <span
                        className={`text-sm font-bold ${conformityPercentage >= 70 ? "text-green-600" : "text-red-600"}`}
                      >
                        {conformityPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ease-in-out ${conformityPercentage >= 70 ? "bg-green-500" : "bg-red-500"}`}
                        style={{ width: `${conformityPercentage}%` }}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Conformidade por Leito</h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>≥ 70%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>{"< 70%"}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 16 }, (_, bedIndex) => {
              const totalChecks = audits.reduce((sum, audit) => {
                const bedChecks = [
                  audit.spo2[bedIndex],
                  audit.circuit_positioned[bedIndex],
                  audit.dp_under_15[bedIndex],
                  audit.vc_6_8[bedIndex],
                  audit.humidification[bedIndex],
                  audit.sfa[bedIndex],
                  audit.assincronia[bedIndex],
                  audit.cuff_pressure[bedIndex],
                ].filter(Boolean).length;
                return sum + bedChecks;
              }, 0);

              const totalPossibleChecks = audits.length * 8; // 8 items per bed
              const conformityPercentage =
                totalPossibleChecks > 0
                  ? (totalChecks / totalPossibleChecks) * 100
                  : 0;

              return (
                <Card
                  key={bedIndex}
                  className={`p-4 hover:shadow-md transition-shadow ${conformityPercentage >= 70 ? "border-green-200" : "border-red-200"}`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Leito {bedIndex + 1}</span>
                      <span
                        className={`text-sm font-bold ${conformityPercentage >= 70 ? "text-green-600" : "text-red-600"}`}
                      >
                        {conformityPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ease-in-out ${conformityPercentage >= 70 ? "bg-green-500" : "bg-red-500"}`}
                        style={{ width: `${conformityPercentage}%` }}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
