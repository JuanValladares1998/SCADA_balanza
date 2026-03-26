import Hls from "hls.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CamaraEstado, CamaraModo, LprEvento } from "../types/camara";
import type { Estado } from "../types/Estado";
import PerifericoList, { PerifericoItem } from "../components/PerifericoList";
import DetalleAnprPanel from "../components/DetalleAnprPanel";
import {
  getAnprCameraRecordById,
  type AnprCameraRecord,
  type AnprCameraRecordDetail,
} from "../lib/api/anpr-camera-controller";
import { createMqttClient } from "../lib/mqtt/client";
import { parseMqttAnprMessage } from "../utils/mqtt-anpr";
import { formatearPlaca } from "../utils/placas";

const mockEvento: LprEvento = {
  plate: "ABC-123",
  fiabilidad: 87,
  tiempoProcesamientoMs: 18,
  timestamp: new Date().toISOString(),
  placaUrl: "https://picsum.photos/seed/lpr/400/200",
};

const mockCamara1: CamaraEstado = {
  conectado: true,
  tiempoInicio: 3600,
  numeroReinicio: 2,
  horasAcumuladas: 124,
  fuentePoder: "PoE",
  consumoEnergia: 12.8,
  temperatura: 39.2,
  modoActual: CamaraModo.DAY,
  fps: 12,
  cuentaPlacasDetectadas: 245,
  ratioRespuestasExitosas: 89,
  ratioErrores: 11,
  ultimoEvento: mockEvento,
  alertasInternas: ["Autoexposure", "Low light"],
};

const mockCamara2: CamaraEstado = {
  conectado: true,
  tiempoInicio: 5400,
  numeroReinicio: 1,
  horasAcumuladas: 98,
  fuentePoder: "Dual",
  consumoEnergia: 14.3,
  temperatura: 37.1,
  modoActual: CamaraModo.NIGHT,
  fps: 10,
  cuentaPlacasDetectadas: 193,
  ratioRespuestasExitosas: 82,
  ratioErrores: 18,
  ultimoEvento: { ...mockEvento, plate: "XYZ-987", fiabilidad: 72, timestamp: new Date().toISOString() },
  alertasInternas: ["Low light"],
};

