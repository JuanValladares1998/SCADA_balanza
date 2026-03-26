import type { AnprCameraRecord } from "../lib/api/anpr-camera-controller";

type MqttAnprDecision = {
  "@x"?: string;
  "@y"?: string;
  "@width"?: string;
  "@height"?: string;
  "@sinus"?: string;
  "@plate"?: string;
  "@context"?: string;
  "@context_isoAlpha3"?: string;
  "@context_isoAlpha2"?: string;
  "@reliability"?: string;
  "@plateOccurences"?: string;
  "@direction"?: string;
  "@squarePlate"?: string;
  reliabilityPerCharacter?: null;
  jpeg?: string;
};

type MqttAnprAnpr = {
  "@date"?: string;
  "@synchronized"?: string;
  "@session"?: string;
  "@id"?: string;
  decision?: MqttAnprDecision;
};

type MqttAnprPayload = {
  anpr?: MqttAnprAnpr;
};

type MqttAnprMessage = {
  apiId?: number;
  plate?: string;
  payload?: MqttAnprPayload;
};

function toNumber(value?: string): number | undefined {
  if (value === undefined || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseMqttAnprMessage(payloadString: string, fallbackId: number): AnprCameraRecord | null {
  try {
    const parsed = JSON.parse(payloadString) as MqttAnprMessage;
    const anpr = parsed.payload?.anpr;
    const decision = anpr?.decision;

    const apiId = typeof parsed.apiId === "number" ? parsed.apiId : undefined;
    const id = apiId ?? fallbackId;
    const plate =
      typeof parsed.plate === "string"
        ? parsed.plate.trim()
        : typeof decision?.["@plate"] === "string"
          ? decision["@plate"].trim()
          : "";

    if (!plate) {
      return null;
    }

    const cameraEventId =
      typeof anpr?.["@id"] === "string" ? toNumber(anpr["@id"]) : undefined;
    const eventDate = typeof anpr?.["@date"] === "string" ? toNumber(anpr["@date"]) : undefined;
    const synchronizedFlag =
      typeof anpr?.["@synchronized"] === "string" ? toNumber(anpr["@synchronized"]) : undefined;
    const session =
      typeof anpr?.["@session"] === "string" ? toNumber(anpr["@session"]) : undefined;
    const positionX =
      typeof decision?.["@x"] === "string" ? toNumber(decision["@x"]) : undefined;
    const positionY =
      typeof decision?.["@y"] === "string" ? toNumber(decision["@y"]) : undefined;
    const width =
      typeof decision?.["@width"] === "string" ? toNumber(decision["@width"]) : undefined;
    const height =
      typeof decision?.["@height"] === "string" ? toNumber(decision["@height"]) : undefined;
    const sinus =
      typeof decision?.["@sinus"] === "string" ? toNumber(decision["@sinus"]) : undefined;
    const countryCode =
      typeof decision?.["@context"] === "string"
        ? decision["@context"]
        : undefined;
    const countryIsoAlpha3 =
      typeof decision?.["@context_isoAlpha3"] === "string"
        ? decision["@context_isoAlpha3"]
        : undefined;
    const countryIsoAlpha2 =
      typeof decision?.["@context_isoAlpha2"] === "string"
        ? decision["@context_isoAlpha2"]
        : undefined;
    const reliability =
      typeof decision?.["@reliability"] === "string" ? toNumber(decision["@reliability"]) : undefined;
    const plateOccurences =
      typeof decision?.["@plateOccurences"] === "string" ? toNumber(decision["@plateOccurences"]) : undefined;
    const direction =
      typeof decision?.["@direction"] === "string"
        ? decision["@direction"]
        : undefined;
    const squarePlate =
      typeof decision?.["@squarePlate"] === "string" ? toNumber(decision["@squarePlate"]) : undefined;
    const jpeg = typeof decision?.jpeg === "string" ? decision.jpeg : undefined;
    const eventTimestamp =
      eventDate !== undefined
        ? new Date(eventDate).toISOString()
        : new Date().toISOString();

    return {
      id,
      apiId,
      plate,
      synchronizedFlag,
      session,
      cameraEventId,
      eventDate,
      countryCode,
      countryIsoAlpha2,
      countryIsoAlpha3,
      direction,
      reliability,
      plateOccurences,
      squarePlate,
      sinus,
      positionX,
      positionY,
      width,
      height,
      jpeg,
      eventTimestamp,
    };
  } catch {
    return null;
  }
}
