import { useEffect, useMemo, useState } from "react";
import { UpsEstado, UpsModo, BateriaEstado } from "../types/ups";
import type { Estado } from "../types/Estado";
import PerifericoList, { PerifericoItem } from "../components/PerifericoList";

const mockUps: Array<{ id: string; nombre: string; estado: Estado; datos: UpsEstado }> = [
  {
    id: "ups-1",
    nombre: "UPS Balanza",
    estado: "ok",
    datos: {
      modo: UpsModo.BATTERY,
      porcentajeCarga: 64,
      autonomiaMinutos: 42,
      temperaturaInterna: 38.4,
      voltajeEntrada: 230.1,
      frecuenciaEntrada: 50.0,
      voltajeSalida: 229.6,
      frecuenciaSalida: 50.0,
      nivelBateria: 64,
      estadoBateria: BateriaEstado.NORMAL,
      sobrecargaerrora: false,
      falloInterno: false,
    },
  },
  {
    id: "ups-2",
    nombre: "UPS Red",
    estado: "alerta",
    datos: {
      modo: UpsModo.ONLINE,
      porcentajeCarga: 38,
      autonomiaMinutos: 12,
      temperaturaInterna: 41.2,
      voltajeEntrada: 231.7,
      frecuenciaEntrada: 50.0,
      voltajeSalida: 231.0,
      frecuenciaSalida: 50.0,
      nivelBateria: 38,
      estadoBateria: BateriaEstado.LOW,
      sobrecargaerrora: false,
      falloInterno: false,
    },
  },
];

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function obtenerColorBateria(nivel: number) {
  if (nivel < 20) return "bg-red-500";
  if (nivel < 50) return "bg-amber-500";
  return "bg-emerald-500";
}

function obtenerColorLinea(modo: UpsModo) {
  if (modo === UpsModo.BATTERY) return { red: "bg-slate-300", bateria: "bg-emerald-500" };
  return { red: "bg-emerald-500", bateria: "bg-slate-300" };
}

function IndicadorLinea({ color }: { color: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <div className={classNames("h-full animate-pulse", color)} style={{ width: "100%" }} />
    </div>
  );
}

function PaginaUps() {
  const [selectedUpsId, setSelectedUpsId] = useState<string | number>(mockUps[0]?.id ?? "");
  const [estado, setEstado] = useState<UpsEstado>(mockUps[0]?.datos ?? ({} as UpsEstado));
  const [autonomia, setAutonomia] = useState<number>(estado.autonomiaMinutos);

  useEffect(() => {
    const selected = mockUps.find((u) => u.id === selectedUpsId);
    if (selected) {
      setEstado(selected.datos);
      setAutonomia(selected.datos.autonomiaMinutos);
    }
  }, [selectedUpsId]);

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setAutonomia((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(intervalo);
  }, []);

  const { red: lineaRed, bateria: lineaBateria } = useMemo(
    () => obtenerColorLinea(estado.modo),
    [estado.modo],
  );

  const barraBateria = useMemo(() => {
    const porcentaje = Math.max(0, Math.min(100, estado.nivelBateria));
    const color = obtenerColorBateria(porcentaje);
    return (
      <div className="relative h-6 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={classNames("absolute left-0 top-0 h-full", color)}
          style={{ width: `${porcentaje}%` }}
        />
        <div className="relative flex h-full items-center justify-center text-xs font-semibold text-slate-900">
          {porcentaje}%
        </div>
      </div>
    );
  }, [estado.nivelBateria]);

  const modoTexto = useMemo(() => {
    switch (estado.modo) {
      case UpsModo.BATTERY:
        return "Batería";
      case UpsModo.ONLINE:
        return "En línea";
      case UpsModo.BYPASS:
        return "Bypass";
      case UpsModo.FAULT:
        return "Falla";
    }
  }, [estado.modo]);

  const upsItems: PerifericoItem[] = mockUps.map((ups) => ({
    id: ups.id,
    nombre: ups.nombre,
    estado: ups.estado,
  }));

  return (
    <main className="flex h-full min-h-0 flex-col gap-4 overflow-hidden p-4">
      <header className="mb-2 flex shrink-0 flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold scada-text-primary tracking-tight">UPS CyberPower</h1>
          <p className="text-sm text-slate-500">Detalle de energía y estado de la UPS.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="text-sm">
            <span className="font-semibold">Última actualización:</span> ahora
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">Modo:</span>
            <span className={estado.modo === UpsModo.BATTERY ? "text-amber-600" : "text-emerald-600"}>
              {modoTexto}
            </span>
          </div>
        </div>
      </header>

      <section className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <PerifericoList
          title="UPS"
          items={upsItems}
          selectedId={selectedUpsId}
          onSelect={setSelectedUpsId}
        />

        <div className="grid grid-cols-1 gap-4">
          <div className="scada-card p-4">
            <h2 className="text-lg font-semibold scada-text-primary mb-3">Diagrama de Flujo de Potencia</h2>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold">
                    R
                  </div>
                  <div className="text-xs text-slate-500">Red Eléctrica</div>
                </div>

                <div className="flex-1">
                  <IndicadorLinea color={lineaRed} />
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold">
                    U
                  </div>
                  <div className="text-xs text-slate-500">UPS</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold">
                    U
                  </div>
                  <div className="text-xs text-slate-500">UPS</div>
                </div>

                <div className="flex-1">
                  <IndicadorLinea color={lineaBateria} />
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold">
                    C
                  </div>
                  <div className="text-xs text-slate-500">Carga</div>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                * Línea verde indica fuente activa; gris indica fuente inactiva.
              </p>
            </div>
          </div>

          <div className="scada-card p-4">
            <h2 className="text-lg font-semibold scada-text-primary mb-3">Barra de Capacidad de Batería</h2>
            {barraBateria}
            <div className="mt-4 text-sm text-slate-600">
              Nivel de batería basado en <span className="font-semibold">num_bateria_capacidad</span>.
            </div>
          </div>

          <div className="scada-card p-4">
            <h2 className="text-lg font-semibold scada-text-primary mb-3">Reloj de Autonomía</h2>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-slate-500">Minutos restantes</div>
                <div className="mt-2 text-4xl font-semibold text-slate-900">{autonomia}</div>
              </div>
              <div className="text-xs text-slate-500">
                basado en <span className="font-semibold">num_autonomia_minutos</span>
              </div>
            </div>
          </div>

          <div className="scada-card p-4">
            <h2 className="text-lg font-semibold scada-text-primary mb-3">Métricas de Energía</h2>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs text-slate-500">Voltaje entrada</div>
                <div className="mt-1 text-lg font-semibold">{estado.voltajeEntrada.toFixed(1)} V</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs text-slate-500">Frecuencia entrada</div>
                <div className="mt-1 text-lg font-semibold">{estado.frecuenciaEntrada.toFixed(1)} Hz</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs text-slate-500">Voltaje salida</div>
                <div className="mt-1 text-lg font-semibold">{estado.voltajeSalida.toFixed(1)} V</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs text-slate-500">Frecuencia salida</div>
                <div className="mt-1 text-lg font-semibold">{estado.frecuenciaSalida.toFixed(1)} Hz</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PaginaUps;
