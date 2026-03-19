"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadEnvFile = void 0;
const config_1 = require("@/config");
function saveAs(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}
function downloadEnvFile(variables, description) {
    const envFileContent = variables
        .map((variable) => {
        const keyValue = `${variable.key}=${config_1.wrappedVarBy}${variable.value.replaceAll('"', '\\"')}${config_1.wrappedVarBy}`;
        return config_1.replaceEnterWithN ? keyValue.replaceAll('\n', '\\n') : keyValue;
    })
        .join('\n');
    const blob = new Blob([envFileContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${description}.env`);
}
exports.downloadEnvFile = downloadEnvFile;
