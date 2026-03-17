import { createAsyncThunk } from "@reduxjs/toolkit";
import { pagoApi, qrApi, comprobantesApi } from "../../../lib/api";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const extractErrorMessage = (error) => {
  if (!error) return "Ocurrió un error inesperado";

  if (typeof error === "string") return error;

  return (
    error.message ||
    error.msg ||
    error.data?.message ||
    error.data?.msg ||
    "Ocurrió un error inesperado"
  );
};

const createOrReusePago = async ({ idCompraTotal, metodo, monto }) => {
  try {
    const response = await pagoApi.createPago({
      compra_total_id_compra_total: idCompraTotal,
      metodo,
      monto,
    });

    return response;
  } catch (error) {
    const message = extractErrorMessage(error).toLowerCase();

    if (
      message.includes("pago existente reutilizado") ||
      message.includes("ya existe un pago para esta compra total") ||
      message.includes("el pago ya está confirmado") ||
      message.includes("la compra ya está completada")
    ) {
      return { ok: true, reused: true };
    }

    throw error;
  }
};

const intentarEnviarComprobante = async ({ idPago, idCompraTotal }) => {
  try {
    if (idPago) {
      return await comprobantesApi.enviarComprobantePorPago(idPago);
    }

    if (idCompraTotal) {
      return await comprobantesApi.enviarComprobantePorCompraTotal(idCompraTotal);
    }

    return null;
  } catch (error) {
    return {
      ok: false,
      message: extractErrorMessage(error),
    };
  }
};

export const iniciarPagoQrThunk = createAsyncThunk(
  "checkout/iniciarPagoQr",
  async (
    { idCompraTotal, total, moneda = "BOB", gloss, additionalData },
    { rejectWithValue }
  ) => {
    try {
      const createPagoResponse = await createOrReusePago({
        idCompraTotal,
        metodo: "QR",
        monto: total,
      });

      const response = await qrApi.generarQR({
        id_compra_total: idCompraTotal,
        currency: moneda,
        gloss: gloss || "Pago de inscripción",
        amount: Number(total),
        additionalData: additionalData || `Compra ${idCompraTotal}`,
      });

      return {
        ...response,
        compra:
          response?.compra ||
          createPagoResponse?.compra_total ||
          null,
      };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const verificarQrThunk = createAsyncThunk(
  "checkout/verificarQr",
  async ({ idCompraTotal, qrId }, { rejectWithValue }) => {
    try {
      const payload = idCompraTotal
        ? { id_compra_total: idCompraTotal }
        : { qrId };

      const response = await qrApi.verificarPagoQR(payload);
      return response;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const confirmarPagoThunk = createAsyncThunk(
  "checkout/confirmarPago",
  async ({ idCompraTotal, tipo, razonSocial, nitCi }, { rejectWithValue }) => {
    try {
      const response = await pagoApi.confirmarPagoPorCompraTotal(idCompraTotal, {
        tipo,
        razon_social: razonSocial,
        nit_ci: nitCi,
      });

      const comprobanteResult = await intentarEnviarComprobante({
        idPago: response?.pago?.id_pago,
        idCompraTotal,
      });

      return {
        ...response,
        comprobante_enviado: comprobanteResult?.ok === true,
        comprobante_resultado: comprobanteResult || null,
      };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const simularPagoTarjetaThunk = createAsyncThunk(
  "checkout/simularPagoTarjeta",
  async (
    { idCompraTotal, total, tipo, razonSocial, nitCi, delayMs = 2800 },
    { rejectWithValue }
  ) => {
    try {
      await createOrReusePago({
        idCompraTotal,
        metodo: "TARJETA",
        monto: total,
      });

      await sleep(delayMs);

      const response = await pagoApi.confirmarPagoPorCompraTotal(idCompraTotal, {
        tipo,
        razon_social: razonSocial,
        nit_ci: nitCi,
      });

      const comprobanteResult = await intentarEnviarComprobante({
        idPago: response?.pago?.id_pago,
        idCompraTotal,
      });

      return {
        ...response,
        comprobante_enviado: comprobanteResult?.ok === true,
        comprobante_resultado: comprobanteResult || null,
      };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const simularPagoTransferenciaThunk = createAsyncThunk(
  "checkout/simularPagoTransferencia",
  async (
    { idCompraTotal, total, tipo, razonSocial, nitCi, delayMs = 5000 },
    { rejectWithValue }
  ) => {
    try {
      await createOrReusePago({
        idCompraTotal,
        metodo: "TRANSFERENCIA",
        monto: total,
      });

      await sleep(delayMs);

      const response = await pagoApi.confirmarPagoPorCompraTotal(idCompraTotal, {
        tipo,
        razon_social: razonSocial,
        nit_ci: nitCi,
      });

      const comprobanteResult = await intentarEnviarComprobante({
        idPago: response?.pago?.id_pago,
        idCompraTotal,
      });

      return {
        ...response,
        comprobante_enviado: comprobanteResult?.ok === true,
        comprobante_resultado: comprobanteResult || null,
      };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const pagarConSaldoThunk = createAsyncThunk(
  "checkout/pagarConSaldo",
  async ({ idCompraTotal, tipo, razonSocial, nitCi }, { rejectWithValue }) => {
    try {
      const createPagoResponse = await createOrReusePago({
        idCompraTotal,
        metodo: "SALDO",
        monto: 0,
      });

      const response = await pagoApi.confirmarPagoPorCompraTotal(idCompraTotal, {
        tipo,
        razon_social: razonSocial,
        nit_ci: nitCi,
      });

      const comprobanteResult = await intentarEnviarComprobante({
        idPago: response?.pago?.id_pago,
        idCompraTotal,
      });

      return {
        ...response,
        compra:
          response?.compra ||
          response?.compra_total ||
          createPagoResponse?.compra_total ||
          null,
        comprobante_enviado: comprobanteResult?.ok === true,
        comprobante_resultado: comprobanteResult || null,
      };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);