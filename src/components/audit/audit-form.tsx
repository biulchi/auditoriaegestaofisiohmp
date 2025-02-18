import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

const ITEMS = [
  "SPO2",
  "Circuito Posicionado",
  "DP < 15",
  "VC 6-8",
  "Umidificação",
  "SFA",
  "Assincronia",
  "Pressão do Cuff",
];

export function AuditForm() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );
  const [responsible, setResponsible] = useState("");
  const [observation, setObservation] = useState("");
  const [checks, setChecks] = useState<{ [key: string]: boolean[] }>(
    ITEMS.reduce(
      (acc, item) => ({
        ...acc,
        [item.toLowerCase().replace(/ /g, "_")]: Array(16).fill(false),
      }),
      {},
    ),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("mechanical_ventilation_audits")
        .insert({
          date,
          time,
          responsible,
          observation,
          spo2: checks.spo2,
          circuit_positioned: checks.circuito_posicionado,
          dp_under_15: checks["dp_<_15"],
          vc_6_8: checks["vc_6-8"],
          humidification: checks.umidificação,
          sfa: checks.sfa,
          assincronia: checks.assincronia,
          cuff_pressure: checks.pressão_do_cuff,
        });

      if (error) throw error;

      // Reset form
      setDate("");
      setTime("");
      setResponsible("");
      setObservation("");
      setChecks(
        ITEMS.reduce(
          (acc, item) => ({
            ...acc,
            [item.toLowerCase().replace(/ /g, "_")]: Array(16).fill(false),
          }),
          {},
        ),
      );
    } catch (error) {
      console.error("Error inserting audit:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-sm rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Hora</Label>
            <Input
              id="time"
              type="time"
              value={time}
              readOnly
              className="bg-gray-50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável</Label>
            <Input
              id="responsible"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="border rounded-lg p-4 overflow-x-auto">
          <div className="flex flex-col space-y-4 md:space-y-0">
            {Array.from({ length: 16 }, (_, bedIndex) => (
              <div key={bedIndex} className="border-b pb-4 last:border-b-0">
                <h3 className="font-medium mb-3">Leito {bedIndex + 1}</h3>
                <div className="space-y-3">
                  {ITEMS.map((item) => (
                    <div
                      key={item}
                      className="flex justify-between items-center"
                    >
                      <span className="w-1/2">{item}</span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={
                            checks[item.toLowerCase().replace(/ /g, "_")][
                              bedIndex
                            ]
                              ? "default"
                              : "outline"
                          }
                          className={`w-16 ${checks[item.toLowerCase().replace(/ /g, "_")][bedIndex] ? "bg-green-500 hover:bg-green-600" : ""}`}
                          onClick={() => {
                            const newChecks = { ...checks };
                            newChecks[item.toLowerCase().replace(/ /g, "_")][
                              bedIndex
                            ] = true;
                            setChecks(newChecks);
                          }}
                        >
                          Sim
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={
                            !checks[item.toLowerCase().replace(/ /g, "_")][
                              bedIndex
                            ]
                              ? "default"
                              : "outline"
                          }
                          className={`w-16 ${!checks[item.toLowerCase().replace(/ /g, "_")][bedIndex] ? "bg-red-500 hover:bg-red-600" : ""}`}
                          onClick={() => {
                            const newChecks = { ...checks };
                            newChecks[item.toLowerCase().replace(/ /g, "_")][
                              bedIndex
                            ] = false;
                            setChecks(newChecks);
                          }}
                        >
                          Não
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="observation">Observações</Label>
          <Textarea
            id="observation"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full">
          Salvar Auditoria
        </Button>
      </form>
    </div>
  );
}
