class ApiClient {
  public makeGETRequest(url: string, queryParams: any) {
    return fetch(this.formatUrl(url)).then(this.jsonResult);
  }

  public makePOSTRequest(url: string, queryParams: any, body: any) {
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
    return `http://localhost:31337/device-farm/api${url}`;
  }

  private jsonResult(res: any) {
    return res.json();
  }
}

export default new ApiClient();
