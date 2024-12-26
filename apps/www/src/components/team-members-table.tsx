/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { inviteTeamModalAtom, leaveTeamModalAtom, selectedTeamAtom, userAtom } from "@/jotai/store";
import { inviteTeam, removeTeamUser, updateTeamUser } from "@/server/actions/team";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useAtom } from "jotai";
import { MoreHorizontal, Plus, RotateCcw, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useUserRole } from "@/hooks/user-user-role";

import { TeamInviteForm } from "./team-invite-modal";
import { TeamLeaveAlert } from "./team-leave-alert";
import { TeamWebsiteModal } from "./team-website";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "./ui/use-toast";
import { TeamMember } from "@loglib/types/models";

export const columns: ColumnDef<TeamMember>[] = [
    {
        id: "name",
        header: "Name",
        cell: ({ row }) => <div className="capitalize">{row.original.name ?? "unknown"}</div>,
    },
    {
        id: "email",
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        id: "accepted",
        accessorKey: "accepted",
        header: "",
        cell: ({ row }) => {
            const accepted = row.getValue("accepted");
            return (
                <div className="text-right">
                    {!accepted ? (
                        <span className="rounded-full bg-yellow-600 px-2 py-1 text-xs font-medium text-white/90">
                            Not Accepted
                        </span>
                    ) : null}
                </div>
            );
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = useUserRole();
            const id = row.original.id;
            const [updating, setUpdating] = React.useState(false);
            const [team] = useAtom(selectedTeamAtom);
            return (
                <div className="text-right">
                    <Select
                        disabled={updating}
                        defaultValue={row.getValue("role")}
                        onValueChange={async (val) => {
                            setUpdating(true);
                            try {
                                await updateTeamUser(
                                    id,
                                    {
                                        role: val as "viewer" | "admin",
                                    },
                                    team?.id ?? "",
                                );
                                toast({
                                    title: "User role is updated successfully",
                                });
                            } catch {
                                toast({
                                    title: "Couldn't update the user try again later",
                                });
                            }
                            setUpdating(false);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Row" />
                        </SelectTrigger>
                        <SelectContent defaultValue={row.getValue("role")}>
                            <SelectItem
                                value="admin"
                                disabled={row.original.role === "owner" || role === "viewer"}
                            >
                                Admin
                            </SelectItem>
                            <SelectItem
                                value="viewer"
                                disabled={row.original.role === "owner" || role === "viewer"}
                            >
                                Viewer
                            </SelectItem>
                            <SelectItem value="owner" disabled={row.original.role !== "owner"}>
                                Owner
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            );
        },
    },
    {
        id: "actions",
        enableHiding: false,
        header: "",
        cell: ({ row }) => {
            const accepted = row.getValue("accepted");
            const role = row.original.role;
            const currentRole = useUserRole();
            const [team, setTeam] = useAtom(selectedTeamAtom);
            const id = row.original.id;
            const [pending, setPending] = React.useState(false);
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            disabled={role === "owner" || currentRole === "viewer" || pending}
                            onClick={async () => {
                                setPending(true);
                                try {
                                    if (!team) return;
                                    await removeTeamUser(id, team.id);
                                    if (team) {
                                        setTeam({
                                            ...team,
                                            teamMember: team.teamMember.filter((u) => u.id !== id),
                                        });
                                    }
                                    toast({
                                        title: "User is removed successfully",
                                    });
                                } catch {
                                    toast({
                                        title: "Couldn't remove the user from this team try again later",
                                    });
                                }
                                setPending(false);
                            }}
                        >
                            <div className=" flex items-center gap-2">
                                <Trash2 size={12} />
                                Remove
                            </div>
                        </DropdownMenuItem>
                        {!accepted ? (
                            <DropdownMenuItem
                                disabled={role === "viewer" || pending}
                                onClick={async () => {
                                    if (team && row.original.email) {
                                        setPending(true);
                                        try {
                                            await inviteTeam(
                                                {
                                                    email: row.original.email ?? "",
                                                    role: role ?? "viewer",
                                                },
                                                team.id,
                                                true,
                                            );
                                            toast({
                                                title: "The invitation is sent.",
                                            });
                                        } catch {
                                            toast({
                                                title: "Couldn't send the invitation try again later",
                                            });
                                        }
                                        setPending(false);
                                    }
                                }}
                            >
                                <div className=" flex items-center gap-2">
                                    <RotateCcw size={12} />
                                    Resend
                                </div>
                            </DropdownMenuItem>
                        ) : null}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export function TeamMembersTable() {
    const [data] = useAtom(selectedTeamAtom);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [, setInviteModal] = useAtom(inviteTeamModalAtom);
    const table = useReactTable({
        data: data?.teamMember ?? [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const [user] = useAtom(userAtom);
    const [, setLeaveTeamModal] = useAtom(leaveTeamModalAtom);
    const isOwner = () => data?.teamMember.find((u) => u.userId === user?.id)?.role === "owner";
    const isTheOnlyOwner = () =>
        data?.teamMember.filter((u) => {
            return u.role === "owner";
        }).length === 1;
    return (
        <div className="w-full">
            <div className="grid grid-cols-3 py-4">
                <Input
                    placeholder="Search by name..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                />
                <div></div>
                <div className=" flex items-center justify-end gap-2">
                    <Button
                        variant="secondary"
                        className=" flex items-center gap-2"
                        onClick={() => setInviteModal(true)}
                    >
                        <Plus size={16} />
                        Invite member
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setLeaveTeamModal(true);
                        }}
                    >
                        {isOwner() && isTheOnlyOwner() ? "Delete team" : "Leave team"}
                    </Button>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                <div>
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}
                                                </div>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {
                                                <div>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext(),
                                                    )}
                                                </div>
                                            }
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No members here yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredRowModel().rows.length} member(s) in this team.
                </div>
            </div>
            <TeamInviteForm />
            <TeamLeaveAlert deleteTeam={isOwner() && isTheOnlyOwner()} id={data?.id ?? ""} />
            <TeamWebsiteModal />
        </div>
    );
}
