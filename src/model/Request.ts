export class Request {
  requestId: string;
  hx: string;
  preHx: string;
  broadCasted: boolean;
  prover: string;
  proverLat: string;
  proverLng: string;
  responses: Response[];

  constructor(requestId, hx, preHx, prover ,proverLat, proverLng) {
    this.requestId = requestId;
    this.hx = hx;
    this.preHx = preHx;
    this.prover = prover;
    this.proverLat = proverLat;
    this.proverLng = proverLng;
    this.broadCasted = false;
    this.responses = new Array<Response>();
  }

  isActive() {
    return this.broadCasted;
  }
}
