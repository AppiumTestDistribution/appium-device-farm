/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
class ApiClient {
  private static JWT_TOKEN: string | null = null;

  public setToken(token: string | null) {
    ApiClient.JWT_TOKEN = token;
  }

  private addDefaultHeaders(defaultHeader: Record<string, any>) {
    if (ApiClient.JWT_TOKEN) {
      defaultHeader['Authorization'] = `Bearer ${ApiClient.JWT_TOKEN}`;
    }
    return defaultHeader;
  }

  public makeGETRequest(url: string, _queryParams: any) {
    return fetch(this.formatUrl(url, _queryParams), {
      headers: this.addDefaultHeaders({}),
    }).then(this.jsonResult);
  }

  public makePOSTRequest(url: string, _queryParams: any, body: any) {
    return fetch(this.formatUrl(url, _queryParams), {
      method: 'POST',
      body: JSON.stringify(body || {}),
      headers: this.addDefaultHeaders({ 'Content-Type': 'application/json' }),
    }).then(this.jsonResult);
  }

  public makePUTRequest(url: string, _queryParams: any, body: any) {
    return fetch(this.formatUrl(url, _queryParams), {
      method: 'PUT',
      body: JSON.stringify(body || {}),
      headers: this.addDefaultHeaders({ 'Content-Type': 'application/json' }),
    }).then(this.jsonResult);
  }

  public makePATCHRequest(url: string, _queryParams: any, body: any) {
    return fetch(this.formatUrl(url, _queryParams), {
      method: 'PATCH',
      body: JSON.stringify(body || {}),
      headers: this.addDefaultHeaders({ 'Content-Type': 'application/json' }),
    }).then(this.jsonResult);
  }

  public makeDELETERequest(url: string) {
    return fetch(this.formatUrl(url), {
      method: 'DELETE',
      headers: this.addDefaultHeaders({}),
    }).then(this.jsonResult);
  }

  public formatUrl(url: string, params?: Record<string, any>) {
    let formattedUrl: URL;
    try {
      formattedUrl = new URL(url);
    } catch (err: any) {
      formattedUrl = new URL(`${window.location.origin}/device-farm/api${url}`);
    }
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        formattedUrl.searchParams.set(key, value);
      });
    }
    return formattedUrl;
  }

  private jsonResult(response: Response) {
    if (!response.ok) {
      return response;
    }
    return response.json();
  }

  public async makeStreamRequest(
    endpoint: string,
    abortController?: AbortController,
    params?: any,
  ) {
    const url = this.formatUrl(endpoint, params);
    return fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        Accept: 'text/plain',
      },
      signal: abortController?.signal,
    });
  }
}

export default new ApiClient();
