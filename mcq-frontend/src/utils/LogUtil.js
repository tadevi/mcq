import {DEBUG} from "./ApiUtils";

export function Log(message, ...args) {
    if (DEBUG) {
        console.log(message, args)
    }
}
