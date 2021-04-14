import { HttpProvider } from '../../providers/HttpProvider';
import { Injectable } from '@angular/core';

@Injectable()
export class ProofService {

  constructor(private httpProvider: HttpProvider) {

  }

  createRequest(shipmentId, proverLat, proverLng, proverAddr, preHx, password) {
    let timestamp = new Date();
    let data = "shipmentId="+shipmentId+"&proverLat="+proverLat+"&proverLng="+proverLng+"&proverAddr="+proverAddr+"&preHx="+preHx+"&password="+password+"&timestamp="+timestamp.toDateString();
    return this.httpProvider.postRequest("proof/createrequest", data)
  }

  addResponse(requestId, shipmentId, witnessLat, witnessLng, witnessAddr, password) {
    let timestamp = new Date();
    let data = "requestId="+requestId+"&shipmentId="+shipmentId+"&witnessLat="+witnessLat+"&witnessLng="+witnessLng+"&witnessAddr="+witnessAddr+"&password="+password+"&timestamp="+timestamp.toDateString();
    return this.httpProvider.postRequest("proof/addresponse", data);
  }

  loadRequestDetails(requestId) {
    let data = "requestId="+requestId;
    return this.httpProvider.postRequest("proof/loadrequest", data);
  }

  submitBlock(requestId, preHx) {
    let data = "requestId="+requestId+"&preHx="+preHx;
    return this.httpProvider.postRequest("proof/submitBlock", data);
  }

  verifyBlocks(blockHx, totalCount) {
    let data = "blockHx="+blockHx+"&totalCount="+totalCount;
    return this.httpProvider.postRequest("proof/verifyblocks", data);
  }

  getRequests(shipmentId) {
    return this.httpProvider.getRequest("proof/getrequests?shipmentId="+shipmentId);
  }

  getResponses(requestId) {
    return this.httpProvider.getRequest("proof/getresponses?requestId="+requestId);
  }

}
