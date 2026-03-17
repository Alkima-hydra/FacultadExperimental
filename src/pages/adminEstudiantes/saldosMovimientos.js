import React, { useEffect, useMemo, useState } from "react";
import {
  FiDollarSign,
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiInfo,
  FiRefreshCw,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchSaldosByEstudianteId } from "./slicesSaldo/SaldoMovimientosThunk";
import {
  selectSaldos,
  selectSaldosLoading,
  selectSaldosError,
} from "./slicesSaldo/SaldosMovimientosSlice";
import { selectUserId } from "../signin/slices/loginSelectors";

/* ─────────────────────────────────────────────── helpers */

const formatMoney = (amount) =>
  new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 2,
  }).format(Number(amount || 0));

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

const getTipoLabel = (tipo) => {
  switch (tipo) {
    case "credito_desinscripcion":  return "Crédito por desinscripción";
    case "credito_cierre_curso":    return "Crédito por cierre de curso";
    case "debito_uso_saldo":        return "Uso de saldo";
    default:                        return tipo || "Sin tipo";
  }
};

const getNaturaleza = (naturaleza) =>
  naturaleza === "C"
    ? { label: "Ingreso", color: "#059669", bg: "#ECFDF5", dot: "#059669" }
    : { label: "Egreso",  color: "#DC2626", bg: "#FEF2F2", dot: "#DC2626" };

const getAuthFromLocalStorage = () => {
  const keys = ["auth","user","usuario","login","authUser","userData","persist:root"];
  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.id && parsed?.token) return parsed;
      if (key === "persist:root") {
        const lp = JSON.parse(parsed?.login || "{}");
        if (lp?.id && lp?.token) return lp;
      }
    } catch {}
  }
  return null;
};

/* ─────────────────────────────────────────────── Loader */

const Loader = () => (
  <div style={styles.loaderOverlay}>
    <div style={styles.loaderCard}>
      {/* Animated coin stack */}
      <div style={styles.loaderIconWrap}>
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <style>{`
            @keyframes coinPulse {
              0%, 100% { transform: scaleY(1);   opacity: 1; }
              50%       { transform: scaleY(0.82); opacity: 0.6; }
            }
            @keyframes coinBounce {
              0%, 100% { transform: translateY(0); }
              50%       { transform: translateY(-6px); }
            }
            .c1 { animation: coinBounce 1.1s ease-in-out infinite 0s; }
            .c2 { animation: coinBounce 1.1s ease-in-out infinite 0.18s; }
            .c3 { animation: coinBounce 1.1s ease-in-out infinite 0.36s; }
          `}</style>
          <ellipse className="c1" cx="26" cy="40" rx="14" ry="5" fill="#6366F1" opacity="0.25"/>
          <rect className="c1" x="12" y="32" width="28" height="8" rx="2" fill="#6366F1" opacity="0.5"/>
          <ellipse className="c1" cx="26" cy="32" rx="14" ry="5" fill="#818CF8"/>

          <ellipse className="c2" cx="26" cy="28" rx="14" ry="5" fill="#6366F1" opacity="0.25"/>
          <rect className="c2" x="12" y="20" width="28" height="8" rx="2" fill="#6366F1" opacity="0.65"/>
          <ellipse className="c2" cx="26" cy="20" rx="14" ry="5" fill="#818CF8"/>

          <ellipse className="c3" cx="26" cy="16" rx="14" ry="5" fill="#6366F1" opacity="0.25"/>
          <rect className="c3" x="12" y="8"  width="28" height="8" rx="2" fill="#6366F1" opacity="0.85"/>
          <ellipse className="c3" cx="26" cy="8"  rx="14" ry="5" fill="#A5B4FC"/>
        </svg>
      </div>

      {/* Dots */}
      <div style={styles.loaderDots}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ ...styles.loaderDot, animationDelay: `${i * 0.18}s` }} />
        ))}
      </div>
      <p style={styles.loaderText}>Cargando movimientos…</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────── MetricCard */

