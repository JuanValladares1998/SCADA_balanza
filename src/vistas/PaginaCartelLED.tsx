import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Estado } from "../types/Estado";
import PerifericoList, { PerifericoItem } from "../components/PerifericoList";

type MensajeCatalogo = {
  id: number;
  codigo: string;
  texto: string;
  colorHex: string;
};

type TelemetriaCartel = {
  mensajeActual: string;
  brilloPorcentaje: number;
  online: boolean;
  temperaturaPanel: number;
  fecRegistro: string;
};

type InstruccionCartel = {
  id: number;
  transaccionId: number;
  fecEnvio: string;
  instruccion: string;
  confirmacionRecepcion: boolean;
};

type CartelLED = {
  id: string;
  nombre: string;
  mensajes: MensajeCatalogo[];
  telemetria: TelemetriaCartel;
  instrucciones: InstruccionCartel[];
};

const mockCarteles: CartelLED[] = [
  {
    id: "led-1",
    nombre: "Cartel LED Entrada",
    mensajes: [
      { id: 1, codigo: "BIENVENIDO", texto: "Ingrese a la plataforma", colorHex: "#22C55E" },
      { id: 2, codigo: "AVANCE", texto: "Corrija su posicionamiento en la balanza", colorHex: "#EF4444" },
      { id: 3, codigo: "PESAJE", texto: "Iniciando pesaje...", colorHex: "#FACC15" },
      { id: 4, codigo: "PESAJE-OK", texto: "Pesaje completado", colorHex: "#22C55E" },
      { id: 5, codigo: "PESAJE-ERROR", texto: "Pesaje incorrecto, espere...", colorHex: "#EF4444" },
      { id: 6, codigo: "FIN", texto: "Retirese de la plataforma", colorHex: "#22C55E" },
      { id: 7, codigo: "PARE", texto: "Error, detengase", colorHex: "#EF4444" },
    ],
    telemetria: {
      mensajeActual: "INGRESAR A PESAJE",
      brilloPorcentaje: 82,
      online: true,
      temperaturaPanel: 39.4,
      fecRegistro: new Date().toISOString(),
    },
    instrucciones: [
      {
        id: 1,
        transaccionId: 10542,
        fecEnvio: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
        instruccion: "INGRESAR A PESAJE",
        confirmacionRecepcion: true,
      },
      {
        id: 2,
        transaccionId: 10541,
        fecEnvio: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
        instruccion: "AVANCE LENTO",
        confirmacionRecepcion: true,
      },
      {
        id: 3,
        transaccionId: 10540,
        fecEnvio: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        instruccion: "PARE",
        confirmacionRecepcion: true,
      },
    ],
  },
  {
    id: "led-2",
    nombre: "Cartel LED Salida",
    mensajes: [
      { id: 1, codigo: "BIENVENIDO", texto: "Ingrese a la plataforma", colorHex: "#22C55E" },
      { id: 2, codigo: "AVANCE", texto: "Corrija su posicionamiento en la balanza", colorHex: "#EF4444" },
      { id: 3, codigo: "PESAJE", texto: "Iniciando pesaje...", colorHex: "#FACC15" },
      { id: 4, codigo: "PESAJE-OK", texto: "Pesaje completado", colorHex: "#22C55E" },
      { id: 5, codigo: "PESAJE-ERROR", texto: "Pesaje incorrecto, espere...", colorHex: "#EF4444" },
      { id: 6, codigo: "FIN", texto: "Retirese de la plataforma", colorHex: "#22C55E" },
      { id: 7, codigo: "PARE", texto: "Error, detengase", colorHex: "#EF4444" },
    ],
    telemetria: {
      mensajeActual: "ESPERE TURNO",
      brilloPorcentaje: 64,
      online: true,
      temperaturaPanel: 41.1,
      fecRegistro: new Date().toISOString(),
    },
    instrucciones: [
      {
        id: 4,
        transaccionId: 10539,
        fecEnvio: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
        instruccion: "ESPERE TURNO",
        confirmacionRecepcion: true,
      },
      {
        id: 5,
        transaccionId: 10538,
        fecEnvio: new Date(Date.now() - 1000 * 60 * 13).toISOString(),
        instruccion: "VIA LIBRE",
        confirmacionRecepcion: false,
      },
    ],
  },
];

