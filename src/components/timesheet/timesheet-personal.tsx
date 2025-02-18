import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

interface TimesheetRecord {
  id: number;
  employee_id: string;
  employee_name: string;
  date: string;
  entry_time: string;
  exit_time: string | null;
  shift_type: string;
  total_hours: number | null;
}

export function TimesheetPersonal() {
  const [records, setRecords] = useState<TimesheetRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

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

  const fetchRecords = async () => {
    try {
      const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;
      const endDate = new Date(selectedYear, selectedMonth, 0)
        .toISOString()
        .split("T")[0];

      const { data, error } = await supabase
        .from("timesheet_records")
        .select("*")
        .eq("employee_id", userId)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedMonth, selectedYear]);

  const totalHours = records
    .filter((record) => record.total_hours)
    .reduce((sum, record) => sum + (record.total_hours || 0), 0);

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
        </div>
      </Card>

      <Card className="p-6 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Meus Registros</h2>
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold">
              Total de Horas: {totalHours.toFixed(2)}
            </div>
            <Button
              onClick={() =>
                window.open(`/print/${selectedYear}/${selectedMonth}`, "_blank")
              }
              variant="outline"
            >
              Imprimir Folha de Ponto
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Data</th>
                <th className="text-left p-2">Entrada</th>
                <th className="text-left p-2">Saída</th>
                <th className="text-left p-2">Plantão</th>
                <th className="text-left p-2">Horas</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    {new Date(record.entry_time).toLocaleTimeString()}
                  </td>
                  <td className="p-2">
                    {record.exit_time
                      ? new Date(record.exit_time).toLocaleTimeString()
                      : "-"}
                  </td>
                  <td className="p-2">{record.shift_type}</td>
                  <td className="p-2">
                    {record.total_hours ? record.total_hours.toFixed(2) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
