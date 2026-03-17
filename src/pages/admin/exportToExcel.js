// ─────────────────────────────────────────────────────────────────────────────
// exportToExcel.js  —  Reemplaza la función anterior en AdminPaymentsReport.jsx
//
// Dependencia:  npm install exceljs
// ─────────────────────────────────────────────────────────────────────────────

import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // npm install file-saver

// ── Paleta ────────────────────────────────────────────────────────────────────
const C = {
  navy:      "FF0F172A",
  header_bg: "FF1E293B",
  indigo:    "FF6366F1",
  indigo_lt: "FFEEF2FF",
  green:     "FF059669",
  green_lt:  "FFDCFCE7",
  amber:     "FFD97706",
  amber_lt:  "FFFEF3C7",
  red:       "FFDC2626",
  red_lt:    "FFFEE2E2",
  slate:     "FF475569",
  slate_lt:  "FFF8FAFC",
  row_alt:   "FFF0F4FF",
  white:     "FFFFFFFF",
  border:    "FFE2E8F0",
  teal:      "FF0D9488",
  teal_lt:   "FFCCFBF1",
  purple:    "FF7C3AED",
  purple_lt: "FFEDE9FE",
};

const METHOD_COLORS = {
  QR:                    C.indigo,
  TARJETA:               "FF0EA5E9",
  TRANSFERENCIA_BANCARIA: C.green,
  SALDO:                 C.amber,
  MIXTO:                 C.purple,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const solidFill  = (argb) => ({ type: "pattern", pattern: "solid", fgColor: { argb } });
const fnt        = (opts = {}) => ({
  name: "Arial",
  size: opts.size ?? 9,
  bold: opts.bold ?? false,
  italic: opts.italic ?? false,
  color: { argb: opts.color ?? C.navy.replace("FF","FF") },
});
const aln = (horizontal = "left", vertical = "middle", wrapText = false) =>
  ({ horizontal, vertical, wrapText });

const thinBorder = (argb = C.border) => {
  const s = { style: "thin", color: { argb } };
  return { top: s, left: s, bottom: s, right: s };
};

const ESTADO_STYLE = {
  COMPLETADO: { font: C.green,  fill: C.green_lt },
  PENDIENTE:  { font: C.amber,  fill: C.amber_lt },
  CANCELADO:  { font: C.red,    fill: C.red_lt   },
};

// ── Formats ───────────────────────────────────────────────────────────────────
const FMT_MONEY = '#,##0.00';
const FMT_DATE  = 'DD/MM/YYYY';
const FMT_TIME  = 'HH:MM';
const FMT_PCT   = '0.0%';

// ── Section heading helper ────────────────────────────────────────────────────
function sectionHeading(ws, row, startCol, endCol, text, bgArgb = C.indigo) {
  ws.mergeCells(row, startCol, row, endCol);
  const cell = ws.getCell(row, startCol);
  cell.value       = `  ${text}`;
  cell.font        = fnt({ bold: true, color: C.white, size: 10 });
  cell.fill        = solidFill(bgArgb);
  cell.alignment   = aln("left");
  ws.getRow(row).height = 22;
}

// ── KPI card (3 rows: accent strip, label, value) ─────────────────────────────
function kpiCard(ws, startRow, startCol, endCol, label, value, accentArgb, bgArgb, valArgb) {
  // Accent strip
  ws.mergeCells(startRow, startCol, startRow, endCol);
  ws.getCell(startRow, startCol).fill = solidFill(accentArgb);
  ws.getRow(startRow).height = 6;

  // Label
  ws.mergeCells(startRow + 1, startCol, startRow + 1, endCol);
  const lbl = ws.getCell(startRow + 1, startCol);
  lbl.value     = label;
  lbl.font      = fnt({ bold: true, color: C.slate, size: 9 });
  lbl.fill      = solidFill(bgArgb);
  lbl.alignment = aln("center");
  ws.getRow(startRow + 1).height = 20;

  // Value
  ws.mergeCells(startRow + 2, startCol, startRow + 2, endCol);
  const val = ws.getCell(startRow + 2, startCol);
  val.value     = value;
  val.font      = fnt({ bold: true, color: valArgb ?? accentArgb, size: 14 });
  val.fill      = solidFill(bgArgb);
  val.alignment = aln("center");
  ws.getRow(startRow + 2).height = 28;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
export async function exportToExcel(payments, stats) {
  const wb = new ExcelJS.Workbook();
  wb.creator  = "Plataforma Educativa";
  wb.created  = new Date();
  wb.modified = new Date();

  // ──────────────────────────────────────────────────────────────────────────
  // SHEET 1 — DASHBOARD
  // ──────────────────────────────────────────────────────────────────────────
  const ws1 = wb.addWorksheet("📊 Dashboard", { views: [{ showGridLines: false }] });

  ws1.columns = [
    { key: "gap1", width: 2 },
    { key: "B",    width: 22 },
    { key: "C",    width: 18 },
    { key: "D",    width: 22 },
    { key: "E",    width: 18 },
    { key: "F",    width: 22 },
    { key: "G",    width: 18 },
    { key: "H",    width: 22 },
    { key: "I",    width: 18 },
    { key: "gap2", width: 2 },
  ];

  // Cover banner
  ws1.mergeCells("B1:I2");
  const banner = ws1.getCell("B1");
  banner.value     = "REPORTE DE PAGOS — PLATAFORMA EDUCATIVA";
  banner.font      = fnt({ bold: true, color: C.white, size: 18 });
  banner.fill      = solidFill(C.header_bg);
  banner.alignment = aln("center");
  ws1.getRow(1).height = 36;
  ws1.getRow(2).height = 36;

  ws1.mergeCells("B3:I3");
  const sub = ws1.getCell("B3");
  sub.value     = `Generado: ${new Date().toLocaleString("es-BO")}   ·   Sistema de Gestión de Pagos`;
  sub.font      = fnt({ italic: true, color: C.slate, size: 10 });
  sub.fill      = solidFill(C.indigo_lt);
  sub.alignment = aln("center");
  ws1.getRow(3).height = 20;

  // Spacer
  ws1.getRow(4).height = 10;

  // KPI row 1
  kpiCard(ws1, 5, 2, 3,
    "Ingresos confirmados",
    `Bs. ${stats.totalIngresos.toFixed(2)}`,
    C.green, C.green_lt);

  kpiCard(ws1, 5, 4, 5,
    "Ticket promedio",
    `Bs. ${(stats.ticketPromedio ?? 0).toFixed(2)}`,
    C.indigo, C.indigo_lt);

  kpiCard(ws1, 5, 6, 7,
    "Tasa de conversión",
    `${(stats.tasaConversion ?? 0).toFixed(1)}%`,
    C.teal, C.teal_lt);

  kpiCard(ws1, 5, 8, 9,
    "Total transacciones",
    String(stats.totalPagos),
    C.purple, C.purple_lt);

  // KPI row 2
  ws1.getRow(9).height = 10;
  kpiCard(ws1, 10, 2, 3, "Completados",  String(stats.completados), C.green, C.green_lt);
  kpiCard(ws1, 10, 4, 5, "Pendientes",   String(stats.pendientes),  C.amber, C.amber_lt);
  kpiCard(ws1, 10, 6, 7, "Cancelados",   String(stats.cancelados),  C.red,   C.red_lt);
  kpiCard(ws1, 10, 8, 9,
    "Métodos distintos",
    String(Object.keys(stats.porMetodo).length),
    C.slate, C.slate_lt);

  ws1.getRow(14).height = 10;

  // ── Method summary ──────────────────────────────────────────────────────────
  sectionHeading(ws1, 15, 2, 5, "📦  Transacciones por método de pago");
  sectionHeading(ws1, 15, 6, 9, "💰  Ingresos por método (Bs.)");

  const mHdrs = ["Método", "Cantidad", "% del total"];
  const iHdrs = ["Método", "Ingresos (Bs.)", "% ingresos"];

  [mHdrs, iHdrs].forEach((hdrs, tableIdx) => {
    const startCol = tableIdx === 0 ? 2 : 6;
    hdrs.forEach((h, ci) => {
      const cell = ws1.getCell(16, startCol + ci);
      cell.value     = h;
      cell.font      = fnt({ bold: true, color: C.white, size: 9 });
      cell.fill      = solidFill(C.navy);
      cell.alignment = aln("center");
      cell.border    = thinBorder(C.navy);
    });
  });
  ws1.getRow(16).height = 22;

  const totalTxn = stats.totalPagos || 1;
  const sortedMethods = Object.entries(stats.porMetodo).sort((a, b) => b[1] - a[1]);
  const totalIncome   = Object.values(stats.ingresosPorMetodo ?? {}).reduce((s, v) => s + v, 0) || 1;

  sortedMethods.forEach(([metodo, cant], ri) => {
    const row = 17 + ri;
    const bg  = ri % 2 === 0 ? C.row_alt : C.white;

    // Left table
    [metodo, cant, `${((cant / totalTxn) * 100).toFixed(1)}%`].forEach((v, ci) => {
      const cell = ws1.getCell(row, 2 + ci);
      cell.value     = v;
      cell.fill      = solidFill(bg);
      cell.font      = ci === 0
        ? fnt({ bold: true, color: METHOD_COLORS[metodo] ?? C.slate, size: 9 })
        : fnt({ size: 9 });
      cell.alignment = aln(ci === 0 ? "left" : "center");
      cell.border    = thinBorder();
    });

    // Right table — income
    const ing = (stats.ingresosPorMetodo ?? {})[metodo] ?? 0;
    [metodo, ing, (ing / totalIncome)].forEach((v, ci) => {
      const cell = ws1.getCell(row, 6 + ci);
      cell.value     = v;
      cell.fill      = solidFill(bg);
      cell.font      = ci === 0
        ? fnt({ bold: true, color: METHOD_COLORS[metodo] ?? C.slate, size: 9 })
        : fnt({ bold: ci > 0, color: ci === 1 ? C.green : C.slate, size: 9 });
      cell.alignment = aln(ci === 0 ? "left" : "center");
      cell.border    = thinBorder();
      if (ci === 1) cell.numFmt = FMT_MONEY;
      if (ci === 2) cell.numFmt = FMT_PCT;
    });

    ws1.getRow(row).height = 20;
  });

  // ──────────────────────────────────────────────────────────────────────────
  // SHEET 2 — TRANSACTIONS
  // ──────────────────────────────────────────────────────────────────────────
  const ws2 = wb.addWorksheet("📋 Transacciones", {
    views: [{ showGridLines: false, state: "frozen", ySplit: 2 }],
  });

  ws2.columns = [
    { key: "id",     header: "ID",            width: 8  },
    { key: "fecha",  header: "Fecha",          width: 14 },
    { key: "hora",   header: "Hora",           width: 10 },
    { key: "curso",  header: "Curso / Producto", width: 30 },
    { key: "metodo", header: "Método",         width: 22 },
    { key: "monto",  header: "Monto (Bs.)",    width: 16 },
    { key: "estado", header: "Estado",         width: 16 },
    { key: "ref",    header: "Referencia",     width: 18 },
  ];

  // Banner
  ws2.mergeCells("A1:H1");
  const banner2 = ws2.getCell("A1");
  banner2.value     = "  DETALLE DE TRANSACCIONES";
  banner2.font      = fnt({ bold: true, color: C.white, size: 13 });
  banner2.fill      = solidFill(C.header_bg);
  banner2.alignment = aln("left");
  ws2.getRow(1).height = 32;

  // Header row
  ws2.getRow(2).eachCell({ includeEmpty: true }, (cell, ci) => {
    if (ci > 8) return;
    const headers2 = ["ID", "Fecha", "Hora", "Curso / Producto", "Método", "Monto (Bs.)", "Estado", "Referencia"];
    cell.value     = headers2[ci - 1];
    cell.font      = fnt({ bold: true, color: C.white, size: 9 });
    cell.fill      = solidFill(C.indigo);
    cell.alignment = aln("center");
    cell.border    = thinBorder(C.indigo);
  });
  ws2.getRow(2).height = 24;

  payments.forEach((p, ri) => {
    const row = 3 + ri;
    const bg  = ri % 2 === 0 ? C.row_alt : C.white;
    const st  = ESTADO_STYLE[p.estado] ?? { font: C.slate, fill: C.slate_lt };
    const fDate = p.fecha ? new Date(p.fecha) : null;

    const rowData = [
      { v: `#${String(p.id_pago).padStart(4, "0")}`, c: { bold: true, color: C.indigo }, a: "center" },
      { v: fDate,  numFmt: FMT_DATE,  a: "center" },
      { v: fDate,  numFmt: FMT_TIME,  a: "center" },
      { v: p.resumenCursos || "—",    a: "left",   wrap: true },
      { v: p.metodo, c: { bold: true, color: METHOD_COLORS[p.metodo] ?? C.slate }, a: "center" },
      { v: Number(p.monto), numFmt: FMT_MONEY, c: { bold: true }, a: "right" },
      { v: p.estado, c: { bold: true, color: st.font }, fill: st.fill, a: "center" },
      { v: p.referencia, c: { color: "FF94A3B8" }, a: "center" },
    ];

    rowData.forEach((d, ci) => {
      const cell = ws2.getCell(row, ci + 1);
      cell.value     = d.v;
      cell.fill      = solidFill(d.fill ?? bg);
      cell.font      = fnt(d.c ?? {});
      cell.alignment = aln(d.a ?? "left", "middle", d.wrap ?? false);
      cell.border    = thinBorder();
      if (d.numFmt) cell.numFmt = d.numFmt;
    });
    ws2.getRow(row).height = 20;
  });

  // Totals row
  const totalRowIdx = 3 + payments.length;
  ws2.mergeCells(totalRowIdx, 1, totalRowIdx, 5);
  const totLbl = ws2.getCell(totalRowIdx, 1);
  totLbl.value     = `  TOTAL INGRESOS CONFIRMADOS — ${payments.length} transacciones`;
  totLbl.font      = fnt({ bold: true, color: C.white, size: 9 });
  totLbl.fill      = solidFill(C.navy);
  totLbl.alignment = aln("right");

  const totMonto = ws2.getCell(totalRowIdx, 6);
  totMonto.value  = stats.totalIngresos;
  totMonto.font   = fnt({ bold: true, color: C.white, size: 10 });
  totMonto.fill   = solidFill(C.navy);
  totMonto.alignment = aln("right");
  totMonto.numFmt = FMT_MONEY;

  [7, 8].forEach(ci => {
    ws2.getCell(totalRowIdx, ci).fill = solidFill(C.navy);
  });
  ws2.getRow(totalRowIdx).height = 24;

  // ──────────────────────────────────────────────────────────────────────────
  // SHEET 3 — MONTHLY SUMMARY
  // ──────────────────────────────────────────────────────────────────────────
  const ws3 = wb.addWorksheet("📈 Resumen mensual", {
    views: [{ showGridLines: false }],
  });

  ws3.columns = [
    { key: "mes",          width: 20 },
    { key: "completados",  width: 16 },
    { key: "pendientes",   width: 16 },
    { key: "cancelados",   width: 16 },
    { key: "total",        width: 16 },
    { key: "ingresos",     width: 20 },
  ];

  ws3.mergeCells("A1:F1");
  const banner3 = ws3.getCell("A1");
  banner3.value     = "  RESUMEN MENSUAL DE INGRESOS";
  banner3.font      = fnt({ bold: true, color: C.white, size: 13 });
  banner3.fill      = solidFill(C.header_bg);
  banner3.alignment = aln("left");
  ws3.getRow(1).height = 32;

  const hdrs3 = ["Mes", "Completados", "Pendientes", "Cancelados", "Total txn", "Ingresos (Bs.)"];
  hdrs3.forEach((h, ci) => {
    const cell = ws3.getCell(2, ci + 1);
    cell.value     = h;
    cell.font      = fnt({ bold: true, color: C.white, size: 9 });
    cell.fill      = solidFill(C.indigo);
    cell.alignment = aln("center");
    cell.border    = thinBorder(C.indigo);
  });
  ws3.getRow(2).height = 24;

  // Aggregate by month
  const MONTHS_ES = [
    "", "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];
  const monthly = {};
  payments.forEach((p) => {
    const d = new Date(p.fecha);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    if (!monthly[key]) monthly[key] = { completados: 0, pendientes: 0, cancelados: 0, total: 0, ingresos: 0 };
    monthly[key].total++;
    if (p.estado === "COMPLETADO") { monthly[key].completados++; monthly[key].ingresos += Number(p.monto); }
    if (p.estado === "PENDIENTE")  monthly[key].pendientes++;
    if (p.estado === "CANCELADO")  monthly[key].cancelados++;
  });

  Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([key, d], ri) => {
      const row = 3 + ri;
      const bg  = ri % 2 === 0 ? C.row_alt : C.white;
      const [yr, mo] = key.split("-");
      const label = `${MONTHS_ES[parseInt(mo)]} ${yr}`;

      const rowData = [
        { v: label,          c: { bold: false }, a: "left"   },
        { v: d.completados,  c: { bold: true, color: C.green }, a: "center" },
        { v: d.pendientes,   c: { bold: true, color: C.amber }, a: "center" },
        { v: d.cancelados,   c: { bold: true, color: C.red   }, a: "center" },
        { v: d.total,        c: { bold: true },                  a: "center" },
        { v: d.ingresos,     c: { bold: true, color: C.green }, a: "right", numFmt: FMT_MONEY },
      ];

      rowData.forEach((item, ci) => {
        const cell = ws3.getCell(row, ci + 1);
        cell.value     = item.v;
        cell.fill      = solidFill(bg);
        cell.font      = fnt(item.c ?? {});
        cell.alignment = aln(item.a ?? "left");
        cell.border    = thinBorder();
        if (item.numFmt) cell.numFmt = item.numFmt;
      });
      ws3.getRow(row).height = 20;
    });

  // Totals row
  const totalRowM = 3 + Object.keys(monthly).length;
  const totValues = Object.values(monthly).reduce(
    (acc, d) => ({
      completados: acc.completados + d.completados,
      pendientes:  acc.pendientes  + d.pendientes,
      cancelados:  acc.cancelados  + d.cancelados,
      total:       acc.total       + d.total,
      ingresos:    acc.ingresos    + d.ingresos,
    }),
    { completados: 0, pendientes: 0, cancelados: 0, total: 0, ingresos: 0 }
  );

  const totRow3 = ["TOTAL", totValues.completados, totValues.pendientes,
                   totValues.cancelados, totValues.total, totValues.ingresos];
  totRow3.forEach((v, ci) => {
    const cell = ws3.getCell(totalRowM, ci + 1);
    cell.value     = v;
    cell.font      = fnt({ bold: true, color: C.white, size: 9 });
    cell.fill      = solidFill(C.navy);
    cell.alignment = aln(ci === 0 ? "left" : "center");
    if (ci === 5) { cell.numFmt = FMT_MONEY; cell.alignment = aln("right"); }
  });
  ws3.getRow(totalRowM).height = 24;

  // ──────────────────────────────────────────────────────────────────────────
  // Export
  // ──────────────────────────────────────────────────────────────────────────
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const filename = `reporte_pagos_${new Date().toISOString().slice(0, 10)}.xlsx`;
  saveAs(blob, filename);
}