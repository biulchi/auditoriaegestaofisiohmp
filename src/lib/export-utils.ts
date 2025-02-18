import * as XLSX from "xlsx";

export const exportToExcel = (
  data: any[],
  filename: string,
  sheetName: string = "Sheet1",
) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const formatAuditData = (audits: any[]) => {
  return audits.map((audit) => ({
    Data: new Date(audit.date).toLocaleDateString(),
    Hora: audit.time,
    Responsável: audit.responsible,
    Observações: audit.observation || "-",
    "Taxa de Conformidade":
      (
        ([
          ...audit.spo2,
          ...audit.circuit_positioned,
          ...audit.dp_under_15,
          ...audit.vc_6_8,
          ...audit.humidification,
          ...audit.sfa,
          ...audit.assincronia,
          ...audit.cuff_pressure,
        ].filter(Boolean).length /
          [
            ...audit.spo2,
            ...audit.circuit_positioned,
            ...audit.dp_under_15,
            ...audit.vc_6_8,
            ...audit.humidification,
            ...audit.sfa,
            ...audit.assincronia,
            ...audit.cuff_pressure,
          ].length) *
        100
      ).toFixed(1) + "%",
  }));
};

export const formatPhysioData = (indicators: any[]) => {
  return indicators.map((indicator) => ({
    Data: new Date(indicator.date).toLocaleDateString(),
    "Dias VM": indicator.mechanical_ventilation_days,
    "Casos PAV": indicator.vap_cases,
    "Taxa PAV":
      indicator.mechanical_ventilation_days > 0
        ? (
            (indicator.vap_cases / indicator.mechanical_ventilation_days) *
            1000
          ).toFixed(2)
        : "0.00",
    Extubações: indicator.extubations,
    Falhas: indicator.failed_extubations,
    "Taxa Reintubação":
      ((indicator.failed_extubations / indicator.extubations) * 100).toFixed(
        1,
      ) + "%",
    Atendimentos: indicator.physiotherapy_treatments,
    Admissões: indicator.admissions,
    Altas: indicator.discharges,
    "Eventos Adversos": indicator.adverse_events || 0,
    "Úlceras por Pressão": indicator.pressure_ulcers || 0,
    "Adesão Protocolos":
      (indicator.protocol_adherence_rate || 0).toFixed(1) + "%",
    "Mobilização 48h": (indicator.mobilization_48h_rate || 0).toFixed(1) + "%",
  }));
};
