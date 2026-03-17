import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiCreditCard,
  FiLock,
  FiShield,
  FiSmartphone,
  FiRepeat,
  FiDollarSign,
} from "react-icons/fi";
import Swal from "sweetalert2";

import {
  clearCheckoutError,
  setMetodoSeleccionado,
  setNitCi,
  setRazonSocial,
  setTipoComprobante,
} from "./slicesCheckout/CheckoutSlice";

import {
  confirmarPagoThunk,
  iniciarPagoQrThunk,
  simularPagoTarjetaThunk,
  simularPagoTransferenciaThunk,
  pagarConSaldoThunk,
} from "./slicesCheckout/CheckoutThunk";

const swalTheme = {
  confirmButtonColor: "#704FE6",
  cancelButtonColor: "#4D5756",
  customClass: { popup: "it-cadm-swal-popup" },
  didOpen: () => {
    const container = document.querySelector(".swal2-container");
    if (container) container.style.zIndex = "99999";
  },
};

const formatMoney = (amount, currency = "BOB") =>
  `${currency === "BOB" ? "Bs." : currency} ${Number(amount || 0).toFixed(2)}`;

const normalizeCompra = (compra) => {
  if (!compra) return null;

  const itemsRaw =
    compra.compra_curso ||
    compra.compraCurso ||
    compra.items ||
    compra.detalles ||
    [];

  const items = Array.isArray(itemsRaw)
    ? itemsRaw.map((item, index) => ({
        id: item.id_compra_curso || item.id || `item-${index}`,
        nombre:
          item?.materia?.nombre ||
          item?.curso?.nombre ||
          item?.nombre ||
          item?.titulo ||
          "Curso",
        precio: Number(
          item?.precio_item ??
            item?.precio ??
            item?.subtotal ??
            item?.monto ??
            0
        ),
      }))
    : [];

  return {
    idCompraTotal:
      compra.id_compra_total ??
      compra.idCompraTotal ??
      compra.compra_total_id_compra_total ??
      null,
    total: Number(compra.total ?? 0),
    subtotalCursos: Number(compra.subtotal_cursos ?? compra.total ?? 0),
    saldoUsado: Number(compra.saldo_usado ?? 0),
    totalPagadoExterno: Number(
      compra.total_pagado_externo ?? compra.total ?? 0
    ),
    saldoDisponible: Number(compra.saldo_disponible ?? 0),
    moneda: compra.moneda || "BOB",
    estado: compra.estado || "PENDIENTE",
    items,
  };
};

const getQrImageSrc = (qrValue) => {
  if (!qrValue) return "";
  if (
    qrValue.startsWith("data:image") ||
    qrValue.startsWith("http://") ||
    qrValue.startsWith("https://")
  ) {
    return qrValue;
  }
  return `data:image/png;base64,${qrValue}`;
};

const getNombreDesdePerfil = (perfilState, loginState) => {
  const perfil = perfilState?.perfil || perfilState?.data || perfilState || {};
  const user = loginState?.user || {};

  return (
    perfil?.nombre_completo ||
    `${perfil?.nombre || user?.nombre || ""} ${
      perfil?.apellido || user?.apellido || ""
    }`.trim() ||
    user?.name ||
    user?.nombre ||
    ""
  );
};

const getCiDesdePerfil = (perfilState, loginState) => {
  const perfil = perfilState?.perfil || perfilState?.data || perfilState || {};
  const user = loginState?.user || {};

  return (
    perfil?.ci ||
    perfil?.nit_ci ||
    perfil?.nitCi ||
    user?.ci ||
    user?.nit_ci ||
    user?.nitCi ||
    ""
  );
};

const onlyDigits = (value = "") => value.replace(/\D/g, "");

const formatCardNumber = (value = "") => {
  const digits = onlyDigits(value).slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};

