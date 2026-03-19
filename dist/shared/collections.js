"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leftJoin = void 0;
function leftJoin(left, right, key, select) {
    const rightLookup = right.reduce((lookup, item) => {
        lookup.set(item[key], item);
        return lookup;
    }, new Map());
    return left.map((item) => {
        return select(item, rightLookup.get(item[key]));
    });
}
exports.leftJoin = leftJoin;
