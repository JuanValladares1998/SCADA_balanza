import { useMemo, useState } from "react";
import { CamaraEstado, CamaraModo, LprEvento } from "../types/camara";
import type { Estado } from "../types/Estado";
import PerifericoList, { PerifericoItem } from "../components/PerifericoList";

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

const mockCamaras: Array<{ id: string; nombre: string; estado: Estado; datos: CamaraEstado }> = [
  { id: "cam-1", nombre: "Camara LPR 1", estado: "ok", datos: mockCamara1 },
  { id: "cam-2", nombre: "Camara LPR 2", estado: "alerta", datos: mockCamara2 },
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
  const [selectedId, setSelectedId] = useState<string | number>(mockCamaras[0].id);
  const selectedCamara = mockCamaras.find((c) => c.id === selectedId) ?? mockCamaras[0];

  const confianza = selectedCamara.datos.ultimoEvento?.fiabilidad ?? 0;

  const modoTexto = useMemo(() => {
    return selectedCamara.datos.modoActual === CamaraModo.DAY ? "Día" : "Noche";
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
          <h1 className="text-2xl font-bold scada-text-primary tracking-tight">Cámara LPR Survision</h1>
          <p className="text-sm text-slate-500">Última lectura de placa y estado de la cámara.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <IconoModo modo={selectedCamara.datos.modoActual} />
            <span className="font-semibold">Modo:</span> {modoTexto}
          </div>
          <div>
            <span className="font-semibold">FPS:</span> {selectedCamara.datos.fps}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 flex-1">
        <PerifericoList
          title="Cámaras"
          items={camarasItems}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        <div className="scada-card p-4">
          <h2 className="text-lg font-semibold scada-text-primary mb-3">Visualizador LPR</h2>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
            <div className="rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center p-10">
              <div className="flex flex-col items-center gap-2 text-center">
                <svg viewBox="0 0 24 24" className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
                <div className="text-lg font-semibold text-white">SIN SEÑAL</div>
                <div className="text-xs text-slate-200">Verifique conexión de la cámara</div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs text-slate-500">Última placa detectada</div>
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
                <div className="text-xs text-slate-500">Temperatura interna</div>
                <div className="mt-1 text-lg font-semibold">{selectedCamara.datos.temperatura.toFixed(1)}°C</div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="text-xs text-slate-500">Lecturas exitosas</div>
              <div className="mt-1 text-lg font-semibold">{selectedCamara.datos.ratioRespuestasExitosas}%</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="text-xs text-slate-500">Errores</div>
              <div className="mt-1 text-lg font-semibold">{selectedCamara.datos.ratioErrores}%</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="text-xs text-slate-500">Estado de conexión</div>
              <div
                className={classNames(
                  "mt-1 text-lg font-semibold",
                  selectedCamara.datos.conectado ? "text-emerald-600" : "text-red-600",
                )}
              >
                {selectedCamara.datos.conectado ? "Online" : "Offline"}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="text-xs text-slate-500">Eventos recientes</div>
              <div className="mt-1 text-sm text-slate-700">
                {selectedCamara.datos.alertasInternas.length > 0
                  ? selectedCamara.datos.alertasInternas.join(", ")
                  : "Sin alertas"}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PaginaCamaraLPR;
