const habilitado = process.env.NEXT_PUBLIC_HABILITAR_LOGS === "true";

const formato = (nivel, mensaje) =>
  `[${new Date().toISOString()}] [${nivel}] ${mensaje}`;

export const logger = {
  info: (mensaje, extra = "") => {
    if (habilitado) console.info(formato("INFO", mensaje), extra);
  },
  warn: (mensaje, extra = "") => console.warn(formato("WARN", mensaje), extra),
  error: (mensaje, extra = "") =>
    console.error(formato("ERROR", mensaje), extra),
};