const formatExpiry = (value = "") => {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const detectCardBrand = (value = "") => {
  const digits = onlyDigits(value);

  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "American Express";
  if (/^(6011|65|64[4-9])/.test(digits)) return "Discover";
  if (/^(36|38|39|30[0-5])/.test(digits)) return "Diners Club";
  if (/^35/.test(digits)) return "JCB";
  if (/^(50|56|57|58|6)/.test(digits)) return "Maestro";

  return "Tarjeta";
};

const luhnCheck = (value = "") => {
  const digits = onlyDigits(value);
  if (digits.length < 13) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

const BrandLogo = ({ brand }) => {
  const normalized = String(brand || "").toLowerCase();

  if (normalized === "visa") {
    return <span className="checkoutx-brand-logo visa">VISA</span>;
  }

  if (normalized === "mastercard") {
    return (
      <span className="checkoutx-brand-logo mastercard">
        <span className="mc-c1" />
        <span className="mc-c2" />
      </span>
    );
  }

  if (normalized === "american express") {
    return <span className="checkoutx-brand-logo amex">AMEX</span>;
  }

  if (normalized === "discover") {
    return <span className="checkoutx-brand-logo discover">DISCOVER</span>;
  }

  if (normalized === "diners club") {
    return <span className="checkoutx-brand-logo diners">DINERS</span>;
  }

  if (normalized === "jcb") {
    return <span className="checkoutx-brand-logo jcb">JCB</span>;
  }

  if (normalized === "maestro") {
    return <span className="checkoutx-brand-logo maestro">MAESTRO</span>;
  }

  return <span className="checkoutx-brand-logo generic">CARD</span>;
};

const CheckoutEstudiante = ({ onBack, onSuccess }) => {
  const dispatch = useDispatch();

  const {
    compraActual,
    metodoSeleccionado,
    tipoComprobante,
    razonSocial,
    nitCi,
    qrData,
    pago,
    factura,
    loading,
    procesandoTarjeta,
    procesandoTransferencia,
    procesandoSaldo,
    pagoConfirmado,
    error,
    successMessage,
  } = useSelector((state) => state.checkout);

  const perfilState = useSelector((state) => state.perfil);
  const loginState = useSelector((state) => state.login);

  const compra = useMemo(() => normalizeCompra(compraActual), [compraActual]);

  const qrAutoConfirmRef = useRef(false);
  const successTriggeredRef = useRef(false);
  const qrTimerRef = useRef(null);

  const [qrSecondsLeft, setQrSecondsLeft] = useState(10);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [usarSaldo, setUsarSaldo] = useState(true);

  const cardBrand = detectCardBrand(cardNumber);
  const cardValid = luhnCheck(cardNumber);
  const qrImageSrc = getQrImageSrc(qrData?.qr);

  const subtotalCursos = Number(compra?.subtotalCursos ?? compra?.total ?? 0);
  const saldoDisponibleActual = Number(compra?.saldoDisponible ?? 0);

  const saldoAplicadoCalculado = usarSaldo
    ? Math.min(saldoDisponibleActual, subtotalCursos)
    : 0;

  const montoPendienteCalculado = Math.max(
    subtotalCursos - saldoAplicadoCalculado,
    0
  );

  const puedePagarSoloConSaldo =
    usarSaldo && montoPendienteCalculado === 0 && saldoAplicadoCalculado > 0;

  useEffect(() => {
    if (!compra) return;
    setUsarSaldo(Number(compra?.saldoDisponible || 0) > 0);
  }, [compra?.idCompraTotal, compra?.saldoDisponible]);

  useEffect(() => {
    successTriggeredRef.current = false;
  }, [compra?.idCompraTotal]);

  useEffect(() => {
    if (!razonSocial) {
      const nombre = getNombreDesdePerfil(perfilState, loginState);
      if (nombre) dispatch(setRazonSocial(nombre));
    }

    if (!nitCi) {
      const ci = getCiDesdePerfil(perfilState, loginState);
      if (ci) dispatch(setNitCi(ci));
    }
  }, [dispatch, perfilState, loginState, razonSocial, nitCi]);

  useEffect(() => {
    qrAutoConfirmRef.current = false;
    setQrSecondsLeft(10);

    if (qrTimerRef.current) {
      clearInterval(qrTimerRef.current);
      qrTimerRef.current = null;
    }

    if (
      metodoSeleccionado !== "QR" ||
      !qrData?.qr ||
      pagoConfirmado ||
      !compra?.idCompraTotal
    ) {
      return;
    }

    qrTimerRef.current = setInterval(() => {
      setQrSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(qrTimerRef.current);
          qrTimerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (qrTimerRef.current) {
        clearInterval(qrTimerRef.current);
        qrTimerRef.current = null;
      }
    };
  }, [metodoSeleccionado, qrData?.qr, pagoConfirmado, compra?.idCompraTotal]);

  useEffect(() => {
    if (metodoSeleccionado !== "QR") return;
    if (!qrData?.qr) return;
    if (!compra?.idCompraTotal) return;
    if (pagoConfirmado) return;
    if (qrAutoConfirmRef.current) return;
    if (qrSecondsLeft > 0) return;

    qrAutoConfirmRef.current = true;

    dispatch(
      confirmarPagoThunk({
        idCompraTotal: compra.idCompraTotal,
        tipo: tipoComprobante,
        razonSocial,
        nitCi,
      })
    );
  }, [
    dispatch,
    metodoSeleccionado,
    qrData?.qr,
    qrSecondsLeft,
    pagoConfirmado,
    compra?.idCompraTotal,
    tipoComprobante,
    razonSocial,
    nitCi,
  ]);

  useEffect(() => {
    if (!pagoConfirmado || successTriggeredRef.current) return;

    successTriggeredRef.current = true;

    const comprobanteEnviado =
      pago?.comprobante_enviado ??
      pago?.comprobanteEnviado ??
      true;

    if (typeof onSuccess === "function") {
      onSuccess({
        factura,
        compra,
        pago,
        comprobanteEnviado,
      });
    }

    if (!comprobanteEnviado) {
      Swal.fire({
        icon: "warning",
        title: "Pago confirmado",
        text: "El pago fue confirmado, pero no se pudo enviar el comprobante por correo.",
        ...swalTheme,
      });
    }
  }, [pagoConfirmado, onSuccess, factura, compra, pago]);

  useEffect(() => {
    if (!error) return;

    const lowered = String(error).toLowerCase();
    if (
      lowered.includes("ya fue confirmado") ||
      lowered.includes("ya está confirmado") ||
      lowered.includes("ya está completada") ||
      lowered.includes("ya está completado")
    ) {
      dispatch(clearCheckoutError());
    }
  }, [error, dispatch]);

  const validateBilling = () => {
    if (!compra?.idCompraTotal) return "No se encontró una compra válida.";
    if (!tipoComprobante) return "Selecciona el tipo de comprobante.";
    if (!razonSocial.trim()) return "Ingresa el nombre o razón social.";
    if (!nitCi.trim()) return "Ingresa el CI o NIT.";
    return null;
  };

  const validateCard = () => {
    if (!cardName.trim()) return "Ingresa el nombre del titular.";
    if (onlyDigits(cardNumber).length < 13)
      return "Ingresa un número de tarjeta válido.";
    if (!cardValid) return "El número de tarjeta no es válido.";
    if (onlyDigits(cardExpiry).length !== 4)
      return "Ingresa una fecha de vencimiento válida.";
    if (onlyDigits(cardCvv).length < 3) return "Ingresa un CVV válido.";
    return null;
  };

  const showWarning = async (title, text) => {
    await Swal.fire({
      icon: "warning",
      title,
      text,
      ...swalTheme,
      showCancelButton: false,
    });
  };

  const handleGenerarQr = async () => {
    const validationError = validateBilling();
    if (validationError) {
      await showWarning("Datos incompletos", validationError);
      return;
    }

    if (montoPendienteCalculado <= 0) {
      await showWarning(
        "Pago externo no requerido",
        "Con el saldo aplicado ya no necesitas generar un QR."
      );
      return;
    }

    try {
      await dispatch(
        iniciarPagoQrThunk({
          idCompraTotal: compra.idCompraTotal,
          total: montoPendienteCalculado,
          moneda: compra.moneda,
          gloss: "Pago de inscripción",
          additionalData: `Compra ${compra.idCompraTotal}`,
        })
      ).unwrap();
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "No se pudo generar el QR",
        text: err || "Ocurrió un error al generar el código QR.",
        ...swalTheme,
      });
    }
  };

  const handlePagarTarjeta = async () => {
    const billingError = validateBilling();
    if (billingError) {
      await showWarning("Datos incompletos", billingError);
      return;
    }

    const cardError = validateCard();
    if (cardError) {
      await showWarning("Tarjeta no válida", cardError);
      return;
    }

    if (montoPendienteCalculado <= 0) {
      await showWarning(
        "Pago externo no requerido",
        "Con el saldo aplicado ya no necesitas pagar con tarjeta."
      );
      return;
    }

    try {
      await dispatch(
        simularPagoTarjetaThunk({
          idCompraTotal: compra.idCompraTotal,
          total: montoPendienteCalculado,
          tipo: tipoComprobante,
          razonSocial,
          nitCi,
        })
      ).unwrap();
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "No se pudo procesar el pago",
        text: err || "Ocurrió un error al procesar el pago con tarjeta.",
        ...swalTheme,
      });
    }
  };

  const handlePagarTransferencia = async () => {
    const billingError = validateBilling();
    if (billingError) {
      await showWarning("Datos incompletos", billingError);
      return;
    }

    if (montoPendienteCalculado <= 0) {
      await showWarning(
        "Pago externo no requerido",
        "Con el saldo aplicado ya no necesitas hacer transferencia."
      );
      return;
    }

    try {
      await dispatch(
        simularPagoTransferenciaThunk({
          idCompraTotal: compra.idCompraTotal,
          total: montoPendienteCalculado,
          tipo: tipoComprobante,
          razonSocial,
          nitCi,
        })
      ).unwrap();
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "No se pudo procesar la transferencia",
        text: err || "Ocurrió un error al confirmar la transferencia.",
        ...swalTheme,
      });
    }
  };

  const handlePagarConSaldo = async () => {
    const billingError = validateBilling();
    if (billingError) {
      await showWarning("Datos incompletos", billingError);
      return;
    }

    if (!puedePagarSoloConSaldo) {
      await showWarning(
        "Saldo insuficiente",
        "Tu saldo no cubre el total completo de la compra."
      );
      return;
    }

    try {
      await dispatch(
        pagarConSaldoThunk({
          idCompraTotal: compra.idCompraTotal,
          tipo: tipoComprobante,
          razonSocial,
          nitCi,
        })
      ).unwrap();
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "No se pudo procesar el pago",
        text: err || "Ocurrió un error al pagar con saldo.",
        ...swalTheme,
      });
    }
  };

  if (!compra) {
    return (
      <div className="checkoutx-root">
        <style>{styles}</style>
        <div className="checkoutx-empty">
          <h3>No hay una compra seleccionada</h3>
          <p>Vuelve al carrito para continuar.</p>
          <button className="checkoutx-back-btn" onClick={onBack}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="checkoutx-root">
        <div className="checkoutx-shell">
          <div className="checkoutx-topbar">
            <div className="checkoutx-topbar__left">
              <div className="checkoutx-topbar__accent" />
              <div>
                <h2 className="checkoutx-topbar__title">Finalizar compra</h2>
                <p className="checkoutx-topbar__sub">
                  Completa tus datos, elige el método de pago y confirma tu inscripción.
                </p>
              </div>
            </div>

            <button className="checkoutx-back-btn" onClick={onBack}>
              <FiArrowLeft />
              <span>Volver al carrito</span>
            </button>
          </div>

          <div className="checkoutx-content">
            {error && (
              <div className="checkoutx-alert checkoutx-alert--error">{error}</div>
            )}

            {successMessage && !pagoConfirmado && (
              <div className="checkoutx-alert checkoutx-alert--success">
                {successMessage}
              </div>
            )}

            {pagoConfirmado && (
              <div className="checkoutx-alert checkoutx-alert--success">
                <FiCheckCircle />
                <span>
                  Pago confirmado correctamente
                  {factura?.numero ? ` · Comprobante N° ${factura.numero}` : ""}
                </span>
              </div>
            )}

            <div className="checkoutx-grid">
              <section className="checkoutx-card checkoutx-main">
                <div className="checkoutx-section">
                  <h3 className="checkoutx-section-title">Datos de facturación</h3>

                  <div className="checkoutx-field">
                    <label>Tipo de comprobante</label>
                    <select
                      value={tipoComprobante}
                      onChange={(e) => dispatch(setTipoComprobante(e.target.value))}
                      disabled={loading || pagoConfirmado}
                    >
                      <option value="RECIBO">RECIBO</option>
                      <option value="FACTURA">FACTURA</option>
                    </select>
                  </div>

                  <div className="checkoutx-field">
                    <label>
                      {tipoComprobante === "FACTURA"
                        ? "Razón social"
                        : "Nombre completo"}
                    </label>
                    <input
                      type="text"
                      value={razonSocial}
                      onChange={(e) => dispatch(setRazonSocial(e.target.value))}
                      placeholder={
                        tipoComprobante === "FACTURA"
                          ? "Ingresa la razón social"
                          : "Ingresa tu nombre completo"
                      }
                      disabled={loading || pagoConfirmado}
                    />
                  </div>

                  <div className="checkoutx-field">
                    <label>{tipoComprobante === "FACTURA" ? "NIT" : "CI / NIT"}</label>
                    <input
                      type="text"
                      value={nitCi}
                      onChange={(e) => dispatch(setNitCi(e.target.value))}
                      placeholder="Ingresa el dato de identificación"
                      disabled={loading || pagoConfirmado}
                    />
                  </div>
                </div>

                <div className="checkoutx-section">
                  <div className="checkoutx-pay-header">
                    <div>
                      <h3 className="checkoutx-section-title">Aplicación de saldo</h3>
                      <p className="checkoutx-muted">
                        Decide si quieres reducir el monto usando tu saldo disponible.
                      </p>
                    </div>
                  </div>

                  <div className="checkoutx-balance-card">
                    <div className="checkoutx-balance-card__row">
                      <div>
                        <span className="checkoutx-balance-card__label">Usar saldo disponible</span>
                        <strong className="checkoutx-balance-card__value">
                          {formatMoney(saldoDisponibleActual, compra.moneda)}
                        </strong>
                      </div>

                      <label className="checkoutx-switch">
                        <input
                          type="checkbox"
                          checked={usarSaldo}
                          onChange={(e) => setUsarSaldo(e.target.checked)}
                          disabled={loading || pagoConfirmado || saldoDisponibleActual <= 0}
                        />
                        <span className="checkoutx-switch__track" />
                      </label>
                    </div>

                    <div className="checkoutx-balance-grid">
                      <div className="checkoutx-mini-box">
                        <span>Subtotal</span>
                        <strong>{formatMoney(subtotalCursos, compra.moneda)}</strong>
                      </div>

                      <div className="checkoutx-mini-box">
                        <span>Saldo aplicado</span>
                        <strong>{formatMoney(saldoAplicadoCalculado, compra.moneda)}</strong>
                      </div>

                      <div className="checkoutx-mini-box highlight">
                        <span>Monto pendiente</span>
                        <strong>{formatMoney(montoPendienteCalculado, compra.moneda)}</strong>
                      </div>
                    </div>

                    {usarSaldo && saldoAplicadoCalculado > 0 && (
                      <p className="checkoutx-note-success">
                        Se aplicará saldo automáticamente para reducir tu pago.
                      </p>
                    )}

                    {!usarSaldo && saldoDisponibleActual > 0 && (
                      <p className="checkoutx-note-error">
                        No se usará tu saldo; pagarás el total completo externamente.
                      </p>
                    )}
                  </div>
                </div>

                <div className="checkoutx-section">
                  <div className="checkoutx-pay-header">
                    <div>
                      <h3 className="checkoutx-section-title">Método de pago</h3>
                      <p className="checkoutx-muted">
                        Elige la forma de pago que prefieras.
                      </p>
                    </div>

                    <div className="checkoutx-security">
                      <FiShield />
                      <span>Proceso seguro</span>
                    </div>
                  </div>

                  <div className="checkoutx-methods checkoutx-methods--four">
                    <button
                      type="button"
                      className={`checkoutx-method-btn ${
                        metodoSeleccionado === "QR" ? "active" : ""
                      }`}
                      onClick={() => dispatch(setMetodoSeleccionado("QR"))}
                      disabled={loading || pagoConfirmado}
                    >
                      <FiSmartphone />
                      <span>Pago por QR</span>
                    </button>

                    <button
                      type="button"
                      className={`checkoutx-method-btn ${
                        metodoSeleccionado === "TARJETA" ? "active" : ""
                      }`}
                      onClick={() => dispatch(setMetodoSeleccionado("TARJETA"))}
                      disabled={loading || pagoConfirmado}
                    >
                      <FiCreditCard />
                      <span>Tarjeta</span>
                    </button>

                    <button
                      type="button"
                      className={`checkoutx-method-btn ${
                        metodoSeleccionado === "TRANSFERENCIA" ? "active" : ""
                      }`}
                      onClick={() => dispatch(setMetodoSeleccionado("TRANSFERENCIA"))}
                      disabled={loading || pagoConfirmado}
                    >
                      <FiRepeat />
                      <span>Transferencia</span>
                    </button>

                    <button
                      type="button"
                      className={`checkoutx-method-btn ${
                        metodoSeleccionado === "SALDO" ? "active" : ""
                      }`}
                      onClick={() => dispatch(setMetodoSeleccionado("SALDO"))}
                      disabled={loading || pagoConfirmado || !puedePagarSoloConSaldo}
                    >
                      <FiDollarSign />
                      <span>Saldo</span>
                    </button>
                  </div>

                  {metodoSeleccionado === "QR" && (
                    <div className="checkoutx-paybox">
                      <div className="checkoutx-paybox-head">
                        <div>
                          <h4>Pago con QR</h4>
                          <p>
                            Genera tu código QR para pagar{" "}
                            <strong>{formatMoney(montoPendienteCalculado, compra.moneda)}</strong>.
                          </p>
                        </div>

                        {!pagoConfirmado && (
                          <button
                            type="button"
                            className="checkoutx-primary-btn"
                            onClick={handleGenerarQr}
                            disabled={loading || montoPendienteCalculado <= 0}
                          >
                            {loading ? "Generando..." : "Generar QR"}
                          </button>
                        )}
                      </div>

                      {qrData?.qr && (
                        <div className="checkoutx-qr-wrap">
                          <div className="checkoutx-qr-box">
                            <img src={qrImageSrc} alt="QR de pago" />
                          </div>

                          <div className="checkoutx-qr-statuses">
                            <span className="checkoutx-status-pill">
                              Tiempo restante: {qrSecondsLeft}s
                            </span>
                          </div>

                          {!pagoConfirmado && qrSecondsLeft > 0 && (
                            <p className="checkoutx-note-success">
                              Procesando pago...
                            </p>
                          )}

                          {!pagoConfirmado && qrSecondsLeft === 0 && (
                            <p className="checkoutx-note-success">
                              Confirmando inscripción...
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {metodoSeleccionado === "TARJETA" && (
                    <div className="checkoutx-paybox">
                      <div className="checkoutx-card-preview">
                        <div className="checkoutx-card-preview__top">
                          <span className="checkoutx-card-chip" />
                          <BrandLogo brand={cardBrand} />
                        </div>

                        <div className="checkoutx-card-number">
                          {cardNumber || "•••• •••• •••• ••••"}
                        </div>

                        <div className="checkoutx-card-preview__bottom">
                          <div>
                            <small>Titular</small>
                            <strong>{cardName || "NOMBRE DEL TITULAR"}</strong>
                          </div>
                          <div>
                            <small>Vence</small>
                            <strong>{cardExpiry || "MM/AA"}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="checkoutx-card-form">
                        <div className="checkoutx-field">
                          <label>Nombre del titular</label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Nombre como figura en la tarjeta"
                            disabled={loading || pagoConfirmado}
                          />
                        </div>

                        <div className="checkoutx-field">
                          <label>Número de tarjeta</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) =>
                              setCardNumber(formatCardNumber(e.target.value))
                            }
                            placeholder="0000 0000 0000 0000"
                            disabled={loading || pagoConfirmado}
                          />
                          <div className="checkoutx-inline-meta">
                            <span>{cardBrand}</span>
                            <span className={cardValid ? "valid" : ""}>
                              {onlyDigits(cardNumber).length >= 13
                                ? cardValid
                                  ? "Número válido"
                                  : "Número inválido"
                                : "Ingresa tu tarjeta"}
                            </span>
                          </div>
                        </div>

                        <div className="checkoutx-card-grid">
                          <div className="checkoutx-field">
                            <label>Vencimiento</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) =>
                                setCardExpiry(formatExpiry(e.target.value))
                              }
                              placeholder="MM/AA"
                              disabled={loading || pagoConfirmado}
                            />
                          </div>

                          <div className="checkoutx-field">
                            <label>CVV</label>
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(e) =>
                                setCardCvv(onlyDigits(e.target.value).slice(0, 4))
                              }
                              placeholder="***"
                              disabled={loading || pagoConfirmado}
                            />
                          </div>
                        </div>

                        <div className="checkoutx-card-secure">
                          <FiLock />
                          <span>Tus datos se procesan de forma segura.</span>
                        </div>

                        {!pagoConfirmado && (
                          <button
                            type="button"
                            className="checkoutx-primary-btn checkoutx-primary-btn--green"
                            onClick={handlePagarTarjeta}
                            disabled={loading || montoPendienteCalculado <= 0}
                          >
                            {procesandoTarjeta
                              ? "Procesando pago..."
                              : `Pagar ${formatMoney(
                                  montoPendienteCalculado,
                                  compra.moneda
                                )}`}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {metodoSeleccionado === "TRANSFERENCIA" && (
                    <div className="checkoutx-paybox">
                      <div className="checkoutx-paybox-head">
                        <div>
                          <h4>Transferencia bancaria</h4>
                          <p>
                            Usa los siguientes datos para pagar{" "}
                            <strong>{formatMoney(montoPendienteCalculado, compra.moneda)}</strong>.
                          </p>
                        </div>
                      </div>

                      <div className="checkoutx-transfer-box">
                        <div className="checkoutx-transfer-row">
                          <span>Banco</span>
                          <strong>Banco Nacional de Bolivia</strong>
                        </div>
                        <div className="checkoutx-transfer-row">
                          <span>Titular</span>
                          <strong>Universidad Católica Boliviana</strong>
                        </div>
                        <div className="checkoutx-transfer-row">
                          <span>Número de cuenta</span>
                          <strong>100-200-300-400</strong>
                        </div>
                        <div className="checkoutx-transfer-row">
                          <span>Moneda</span>
                          <strong>{compra.moneda}</strong>
                        </div>
                        <div className="checkoutx-transfer-row">
                          <span>Monto</span>
                          <strong>
                            {formatMoney(montoPendienteCalculado, compra.moneda)}
                          </strong>
                        </div>
                      </div>

                      {!pagoConfirmado && (
                        <button
                          type="button"
                          className="checkoutx-primary-btn"
                          onClick={handlePagarTransferencia}
                          disabled={loading || montoPendienteCalculado <= 0}
                        >
                          {procesandoTransferencia
                            ? "Procesando pago..."
                            : "Confirmar transferencia"}
                        </button>
                      )}
                    </div>
                  )}

                  {metodoSeleccionado === "SALDO" && (
                    <div className="checkoutx-paybox">
                      <div className="checkoutx-paybox-head">
                        <div>
                          <h4>Pago con saldo</h4>
                          <p>Usa tu saldo disponible para cubrir el total de la compra.</p>
                        </div>
                      </div>

                      <div className="checkoutx-transfer-box">
                        <div className="checkoutx-transfer-row">
                          <span>Saldo disponible</span>
                          <strong>{formatMoney(saldoDisponibleActual, compra.moneda)}</strong>
                        </div>
                        <div className="checkoutx-transfer-row">
                          <span>Saldo aplicado</span>
                          <strong>{formatMoney(saldoAplicadoCalculado, compra.moneda)}</strong>
                        </div>
                        <div className="checkoutx-transfer-row">
                          <span>Monto pendiente</span>
                          <strong>{formatMoney(montoPendienteCalculado, compra.moneda)}</strong>
                        </div>
                      </div>

                      {!puedePagarSoloConSaldo && (
                        <p className="checkoutx-note-error">
                          Para pagar solo con saldo, el monto pendiente debe quedar en cero.
                        </p>
                      )}

                      {!pagoConfirmado && (
                        <button
                          type="button"
                          className="checkoutx-primary-btn checkoutx-primary-btn--green"
                          onClick={handlePagarConSaldo}
                          disabled={loading || !puedePagarSoloConSaldo}
                        >
                          {procesandoSaldo
                            ? "Procesando pago..."
                            : "Pagar con saldo"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </section>

              <aside className="checkoutx-card checkoutx-summary">
                <h3 className="checkoutx-section-title">Resumen del pedido</h3>

                <div className="checkoutx-summary-block">
                  <span className="checkoutx-label">Estado</span>
                  <strong>{compra.estado}</strong>
                </div>

                <div className="checkoutx-order-list">
                  {compra.items.length > 0 ? (
                    compra.items.map((item) => (
                      <div className="checkoutx-order-item" key={item.id}>
                        <div>
                          <h4>{item.nombre}</h4>
                        </div>
                        <strong>{formatMoney(item.precio, compra.moneda)}</strong>
                      </div>
                    ))
                  ) : (
                    <div className="checkoutx-order-item">
                      <div>
                        <h4>Compra académica</h4>
                      </div>
                      <strong>{formatMoney(compra.total, compra.moneda)}</strong>
                    </div>
                  )}
                </div>

                <div className="checkoutx-summary-totals">
                  <div>
                    <span>Subtotal cursos</span>
                    <strong>{formatMoney(subtotalCursos, compra.moneda)}</strong>
                  </div>
                  <div>
                    <span>Saldo aplicado</span>
                    <strong>{formatMoney(saldoAplicadoCalculado, compra.moneda)}</strong>
                  </div>
                  <div>
                    <span>Pago externo</span>
                    <strong>{formatMoney(montoPendienteCalculado, compra.moneda)}</strong>
                  </div>
                  <div className="checkoutx-total-row">
                    <span>Total</span>
                    <strong>{formatMoney(subtotalCursos, compra.moneda)}</strong>
                  </div>
                </div>

                <div className="checkoutx-summary-method">
                  <span className="checkoutx-label">Método seleccionado</span>
                  <strong>
                    {metodoSeleccionado === "QR"
                      ? "Pago por QR"
                      : metodoSeleccionado === "TARJETA"
                      ? cardBrand
                      : metodoSeleccionado === "TRANSFERENCIA"
                      ? "Transferencia"
                      : "Saldo"}
                  </strong>
                </div>

                {factura && pagoConfirmado && (
                  <div className="checkoutx-proof">
                    <h3>Comprobante generado</h3>
                    <p><strong>Tipo:</strong> {factura.tipo}</p>
                    <p><strong>Número:</strong> {factura.numero}</p>
                    <p><strong>A nombre de:</strong> {factura.razon_social}</p>
                    <p><strong>CI / NIT:</strong> {factura.nit_ci}</p>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = `
  .checkoutx-root{
    min-height:100%;
    padding:16px 18px 22px;
    background:transparent;
    box-sizing:border-box;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  }

  .checkoutx-shell{
    background:#ffffff;
    border:1px solid #e7edf5;
    border-radius:22px;
    box-shadow:0 12px 32px rgba(15, 23, 42, 0.05);
    overflow:hidden;
  }

  .checkoutx-topbar{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:18px;
    flex-wrap:wrap;
    padding:18px 20px 16px;
    border-bottom:1px solid #eef2f7;
    background:#ffffff;
  }

  .checkoutx-topbar__left{
    display:flex;
    align-items:flex-start;
    gap:14px;
  }

  .checkoutx-topbar__accent{
    width:8px;
    height:40px;
    border-radius:999px;
    background:linear-gradient(180deg,#7c5cff 0%, #6d5dfd 100%);
    margin-top:2px;
    flex-shrink:0;
  }

  .checkoutx-topbar__title{
    margin:0;
    font-size:20px;
    line-height:1.12;
    font-weight:900;
    color:#111827;
  }

  .checkoutx-topbar__sub{
    margin:5px 0 0;
    color:#667085;
    font-size:13px;
    line-height:1.55;
    font-weight:700;
  }

  .checkoutx-content{
    padding:20px;
    background:#ffffff;
  }

  .checkoutx-back-btn{
    border:1px solid #dbe1ec;
    background:#fff;
    color:#1b2437;
    border-radius:14px;
    padding:11px 14px;
    display:inline-flex;
    align-items:center;
    gap:8px;
    font-weight:800;
    cursor:pointer;
    transition:.18s ease;
  }

  .checkoutx-back-btn:hover{
    background:#f9fbff;
    transform:translateY(-1px);
  }

  .checkoutx-alert{
    border-radius:16px;
    padding:14px 16px;
    margin-bottom:18px;
    font-weight:800;
    display:flex;
    align-items:center;
    gap:10px;
  }

  .checkoutx-alert--error{
    background:#fff1f1;
    color:#9f2f2f;
    border:1px solid #f2c6c6;
  }

  .checkoutx-alert--success{
    background:#eefbf3;
    color:#1f6b42;
    border:1px solid #c9edd6;
  }

  .checkoutx-grid{
    display:grid;
    grid-template-columns:minmax(0, 1.3fr) minmax(320px, .9fr);
    gap:24px;
    align-items:start;
  }

  .checkoutx-card{
    background:#fff;
    border:1px solid #e7edf5;
    border-radius:22px;
    box-shadow:0 10px 24px rgba(15,23,42,.05);
  }

  .checkoutx-main{
    padding:22px;
  }

  .checkoutx-summary{
    padding:22px;
    position:sticky;
    top:20px;
  }

  .checkoutx-section + .checkoutx-section{
    margin-top:26px;
    padding-top:24px;
    border-top:1px solid #edf1f8;
  }

  .checkoutx-section-title{
    margin:0 0 18px;
    font-size:20px;
    color:#111827;
    font-weight:900;
  }

  .checkoutx-field{
    display:flex;
    flex-direction:column;
    gap:10px;
    margin-bottom:18px;
  }

  .checkoutx-field label{
    font-size:13px;
    color:#344054;
    font-weight:800;
  }

  .checkoutx-field input,
  .checkoutx-field select{
    width:100%;
    min-height:48px;
    border:1px solid #d7dfec;
    border-radius:14px;
    background:#fff;
    padding:0 14px;
    font-size:14px;
    color:#1b2437;
    outline:none;
    transition:.18s ease;
    box-sizing:border-box;
  }

  .checkoutx-field input:focus,
  .checkoutx-field select:focus{
    border-color:#704FE6;
    box-shadow:0 0 0 4px rgba(112,79,230,.10);
  }

  .checkoutx-pay-header{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:14px;
    margin-bottom:18px;
    flex-wrap:wrap;
  }

  .checkoutx-muted{
    margin:6px 0 0;
    color:#667085;
    font-size:13px;
    line-height:1.5;
    font-weight:700;
  }

  .checkoutx-security{
    display:inline-flex;
    align-items:center;
    gap:8px;
    padding:10px 12px;
    border-radius:999px;
    background:#f4f8ff;
    border:1px solid #dce7fb;
    color:#244b86;
    font-size:12px;
    font-weight:800;
  }

  .checkoutx-balance-card{
    border:1px solid #e6ebf4;
    background:linear-gradient(180deg,#fbfcff 0%, #f7f9fd 100%);
    border-radius:18px;
    padding:18px;
  }

  .checkoutx-balance-card__row{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:14px;
    margin-bottom:16px;
  }

  .checkoutx-balance-card__label{
    display:block;
    font-size:13px;
    color:#667085;
    font-weight:800;
    margin-bottom:6px;
  }

  .checkoutx-balance-card__value{
    color:#111827;
    font-size:18px;
    font-weight:900;
  }

  .checkoutx-switch{
    position:relative;
    display:inline-flex;
    align-items:center;
    cursor:pointer;
  }

  .checkoutx-switch input{
    display:none;
  }

  .checkoutx-switch__track{
    width:54px;
    height:30px;
    border-radius:999px;
    background:#d0d5dd;
    position:relative;
    transition:.18s ease;
  }

  .checkoutx-switch__track::after{
    content:"";
    position:absolute;
    top:4px;
    left:4px;
    width:22px;
    height:22px;
    border-radius:50%;
    background:#fff;
    box-shadow:0 2px 6px rgba(0,0,0,.18);
    transition:.18s ease;
  }

  .checkoutx-switch input:checked + .checkoutx-switch__track{
    background:#7c5cff;
  }

  .checkoutx-switch input:checked + .checkoutx-switch__track::after{
    left:28px;
  }

  .checkoutx-balance-grid{
    display:grid;
    grid-template-columns:repeat(3, minmax(0, 1fr));
    gap:12px;
  }

  .checkoutx-mini-box{
    padding:14px;
    border-radius:14px;
    border:1px solid #e5ebf4;
    background:#fff;
  }

  .checkoutx-mini-box span{
    display:block;
    font-size:12px;
    color:#667085;
    font-weight:800;
    margin-bottom:8px;
  }

  .checkoutx-mini-box strong{
    color:#111827;
    font-size:16px;
    font-weight:900;
  }

  .checkoutx-mini-box.highlight{
    background:#f5f3ff;
    border-color:#ddd6fe;
  }

  .checkoutx-mini-box.highlight strong{
    color:#5b3fd5;
  }

  .checkoutx-methods{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:12px;
    margin-bottom:18px;
  }

  .checkoutx-methods--four{
    grid-template-columns:repeat(4, 1fr);
  }

  .checkoutx-method-btn{
    min-height:52px;
    border-radius:16px;
    border:1px solid #d5ddec;
    background:#fff;
    color:#21314d;
    font-size:14px;
    font-weight:800;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:8px;
    cursor:pointer;
    transition:.18s ease;
  }

  .checkoutx-method-btn.active{
    background:linear-gradient(135deg,#7c5cff 0%, #6d5dfd 100%);
    color:#fff;
    border-color:#6d5dfd;
    box-shadow:0 12px 26px rgba(109,93,253,.22);
  }

  .checkoutx-method-btn:disabled{
    opacity:.65;
    cursor:not-allowed;
  }

  .checkoutx-paybox{
    border:1px solid #e6ebf4;
    background:linear-gradient(180deg,#fbfcff 0%, #f7f9fd 100%);
    border-radius:20px;
    padding:20px;
  }

  .checkoutx-paybox-head{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:16px;
    flex-wrap:wrap;
    margin-bottom:18px;
  }

  .checkoutx-paybox-head h4{
    margin:0 0 8px;
    color:#111827;
    font-size:18px;
    font-weight:900;
  }

  .checkoutx-paybox-head p{
    margin:0;
    color:#667085;
    font-size:14px;
    line-height:1.6;
    font-weight:700;
    max-width:540px;
  }

  .checkoutx-primary-btn{
    min-height:46px;
    border:none;
    border-radius:14px;
    padding:0 18px;
    background:linear-gradient(135deg,#704FE6 0%, #5A3ED7 100%);
    color:#fff;
    font-weight:900;
    font-size:14px;
    cursor:pointer;
    box-shadow:0 12px 22px rgba(112,79,230,.24);
    transition:.18s ease;
  }

  .checkoutx-primary-btn:hover{
    transform:translateY(-1px);
  }

  .checkoutx-primary-btn:disabled{
    opacity:.72;
    cursor:not-allowed;
    transform:none;
  }

  .checkoutx-primary-btn--green{
    background:linear-gradient(135deg,#0f9d58 0%, #0b7f46 100%);
    box-shadow:0 12px 22px rgba(15,157,88,.22);
    width:100%;
  }

  .checkoutx-qr-wrap{
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:14px;
    padding-top:8px;
  }

  .checkoutx-qr-box{
    width:260px;
    height:260px;
    border-radius:22px;
    background:#fff;
    border:1px solid #e6ebf5;
    display:flex;
    align-items:center;
    justify-content:center;
    box-shadow:0 14px 32px rgba(24,42,75,.08);
    padding:18px;
  }

  .checkoutx-qr-box img{
    width:100%;
    height:100%;
    object-fit:contain;
  }

  .checkoutx-qr-statuses{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    justify-content:center;
  }

  .checkoutx-status-pill{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    min-height:34px;
    border-radius:999px;
    padding:0 12px;
    background:#f1f4fa;
    color:#41536f;
    font-size:12px;
    font-weight:800;
    border:1px solid #dde5f0;
  }

  .checkoutx-note-error{
    margin:12px 0 0;
    color:#b33b3b;
    font-size:13px;
    font-weight:800;
  }

  .checkoutx-note-success{
    margin:0;
    color:#167249;
    font-size:13px;
    font-weight:800;
  }

  .checkoutx-card-preview{
    border-radius:24px;
    padding:22px;
    background:
      radial-gradient(circle at top right, rgba(255,255,255,.18), transparent 28%),
      linear-gradient(135deg,#121c2a 0%, #26374b 55%, #0f1722 100%);
    color:#fff;
    box-shadow:0 18px 34px rgba(17,28,44,.22);
    margin-bottom:22px;
  }

  .checkoutx-card-preview__top{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:28px;
  }

  .checkoutx-card-chip{
    width:44px;
    height:32px;
    border-radius:10px;
    background:linear-gradient(135deg,#f4d36d 0%, #d5a93e 100%);
    display:inline-block;
  }

  .checkoutx-brand-logo{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    min-width:74px;
    height:30px;
    border-radius:999px;
    padding:0 10px;
    font-size:11px;
    font-weight:900;
    letter-spacing:.4px;
    background:rgba(255,255,255,.12);
    border:1px solid rgba(255,255,255,.18);
    color:#fff;
  }

  .checkoutx-brand-logo.visa{
    color:#ffffff;
    background:rgba(22, 92, 255, .22);
  }

  .checkoutx-brand-logo.amex{
    background:rgba(34, 165, 224, .22);
  }

  .checkoutx-brand-logo.discover{
    background:rgba(255, 122, 0, .18);
  }

  .checkoutx-brand-logo.diners{
    background:rgba(80, 120, 255, .16);
  }

  .checkoutx-brand-logo.jcb{
    background:rgba(0, 200, 120, .16);
  }

  .checkoutx-brand-logo.maestro{
    background:rgba(255, 0, 102, .16);
  }

  .checkoutx-brand-logo.mastercard{
    min-width:72px;
    gap:0;
    background:transparent;
    border:none;
    padding:0;
  }

  .checkoutx-brand-logo.mastercard .mc-c1,
  .checkoutx-brand-logo.mastercard .mc-c2{
    width:22px;
    height:22px;
    border-radius:50%;
    display:inline-block;
  }

  .checkoutx-brand-logo.mastercard .mc-c1{
    background:#eb001b;
    margin-right:-6px;
    z-index:2;
  }

  .checkoutx-brand-logo.mastercard .mc-c2{
    background:#f79e1b;
    z-index:1;
  }

  .checkoutx-card-number{
    font-size:26px;
    font-weight:900;
    letter-spacing:1px;
    margin-bottom:26px;
    line-height:1.2;
    word-break:break-word;
  }

  .checkoutx-card-preview__bottom{
    display:flex;
    justify-content:space-between;
    gap:16px;
  }

  .checkoutx-card-preview__bottom small{
    display:block;
    color:rgba(255,255,255,.72);
    margin-bottom:6px;
    text-transform:uppercase;
    font-size:10px;
    letter-spacing:.9px;
  }

  .checkoutx-card-preview__bottom strong{
    font-size:13px;
    font-weight:800;
  }

  .checkoutx-card-form{
    display:flex;
    flex-direction:column;
    gap:0;
  }

  .checkoutx-card-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:14px;
  }

  .checkoutx-inline-meta{
    display:flex;
    justify-content:space-between;
    gap:8px;
    color:#6f7d94;
    font-size:12px;
    font-weight:800;
    margin-top:4px;
  }

  .checkoutx-inline-meta .valid{
    color:#14834f;
  }

  .checkoutx-card-secure{
    display:flex;
    align-items:center;
    gap:8px;
    font-size:12px;
    color:#5b6c84;
    font-weight:800;
    background:#fff;
    border:1px solid #e5ebf4;
    border-radius:14px;
    padding:12px 14px;
    margin:2px 0 18px;
  }

  .checkoutx-transfer-box{
    display:flex;
    flex-direction:column;
    gap:12px;
    padding:16px;
    border-radius:16px;
    background:#fff;
    border:1px solid #e5ebf4;
    margin-bottom:18px;
  }

  .checkoutx-transfer-row{
    display:flex;
    justify-content:space-between;
    gap:14px;
    align-items:center;
    font-size:14px;
  }

  .checkoutx-transfer-row span{
    color:#617089;
    font-weight:800;
  }

  .checkoutx-transfer-row strong{
    color:#1b2437;
    font-weight:900;
    text-align:right;
  }

  .checkoutx-summary-block,
  .checkoutx-summary-method{
    margin-bottom:18px;
  }

  .checkoutx-label{
    display:block;
    color:#6b7890;
    font-size:13px;
    margin-bottom:8px;
    font-weight:800;
  }

  .checkoutx-summary-block strong,
  .checkoutx-summary-method strong{
    color:#17263e;
    font-size:16px;
    font-weight:900;
  }

  .checkoutx-order-list{
    display:flex;
    flex-direction:column;
    gap:12px;
    margin:18px 0 22px;
  }

  .checkoutx-order-item{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:12px;
    padding:14px 16px;
    border:1px solid #e5ebf4;
    background:#fff;
    border-radius:16px;
  }

  .checkoutx-order-item h4{
    margin:0;
    color:#1b2437;
    font-size:16px;
    font-weight:900;
    line-height:1.35;
  }

  .checkoutx-order-item strong{
    color:#1b2437;
    font-size:15px;
    font-weight:900;
    white-space:nowrap;
  }

  .checkoutx-summary-totals{
    border-top:1px solid #e8edf6;
    border-bottom:1px solid #e8edf6;
    padding:18px 0;
    display:flex;
    flex-direction:column;
    gap:14px;
    margin-bottom:18px;
  }

  .checkoutx-summary-totals > div{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:12px;
  }

  .checkoutx-summary-totals span{
    color:#57657f;
    font-weight:800;
    font-size:14px;
  }

  .checkoutx-summary-totals strong{
    color:#1d2b44;
    font-size:16px;
    font-weight:900;
  }

  .checkoutx-total-row strong{
    color:#5b3fd5;
    font-size:22px;
  }

  .checkoutx-proof{
    margin-top:22px;
    border:1px solid #dce8dc;
    background:#f6fff8;
    border-radius:16px;
    padding:18px;
  }

  .checkoutx-proof h3{
    margin:0 0 12px;
    color:#1d6a43;
    font-size:16px;
    font-weight:900;
  }

  .checkoutx-proof p{
    margin:0 0 8px;
    color:#345040;
    font-size:14px;
    line-height:1.5;
  }

  .checkoutx-empty{
    min-height:60vh;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    background:#fff;
    border:1px solid #ebeff7;
    border-radius:24px;
    box-shadow:0 18px 44px rgba(18,35,67,.08);
    text-align:center;
    gap:12px;
  }

  .checkoutx-empty h3{
    margin:0;
    color:#163357;
    font-size:28px;
    font-weight:900;
  }

  .checkoutx-empty p{
    margin:0 0 10px;
    color:#6a7690;
    font-size:15px;
    font-weight:700;
  }

  @media (max-width: 1100px){
    .checkoutx-grid{
      grid-template-columns:1fr;
    }

    .checkoutx-summary{
      position:static;
    }

    .checkoutx-methods--four{
      grid-template-columns:1fr 1fr;
    }

    .checkoutx-balance-grid{
      grid-template-columns:1fr;
    }
  }

  @media (max-width: 768px){
    .checkoutx-root{
      padding:12px;
    }

    .checkoutx-topbar,
    .checkoutx-content{
      padding-left:14px;
      padding-right:14px;
    }

    .checkoutx-topbar__title{
      font-size:18px;
    }

    .checkoutx-main,
    .checkoutx-summary{
      padding:18px 16px;
      border-radius:20px;
    }

    .checkoutx-methods,
    .checkoutx-methods--four,
    .checkoutx-card-grid{
      grid-template-columns:1fr;
    }

    .checkoutx-qr-box{
      width:100%;
      max-width:260px;
      height:auto;
      aspect-ratio:1/1;
    }

    .checkoutx-card-number{
      font-size:22px;
    }

    .checkoutx-transfer-row{
      flex-direction:column;
      align-items:flex-start;
    }

    .checkoutx-transfer-row strong{
      text-align:left;
    }
  }
`;

export default CheckoutEstudiante;