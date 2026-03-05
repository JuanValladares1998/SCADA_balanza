type PropiedadesTarjetaPantallaLED = {
  tituloPrincipal: string;
  subtitulo?: string;
};


function TarjetaPantallaLED({ tituloPrincipal, subtitulo }: PropiedadesTarjetaPantallaLED) {
  return (
    <article className="col-span-3 scada-card shadow-sm p-4 flex flex-col">
      <h2 className="text-sm font-semibold scada-title p-2 rounded mb-4">Visualizacion LED Externa</h2>
      <div className="flex-1 flex items-center justify-center scada-led-shell p-2">
        <div className="led-display w-full h-full flex flex-col items-center justify-center rounded text-center p-2">
          <div className="text-2xl">{tituloPrincipal}</div>
          <div className="text-xl blink mt-2">{subtitulo}</div>
        </div>
      </div>
    </article>
  );
}

export default TarjetaPantallaLED;
