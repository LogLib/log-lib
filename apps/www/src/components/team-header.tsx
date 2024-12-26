"use client";

import { createTeamModalAtom, selectedTeamAtom, teamSitesModalAtom } from "@/jotai/store";
import { Teams } from "@/server/query";
import { useAtom } from "jotai";
import { ChevronDown, Plus, Terminal } from "lucide-react";
import { useEffect } from "react";

import { useUserRole } from "@/hooks/user-user-role";
import { cn } from "@/lib/utils";

import { Icons } from "./icons";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button, buttonVariants } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "./ui/use-toast";

type Props = {
    teams: Teams;
};

export const TeamHeader = ({ teams }: Props) => {
    const [, setCreateTeam] = useAtom(createTeamModalAtom);
    const [selectedTeam, setSelectedTeam] = useAtom(selectedTeamAtom);
    const [, setTeamSitesModal] = useAtom(teamSitesModalAtom);
    const role = useUserRole();
    async function onClick() {
        if (teams.length > 2) {
            return toast({
                title: "Limit of 2 team is reached.",
                description: "We currently only support 2 teams per account.",
                variant: "destructive",
            });
        }
        setCreateTeam(true);
    }
    useEffect(() => {
        if (teams.length > 0) {
            if (!selectedTeam) {
                return setSelectedTeam(teams[0]);
            }
            const team = teams.find((team) => team?.id === selectedTeam.id);
            if (!team) {
                setSelectedTeam(teams[0]);
            } else {
                setSelectedTeam(team);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teams]);
    return (
        <div>
            <div className=" my-6 flex items-center justify-between">
                {teams.length ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className=" flex w-72 justify-start">
                            <Button variant="outline" className="justify-between gap-2">
                                {selectedTeam?.name || "Select Team"}
                                <ChevronDown size={18} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className=" w-72">
                            {teams.length &&
                                teams.map((team) => (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setSelectedTeam(team);
                                        }}
                                    >
                                        {team?.name}
                                    </DropdownMenuItem>
                                ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className=" flex items-center gap-2"
                                onClick={onClick}
                            >
                                <Plus size={12} /> Create New Team
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : null}

                {teams.length ? (
                    <div className="ml-auto flex items-center gap-2">
                        {role === "owner" && (
                            <button
                                onClick={() => {
                                    setTeamSitesModal(true);
                                }}
                                className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
                            >
                                <Icons.layout className="h-4 w-4 " />
                                <span className="">
                                    {selectedTeam?.websites.length ? "Change" : "Add"} Team Website
                                </span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="ml-auto flex items-center gap-2">
                        <button onClick={onClick} className={cn(buttonVariants(), "gap-2")}>
                            <Icons.add className="h-4 w-4 " />
                            <span className="">Add Team</span>
                        </button>
                    </div>
                )}
            </div>
            {!teams.length || selectedTeam?.websites.length || role === "viewer" ? null : (
                <Alert className=" text-logo">
                    <Terminal size={16} className=" animate-pulse" />
                    <AlertTitle>Hey there!</AlertTitle>
                    <AlertDescription>
                        You haven&apos;t added any websites to your team. To add a website, click
                        add team website button located above me.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};
