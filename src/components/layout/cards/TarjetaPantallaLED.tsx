type PropiedadesTarjetaPantallaLED = {
  tituloPrincipal: string;
  subtitulo?: string;
};


function TarjetaPantallaLED({ tituloPrincipal, subtitulo }: PropiedadesTarjetaPantallaLED) {
  return (
    <article className="col-span-3 scada-card shadow-sm p-4 flex flex-col">
      <h2 className="text-sm font-semibold scada-title p-2 rounded mb-4">Visualizacion LED Externa</h2>
      <div className="flex-1 flex items-center justify-center p-2">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="scada-led-shell led-display w-[82%] h-[58%] flex flex-col items-center justify-center rounded text-center p-2">
            <div className="text-xl">{tituloPrincipal}</div>
            <div className="text-lg blink mt-2">{subtitulo}</div>
          </div>
          <div className="w-3 h-10 bg-slate-500 rounded-b-sm" />
          <div className="w-16 h-2 bg-slate-600 rounded-full" />
        </div>
      </div>
    </article>
  );
}

export default TarjetaPantallaLED;
