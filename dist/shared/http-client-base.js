"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_cache_interceptor_1 = require("axios-cache-interceptor");
const storage = (0, axios_cache_interceptor_1.buildWebStorage)(window.sessionStorage, 'gs-');
class HttpClient {
    constructor(baseURL) {
        this._handleResponse = ({ data }) => data;
        this._handleError = (error) => Promise.reject(error);
        this.client = (0, axios_cache_interceptor_1.setupCache)(axios_1.default.create({ baseURL }), {
            storage: storage,
            generateKey: axios_cache_interceptor_1.defaultKeyGenerator,
            headerInterpreter: axios_cache_interceptor_1.defaultHeaderInterpreter,
            debug: (msg) => console.log(msg),
            ttl: 1000 * 15,
            cachePredicate: {
                statusCheck: (status) => status >= 200 && status < 400,
            },
        });
        this._initializeResponseInterceptor();
    }
    _initializeResponseInterceptor() {
        this.client.interceptors.response.use(this._handleResponse, this._handleError);
    }
}
exports.HttpClient = HttpClient;
