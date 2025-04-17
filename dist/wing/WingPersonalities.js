"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Wing_1 = __importDefault(require("./Wing"));
class WingPersonalities extends Wing_1.default {
    static get(content) {
        let personalities = ["string"];
        if (Object.keys(lists).includes(content)) {
            personalities.unshift("list");
        }
        if (!isNaN(parseFloat(content)) && isFinite(parseInt(content))) {
            personalities.unshift("number");
            let bigint = false;
            if (parseInt(content) > Number.MAX_SAFE_INTEGER || parseInt(content) < -(Number.MAX_SAFE_INTEGER)) {
                try {
                    let big = BigInt(content);
                    personalities.unshift("big");
                    bigint = true;
                    if (big >= 0) {
                        personalities.unshift("pbig");
                    }
                    else {
                        personalities.unshift("nbig");
                    }
                }
                catch (e) {
                    bigint = false;
                }
            }
            if (!bigint) {
                if (!isNaN(parseInt(content)) && parseInt(content) === parseFloat(content)) {
                    personalities.unshift("int");
                    if (Math.abs(parseInt(content)) === parseInt(content)) {
                        personalities.unshift("u64");
                    }
                    else {
                        personalities.unshift("i64");
                    }
                }
                else {
                    personalities.unshift("float");
                }
                if (parseFloat(content) === 0) {
                    personalities.unshift("boolean");
                    personalities.unshift("false");
                }
                else if (parseFloat(content) === 1) {
                    personalities.unshift("boolean");
                    personalities.unshift("true");
                }
            }
        }
        else if (content === "inf") {
            personalities.unshift("number");
            personalities.unshift("infinity");
        }
        else if (content === "NaN") {
            personalities.unshift("errnumber");
        }
        else if (content && content.length === 1) {
            personalities.unshift("char");
        }
        return personalities;
    }
}
exports.default = WingPersonalities;
let lists = global.lists;
//# sourceMappingURL=WingPersonalities.js.map