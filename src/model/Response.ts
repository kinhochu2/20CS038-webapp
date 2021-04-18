export class Response {
  requestId: string;
  witnessAddr: string;
  witnessLat: string;
  witnessLng: string;
  timestamp: string;

  constructor(requestId, witnessAddr, witnessLat, witnessLng, timestamp) {
    this.requestId = requestId;
    this.witnessAddr = witnessAddr;
    this.witnessLat = witnessLat;
    this.witnessLng = witnessLng;
    this.timestamp = timestamp;
  }
}
