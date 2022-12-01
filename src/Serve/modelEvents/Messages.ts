// interfaz para la creación del el objeto del payload
export interface Payload {
  "id"?: string | null | undefined,
  "source": string | undefined, // number "51987947xxx"
  "type": string //"text"|"image"|"file"|"audio"|"video"|"contact"|"location"|"button_reply"|"list_reply", 
  "payload"?: any
}

/* ===== Messages-Event ======
=="payload":{
===="id":"gBEGkYaYVSEEAgnZxQ3JmKK6Wvg" (identificador de mensaje)
===="gsId": "ee4a68a0-1203-4c85-8dc3-49d0b3226a35" (ID de mensaje para Guardar Sesiones)
===="type":"enqueued"|"failed"|"sent"|"delivered"|"read",
===="destination":"91XX985XX10X",
===="payload": << Varia según el valor de la propiedad - "type" >>;
==}
*/
export interface PayloadEvent {
  "id"?: string | null | undefined,
  "gsid"?: string | null | undefined,
  "type": string
  "destination": string | undefined, // number "51987947xxx"
  "payload"?: any
}
export interface MessageEvent {
  "app": string,
  "company": string,
  "timestamp": number,
  "date": Date,
  "version": number,
  "type": string, //"user-event"
  "payload": PayloadEvent,
  
}



export interface Sender {
  "phone": string | undefined,  
  "name"?: string | null | undefined,   
  "country_code"?: number, 
  "dial_code"?: string 
  
}

export interface MessageIN {
  "app": string,
  "company": string,
  "timestamp": number,
  "date": Date,
  "version": number,
  "type": string, //"user-event"
  "payload": Payload,
  "sender": Sender
}


