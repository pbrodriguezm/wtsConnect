// interfaz para la creación del el objeto del payload de conexion QR

export interface Payload {
  "phone"?: string,
  "qr": string | undefined,
  "type": string //generate | oppended | connect
}


export interface QRGenerate {
  "app": string,
  "timestamp": number,
  "date": Date,
  "phone"?: string,
  "company": string,
  "version": number,
  "type": string, //"qr-event"
  "payload": Payload;
}
