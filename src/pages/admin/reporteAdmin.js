import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  FiDollarSign,
  FiCreditCard,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiSearch,
  FiFilter,
  FiDownload,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiRefreshCw,
  FiBarChart2,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchPagos } from "./slicesPagos/PagosThunk";
import {
  selectPagos,
  selectPagosLoading,
  selectPagosError,
} from "./slicesPagos/PagosSlice";
import { exportToExcel } from "./exportToExcel";

/* ────────────────────────────────────────────────────────── helpers */

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("es-BO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMoney = (amount) =>
  new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 2,
  }).format(Number(amount || 0));

const getStatusLabel = (pago) => {
  if (pago?.compraTotal?.estado === "CANCELADO") return "CANCELADO";
  if (pago?.estado === true) return "COMPLETADO";
  if (pago?.confirmado_en) return "COMPLETADO";
  return "PENDIENTE";
};

const getStatusStyles = (estado) => {
  switch (estado) {
    case "COMPLETADO":
      return { color: "#059669", bg: "#ECFDF5", dot: "#059669" };
    case "PENDIENTE":
      return { color: "#D97706", bg: "#FFFBEB", dot: "#D97706" };
    case "CANCELADO":
      return { color: "#DC2626", bg: "#FEF2F2", dot: "#DC2626" };
    default:
      return { color: "#64748B", bg: "#F8FAFC", dot: "#94A3B8" };
  }
};

const transformarPago = (pago) => {
  const cursos =
    pago?.compraTotal?.compra_curso?.map((item) => ({
      id_curso: item?.curso?.id_curso || item?.curso_id_curso,
      nombre: item?.curso?.materia?.nombre || "Curso sin nombre",
      precio: item?.curso?.precio || 0,
      periodo: item?.curso?.periodo || "-",
    })) || [];

  return {
    id_pago: pago?.id_pago,
    fecha: pago?.creado_en,
    monto: Number(pago?.monto || 0),
    metodo: pago?.metodo || "TRANSFERENCIA BANCARIA",
    estado: getStatusLabel(pago),
    referencia: `PAGO-${pago?.id_pago}`,
    cursos,
    resumenCursos: cursos.map((c) => c.nombre).join(", "),
    compraEstado: pago?.compraTotal?.estado || "-",
  };
};

/* ────────────────────────────────────────────────────────── Excel export */


/* ────────────────────────────────────────────────────────── sub-components */

const Pill = ({ children, color, bg, dot }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color,
      background: bg,
    }}
  >
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: dot,
        flexShrink: 0,
      }}
    />
    {children}
  </span>
);

const MetricCard = ({ icon, label, value, sub, accent, trend }) => (
  <div style={styles.metricCard}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: accent + "18",
          color: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      {trend !== undefined && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            fontSize: 11,
            fontWeight: 700,
            color: trend >= 0 ? "#059669" : "#DC2626",
          }}
        >
          {trend >= 0 ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
          {Math.abs(trend).toFixed(1)}%
        </div>
      )}
    </div>
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginTop: 4, letterSpacing: "-0.02em" }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>{sub}</div>
      )}
    </div>
  </div>
);

