import { apiRequest } from "./client";

export type AnprCameraRecord = {
  id: number;
  plate: string;
};

export async function getAnprCameraRecords() {
  return apiRequest<AnprCameraRecord[]>("/api/camera/anpr");
}
