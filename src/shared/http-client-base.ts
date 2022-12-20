import axios, { AxiosResponse } from 'axios';
import {
  AxiosCacheInstance,
  buildMemoryStorage,
  defaultHeaderInterpreter,
  defaultKeyGenerator,
  setupCache,
} from 'axios-cache-interceptor';

declare module 'axios' {
  interface AxiosResponse<T = any> extends Promise<T> {}
}

export abstract class HttpClient {
  protected readonly client: AxiosCacheInstance;

  constructor(baseURL: string) {
    this.client = setupCache(axios.create({ baseURL }), {
      storage: buildMemoryStorage(),
      generateKey: defaultKeyGenerator,
      headerInterpreter: defaultHeaderInterpreter,
      debug: (msg) => console.log(msg),
      ttl: 1000 * 15,
      cachePredicate: {
        statusCheck: (status) => status >= 200 && status < 400,
      },
    });

    this._initializeResponseInterceptor();
  }

  private _initializeResponseInterceptor() {
    this.client.interceptors.response.use(this._handleResponse, this._handleError);
  }

  protected _handleResponse = ({ data }: AxiosResponse) => data;

  protected _handleError = (error: any) => Promise.reject(error);
}
