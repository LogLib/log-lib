import { browserName, detectOS } from "detect-browser";
import { ApiRequest } from "../../routes/type";
import { getDevice } from "./get-device";
import { getIpAddress } from "./get-ip-address";
import { getLocation } from "./get-location";

export async function detect(req: ApiRequest, screenWidth: number) {
    const ip = getIpAddress(req);
    const userAgent = req.headers["user-agent"];
    const { city, country } = await getLocation(ip, req);
    const browser = browserName(userAgent) ?? "unknown";
    const os = detectOS(userAgent) ?? "Mac OS";
    const device = os ? getDevice(screenWidth, os) ?? "desktop" : "unknown";
    return {
        device,
        os,
        browser,
        city,
        country,
    };
}