const BarMini = ({ label, value, max, color }) => {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12, color: "#0F172A", fontWeight: 800 }}>{value}</span>
      </div>
      <div style={{ height: 6, background: "#F1F5F9", borderRadius: 999, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 999,
            transition: "width 0.6s cubic-bezier(.16,1,.3,1)",
          }}
        />
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────── main */

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const AdminPaymentsReport = () => {
  const dispatch = useDispatch();
  const pagosRaw = useSelector(selectPagos);
  const isLoading = useSelector(selectPagosLoading);
  const error = useSelector(selectPagosError);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [methodFilter, setMethodFilter] = useState("TODOS");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchPagos());
  }, [dispatch]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, methodFilter, dateFrom, dateTo, pageSize]);

  const payments = useMemo(
    () => (Array.isArray(pagosRaw) ? pagosRaw.map(transformarPago) : []),
    [pagosRaw]
  );

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        p.resumenCursos.toLowerCase().includes(q) ||
        p.referencia.toLowerCase().includes(q) ||
        String(p.id_pago).includes(q);
      const matchesStatus = statusFilter === "TODOS" || p.estado === statusFilter;
      const matchesMethod = methodFilter === "TODOS" || p.metodo === methodFilter;
      const d = new Date(p.fecha);
      const matchesFrom = !dateFrom || d >= new Date(`${dateFrom}T00:00:00`);
      const matchesTo = !dateTo || d <= new Date(`${dateTo}T23:59:59`);
      return matchesSearch && matchesStatus && matchesMethod && matchesFrom && matchesTo;
    });
  }, [payments, search, statusFilter, methodFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const paginated = filteredPayments.slice((page - 1) * pageSize, page * pageSize);

  const stats = useMemo(() => {
    const completados = filteredPayments.filter((p) => p.estado === "COMPLETADO");
    const pendientes = filteredPayments.filter((p) => p.estado === "PENDIENTE");
    const cancelados = filteredPayments.filter((p) => p.estado === "CANCELADO");
    const totalIngresos = completados.reduce((s, p) => s + p.monto, 0);
    const ticketPromedio = completados.length ? totalIngresos / completados.length : 0;
    const tasaConversion = filteredPayments.length
      ? (completados.length / filteredPayments.length) * 100
      : 0;
    const porMetodo = filteredPayments.reduce((acc, p) => {
      acc[p.metodo] = (acc[p.metodo] || 0) + 1;
      return acc;
    }, {});
    const maxMetodo = Math.max(...Object.values(porMetodo), 1);
    const ingresosPorMetodo = completados.reduce((acc, p) => {
      acc[p.metodo] = (acc[p.metodo] || 0) + p.monto;
      return acc;
    }, {});

    return {
      totalIngresos,
      ticketPromedio,
      tasaConversion,
      totalPagos: filteredPayments.length,
      completados: completados.length,
      pendientes: pendientes.length,
      cancelados: cancelados.length,
      porMetodo,
      maxMetodo,
      ingresosPorMetodo,
    };
  }, [filteredPayments]);

  const hasFilters =
    search || statusFilter !== "TODOS" || methodFilter !== "TODOS" || dateFrom || dateTo;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("TODOS");
    setMethodFilter("TODOS");
    setDateFrom("");
    setDateTo("");
  };

  const methodColors = {
    QR: "#6366F1",
    TARJETA: "#0EA5E9",
    TRANSFERENCIA_BANCARIA: "#10B981",
    SALDO: "#F59E0B",
    MIXTO: "#8B5CF6",
    "TRANSFERENCIA BANCARIA": "#10B981",
  };

  return (
    <div style={styles.root}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div>
          <div style={styles.headerTag}>
            <FiActivity size={12} />
            Panel financiero
          </div>
          <h1 style={styles.title}>Reporte de Pagos</h1>
          <p style={styles.subtitle}>
            Vista administrativa · Sin datos sensibles de estudiantes
          </p>
        </div>
        <button
          onClick={() => dispatch(fetchPagos())}
          style={styles.refreshBtn}
          title="Recargar datos"
        >
          <FiRefreshCw size={15} />
          Actualizar
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={styles.errorBanner}>
          <FiAlertCircle size={15} />
          {typeof error === "string" ? error : "No se pudieron cargar los pagos"}
        </div>
      )}

      {/* ── KPI row ── */}
      <div style={styles.metricsGrid}>
        <MetricCard
          icon={<FiDollarSign size={18} />}
          label="Ingresos confirmados"
          value={formatMoney(stats.totalIngresos)}
          sub="Solo pagos completados"
          accent="#059669"
        />
        <MetricCard
          icon={<FiBarChart2 size={18} />}
          label="Ticket promedio"
          value={formatMoney(stats.ticketPromedio)}
          sub="Por pago completado"
          accent="#6366F1"
        />
        <MetricCard
          icon={<FiActivity size={18} />}
          label="Tasa de conversión"
          value={`${stats.tasaConversion.toFixed(1)}%`}
          sub="Completados / Total"
          accent="#0EA5E9"
        />
        <MetricCard
          icon={<FiCreditCard size={18} />}
          label="Total transacciones"
          value={stats.totalPagos}
          sub="Según filtros activos"
          accent="#F59E0B"
        />
        <MetricCard
          icon={<FiCheckCircle size={18} />}
          label="Completados"
          value={stats.completados}
          sub="Transacciones exitosas"
          accent="#059669"
        />
        <MetricCard
          icon={<FiClock size={18} />}
          label="Pendientes"
          value={stats.pendientes}
          sub="Sin confirmar"
          accent="#D97706"
        />
      </div>

      {/* ── Charts row ── */}
      <div style={styles.chartsRow}>
        {/* Métodos */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <FiCreditCard size={15} />
            Métodos de pago
          </h3>
          {Object.keys(stats.porMetodo).length === 0 ? (
            <p style={styles.emptyText}>No hay datos</p>
          ) : (
            Object.entries(stats.porMetodo)
              .sort((a, b) => b[1] - a[1])
              .map(([metodo, cantidad]) => (
                <BarMini
                  key={metodo}
                  label={metodo}
                  value={cantidad}
                  max={stats.maxMetodo}
                  color={methodColors[metodo] || "#94A3B8"}
                />
              ))
          )}
        </div>

        {/* Ingresos por método */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <FiDollarSign size={15} />
            Ingresos por método
          </h3>
          {Object.keys(stats.ingresosPorMetodo).length === 0 ? (
            <p style={styles.emptyText}>No hay datos</p>
          ) : (
            Object.entries(stats.ingresosPorMetodo)
              .sort((a, b) => b[1] - a[1])
              .map(([metodo, monto]) => (
                <div
                  key={metodo}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "9px 0",
                    borderBottom: "1px solid #F1F5F9",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: methodColors[metodo] || "#94A3B8",
                      }}
                    />
                    <span style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>
                      {metodo}
                    </span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>
                    {formatMoney(monto)}
                  </span>
                </div>
              ))
          )}
        </div>

        {/* Estado donut-ish */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <FiActivity size={15} />
            Estados
          </h3>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              { label: "Completados", value: stats.completados, color: "#059669", bg: "#ECFDF5" },
              { label: "Pendientes", value: stats.pendientes, color: "#D97706", bg: "#FFFBEB" },
              { label: "Cancelados", value: stats.cancelados, color: "#DC2626", bg: "#FEF2F2" },
            ].map((s) => {
              const pct = stats.totalPagos > 0 ? (s.value / stats.totalPagos) * 100 : 0;
              return (
                <div
                  key={s.label}
                  style={{
                    background: s.bg,
                    borderRadius: 12,
                    padding: "12px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, color: s.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>
                      {s.value}
                    </div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>
                    {pct.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={styles.filterCard}>
        <div style={styles.filterRow}>
          {/* Search */}
          <div style={{ flex: "1 1 220px" }}>
            <label style={styles.filterLabel}>Buscar</label>
            <div style={{ position: "relative", marginTop: 6 }}>
              <FiSearch size={14} style={styles.inputIcon} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Curso, referencia o ID…"
                style={styles.input}
              />
            </div>
          </div>

          {/* Estado */}
          <div style={{ flex: "0 1 150px" }}>
            <label style={styles.filterLabel}>Estado</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.select}>
              <option value="TODOS">Todos</option>
              <option value="COMPLETADO">Completado</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          {/* Método */}
          <div style={{ flex: "0 1 190px" }}>
            <label style={styles.filterLabel}>Método</label>
            <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} style={styles.select}>
              <option value="TODOS">Todos</option>
              <option value="QR">QR</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="TRANSFERENCIA_BANCARIA">Transferencia</option>
              <option value="SALDO">Saldo</option>
              <option value="MIXTO">Mixto</option>
            </select>
          </div>

          {/* Desde */}
          <div style={{ flex: "0 1 150px" }}>
            <label style={styles.filterLabel}>Desde</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={styles.select} />
          </div>

          {/* Hasta */}
          <div style={{ flex: "0 1 150px" }}>
            <label style={styles.filterLabel}>Hasta</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={styles.select} />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            {hasFilters && (
              <button onClick={clearFilters} style={styles.clearBtn} title="Limpiar filtros">
                <FiX size={14} />
                Limpiar
              </button>
            )}
            <button
              onClick={() => exportToExcel(filteredPayments, stats)}
              style={styles.exportBtn}
            >
              <FiDownload size={14} />
              Excel
            </button>
          </div>
        </div>

        {hasFilters && (
          <div style={{ marginTop: 10, fontSize: 12, color: "#6366F1", fontWeight: 600 }}>
            {filteredPayments.length} resultado{filteredPayments.length !== 1 ? "s" : ""} · Filtros activos
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FiFilter size={14} color="#475569" />
            <span style={{ fontWeight: 700, color: "#0F172A", fontSize: 15 }}>
              Transacciones
            </span>
            <span style={styles.countBadge}>{filteredPayments.length}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 12, color: "#64748B" }}>Por página:</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              style={{ ...styles.select, marginTop: 0, padding: "6px 10px", fontSize: 12, width: "auto" }}
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          {isLoading ? (
            <div style={styles.loadingRow}>
              <FiRefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} />
              Cargando pagos…
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["ID", "Fecha", "Cursos", "Método", "Monto", "Estado", "Referencia"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={styles.emptyRow}>
                      No se encontraron transacciones con los filtros actuales.
                    </td>
                  </tr>
                ) : (
                  paginated.map((p, i) => {
                    const s = getStatusStyles(p.estado);
                    return (
                      <tr
                        key={p.id_pago}
                        style={{
                          borderTop: "1px solid #F1F5F9",
                          background: i % 2 === 0 ? "#fff" : "#FAFBFC",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F0F4FF")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#FAFBFC")}
                      >
                        <td style={{ ...styles.td, fontWeight: 700, color: "#6366F1" }}>
                          #{p.id_pago}
                        </td>
                        <td style={{ ...styles.td, whiteSpace: "nowrap", color: "#475569" }}>
                          {formatDate(p.fecha)}
                        </td>
                        <td style={{ ...styles.td, maxWidth: 260 }}>
                          <div
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: 13,
                            }}
                            title={p.resumenCursos}
                          >
                            {p.resumenCursos || "—"}
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: methodColors[p.metodo] || "#64748B",
                            }}
                          >
                            {p.metodo}
                          </span>
                        </td>
                        <td style={{ ...styles.td, fontWeight: 700 }}>
                          {formatMoney(p.monto)}
                        </td>
                        <td style={styles.td}>
                          <Pill color={s.color} bg={s.bg} dot={s.dot}>
                            {p.estado}
                          </Pill>
                        </td>
                        <td style={{ ...styles.td, color: "#94A3B8", fontSize: 12 }}>
                          {p.referencia}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && filteredPayments.length > 0 && (
          <div style={styles.pagination}>
            <span style={{ fontSize: 13, color: "#64748B" }}>
              Mostrando{" "}
              <strong style={{ color: "#0F172A" }}>
                {Math.min((page - 1) * pageSize + 1, filteredPayments.length)}–
                {Math.min(page * pageSize, filteredPayments.length)}
              </strong>{" "}
              de <strong style={{ color: "#0F172A" }}>{filteredPayments.length}</strong>
            </span>

            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                style={styles.pageBtn(page === 1)}
              >
                «
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={styles.pageBtn(page === 1)}
              >
                <FiChevronLeft size={14} />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const n = start + i;
                if (n > totalPages) return null;
                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    style={styles.pageBtn(false, n === page)}
                  >
                    {n}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={styles.pageBtn(page === totalPages)}
              >
                <FiChevronRight size={14} />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                style={styles.pageBtn(page === totalPages)}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input:focus, select:focus { border-color: #6366F1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
      `}</style>
    </div>
  );
};

/* ────────────────────────────────────────────────────────── styles */

const styles = {
  root: {
    padding: "28px 24px",
    background: "#F8FAFC",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    flexWrap: "wrap",
    gap: 12,
  },
  headerTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: "#EEF2FF",
    color: "#6366F1",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding: "4px 10px",
    borderRadius: 999,
    marginBottom: 10,
  },
  title: {
    margin: 0,
    fontSize: 30,
    fontWeight: 900,
    color: "#0F172A",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 0,
    color: "#94A3B8",
    fontSize: 13,
  },
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#fff",
    border: "1px solid #E2E8F0",
    color: "#475569",
    padding: "9px 16px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  errorBanner: {
    marginBottom: 20,
    padding: "12px 16px",
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: 10,
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 14,
    marginBottom: 20,
  },
  metricCard: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 14,
    padding: "18px 20px",
    boxShadow: "0 1px 3px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.03)",
  },
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
    marginBottom: 20,
  },
  card: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 14,
    padding: "20px",
    boxShadow: "0 1px 3px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.03)",
  },
  cardTitle: {
    margin: "0 0 16px",
    fontSize: 13,
    fontWeight: 700,
    color: "#475569",
    display: "flex",
    alignItems: "center",
    gap: 7,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  filterCard: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 14,
    padding: "18px 20px",
    marginBottom: 16,
    boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
  },
  filterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "flex-end",
  },
  filterLabel: {
    display: "block",
    fontSize: 11,
    color: "#64748B",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    border: "1px solid #E2E8F0",
    borderRadius: 8,
    padding: "9px 12px 9px 32px",
    fontSize: 13,
    color: "#0F172A",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  inputIcon: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94A3B8",
    pointerEvents: "none",
  },
  select: {
    width: "100%",
    border: "1px solid #E2E8F0",
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 13,
    color: "#0F172A",
    marginTop: 6,
    outline: "none",
    background: "#fff",
    cursor: "pointer",
  },
  clearBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    border: "1px solid #E2E8F0",
    background: "#fff",
    color: "#64748B",
    padding: "9px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  exportBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#0F172A",
    color: "#fff",
    border: "none",
    padding: "9px 16px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  tableCard: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.03)",
  },
  tableHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid #F1F5F9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },
  countBadge: {
    background: "#EEF2FF",
    color: "#6366F1",
    fontSize: 11,
    fontWeight: 800,
    padding: "2px 8px",
    borderRadius: 999,
  },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: 11,
    color: "#64748B",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "13px 16px",
    fontSize: 13,
    color: "#0F172A",
  },
  emptyRow: {
    padding: "40px 24px",
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 14,
  },
  loadingRow: {
    padding: "40px 24px",
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    padding: "14px 20px",
    borderTop: "1px solid #F1F5F9",
  },
  pageBtn: (disabled, active) => ({
    minWidth: 34,
    height: 34,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: active ? "none" : "1px solid #E2E8F0",
    borderRadius: 8,
    background: active ? "#6366F1" : disabled ? "#F8FAFC" : "#fff",
    color: active ? "#fff" : disabled ? "#CBD5E1" : "#475569",
    fontSize: 13,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    padding: "0 6px",
  }),
  emptyText: {
    margin: 0,
    color: "#94A3B8",
    fontSize: 13,
  },
};

export default AdminPaymentsReport;