function PaginaCartelLED() {
  const [searchParams, setSearchParams] = useSearchParams();
  const cartelIdDesdeUrl = searchParams.get("cartel");
  const cartelInicial =
    mockCarteles.find((cartel) => cartel.id === cartelIdDesdeUrl)?.id ?? mockCarteles[0].id;

  const [selectedId, setSelectedId] = useState<string | number>(cartelInicial);

  useEffect(() => {
    if (!cartelIdDesdeUrl) {
      setSelectedId(mockCarteles[0].id);
      return;
    }

    const cartelExiste = mockCarteles.some((cartel) => cartel.id === cartelIdDesdeUrl);
    setSelectedId(cartelExiste ? cartelIdDesdeUrl : mockCarteles[0].id);
  }, [cartelIdDesdeUrl]);

  const handleSelectCartel = (id: string | number) => {
    const cartelId = String(id);
    setSelectedId(cartelId);
    setSearchParams({ cartel: cartelId });
  };

  const cartelSeleccionado = mockCarteles.find((cartel) => cartel.id === selectedId) ?? mockCarteles[0];

  const cartelesItems: PerifericoItem[] = mockCarteles.map((cartel) => {
    const estado: Estado = cartel.telemetria.online ? "ok" : "error";
    return { id: cartel.id, nombre: cartel.nombre, estado };
  });

  const ultimoAck = useMemo(
    () => cartelSeleccionado.instrucciones.filter((item) => item.confirmacionRecepcion).length,
    [cartelSeleccionado],
  );

  return (
    <main className="p-4 h-screen flex flex-col gap-4">
      <header className="flex flex-wrap justify-between items-start gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold scada-text-primary tracking-tight">Cartel LED</h1>
          <p className="text-sm text-slate-500">Monitoreo de mensajes, telemetria e instrucciones enviadas al camion.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div>
            <span className="font-semibold">Brillo:</span> {cartelSeleccionado.telemetria.brilloPorcentaje}%
          </div>
          <div>
            <span className="font-semibold">ACK recibidos:</span> {ultimoAck}/{cartelSeleccionado.instrucciones.length}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 flex-1">
        <PerifericoList
          title="Carteles LED"
          items={cartelesItems}
          selectedId={selectedId}
          onSelect={handleSelectCartel}
        />

        <div className="grid grid-cols-1 gap-4">
          <div className="scada-card p-4">
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-900 p-6">
                <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Mensaje actual</div>
                <div className="mt-4 scada-led-shell led-display min-h-40 rounded-xl px-6 py-8 text-center">
                  <div className="text-4xl font-semibold">{cartelSeleccionado.telemetria.mensajeActual}</div>
                  <div className="mt-3 text-base text-slate-300">
                    Actualizado {new Date(cartelSeleccionado.telemetria.fecRegistro).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="text-xs text-slate-500">Estado</div>
                  <div className={`mt-1 text-lg font-semibold ${cartelSeleccionado.telemetria.online ? "text-emerald-600" : "text-red-600"}`}>
                    {cartelSeleccionado.telemetria.online ? "Online" : "Offline"}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="text-xs text-slate-500">Temperatura</div>
                  <div className="mt-1 text-lg font-semibold">{cartelSeleccionado.telemetria.temperaturaPanel.toFixed(1)}°C</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="text-xs text-slate-500">Brillo</div>
                  <div className="mt-1 text-lg font-semibold">{cartelSeleccionado.telemetria.brilloPorcentaje}%</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="text-xs text-slate-500">Ultima lectura</div>
                  <div className="mt-1 text-lg font-semibold">{new Date(cartelSeleccionado.telemetria.fecRegistro).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="scada-card p-4">
              <h2 className="text-lg font-semibold scada-text-primary mb-3">Catalogo de mensajes</h2>
              <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
                {cartelSeleccionado.mensajes.map((mensaje) => (
                  <div key={mensaje.id} className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs text-slate-500">{mensaje.codigo}</div>
                        <div className="mt-1 font-semibold">{mensaje.texto}</div>
                      </div>
                      <span
                        className="inline-flex h-6 w-6 rounded-full border border-slate-200"
                        style={{ backgroundColor: mensaje.colorHex }}
                        title={mensaje.colorHex}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="scada-card p-4">
              <h2 className="text-lg font-semibold scada-text-primary mb-3">Historial de instrucciones</h2>
              <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
                {cartelSeleccionado.instrucciones.map((instruccion) => (
                  <div key={instruccion.id} className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-slate-500">Transaccion #{instruccion.transaccionId}</div>
                        <div className="mt-1 font-semibold">{instruccion.instruccion}</div>
                        <div className="mt-1 text-xs text-slate-500">{new Date(instruccion.fecEnvio).toLocaleString()}</div>
                      </div>
                      <span className={`text-xs font-semibold ${instruccion.confirmacionRecepcion ? "text-emerald-600" : "text-amber-600"}`}>
                        {instruccion.confirmacionRecepcion ? "ACK" : "SIN ACK"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PaginaCartelLED;
