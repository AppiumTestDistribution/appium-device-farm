/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
class ApiClient {
  public makeGETRequest(url: string, _queryParams: any) {
    return fetch(this.formatUrl(url)).then(this.jsonResult);
  }

  public makePOSTRequest(url: string, _queryParams: any, body: any) {
    return fetch(this.formatUrl(url), {
      method: 'POST',
      body: JSON.stringify(body || {}),
      headers: { 'Content-Type': 'application/json' },
    }).then(this.jsonResult);
  }

  public makeDELETERequest(url: string) {
    return fetch(this.formatUrl(url), {
      method: 'DELETE',
    }).then(this.jsonResult);
  }

  public formatUrl(url: string) {
    return `/device-farm/api${url}`;
  }

  private jsonResult(res: any) {
    return res.json();
  }
}

export default new ApiClient();
