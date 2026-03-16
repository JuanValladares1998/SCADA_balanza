import { useMemo, useState } from "react";
import type { Estado } from "../types/Estado";
import PerifericoList, { PerifericoItem } from "../components/PerifericoList";

const mockBalanzas = [
  {
    id: "bal-1",
    nombre: "Balanza principal",
    unidad: "kg",
    pesoBruto: 12560.3,
    esEstable: true,
    estaEnCero: false,
    sobrecargaerrora: false,
    redPDXSaludable: true,
    codigoError: "",
    temperaturaGabinete: 34.2,
  },
  {
    id: "bal-2",
    nombre: "Balanza patio",
    unidad: "kg",
    pesoBruto: 18420.1,
    esEstable: true,
    estaEnCero: false,
    sobrecargaerrora: false,
    redPDXSaludable: true,
    codigoError: "",
    temperaturaGabinete: 32.1,
  },
  {
    id: "bal-3",
    nombre: "Balanza secundaria",
    unidad: "kg",
    pesoBruto: 0,
    esEstable: false,
    estaEnCero: false,
    sobrecargaerrora: false,
    redPDXSaludable: false,
    codigoError: "SIN CONEXION",
    temperaturaGabinete: 0,
  },
];

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PaginaBalanza() {
  const [selectedBalanzaId, setSelectedBalanzaId] = useState<string | number>(mockBalanzas[0].id);

  const balanzasItems: PerifericoItem[] = mockBalanzas.map((bal) => {
    let estado: Estado = "ok";
    if (!bal.redPDXSaludable) estado = "error";
    else if (!bal.esEstable) estado = "alerta";

    return {
      id: bal.id,
      nombre: bal.nombre,
      estado,
    };
  });

  const balanzaSeleccionada = mockBalanzas.find((b) => b.id === selectedBalanzaId) ?? mockBalanzas[0];

  return (
    <main className="p-4 h-screen flex flex-col gap-4">
      <header className="flex flex-wrap justify-between items-start gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold scada-text-primary tracking-tight">Monitoreo Balanza</h1>
          <p className="text-sm text-slate-500">Visualización en tiempo real de peso, celdas y estado de la balanza.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="text-sm">
            <span className="font-semibold">Última actualización:</span> ahora
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">Red PDX:</span>
            <span className={balanzaSeleccionada.redPDXSaludable ? "text-emerald-600" : "text-red-600"}>
              {balanzaSeleccionada.redPDXSaludable ? "OK" : "ERROR"}
            </span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 flex-1">
        <PerifericoList
          title="Balanzas"
          items={balanzasItems}
          selectedId={selectedBalanzaId}
          onSelect={setSelectedBalanzaId}
        />

        <div className="grid grid-cols-1 gap-4">
          <div className="scada-card p-4">
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div>
                <div className="text-sm text-slate-500">Peso Bruto</div>
                <div className="mt-2 flex items-end gap-2">
                  <span className="led-display text-6xl font-semibold">{balanzaSeleccionada.pesoBruto.toFixed(2)}</span>
                  <span className="text-xl text-slate-500">{balanzaSeleccionada.unidad}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={classNames(
                      "h-3 w-3 rounded-full",
                      balanzaSeleccionada.esEstable ? "bg-emerald-500" : "bg-red-500",
                    )}
                  />
                  <span className="text-sm">Stable</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={classNames(
                      "h-3 w-3 rounded-full",
                      balanzaSeleccionada.estaEnCero ? "bg-emerald-500" : "bg-slate-400",
                    )}
                  />
                  <span className="text-sm">Zero</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={classNames(
                      "h-3 w-3 rounded-full",
                      balanzaSeleccionada.sobrecargaerrora ? "bg-red-500" : "bg-slate-400",
                    )}
                  />
                  <span className="text-sm">Overload</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600">
              <div>
                <span className="font-semibold">Código error:</span>{" "}
                {balanzaSeleccionada.codigoError || "Ninguno"}
              </div>
              <div>
                <span className="font-semibold">Temp gabinete:</span>{" "}
                {balanzaSeleccionada.temperaturaGabinete.toFixed(1)}°C
              </div>
              <div>
                <span className="font-semibold">Red PDX:</span>{" "}
                <span className={balanzaSeleccionada.redPDXSaludable ? "text-emerald-600" : "text-red-600"}>
                  {balanzaSeleccionada.redPDXSaludable ? "OK" : "ERROR"}
                </span>
              </div>
              <div>
                <span className="font-semibold">Estado:</span>{" "}
                <span className={balanzaSeleccionada.redPDXSaludable ? "text-emerald-600" : "text-amber-600"}>
                  {balanzaSeleccionada.esEstable ? "Operativa" : "Inestable"}
                </span>
              </div>
            </div>
          </div>

          <div className="scada-card p-4">
            <h2 className="text-lg font-semibold scada-text-primary mb-3">Detalle de balanza</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Nombre</div>
                <div className="mt-1 text-lg font-semibold">{balanzaSeleccionada.nombre}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Estado de conexión</div>
                <div className={classNames("mt-1 text-lg font-semibold", balanzaSeleccionada.redPDXSaludable ? "text-emerald-600" : "text-red-600")}> 
                  {balanzaSeleccionada.redPDXSaludable ? "Online" : "Offline"}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Último error</div>
                <div className="mt-1 text-lg font-semibold">{balanzaSeleccionada.codigoError || "Ninguno"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PaginaBalanza;
