import TarjetaAlertas from "./components/TarjetaAlertas";
import TarjetaControlPeso from "./components/TarjetaControlPeso";
import TarjetaDiagrama from "./components/TarjetaDiagrama";
import TarjetaIndicadores from "./components/TarjetaIndicadores";
import TarjetaPantallaLED from "./components/TarjetaPantallaLED";
import TarjetaSensoresIR from "./components/TarjetaSensoresIR";
import TarjetaVehiculoChofer from "./components/TarjetaVehiculoChofer";

function Aplicacion() {
  return (
    <main className="p-4 h-screen flex flex-col gap-4">
      <header className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold scada-text-primary tracking-tight">
          Sistema SCADA: Control de Pesaje
        </h1>
        <div className="text-sm scada-text-secondary">
          Estado del Sistema: <span className="scada-text-ok font-bold">ONLINE</span>
        </div>
      </header>

      <section className="grid grid-cols-12 grid-rows-[1.40fr_1fr] gap-4 h-full">
        <TarjetaControlPeso pesoEntrada={12000} pesoSalida={10000} />
        <TarjetaDiagrama />
        <TarjetaAlertas
          alertas={[
            { id: 1, estado: "alarma", titulo: "Alerta 1", descripcion: "Sensor de Entrada Desconectado", hora: "08:00 AM" },
            { id: 2, estado: "advertencia", titulo: "Alerta 2", descripcion: "Peso Excede Limite Permitido", hora: "08:05 AM" },
            { id: 3, estado: "ok", titulo: "Alerta 3", descripcion: "Calibracion Exitosa", hora: "08:10 AM" },
          ]}
        />
        <TarjetaVehiculoChofer placa="A5T-837" chofer="Pedro Sanchez" />
        <TarjetaSensoresIR
          sensores={[
            { id: 1, nombre: "IR Entrada", estado: "ok" },
            { id: 2, nombre: "IR Salida", estado: "advertencia" },
            { id: 3, nombre: "IR Lateral Izq.", estado: "ok" },
            { id: 4, nombre: "IR Lateral Der.", estado: "alarma" },
          ]}
        />
        <TarjetaPantallaLED tituloPrincipal="Ingresar a pesaje" subtitulo="espacio libre" />
        <TarjetaIndicadores
          cantidadIngresosBalanza={126}
          tiempoOperativoPromedio={7.8}
          pesoTotalProcesado={1842}
          eficienciaOperativa={94.6}
        />
      </section>
    </main>
  );
}

export default Aplicacion;
