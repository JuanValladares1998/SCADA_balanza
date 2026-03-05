import AlertsCard from "./components/AlertsCard";
import DiagramCard from "./components/DiagramCard";
import IRSensorsCard from "./components/IRSensorsCard";
import KpisCard from "./components/KpisCard";
import LedDisplayCard from "./components/LedDisplayCard";
import VehicleDriverCard from "./components/VehicleDriverCard";
import WeightControlCard from "./components/WeightControlCard";

function App() {
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
        <WeightControlCard />
        <DiagramCard />
        <AlertsCard />
        <VehicleDriverCard />
        <IRSensorsCard />
        <LedDisplayCard />
        <KpisCard />
      </section>
    </main>
  );
}

export default App;
