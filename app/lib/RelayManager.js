import "standard-file-js/dist/regenerator.js";
import { StandardFile, SFAbstractCrypto, SFItemTransformer, SFHttpManager } from 'standard-file-js';

export default class RelayManager {

  /* Singleton */
  static instance = null;
  static get() {
    if (this.instance == null) { this.instance = new RelayManager(); }
    return this.instance;
  }

  constructor() {
    this.httpManger = new SFHttpManager();
    this.httpManger.setJWTRequestHandler(() => {});

    this.relayServerUrl = "http://localhost:3020";
  }

  getUrl() {
    return this.relayServerUrl;
  }

  async uploadFile(name, item, integration) {
    let url = `${this.relayServerUrl}/integrations/save-item`;
    let params = {
      file: {
        name: name,
        item: item // base64 string of file
      },
      source: integration.source,
      authorization: integration.authorization
    }

    console.log("Beginning relay upload");

    // console.log("Uploading params to relay server", params);

    return new Promise((resolve, reject) => {
      this.httpManger.postAbsolute(url, params, (response) => {
        // console.log("Upload success response", response);
        resolve(response.metadata);
      }, (errorResponse) => {
        var error = errorResponse.error;
        if(!error) {
          error = {message: "File upload failed."};
        }
        console.log("Upload error response", error);
        reject(error);
      })
    });
  }

  async downloadFile(metadataItem, integration) {
    let url = `${this.relayServerUrl}/integrations/download-item`;
    let params = {
      metadata: metadataItem.content.serverMetadata,
      authorization: integration.authorization
    }

    // console.log("Downloading file with params", params);

    return new Promise((resolve, reject) => {
      this.httpManger.postAbsolute(url, params, (response) => {
        // console.log("Download success response", response);
        resolve(response);
      }, (errorResponse) => {
        var error = errorResponse.error;
        console.log("Download error response", errorResponse);
        reject(error);
      })
    });
  }

  async deleteFile(metadataItem, integration) {
    let url = `${this.relayServerUrl}/integrations/delete-item`;
    let params = {
      metadata: metadataItem.content.serverMetadata,
      authorization: integration.authorization
    }

    // console.log("Deleting file with params", params);

    return new Promise((resolve, reject) => {
      this.httpManger.postAbsolute(url, params, (response) => {
        // console.log("Download success response", response);
        resolve(response);
      }, (errorResponse) => {
        var error = errorResponse.error;
        console.log("Download error response", errorResponse);
        reject(error);
      })
    });
  }

}
