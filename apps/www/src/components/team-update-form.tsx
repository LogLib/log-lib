"use client";

import { selectedTeamAtom } from "@/jotai/store";
import { updateTeam } from "@/server/actions/team";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useUserRole } from "@/hooks/user-user-role";
import { teamSchema } from "@/lib/validations/team";

import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";

export const TeamUpdateForm = () => {
    const [team, setSelectedTeam] = useAtom(selectedTeamAtom);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof teamSchema>>({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            name: team?.name,
        },
    });
    const router = useRouter();
    async function handleSubmit(data: z.infer<typeof teamSchema>) {
        if (!team?.id) return;
        setIsLoading(true);
        try {
            const res = await updateTeam(data, team.id);
            if (!res) throw new Error("Could not update team");
            setSelectedTeam({
                ...team,
                name: res.name,
                websites: res.teamWebsites,
            });
            toast({
                title: "Success!",
                description: "Your team has been updated.",
            });
        } catch {
            toast({
                title: "Uh oh!",
                description: "Could not update your team. Please try again later.",
                variant: "destructive",
            });
        }
        setIsLoading(false);
        router.refresh();
    }

    useEffect(() => {
        form.setValue("name", team?.name ?? "");
    }, [team]);
    const role = useUserRole();
    return (
        <Form {...form}>
            <form
                className=" grid grid-cols-3 "
                onSubmit={form.handleSubmit(handleSubmit, (e) => {
                    toast({
                        title: e.root?.message ?? e.name?.message,
                    });
                })}
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="">
                            <FormLabel>Team Name</FormLabel>
                            {/* <FormMessage /> */}
                            <FormControl>
                                <Input
                                    disabled={role === "viewer"}
                                    placeholder="Your Team Name"
                                    {...field}
                                    className=" "
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className=" mx-2 self-end">
                    <Button
                        variant="secondary"
                        disabled={
                            team?.name === form.watch("name") ||
                            !form.formState.isValid ||
                            role === "viewer"
                        }
                    >
                        {isLoading ? <Icons.spinner className=" h-4 w-4 animate-spin " /> : "Save"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
