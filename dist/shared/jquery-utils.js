"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ = void 0;
const jquery_slim_1 = __importDefault(require("jquery/dist/jquery.slim"));
function $(selector) {
    const htmlElements = (0, jquery_slim_1.default)(selector);
    if (htmlElements.length === 0) {
        console.error(`No element found for selector ${selector}`);
    }
    return htmlElements;
}
exports.$ = $;