const mockCamaras: Array<{
  id: string;
  nombre: string;
  estado: Estado;
  datos: CamaraEstado;
}> = [
    {
      id: "cam-1",
      nombre: "Camara LPR 1",
      estado: "ok",
      datos: mockCamara1,
    },
    {
      id: "cam-2",
      nombre: "Camara LPR 2",
      estado: "alerta",
      datos: mockCamara2,
    },
  ];

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function IconoModo({ modo }: { modo: CamaraModo }) {
  if (modo === CamaraModo.DAY) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v3" />
        <path d="M12 20v3" />
        <path d="M4.22 4.22l2.12 2.12" />
        <path d="M17.66 17.66l2.12 2.12" />
        <path d="M1 12h3" />
        <path d="M20 12h3" />
        <path d="M4.22 19.78l2.12-2.12" />
        <path d="M17.66 6.34l2.12-2.12" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function PaginaCamaraLPR() {
  const streamUrl = import.meta.env.VITE_CAMERA_LPR_STREAM_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const camaraIdDesdeUrl = searchParams.get("camara");
  const camaraInicial =
    mockCamaras.find((camara) => camara.id === camaraIdDesdeUrl)?.id ?? mockCamaras[0].id;

  const [selectedId, setSelectedId] = useState<string | number>(camaraInicial);
  const [placasRegistradas, setPlacasRegistradas] = useState<AnprCameraRecord[]>([]);
  const [placasError, setPlacasError] = useState<string | null>(null);
  const [cargandoPlacas, setCargandoPlacas] = useState(true);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState<AnprCameraRecordDetail | null>(null);
  const [detalleError, setDetalleError] = useState<string | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [mqttStatus, setMqttStatus] = useState("Desconectado");
  const [mqttMessage, setMqttMessage] = useState<string | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!camaraIdDesdeUrl) {
      setSelectedId(mockCamaras[0].id);
      return;
    }

    const camaraExiste = mockCamaras.some((camara) => camara.id === camaraIdDesdeUrl);
    setSelectedId(camaraExiste ? camaraIdDesdeUrl : mockCamaras[0].id);
  }, [camaraIdDesdeUrl]);

  const nextIdRef = useRef(1);

  useEffect(() => {
    const brokerUrl = import.meta.env.VITE_MQTT_BROKER_WS;

    if (!brokerUrl) {
      setMqttStatus("No configurado");
      setCargandoPlacas(false);
      return;
    }

    const client = createMqttClient(brokerUrl);
    setMqttStatus("Conectando...");

    const agregarPlaca = (registro: AnprCameraRecord) => {
      setPlacasRegistradas((prev) => {
        const next = [registro, ...prev.filter((r) => r.id !== registro.id)];
        if (next.length > 20) {
          next.length = 20;
        }
        return next;
      });
    };

    client.on("connect", () => {
      setMqttStatus("Conectado");
      client.subscribe("/tra/camara/anpr", { qos: 0 }, () => { });
      client.subscribe("tra/camara/anpr", { qos: 0 }, () => { });
    });

    client.on("error", () => {
      setMqttStatus("Error");
      client.end();
    });

    client.on("message", (_, payload) => {
      const payloadString = payload.toString();

      console.log("Mensaje MQTT recibido:", payloadString);

      const registro = parseMqttAnprMessage(payloadString, nextIdRef.current);

      if (registro && registro.apiId === undefined) {
        nextIdRef.current += 1;
      }

      if (registro) {
        setMqttMessage(registro.plate);
        agregarPlaca(registro);
        setPlacasError(null);
      }

      setCargandoPlacas(false);
    });


    return () => {
      client.end();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !streamUrl) {
      return;
    }

    setStreamError(null);
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;

    const intentarReproducir = async () => {
      try {
        await video.play();
      } catch {
        setStreamError("El stream cargo, pero el navegador no pudo iniciar la reproduccion automaticamente.");
      }
    };

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      const onLoadedMetadata = () => {
        void intentarReproducir();
      };
      video.addEventListener("loadedmetadata", onLoadedMetadata);

      return () => {
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
        video.pause();
        video.removeAttribute("src");
        video.load();
      };
    }

    if (!Hls.isSupported()) {
      setStreamError("El navegador no soporta reproduccion HLS.");
      return;
    }

    const hls = new Hls();
    hls.loadSource(streamUrl);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      void intentarReproducir();
    });
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        setStreamError("No se pudo cargar el stream de la camara.");

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.destroy();
        }
      }
    });

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
      hls.destroy();
    };
  }, [streamUrl]);

  const handleSelectCamara = (id: string | number) => {
    const camaraId = String(id);
    setSelectedId(camaraId);
    setSearchParams({ camara: camaraId });
  };

  const handleOpenDetalle = async (registro: AnprCameraRecord) => {
    setCargandoDetalle(true);
    setDetalleError(null);
    setDetalleSeleccionado(null);

    try {
      const apiId = registro.apiId ?? registro.id;

      if (!apiId) {
        throw new Error("No se pudo resolver el id del detalle.");
      }

      const detalle = await getAnprCameraRecordById(apiId);
      setDetalleSeleccionado(detalle);
    } catch {
      setDetalleError("No se pudo cargar el detalle de la placa seleccionada.");
    } finally {
      setCargandoDetalle(false);
    }
  };

  const selectedCamara = mockCamaras.find((c) => c.id === selectedId) ?? mockCamaras[0];

  useEffect(() => {
    const brokerUrl = import.meta.env.VITE_MQTT_BROKER_WS;

    if (!brokerUrl) {
      setMqttStatus("No configurado");
      return;
    }

    const client = createMqttClient(brokerUrl);
    setMqttStatus("Conectando...");

    client.on("connect", () => {
      setMqttStatus("Conectado");
      client.subscribe("camara/lpr/status", { qos: 0 }, () => { });
    });

    client.on("error", () => {
      setMqttStatus("Error");
    });

    client.on("message", (_, payload) => {
      setMqttMessage(payload.toString());
    });

    return () => {
      client.end();
    };
  }, []);

  const confianza = selectedCamara.datos.ultimoEvento?.fiabilidad ?? 0;

  const modoTexto = useMemo(() => {
    return selectedCamara.datos.modoActual === CamaraModo.DAY ? "Dia" : "Noche";
  }, [selectedCamara.datos.modoActual]);

  const camarasItems: PerifericoItem[] = mockCamaras.map((cam) => ({
    id: cam.id,
    nombre: cam.nombre,
    estado: cam.estado,
  }));

  return (
    <main className="p-4 h-screen flex flex-col gap-4">
      <header className="flex flex-wrap justify-between items-start gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold scada-text-primary tracking-tight">Camara LPR Survision</h1>
          <p className="text-sm text-slate-500">Ultima lectura de placa y estado de la camara.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <IconoModo modo={selectedCamara.datos.modoActual} />
            <span className="font-semibold">Modo:</span> {modoTexto}
          </div>
          <div className="text-xs text-slate-500">
            MQTT: <span className="font-semibold text-slate-900">{mqttStatus}</span>
          </div>
        </div>

        {/* {mqttMessage ? (
          <div className="text-xs text-slate-500 w-full">
            Último mensaje MQTT: <span className="text-slate-900 font-semibold">{mqttMessage}</span>
          </div>
        ) : null} */}
      </header>

      <section className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <PerifericoList
          title="Camaras"
          items={camarasItems}
          selectedId={selectedId}
          onSelect={handleSelectCamara}
        />

        <div className="scada-card flex h-full min-h-0 flex-col p-4">
          <h2 className="text-lg font-semibold scada-text-primary mb-3">Visualizador {selectedCamara.nombre}</h2>
          <div className="flex gap-4">
            <div className="relative flex items-center justify-center overflow-hidden rounded-xl bg-slate-900">
              <video
                ref={videoRef}
                className="h-[250px] min-h-[150px] max-w-full bg-slate-950 object-contain"
                autoPlay
                muted
                playsInline
                controls
              />
              {streamError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 p-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">SIN SENAL</div>
                    <div className="mt-2 text-xs text-slate-200">{streamError}</div>
                  </div>
                </div>
              ) : null}
              {!streamUrl ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 p-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">STREAM NO CONFIGURADO</div>
                    <div className="mt-2 text-xs text-slate-200">Define VITE_CAMERA_LPR_STREAM_URL en el entorno.</div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs text-slate-500">Ultima placa detectada</div>
                <div className="mt-1 text-xl font-semibold">{selectedCamara.datos.ultimoEvento?.plate}</div>
                <div className="text-xs text-slate-500">
                  {new Date(selectedCamara.datos.ultimoEvento?.timestamp ?? "").toLocaleString()}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs text-slate-500">Confianza promedio</div>
                <div className="mt-1 text-3xl font-semibold text-emerald-600">{confianza}%</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs text-slate-500">Errores</div>
                <div className="mt-1 text-lg font-semibold">{selectedCamara.datos.ratioErrores}%</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs text-slate-500">Estado de conexion</div>
                <div
                  className={classNames(
                    "mt-1 text-lg font-semibold",
                    selectedCamara.datos.conectado ? "text-emerald-600" : "text-red-600",
                  )}
                >
                  {selectedCamara.datos.conectado ? "Online" : "Offline"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-600 lg:grid-cols-4">

          </div>

          <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="rounded-lg border border-slate-200 bg-white p-3 min-h-0 flex flex-col">
              <div className="text-xs text-slate-500">Placas registradas por la camara</div>
              {placasError ? (
                <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  {placasError}
                </div>
              ) : null}
              <div className="mt-2 min-h-0 flex-1 overflow-y-auto space-y-2 pr-1">
                {cargandoPlacas ? (
                  <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                    Cargando placas...
                  </div>
                ) : (
                  placasRegistradas.map((registro) => (
                    <button
                      key={`${selectedCamara.id}-${registro.id}`}
                      type="button"
                      onClick={() => void handleOpenDetalle(registro)}
                      className={`block w-full rounded-md border px-3 py-2 text-left font-mono text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 
                        ${registro.reliability === undefined
                          ? "border-slate-200 bg-slate-50"
                          : registro.reliability > 80
                              ? "border-status-ok bg-status-ok"
                              : registro.reliability >= 50
                                ? "border-status-alerta bg-status-alerta"
                              : "border-status-error bg-status-error"
                        }`}
                    >
                      {formatearPlaca(registro.plate)}
                    </button>
                  ))
                )}
              </div>
            </div>

            <DetalleAnprPanel
              detalle={detalleSeleccionado}
              cargando={cargandoDetalle}
              error={detalleError}
            />
          </div>
        </div>
      </section>
    </main >
  );
}

export default PaginaCamaraLPR;
