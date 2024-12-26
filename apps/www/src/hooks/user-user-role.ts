import { selectedTeamAtom, userAtom } from "@/jotai/store";
import { useAtom } from "jotai";

export function useUserRole() {
    const [user] = useAtom(userAtom);
    const [team] = useAtom(selectedTeamAtom);
    const teamUser = team?.teamMember.find((member) => member.userId === user?.id);
    return teamUser?.role as "owner" | "admin" | "viewer";
}
