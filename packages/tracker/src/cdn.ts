import { record } from "./record";

const script = document.currentScript;
const id = script.getAttribute("data-id");
const host = script.getAttribute("data-host") ?? "https://api.loglib.io";
const consent = (script.getAttribute("data-consent") as "granted" | "denied") ?? "denied";
record({ id, host, consent });
