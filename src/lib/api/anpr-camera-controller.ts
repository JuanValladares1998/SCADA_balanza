import { apiRequest } from "./client";

export type AnprCameraRecord = {
  id: number;
  plate: string;
  apiId?: number;
  cameraEventId?: string;
  eventDate?: string;
  eventTimestamp?: string;
};

export type AnprCameraRecordDetail = {
  id: number;
  sensorMacAddress: string;
  sensorSerialNumber: string;
  sensorName: string;
  droppedMessages: string;
  eventDate: string;
  synchronizedFlag: string;
  session: string;
  cameraEventId: string;
  plate: string;
  countryCode: string;
  countryIsoAlpha2: string;
  countryIsoAlpha3: string;
  direction: string;
  reliability: string;
  plateOccurences: string;
  squarePlate: string;
  sinus: string;
  positionX: string;
  positionY: string;
  width: string;
  height: string;
  imagePath: string;
  eventTimestamp: string;
  receivedAt: string;
};

export async function getAnprCameraRecords() {
  return apiRequest<AnprCameraRecord[]>("/api/camera/anpr");
}

export async function getAnprCameraRecordById(id: number | string) {
  return apiRequest<AnprCameraRecordDetail>(`/api/camera/anpr/${id}`);
}
