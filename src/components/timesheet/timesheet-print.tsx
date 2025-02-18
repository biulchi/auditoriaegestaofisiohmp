import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import html2pdf from "html2pdf.js";

interface TimesheetRecord {
  id: number;
  employee_id: string;
  employee_name: string;
  date: string;
  entry_time: string;
  exit_time: string | null;
  shift_type: string;
}

interface PrintableTimesheetProps {
  employeeId: string;
  month: number;
  year: number;
}

export function PrintableTimesheet({
  employeeId,
  month,
  year,
}: PrintableTimesheetProps) {
  const [records, setRecords] = useState<TimesheetRecord[]>([]);
  const [employeeData, setEmployeeData] = useState<{
    name: string;
    sector: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch employee data
      const { data: userData } = await supabase
        .from("users")
        .select("employee_name, sector, role")
        .eq("employee_id", employeeId)
        .single();

      if (userData) {
        setEmployeeData({
          name: userData.employee_name,
          sector: userData.sector || "",
          role: userData.role || "",
        });
      }

      // Fetch timesheet records
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const endDate = new Date(year, month, 0).toISOString().split("T")[0];

      const { data: records } = await supabase
        .from("timesheet_records")
        .select("*")
        .eq("employee_id", employeeId)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: true });

      setRecords(records || []);
    };

    fetchData();
  }, [employeeId, month, year]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const monthName = new Date(year, month - 1)
    .toLocaleString("pt-BR", { month: "long" })
    .toUpperCase();

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const opt = {
        margin: 10,
        filename: `folha-ponto-${employeeData?.name}-${monthName}-${year}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf().set(opt).from(contentRef.current).save();
    }
  }, [records, employeeData]);

  return (
    <div ref={contentRef} className="p-8 bg-white">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold mb-2">
          PREFEITURA MUNICIPAL DE PARACATU - MINAS GERAIS
        </h1>
        <h2 className="text-lg font-bold">HOSPITAL MUNICIPAL DE PARACATU</h2>
      </div>

      <h3 className="text-center font-bold mb-4">FOLHA DE PONTO INDIVIDUAL</h3>

      {/* Employee Info */}
      <div className="grid grid-cols-1 gap-2 mb-6 border-b pb-4">
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <span className="font-bold">MATRÍCULA:</span>
          <span>{employeeId}</span>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <span className="font-bold">NOME:</span>
          <span>{employeeData?.name}</span>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <span className="font-bold">SETOR:</span>
          <span>{employeeData?.sector}</span>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <span className="font-bold">FUNÇÃO:</span>
          <span>{employeeData?.role}</span>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <span className="font-bold">PERÍODO:</span>
          <span>
            {monthName}/{year}
          </span>
        </div>
      </div>

      {/* Timesheet Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border">
            <th className="border p-2">DATA</th>
            <th className="border p-2">DIA</th>
            <th className="border p-2">ENTRADA</th>
            <th className="border p-2">SAÍDA</th>
            <th className="border p-2">ENTRADA</th>
            <th className="border p-2">SAÍDA</th>
            <th className="border p-2">HORAS EXTRAS</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(year, month - 1, i + 1);
            const dateStr = date.toISOString().split("T")[0];
            const record = records.find((r) => r.date === dateStr);
            const dayName = date
              .toLocaleDateString("pt-BR", { weekday: "long" })
              .toUpperCase();

            return (
              <tr key={i} className="border">
                <td className="border p-2 text-center">{i + 1}</td>
                <td className="border p-2">{dayName}</td>
                <td className="border p-2 text-center">
                  {record?.entry_time
                    ? new Date(record.entry_time)
                        .toLocaleTimeString()
                        .slice(0, 5)
                    : ""}
                </td>
                <td className="border p-2 text-center">
                  {record?.exit_time
                    ? new Date(record.exit_time)
                        .toLocaleTimeString()
                        .slice(0, 5)
                    : ""}
                </td>
                <td className="border p-2"></td>
                <td className="border p-2"></td>
                <td className="border p-2"></td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border">
            <td colSpan={3} className="border p-2 text-center font-bold">
              HORAS-60
            </td>
            <td colSpan={2} className="border p-2 text-center font-bold">
              PLANTÕES
            </td>
            <td colSpan={2} className="border p-2 text-center font-bold">
              ATESTADOS
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
