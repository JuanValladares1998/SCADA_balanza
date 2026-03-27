import { useMemo, useState } from "react";
import { PuertoData, SwitchEstado, PuertoEstado, AnilloEstado } from "../types/switch";
import type { Estado } from "../types/Estado";
import PerifericoList, { PerifericoItem } from "../components/PerifericoList";

const mockSwitchBase: SwitchEstado = {
  conectado: true,
  horaInicio: "08:12:34",
  usoCpu: 39,
  temperatura: 42.6,
  pwr1Activo: true,
  pwr2Activo: true,
  modoRecundancia: "0-Ring",
  anilloEstado: AnilloEstado.HEALTHY,
  puertosTotales: 24,
  cuentaPuertosActivos: 18,
  erroraGlobal: false,
  puertos: Array.from({ length: 24 }, (_, i) => {
    const index = i + 1;
    const esCamara = index <= 8;
    const estado = Math.random() < 0.9 ? PuertoEstado.UP : PuertoEstado.DOWN;
    const ratioError = estado === PuertoEstado.UP ? Math.random() * 0.02 : 0;
    const anchoBandaRx = esCamara ? Math.random() * 80 + 20 : Math.random() * 5;
    const anchoBandaTx = esCamara ? Math.random() * 80 + 20 : Math.random() * 5;

    return {
      id: index,
      etiqueta: esCamara ? `Camara ${index}` : `Puerto ${index}`,
      estado,
      esPoe: index <= 12,
      porWatts: index <= 12 ? Math.round(Math.random() * 15 + 5) : undefined,
      anchoBandaRxMbps: parseFloat(anchoBandaRx.toFixed(1)),
      anchoBandaTxMbps: parseFloat(anchoBandaTx.toFixed(1)),
      ratioError: parseFloat(ratioError.toFixed(3)),
    };
  }),
};

const mockSwitches: Array<{ id: string; nombre: string; estado: Estado; datos: SwitchEstado }> = [
  { id: "switch-1", nombre: "Switch Principal", estado: "ok", datos: mockSwitchBase },
  {
    id: "switch-2",
    nombre: "Switch Backup",
    estado: "alerta",
    datos: {
      ...mockSwitchBase,
      usoCpu: 72,
      temperatura: 46.0,
      cuentaPuertosActivos: 15,
      erroraGlobal: true,
      puertos: mockSwitchBase.puertos.map((p) => ({
        ...p,
        estado: Math.random() < 0.85 ? PuertoEstado.UP : PuertoEstado.DOWN,
        ratioError: Math.random() < 0.2 ? Math.random() * 0.1 : 0,
      })),
    },
  },
];

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PortIndicator({ puerto }: { puerto: PuertoData }) {
  const isError = puerto.ratioError > 0.005;
  const isUp = puerto.estado === PuertoEstado.UP;
  const baseColor = isUp ? "bg-emerald-500" : "bg-slate-300";
  const errorClass = isError ? "animate-pulse bg-red-500" : "";

  return (
    <div className="flex flex-col items-center gap-1 text-[10px]">
      <div
        className={classNames(
          "h-6 w-10 rounded-sm border border-slate-200",
          baseColor,
          errorClass,
        )}
        title={`${puerto.etiqueta} - ${isUp ? "Link Up" : "Link Down"}${isError ? " (Errores)" : ""}`}
      />
      <div className="text-slate-500">{puerto.id}</div>
    </div>
  );
}

function MiniTrendChart({ values, color }: { values: number[]; color: string }) {
  const { points, viewBox } = useMemo(() => {
    const width = 200;
    const height = 50;
    const max = Math.max(...values, 1);
    const min = Math.min(...values);
    const span = max - min || 1;

    const points = values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * width;
        const y = height - ((value - min) / span) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return { points, viewBox: `0 0 ${width} ${height}` };
  }, [values]);

  return (
    <svg viewBox={viewBox} className="w-full h-14">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeOpacity={0.06}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PaginaSwitch() {
  const [selectedSwitchId, setSelectedSwitchId] = useState<string | number>(mockSwitches[0].id);
  const selectedSwitch = mockSwitches.find((s) => s.id === selectedSwitchId) ?? mockSwitches[0];

  const trendCpu = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => {
      const jitter = Math.sin(i / 2) * 5;
      return Math.max(0, Math.min(100, selectedSwitch.datos.usoCpu + jitter + Math.random() * 4 - 2));
    });
  }, [selectedSwitch.datos.usoCpu]);

  const trendTraffic = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => {
      const base = 20 + Math.sin(i / 2) * 15;
      return Math.max(0, base + Math.random() * 10);
    });
  }, []);

  const switchItems: PerifericoItem[] = mockSwitches.map((s) => ({
    id: s.id,
    nombre: s.nombre,
    estado: s.estado,
  }));

  const camaras = selectedSwitch.datos.puertos.filter((p) => p.etiqueta.startsWith("Camara"));

  return (
    <main className="flex h-full min-h-0 flex-col gap-4 overflow-hidden p-4">
      <header className="mb-2 flex shrink-0 flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold scada-text-primary tracking-tight">Switch IES-3242GC-E</h1>
          <p className="text-sm text-slate-500">Detalle de comunicaciones y salud de puertos.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="text-sm">
            <span className="font-semibold">Uptime:</span> {selectedSwitch.datos.horaInicio}
          </div>
          <div className="text-sm">
            <span className="font-semibold">CPU:</span> {selectedSwitch.datos.usoCpu}%
          </div>
          <div className="text-sm">
            <span className="font-semibold">Temp:</span> {selectedSwitch.datos.temperatura.toFixed(1)}°C
          </div>
        </div>
      </header>

      <section className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <PerifericoList
          title="Switches"
          items={switchItems}
          selectedId={selectedSwitchId}
          onSelect={setSelectedSwitchId}
        />

        <div className="grid gap-4">
          <div className="scada-card p-4">
            <h2 className="text-lg font-semibold scada-text-primary mb-3">Panel frontal (puertos)</h2>
            <p className="text-xs text-slate-500 mb-3">Verde = Link Up · Gris = Down · Rojo = Error de paquetes</p>

            <div className="grid grid-cols-6 gap-2">
              {selectedSwitch.datos.puertos.map((puerto) => (
                <PortIndicator key={puerto.id} puerto={puerto} />
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Link Up</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                <span>Link Down</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span>Error de paquetes</span>
              </div>
            </div>
          </div>

          <div className="scada-card p-4">
            <h2 className="text-lg font-semibold scada-text-primary mb-3">Tendencia de CPU</h2>
            <MiniTrendChart values={trendCpu} color="#0ea5e9" />
            <div className="mt-2 text-xs text-slate-500">Uso de CPU (%) en las últimas 16 lecturas.</div>
          </div>

          <div className="scada-card p-4">
            <h2 className="text-lg font-semibold scada-text-primary mb-3">Tráfico Cámaras (Mbps)</h2>
            <MiniTrendChart values={trendTraffic} color="#3b82f6" />
            <div className="mt-2 text-xs text-slate-500">Promedio de tráfico de los puertos de cámaras.</div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PaginaSwitch;
