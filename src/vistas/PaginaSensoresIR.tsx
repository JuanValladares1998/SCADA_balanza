import { useMemo, useState } from "react";
import { Sensor, EstadoAlineamiento } from "../types/sensores";
import type { Estado } from "../types/Estado";
import PerifericoList, { PerifericoItem } from "../components/PerifericoList";

const mockSensores: Sensor[] = [
  {
    id: "IR_ENTRADA",
    etiqueta: "IR Entrada",
    interrumpido: false,
    tapaActiva: false,
    voltaje: 24.2,
    intensidadSenal: 92,
    estadoAlineamiento: EstadoAlineamiento.OPTIMO,
    cuentaActivacion: 1542,
    ratioFalsaerrora: 0.3,
  },
  {
    id: "IR_SALIDA",
    etiqueta: "IR Salida",
    interrumpido: false,
    tapaActiva: false,
    voltaje: 23.9,
    intensidadSenal: 78,
    estadoAlineamiento: EstadoAlineamiento.ATENUADO,
    cuentaActivacion: 1438,
    ratioFalsaerrora: 0.7,
  },
  {
    id: "IR_LATERAL_IZQ",
    etiqueta: "IR Lateral Izq.",
    interrumpido: true,
    tapaActiva: true,
    voltaje: 21.5,
    intensidadSenal: 28,
    estadoAlineamiento: EstadoAlineamiento.DESALINEADO,
    cuentaActivacion: 82,
    ratioFalsaerrora: 2.2,
  },
  {
    id: "IR_LATERAL_DER",
    etiqueta: "IR Lateral Der.",
    interrumpido: false,
    tapaActiva: false,
    voltaje: 24.6,
    intensidadSenal: 67,
    estadoAlineamiento: EstadoAlineamiento.OPTIMO,
    cuentaActivacion: 1284,
    ratioFalsaerrora: 0.6,
  },
];

function SignalBars({ nivel }: { nivel: number }) {
  const normalized = Math.max(0, Math.min(100, nivel));
  const barras = [20, 40, 60, 80, 100];

  return (
    <div className="flex items-end gap-1">
      {barras.map((umbral) => {
        const activo = normalized >= umbral;
        return (
          <div
            key={umbral}
            className={
              "h-4 w-2 rounded-sm transition-colors " +
              (activo ? "bg-emerald-500" : "bg-slate-200")
            }
          />
        );
      })}
      <span className="text-xs text-slate-500 ml-2">{normalized}%</span>
    </div>
  );
}

function PaginaSensoresIR() {
  const [selectedId, setSelectedId] = useState<string | number>(mockSensores[0].id);
  const selectedSensor = mockSensores.find((s) => s.id === selectedId) ?? mockSensores[0];

  const totalActivaciones = useMemo(
    () => mockSensores.reduce((sum, s) => sum + s.cuentaActivacion, 0),
    [],
  );

  const sensoresItems: PerifericoItem[] = mockSensores.map((sensor) => {
    const estado: Estado = sensor.interrumpido
      ? "error"
      : sensor.estadoAlineamiento === EstadoAlineamiento.DESALINEADO
      ? "alerta"
      : "ok";
    return { id: sensor.id, nombre: sensor.etiqueta, estado };
  });

  return (
    <main className="p-4 h-screen flex flex-col gap-4">
      <header className="flex flex-wrap justify-between items-start gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold scada-text-primary tracking-tight">Sensores IR</h1>
          <p className="text-sm text-slate-500">Estado de haz y alineamiento de los sensores infrarrojos.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div>
            <span className="font-semibold">Activaciones totales:</span> {totalActivaciones}
          </div>
          <div>
            <span className="font-semibold">Sensores con tapa:</span>{" "}
            {mockSensores.filter((s) => s.tapaActiva).length}/{mockSensores.length}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 flex-1">
        <PerifericoList
          title="Sensores"
          items={sensoresItems}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        <div className="scada-card p-4">
          <h2 className="text-lg font-semibold scada-text-primary mb-3">Detalle de sensor</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-xs text-slate-500">Sensor</div>
              <div className="mt-1 text-lg font-semibold">{selectedSensor.etiqueta}</div>
              <div className="text-xs text-slate-500">ID: {selectedSensor.id}</div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-xs text-slate-500">Voltaje de alimentación</div>
              <div className="mt-1 text-lg font-semibold">{selectedSensor.voltaje.toFixed(1)} V</div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-xs text-slate-500">Nivel de señal</div>
              <SignalBars nivel={selectedSensor.intensidadSenal} />
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-xs text-slate-500">Alineamiento</div>
              <div className="mt-1 text-lg font-semibold">
                {selectedSensor.estadoAlineamiento === EstadoAlineamiento.OPTIMO && (
                  <span className="text-emerald-600">Óptimo</span>
                )}
                {selectedSensor.estadoAlineamiento === EstadoAlineamiento.ATENUADO && (
                  <span className="text-amber-600">Atenuado</span>
                )}
                {selectedSensor.estadoAlineamiento === EstadoAlineamiento.DESALINEADO && (
                  <span className="text-red-600">Desalineado</span>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-xs text-slate-500">Estado de haz</div>
              <div className="mt-1 text-lg font-semibold">
                {selectedSensor.interrumpido ? (
                  <span className="text-red-600">Interrumpido</span>
                ) : (
                  <span className="text-emerald-600">Activo</span>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-xs text-slate-500">Falsos positivos</div>
              <div className="mt-1 text-lg font-semibold">{selectedSensor.ratioFalsaerrora.toFixed(1)}%</div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-xs text-slate-500">Activaciones</div>
              <div className="mt-1 text-lg font-semibold">{selectedSensor.cuentaActivacion}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PaginaSensoresIR;
