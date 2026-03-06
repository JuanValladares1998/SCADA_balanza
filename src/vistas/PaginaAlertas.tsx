import { Link } from "react-router-dom";
import TarjetaAlertas from "../components/layout/cards/TarjetaAlertas";

function PaginaAlertas() {
  return (
    <main className="p-4 h-screen flex flex-col gap-4">
      <header className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold scada-text-primary tracking-tight">Sistema SCADA: Alertas</h1>
        <nav className="flex items-center gap-2 text-sm">
          <Link className="scada-text-secondary hover:underline" to="/dashboard">
            Dashboard
          </Link>
          <span className="scada-text-secondary">|</span>
          <Link className="scada-text-primary font-semibold hover:underline" to="/alertas">
            Alertas
          </Link>
        </nav>
      </header>

      <section className="grid grid-cols-12 gap-4 h-full">
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <TarjetaAlertas
            alertas={[
              {
                id: 1,
                estado: "error",
                titulo: "Alerta 1",
                descripcion: "Sensor de Entrada Desconectado",
                hora: "08:00 AM",
              },
              {
                id: 2,
                estado: "alerta",
                titulo: "Alerta 2",
                descripcion: "Peso Excede Limite Permitido",
                hora: "08:05 AM",
              },
              { id: 3, estado: "ok", titulo: "Alerta 3", descripcion: "Calibracion Exitosa", hora: "08:10 AM" },
            ]}
          />
        </div>
      </section>
    </main>
  );
}

export default PaginaAlertas;
