import mqtt from "mqtt";

export function createMqttClient(brokerUrl: string, options?: mqtt.IClientOptions) {
  return mqtt.connect(brokerUrl, {
    reconnectPeriod: 5000,
    keepalive: 30,
    ...options,
  });
}