const MetricCard = ({ icon, label, value, sub, accent }) => (
  <div style={styles.metricCard}>
    <div style={{
      width: 40, height: 40, borderRadius: 10,
      background: accent + "1A", color: accent,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {icon}
    </div>
    <div style={{ marginTop: 14 }}>
      <div style={styles.metricLabel}>{label}</div>
      <div style={styles.metricValue}>{value}</div>
      {sub && <div style={styles.metricSub}>{sub}</div>}
    </div>
  </div>
);

/* ─────────────────────────────────────────────── Pill */

const Pill = ({ color, bg, dot, children }) => (
  <span style={{ ...styles.pill, color, background: bg }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot, flexShrink: 0 }} />
    {children}
  </span>
);

/* ─────────────────────────────────────────────── SaldoBar */

const SaldoBar = ({ anterior, posterior }) => {
  const max = Math.max(anterior, posterior, 1);
  const isUp = posterior >= anterior;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{
          height: 6, borderRadius: 999, background: "#E2E8F0", flex: 1, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", borderRadius: 999,
            width: `${(posterior / max) * 100}%`,
            background: isUp ? "#059669" : "#DC2626",
            transition: "width 0.5s ease",
          }} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: isUp ? "#059669" : "#DC2626", whiteSpace: "nowrap" }}>
          {formatMoney(posterior)}
        </span>
      </div>
      <span style={{ fontSize: 10, color: "#94A3B8" }}>antes: {formatMoney(anterior)}</span>
    </div>
  );
};

/* ─────────────────────────────────────────────── Main */

const PAGE_SIZES = [10, 20, 50];

