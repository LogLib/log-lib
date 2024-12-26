export const Logger = (debug: boolean) => {
    return {
        log(...args: any[]) {
            debug && console.log(...args);
        },
        error(...args: any[]) {
            debug && console.error(...args);
        },
    };
};
