import { useEffect, useState } from "react";

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        setIsMobile(window.screen.width <= 720);
    }, []);
    return isMobile;
}