const StudentBalanceHistory = () => {
  const userIdFromStore = useSelector(selectUserId);
  const dispatch = useDispatch();
  const localAuth = useMemo(() => getAuthFromLocalStorage(), []);
  const estudianteId = userIdFromStore || localAuth?.id;

  const movimientosRaw = useSelector(selectSaldos);
  const isLoading      = useSelector(selectSaldosLoading);
  const error          = useSelector(selectSaldosError);

  const [search, setSearch]               = useState("");
  const [naturalezaFilter, setNaturaleza] = useState("TODOS");
  const [tipoFilter, setTipo]             = useState("TODOS");
  const [dateFrom, setDateFrom]           = useState("");
  const [dateTo, setDateTo]               = useState("");
  const [page, setPage]                   = useState(1);
  const [pageSize, setPageSize]           = useState(10);

  useEffect(() => {
    if (estudianteId) dispatch(fetchSaldosByEstudianteId(estudianteId));
  }, [dispatch, estudianteId]);

  useEffect(() => { setPage(1); }, [search, naturalezaFilter, tipoFilter, dateFrom, dateTo, pageSize]);

  const getCursos = (mov) => {
    if (mov?.curso?.materia?.nombre)
      return [{ nombre: mov.curso.materia.nombre, periodo: mov.curso.periodo || "-" }];
    return (
      mov?.compraTotal?.compra_curso
        ?.map((item) => ({
          nombre: item?.curso?.materia?.nombre || "Curso sin nombre",
          periodo: item?.curso?.periodo || "-",
        }))
        ?.filter((c) => c.nombre) || []
    );
  };

  const movimientos = useMemo(() => {
    if (!Array.isArray(movimientosRaw)) return [];
    return movimientosRaw.map((m) => {
      const cursos = getCursos(m);
      return {
        ...m,
        tipoLabel: getTipoLabel(m.tipo_movimiento),
        cursos,
        cursoNombre: cursos.length ? cursos.map((c) => c.nombre).join(", ") : "Sin curso asociado",
        periodo: cursos.length === 1 ? cursos[0].periodo : cursos.length > 1 ? "Varios" : "-",
        montoNumber:          Number(m?.monto || 0),
        saldoAnteriorNumber:  Number(m?.saldo_anterior || 0),
        saldoPosteriorNumber: Number(m?.saldo_posterior || 0),
      };
    });
  }, [movimientosRaw]);

  const filtered = useMemo(() => {
    return movimientos.filter((m) => {
      const q = search.toLowerCase();
      const matchSearch =
        m.tipoLabel.toLowerCase().includes(q) ||
        m.cursoNombre.toLowerCase().includes(q) ||
        (m.observacion || "").toLowerCase().includes(q) ||
        String(m.id_saldo_movimiento).includes(q);
      const matchNat  = naturalezaFilter === "TODOS" || m.naturaleza === naturalezaFilter;
      const matchTipo = tipoFilter       === "TODOS" || m.tipo_movimiento === tipoFilter;
      const d = new Date(m.creado_en);
      const matchFrom = !dateFrom || d >= new Date(`${dateFrom}T00:00:00`);
      const matchTo   = !dateTo   || d <= new Date(`${dateTo}T23:59:59`);
      return matchSearch && matchNat && matchTipo && matchFrom && matchTo;
    });
  }, [movimientos, search, naturalezaFilter, tipoFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  const stats = useMemo(() => {
    const creditos = filtered.filter((m) => m.naturaleza === "C");
    const debitos  = filtered.filter((m) => m.naturaleza === "D");
    return {
      ultimoSaldo:      movimientos.length ? movimientos[0].saldoPosteriorNumber : 0,
      totalCreditos:    creditos.reduce((s, m) => s + m.montoNumber, 0),
      totalDebitos:     debitos.reduce((s, m) => s + m.montoNumber, 0),
      totalMovimientos: filtered.length,
      nCreditos:        creditos.length,
      nDebitos:         debitos.length,
    };
  }, [filtered, movimientos]);

  const hasFilters = search || naturalezaFilter !== "TODOS" || tipoFilter !== "TODOS" || dateFrom || dateTo;
  const clearFilters = () => { setSearch(""); setNaturaleza("TODOS"); setTipo("TODOS"); setDateFrom(""); setDateTo(""); };

  return (
    <div style={styles.root}>
      {isLoading && <Loader />}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.tag}>
            <FiActivity size={11} />
            Mis finanzas
          </div>
          <h1 style={styles.title}>Historial de Saldo</h1>
          <p style={styles.subtitle}>
            Créditos generados, uso de saldo y movimientos en tus compras
          </p>
        </div>
        <button
          onClick={() => estudianteId && dispatch(fetchSaldosByEstudianteId(estudianteId))}
          style={styles.refreshBtn}
        >
          <FiRefreshCw size={14} />
          Actualizar
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBanner}>
          <FiInfo size={14} />
          {typeof error === "string" ? error : "No se pudieron cargar los movimientos de saldo"}
        </div>
      )}

      {/* KPIs */}
      <div style={styles.kpiGrid}>
        <MetricCard icon={<FiDollarSign size={18} />}    label="Saldo actual"        value={formatMoney(stats.ultimoSaldo)}   sub="Último saldo registrado" accent="#6366F1" />
        <MetricCard icon={<FiArrowDownCircle size={18}/>} label="Créditos acumulados" value={formatMoney(stats.totalCreditos)} sub={`${stats.nCreditos} movimientos`} accent="#059669" />
        <MetricCard icon={<FiArrowUpCircle size={18}/>}   label="Débitos acumulados"  value={formatMoney(stats.totalDebitos)}  sub={`${stats.nDebitos} movimientos`}  accent="#DC2626" />
        <MetricCard icon={<FiCalendar size={18} />}       label="Movimientos"         value={stats.totalMovimientos}           sub="Según filtros activos"   accent="#F59E0B" />
      </div>

      {/* Balance ratio bar */}
      {(stats.totalCreditos > 0 || stats.totalDebitos > 0) && (
        <div style={styles.ratioCard}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>
              Créditos: {formatMoney(stats.totalCreditos)}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#DC2626" }}>
              Débitos: {formatMoney(stats.totalDebitos)}
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "#FEE2E2", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 999, background: "#059669",
              width: `${Math.min(100, (stats.totalCreditos / (stats.totalCreditos + stats.totalDebitos || 1)) * 100)}%`,
              transition: "width 0.6s cubic-bezier(.16,1,.3,1)",
            }} />
          </div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 5, textAlign: "center" }}>
            Balance neto: <strong style={{ color: stats.totalCreditos >= stats.totalDebitos ? "#059669" : "#DC2626" }}>
              {formatMoney(stats.totalCreditos - stats.totalDebitos)}
            </strong>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={styles.filterCard}>
        <div style={styles.filterRow}>
          <div style={{ flex: "1 1 200px" }}>
            <label style={styles.filterLabel}>Buscar</label>
            <div style={{ position: "relative", marginTop: 6 }}>
              <FiSearch size={13} style={styles.inputIcon} />
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Curso, observación o ID…"
                style={styles.input}
              />
            </div>
          </div>

          <div style={{ flex: "0 1 140px" }}>
            <label style={styles.filterLabel}>Naturaleza</label>
            <select value={naturalezaFilter} onChange={(e) => setNaturaleza(e.target.value)} style={styles.select}>
              <option value="TODOS">Todos</option>
              <option value="C">Ingreso</option>
              <option value="D">Egreso</option>
            </select>
          </div>

          <div style={{ flex: "0 1 200px" }}>
            <label style={styles.filterLabel}>Tipo</label>
            <select value={tipoFilter} onChange={(e) => setTipo(e.target.value)} style={styles.select}>
              <option value="TODOS">Todos</option>
              <option value="credito_desinscripcion">Ingreso por desinscripción</option>
              <option value="credito_cierre_curso">Ingreso por cierre de curso</option>
              <option value="debito_uso_saldo">Egreso por uso de saldo</option>
            </select>
          </div>

          <div style={{ flex: "0 1 145px" }}>
            <label style={styles.filterLabel}>Desde</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={styles.select} />
          </div>

          <div style={{ flex: "0 1 145px" }}>
            <label style={styles.filterLabel}>Hasta</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={styles.select} />
          </div>

          {hasFilters && (
            <button onClick={clearFilters} style={styles.clearBtn}>
              <FiX size={13} /> Limpiar
            </button>
          )}
        </div>

        {hasFilters && (
          <div style={{ marginTop: 8, fontSize: 12, color: "#6366F1", fontWeight: 600 }}>
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} · Filtros activos
          </div>
        )}
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FiFilter size={14} color="#475569" />
            <span style={{ fontWeight: 700, color: "#0F172A", fontSize: 15 }}>Movimientos</span>
            <span style={styles.badge}>{filtered.length}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>Por página:</span>
            <select
              value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}
              style={{ ...styles.select, marginTop: 0, padding: "5px 8px", fontSize: 12, width: "auto" }}
            >
              {PAGE_SIZES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          {!isLoading && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["ID","Fecha","Tipo","Curso","Monto","Saldo posterior","Naturaleza","Detalle"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={styles.emptyRow}>
                      No se encontraron movimientos con los filtros actuales.
                    </td>
                  </tr>
                ) : (
                  paginated.map((mov, i) => {
                    const nat = getNaturaleza(mov.naturaleza);
                    const isIngreso = mov.naturaleza === "C";
                    return (
                      <tr
                        key={mov.id_saldo_movimiento}
                        style={{ borderTop: "1px solid #F1F5F9", background: i % 2 === 0 ? "#fff" : "#FAFBFC" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F0F4FF")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#FAFBFC")}
                      >
                        <td style={{ ...styles.td, fontWeight: 700, color: "#6366F1" }}>
                          #{mov.id_saldo_movimiento}
                        </td>
                        <td style={{ ...styles.td, color: "#475569", whiteSpace: "nowrap", fontSize: 12 }}>
                          {formatDate(mov.creado_en)}
                        </td>
                        <td style={{ ...styles.td, fontSize: 12 }}>
                          <span style={{
                            display: "inline-block",
                            padding: "3px 8px",
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            background: isIngreso ? "#EEF2FF" : "#FFF7ED",
                            color: isIngreso ? "#6366F1" : "#C2410C",
                          }}>
                            {mov.tipoLabel}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={{ lineHeight: 1.4 }}>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{mov.cursoNombre}</div>
                            <div style={{ fontSize: 11, color: "#94A3B8" }}>{mov.periodo}</div>
                          </div>
                        </td>
                        <td style={{ ...styles.td, fontWeight: 800, color: isIngreso ? "#059669" : "#DC2626", whiteSpace: "nowrap" }}>
                          {isIngreso ? "+" : "−"}{formatMoney(mov.montoNumber)}
                        </td>
                        <td style={styles.td}>
                          <SaldoBar anterior={mov.saldoAnteriorNumber} posterior={mov.saldoPosteriorNumber} />
                        </td>
                        <td style={styles.td}>
                          <Pill color={nat.color} bg={nat.bg} dot={nat.dot}>{nat.label}</Pill>
                        </td>
                        <td style={{ ...styles.td, fontSize: 12, color: "#64748B", maxWidth: 180 }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                            <FiInfo size={12} style={{ marginTop: 2, flexShrink: 0, color: "#CBD5E1" }} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {mov.observacion || "—"}
                            </span>
                          </div>
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
        {!isLoading && filtered.length > 0 && (
          <div style={styles.pagination}>
            <span style={{ fontSize: 12, color: "#64748B" }}>
              Mostrando{" "}
              <strong style={{ color: "#0F172A" }}>
                {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)}
              </strong>{" "}
              de <strong style={{ color: "#0F172A" }}>{filtered.length}</strong>
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => setPage(1)} disabled={page === 1} style={pageBtn(page === 1)}>«</button>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={pageBtn(page === 1)}>
                <FiChevronLeft size={13} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const n = start + i;
                if (n > totalPages) return null;
                return (
                  <button key={n} onClick={() => setPage(n)} style={pageBtn(false, n === page)}>{n}</button>
                );
              })}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pageBtn(page === totalPages)}>
                <FiChevronRight size={13} />
              </button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} style={pageBtn(page === totalPages)}>»</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0);   opacity: 0.3; }
          40%            { transform: translateY(-8px); opacity: 1;   }
        }
        * { box-sizing: border-box; }
        input:focus, select:focus { border-color: #6366F1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); outline: none; }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────────────────────── styles */

const pageBtn = (disabled, active) => ({
  minWidth: 32, height: 32,
  display: "flex", alignItems: "center", justifyContent: "center",
  border: active ? "none" : "1px solid #E2E8F0",
  borderRadius: 7,
  background: active ? "#6366F1" : disabled ? "#F8FAFC" : "#fff",
  color: active ? "#fff" : disabled ? "#CBD5E1" : "#475569",
  fontSize: 12, fontWeight: 600,
  cursor: disabled ? "not-allowed" : "pointer",
  padding: "0 6px",
});

const styles = {
  root: {
    padding: "28px 24px", background: "#F8FAFC", minHeight: "100vh",
  },
  loaderOverlay: {
    position: "fixed", inset: 0, zIndex: 999,
    background: "rgba(248,250,252,0.85)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  loaderCard: {
    background: "#fff", borderRadius: 20, padding: "36px 48px",
    boxShadow: "0 20px 60px rgba(99,102,241,0.15), 0 4px 16px rgba(15,23,42,0.06)",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
    border: "1px solid #E0E7FF",
  },
  loaderIconWrap: {
    width: 72, height: 72,
    background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
    borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 16px rgba(99,102,241,0.15)",
  },
  loaderDots: { display: "flex", gap: 7 },
  loaderDot: {
    width: 8, height: 8, borderRadius: "50%", background: "#6366F1",
    display: "inline-block",
    animation: "dotBounce 1.2s ease-in-out infinite",
  },
  loaderText: { margin: 0, fontSize: 13, color: "#94A3B8", fontWeight: 600, letterSpacing: "0.03em" },

  header: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: 24, flexWrap: "wrap", gap: 12,
  },
  tag: {
    display: "inline-flex", alignItems: "center", gap: 5,
    background: "#EEF2FF", color: "#6366F1",
    fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
    padding: "4px 10px", borderRadius: 999, marginBottom: 10,
  },
  title: { margin: 0, fontSize: 28, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.02em" },
  subtitle: { marginTop: 6, marginBottom: 0, color: "#94A3B8", fontSize: 13 },
  refreshBtn: {
    display: "flex", alignItems: "center", gap: 6,
    background: "#fff", border: "1px solid #E2E8F0", color: "#475569",
    padding: "9px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
  },
  errorBanner: {
    marginBottom: 16, padding: "12px 16px",
    background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10,
    color: "#B91C1C", fontSize: 13, fontWeight: 600,
    display: "flex", alignItems: "center", gap: 8,
  },
  kpiGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 14, marginBottom: 16,
  },
  metricCard: {
    background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14,
    padding: "18px 20px", boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
  },
  metricLabel: { fontSize: 10, color: "#94A3B8", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" },
  metricValue: { fontSize: 22, fontWeight: 800, color: "#0F172A", marginTop: 3, letterSpacing: "-0.02em" },
  metricSub:   { fontSize: 11, color: "#94A3B8", marginTop: 2 },
  ratioCard: {
    background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12,
    padding: "14px 18px", marginBottom: 16,
    boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
  },
  filterCard: {
    background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14,
    padding: "16px 18px", marginBottom: 16, boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
  },
  filterRow: { display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" },
  filterLabel: {
    display: "block", fontSize: 10, color: "#64748B",
    fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
  },
  input: {
    width: "100%", border: "1px solid #E2E8F0", borderRadius: 8,
    padding: "9px 12px 9px 30px", fontSize: 13, color: "#0F172A", outline: "none",
    transition: "border-color 0.15s",
  },
  inputIcon: {
    position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)",
    color: "#94A3B8", pointerEvents: "none",
  },
  select: {
    width: "100%", border: "1px solid #E2E8F0", borderRadius: 8,
    padding: "9px 10px", fontSize: 13, color: "#0F172A",
    marginTop: 6, outline: "none", background: "#fff", cursor: "pointer",
  },
  clearBtn: {
    display: "flex", alignItems: "center", gap: 5,
    border: "1px solid #E2E8F0", background: "#fff", color: "#64748B",
    padding: "9px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
  },
  tableCard: {
    background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14,
    overflow: "hidden", boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
  },
  tableHeader: {
    padding: "14px 18px", borderBottom: "1px solid #F1F5F9",
    display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
  },
  badge: {
    background: "#EEF2FF", color: "#6366F1",
    fontSize: 11, fontWeight: 800, padding: "2px 7px", borderRadius: 999,
  },
  th: {
    textAlign: "left", padding: "11px 14px", fontSize: 10,
    color: "#64748B", fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.06em", whiteSpace: "nowrap",
  },
  td: { padding: "12px 14px", fontSize: 13, color: "#0F172A" },
  emptyRow: { padding: "40px 24px", textAlign: "center", color: "#94A3B8", fontSize: 14 },
  pagination: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: 10, padding: "12px 18px", borderTop: "1px solid #F1F5F9",
  },
  pill: {
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "4px 9px", borderRadius: 999, fontSize: 11,
    fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
  },
};

export default StudentBalanceHistory;