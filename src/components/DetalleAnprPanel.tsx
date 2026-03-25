import { useMemo, useState } from "react";
import type { AnprCameraRecordDetail } from "../lib/api/anpr-camera-controller";
import { resolveApiUrl } from "../lib/api/client";

type DetalleAnprPanelProps = {
  detalle: AnprCameraRecordDetail | null;
  cargando: boolean;
  error: string | null;
};

const camposDetalle: Array<{ clave: keyof AnprCameraRecordDetail; etiqueta: string }> = [
  /* { clave: "sensorMacAddress", etiqueta: "Sensor MAC" },
   { clave: "sensorSerialNumber", etiqueta: "Serial del sensor" },
   { clave: "sensorName", etiqueta: "Nombre del sensor" },
   { clave: "droppedMessages", etiqueta: "Mensajes perdidos" },
   { clave: "eventDate", etiqueta: "Fecha del evento" },
   { clave: "synchronizedFlag", etiqueta: "Sincronizado" },
   { clave: "session", etiqueta: "Sesion" },
   { clave: "cameraEventId", etiqueta: "ID evento camara" },*/
  { clave: "plate", etiqueta: "Placa" },
  /*{ clave: "countryCode", etiqueta: "Codigo pais" },
  { clave: "countryIsoAlpha2", etiqueta: "ISO Alpha 2" },
  { clave: "countryIsoAlpha3", etiqueta: "ISO Alpha 3" },
  { clave: "direction", etiqueta: "Direccion" },
  { clave: "reliability", etiqueta: "Confiabilidad" },
  { clave: "plateOccurences", etiqueta: "Ocurrencias" },
  { clave: "squarePlate", etiqueta: "Placa cuadrada" },
  { clave: "sinus", etiqueta: "Sinus" },
  { clave: "positionX", etiqueta: "Posicion X" },
  { clave: "positionY", etiqueta: "Posicion Y" },
  { clave: "width", etiqueta: "Ancho" },
  { clave: "height", etiqueta: "Alto" },*/
  { clave: "eventTimestamp", etiqueta: "Timestamp evento" },
  /*{ clave: "receivedAt", etiqueta: "Recibido en" },*/
];

function DetalleAnprPanel({ detalle, cargando, error }: DetalleAnprPanelProps) {
  const imageUrl = detalle?.imagePath ? resolveApiUrl(detalle.imagePath) : "";
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const crop = useMemo(() => {
    if (!detalle) {
      return null;
    }

    const x = Number(detalle.positionX);
    const y = Number(detalle.positionY);
    const width = Number(detalle.width) + 10;
    const height = Number(detalle.height) + 10;

    if ([x, y, width, height].some((value) => Number.isNaN(value) || value < 0)) {
      return null;
    }

    return { x, y, width, height };
  }, [detalle]);

  const cropPreviewWidth = 360;
  const cropPreviewHeight = 200;
  const cropScale =
    crop && imageSize && crop.width > 0 && crop.height > 0
      ? Math.min(cropPreviewWidth / crop.width, cropPreviewHeight / crop.height)
      : 1;
  const viewportWidth = crop ? Math.min(crop.width * cropScale, cropPreviewWidth) : cropPreviewWidth;
  const viewportHeight = crop ? Math.min(crop.height * cropScale, cropPreviewHeight) : cropPreviewHeight;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 min-h-0 flex flex-col">
      <div className="text-xs text-slate-500">Detalle de placa</div>

      {cargando ? (
        <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
          Cargando detalle...
        </div>
      ) : error ? (
        <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : detalle ? (
        <div className="mt-2 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {imageUrl ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <img
                src={imageUrl}
                alt=""
                className="hidden"
                onLoad={(event) => {
                  setImageSize({
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight,
                  });
                }}
              />
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Recorte de placa
              </div>
              {crop && imageSize ? (
                <div className="flex h-[200px] items-center justify-center rounded-md border border-slate-200 bg-black">
                  <div
                    className="relative overflow-hidden rounded"
                    style={{
                      width: viewportWidth,
                      height: viewportHeight,
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={`Recorte de la placa ${detalle.plate}`}
                      className="absolute max-w-none"
                      style={{
                        width: imageSize.width * cropScale,
                        height: imageSize.height * cropScale,
                        left: -crop.x * cropScale,
                        top: -crop.y * cropScale,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex h-[200px] items-center justify-center rounded-md border border-slate-200 bg-white text-sm text-slate-500">
                  Sin coordenadas de recorte
                </div>
              )}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {camposDetalle.map((campo) => (
              <div key={campo.clave} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {campo.etiqueta}
                </div>
                <div className="mt-1 break-words text-sm font-medium text-slate-800">
                  {detalle[campo.clave] || "-"}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-2 flex flex-1 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
          Selecciona una placa para ver su detalle.
        </div>
      )}
    </div>
  );
}

export default DetalleAnprPanel;
