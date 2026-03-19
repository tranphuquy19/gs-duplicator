"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VarOptionStorage = void 0;
const gitlab_http_client_1 = require("./gitlab-http-client");
const gitlab_resource_extractor_1 = require("./gitlab-resource-extractor");
class VarOptionStorage {
    constructor() {
        this.glHttpClient = gitlab_http_client_1.GitlabHttpClient.getInstance();
        this.options = {};
    }
    static getInstance() {
        if (!VarOptionStorage.instance) {
            VarOptionStorage.instance = new VarOptionStorage();
        }
        return VarOptionStorage.instance;
    }
    // Extract the options from the variable description
    setOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            for (const key of Object.keys(options)) {
                const values = options[key];
                if (!!values) {
                    for (let i = 0; i < values.length; i++) {
                        const value = values[i];
                        if (!!value) {
                            if (value.match(/\$glBranches\((\d+)?\)/)) {
                                const projectId = (0, gitlab_resource_extractor_1.getProjectIdFromTemplateVar)(value);
                                promises.push(this.glHttpClient.getProjectBranches(projectId).then((branches) => {
                                    values.splice(i, 1, ...(branches || []));
                                }));
                            }
                        }
                    }
                }
            }
            yield Promise.all(promises);
            this.options = options;
        });
    }
    getOptions() {
        return this.options;
    }
    getOptionsByKey(key) {
        return this.options[key] || [];
    }
    hasOptions() {
        return Object.keys(this.options).length > 0;
    }
    addOption(key, value) {
        var _a, _b;
        if (!this.options[key]) {
            this.options[key] = [];
        }
        if (((_a = this.options[key]) === null || _a === void 0 ? void 0 : _a.indexOf(value)) === -1) {
            (_b = this.options[key]) === null || _b === void 0 ? void 0 : _b.push(value);
        }
    }
    removeOption(key, value) {
        var _a, _b;
        if (!this.options[key]) {
            return;
        }
        const index = ((_a = this.options[key]) === null || _a === void 0 ? void 0 : _a.indexOf(value)) || -1;
        if (index !== -1) {
            (_b = this.options[key]) === null || _b === void 0 ? void 0 : _b.splice(index, 1);
        }
    }
}
exports.VarOptionStorage = VarOptionStorage;
