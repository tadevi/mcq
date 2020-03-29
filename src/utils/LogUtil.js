import {DEBUG} from "../config";

export function Log(message, ...args) {
    if (DEBUG) {
        console.log(message, args)
    }
}
