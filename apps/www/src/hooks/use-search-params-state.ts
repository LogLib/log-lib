import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useSearchParamsState(key: string) {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const router = useRouter();
    const value = useMemo(() => {
        return searchParams.get(key);
    }, [searchParams]);
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const newSearchParams = new URLSearchParams(searchParams.toString());
            newSearchParams.set(name, value);
            return newSearchParams.toString();
        },
        [searchParams],
    );
    const setValue = useCallback(
        (newValue: string | null | undefined) => {
            if (newValue === value) {
                return;
            }
            let updatedQueryString: string;
            if (newValue && newValue.length > 0) {
                updatedQueryString = createQueryString(key, newValue);
            } else {
                updatedQueryString = createQueryString(key, "");
            }
            router.push(`${pathName}?${updatedQueryString}`);
        },
        [router, pathName],
    );
    return [value, setValue] as const;
}
