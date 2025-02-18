import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export function PhysioForm() {
  const [date, setDate] = useState("");
  const [data, setData] = useState({
    mechanical_ventilation_days: 0,
    vap_cases: 0,
    extubations: 0,
    failed_extubations: 0,
    physiotherapy_treatments: 0,
    admissions: 0,
    discharges: 0,
    early_mobilization_rate: 0,
    adverse_events: 0,
    pressure_ulcers: 0,
    protocol_adherence_rate: 0,
    mobilization_48h_rate: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;

    try {
      const formData = {
        date,
        month,
        year,
        mechanical_ventilation_days: parseInt(
          data.mechanical_ventilation_days.toString(),
        ),
        vap_cases: parseInt(data.vap_cases.toString()),
        extubations: parseInt(data.extubations.toString()),
        failed_extubations: parseInt(data.failed_extubations.toString()),
        physiotherapy_treatments: parseInt(
          data.physiotherapy_treatments.toString(),
        ),
        admissions: parseInt(data.admissions.toString()),
        discharges: parseInt(data.discharges.toString()),
        early_mobilization_rate: parseFloat(
          data.early_mobilization_rate.toString(),
        ),
      };

      console.log("Submitting data:", formData);

      const { error } = await supabase
        .from("physiotherapy_indicators")
        .insert(formData);

      if (error) {
        console.error("Error details:", error);
        throw error;
      }

      // Reset form
      setDate("");
      setData({
        mechanical_ventilation_days: 0,
        vap_cases: 0,
        extubations: 0,
        failed_extubations: 0,
        physiotherapy_treatments: 0,
        admissions: 0,
        discharges: 0,
        early_mobilization_rate: 0,
      });

      alert("Dados salvos com sucesso!");
    } catch (error) {
      console.error("Error inserting data:", error);
      alert("Erro ao salvar dados");
    }
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto bg-white shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="date">Data do Registro</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mv_days">Dias de Ventilação Mecânica</Label>
            <Input
              id="mv_days"
              type="number"
              value={data.mechanical_ventilation_days}
              onChange={(e) =>
                setData({
                  ...data,
                  mechanical_ventilation_days: parseInt(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vap">Casos de PAV</Label>
            <Input
              id="vap"
              type="number"
              value={data.vap_cases}
              onChange={(e) =>
                setData({ ...data, vap_cases: parseInt(e.target.value) })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extubations">Número de Extubações</Label>
            <Input
              id="extubations"
              type="number"
              value={data.extubations}
              onChange={(e) =>
                setData({ ...data, extubations: parseInt(e.target.value) })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="failed_extubations">Falhas de Extubação</Label>
            <Input
              id="failed_extubations"
              type="number"
              value={data.failed_extubations}
              onChange={(e) =>
                setData({
                  ...data,
                  failed_extubations: parseInt(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatments">Atendimentos de Fisioterapia</Label>
            <Input
              id="treatments"
              type="number"
              value={data.physiotherapy_treatments}
              onChange={(e) =>
                setData({
                  ...data,
                  physiotherapy_treatments: parseInt(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admissions">Admissões</Label>
            <Input
              id="admissions"
              type="number"
              value={data.admissions}
              onChange={(e) =>
                setData({ ...data, admissions: parseInt(e.target.value) })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discharges">Altas</Label>
            <Input
              id="discharges"
              type="number"
              value={data.discharges}
              onChange={(e) =>
                setData({ ...data, discharges: parseInt(e.target.value) })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobilization">
              Taxa de Mobilização Precoce (%)
            </Label>
            <Input
              id="mobilization"
              type="number"
              step="0.01"
              value={data.early_mobilization_rate}
              onChange={(e) =>
                setData({
                  ...data,
                  early_mobilization_rate: parseFloat(e.target.value),
                })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adverse_events">
            Eventos Adversos durante Fisioterapia
          </Label>
          <Input
            id="adverse_events"
            type="number"
            value={data.adverse_events}
            onChange={(e) =>
              setData({
                ...data,
                adverse_events: parseInt(e.target.value),
              })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pressure_ulcers">
            Úlceras por Pressão (Imobilidade)
          </Label>
          <Input
            id="pressure_ulcers"
            type="number"
            value={data.pressure_ulcers}
            onChange={(e) =>
              setData({
                ...data,
                pressure_ulcers: parseInt(e.target.value),
              })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="protocol_adherence">
            Taxa de Adesão a Protocolos (%)
          </Label>
          <Input
            id="protocol_adherence"
            type="number"
            step="0.01"
            value={data.protocol_adherence_rate}
            onChange={(e) =>
              setData({
                ...data,
                protocol_adherence_rate: parseFloat(e.target.value),
              })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobilization_48h">
            Taxa de Mobilização em 48h (%)
          </Label>
          <Input
            id="mobilization_48h"
            type="number"
            step="0.01"
            value={data.mobilization_48h_rate}
            onChange={(e) =>
              setData({
                ...data,
                mobilization_48h_rate: parseFloat(e.target.value),
              })
            }
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Salvar Indicadores
        </Button>
      </form>
    </Card>
  );
}
