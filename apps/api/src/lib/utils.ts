export const convertDate = (date: Date | string) => {
    if (typeof date === "string") {
        const d = new Date(date);
        return d.toISOString().slice(0, 19).replace("T", " ");
    }
    return date.toISOString().slice(0, 19).replace("T", " ");
};

export const getNow = () => {
    return new Date(convertDate(new Date()));
};

export const getQuery = (query: string) => {
    const q = new URLSearchParams(query.split("?")[1]);
    const queryObject = Object.fromEntries(q.entries());
    return queryObject;
};
