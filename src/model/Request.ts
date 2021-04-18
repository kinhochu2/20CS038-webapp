export class Request {
  requestId: number;
  shipmentId: number;
  signedHx: string;
  preHx: string;
  broadCasted: boolean;
  proverAddr: string;
  proverLat: string;
  proverLng: string;
  responses: Response[];
  timestamp: Date;
  finished: boolean;

  constructor(requestId, shipmentId, prover ,proverLat, proverLng, timestamp) {
    this.requestId = requestId;
    this.shipmentId = shipmentId
    this.proverAddr = prover;
    this.proverLat = proverLat;
    this.proverLng = proverLng;
    this.broadCasted = false;
    this.responses = new Array<Response>();
    this.timestamp = timestamp;
    this.finished = false;
  }

  isActive() {
    return this.broadCasted;
  }
}
