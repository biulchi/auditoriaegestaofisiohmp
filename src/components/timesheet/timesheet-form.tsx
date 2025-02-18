import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useAuth } from "@/lib/auth";

export function TimesheetForm() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [shiftType, setShiftType] = useState("12h");
  const { userId } = useAuth();
  const [employeeData, setEmployeeData] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [lastRecord, setLastRecord] = useState<any>(null);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!userId) return;

      const { data } = await supabase
        .from("users")
        .select("employee_id, employee_name")
        .eq("employee_id", userId)
        .single();

      if (data) {
        setEmployeeData({
          id: data.employee_id,
          name: data.employee_name,
        });
      }
    };

    fetchEmployeeData();
  }, [userId]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch last record
  useEffect(() => {
    const fetchLastRecord = async () => {
      if (!employeeData?.id) return;

      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("timesheet_records")
        .select("*")
        .eq("employee_id", employeeData.id)
        .eq("date", today)
        .single();

      setLastRecord(data);
    };

    fetchLastRecord();
  }, [employeeData?.id]);

  useKeyboardShortcuts([
    {
      key: "Enter",
      ctrlKey: true,
      handler: () => {
        if (!lastRecord?.exit_time) {
          handleSubmit(new Event("submit") as any);
        }
      },
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeData?.id) {
      alert("Erro: Dados do funcionário não encontrados");
      return;
    }

    try {
      // Get geolocation
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          if (!navigator.geolocation) {
            reject("Geolocalização não suportada");
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject);
        },
      );

      const { latitude, longitude } = position.coords;
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      if (lastRecord) {
        // Registrar saída
        if (!lastRecord.exit_time) {
          const entryTime = new Date(lastRecord.entry_time);
          const totalHours =
            (now.getTime() - entryTime.getTime()) / (1000 * 60 * 60);

          const { error } = await supabase
            .from("timesheet_records")
            .update({
              exit_time: now.toISOString(),
              total_hours: parseFloat(totalHours.toFixed(2)),
              latitude,
              longitude,
            })
            .eq("id", lastRecord.id);

          if (error) throw error;
          alert("Saída registrada com sucesso!");
          window.location.reload();
        } else {
          alert("Você já registrou entrada e saída hoje!");
        }
      } else {
        // Registrar entrada
        const { error } = await supabase.from("timesheet_records").insert({
          employee_id: employeeData.id,
          employee_name: employeeData.name,
          date: today,
          entry_time: now.toISOString(),
          shift_type: shiftType,
          latitude,
          longitude,
        });

        if (error) throw error;
        alert("Entrada registrada com sucesso!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Erro ao registrar ponto");
    }
  };

  return (
    <Card className="p-6 max-w-xl mx-auto bg-white shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center text-4xl font-mono mb-4">
          {currentTime.toLocaleTimeString("pt-BR")}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <div className="p-2 bg-gray-100 rounded">{employeeData?.name}</div>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Plantão</Label>
            <RadioGroup
              value={shiftType}
              onValueChange={setShiftType}
              className="flex gap-4"
              disabled={!!lastRecord}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6h" id="6h" />
                <Label htmlFor="6h">6 horas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12h" id="12h" />
                <Label htmlFor="12h">12 horas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24h" id="24h" />
                <Label htmlFor="24h">24 horas</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center text-sm text-gray-500">
            {lastRecord && !lastRecord.exit_time ? (
              <p>
                Último registro: Entrada às{" "}
                {new Date(lastRecord.entry_time).toLocaleTimeString()}
              </p>
            ) : lastRecord?.exit_time ? (
              <p>Ponto do dia finalizado</p>
            ) : (
              <p>Nenhum registro hoje</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={lastRecord?.exit_time}
          >
            {lastRecord && !lastRecord.exit_time
              ? "Registrar Saída"
              : "Registrar Entrada"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
