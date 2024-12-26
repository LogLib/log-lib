import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    ColumnFiltersState,
    PaginationState,
    Row,
    SortingState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import { EventFilter } from "./filter";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    renderSubComponent: (props: { row: Row<TData> }) => React.ReactElement;
    isLoading: boolean;
}

function DataTable<TData, TValue>({
    columns,
    data,
    renderSubComponent,
    isLoading,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 40,
    });

    const [localData, setLocalData] = useState(data);

    useEffect(() => {
        if (data) {
            setLocalData(data);
        }
    }, [data]);

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize],
    );

    const table = useReactTable({
        data: localData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            pagination: pagination,
        },
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: () => {
            //pagination is handled by the load more button
        },
    });

    return (
        <AnimatePresence>
            <p className=" text-sm my-2">
                Showing <strong>{table.getRowModel().rows?.length}</strong> of
                <strong> {data.length} </strong>
                events
            </p>
            <motion.div className="rounded-md border dark:border-gray-800 scrollbar-hide">
                <div className="flex items-center py-4 px-2 justify-between">
                    <Input
                        placeholder="Search Events..."
                        value={(table.getColumn("eventName")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("eventName")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    {/* @ts-ignore */}
                    <EventFilter data={data} setData={setLocalData} />
                </div>
                <Table className=" scrollbar-hide">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : (flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  ) as ReactNode)}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <Fragment key={row.id}>
                                    <TableRow
                                        data-state={row.getIsSelected() && "selected"}
                                        onClick={() => row.toggleExpanded()}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {
                                                    flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext(),
                                                    ) as ReactNode
                                                }
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {row.getIsExpanded() && (
                                        <motion.tr
                                            initial={{ opacity: 0.8 }}
                                            animate={{ opacity: 1 }}
                                            transition={{
                                                type: "just",
                                                delay: 0.2,
                                            }}
                                        >
                                            <TableCell colSpan={row.getVisibleCells().length}>
                                                {renderSubComponent({ row })}
                                            </TableCell>
                                        </motion.tr>
                                    )}
                                </Fragment>
                            ))
                        ) : isLoading ? (
                            <TableRow
                                className={
                                    "h-6 gap-2 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"
                                }
                            >
                                <TableCell
                                    colSpan={columns.length}
                                    className=" h-6 gap-2 bg-gray-200 dark:bg-gray-800 animate-pulse text-center"
                                >
                                    Loading Data ...
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </motion.div>
            <div className=" flex items-center justify-center my-2 gap-6">
                {pagination.pageSize < data.length && (
                    <Button
                        onClick={() => {
                            setPagination({
                                pageIndex: 0,
                                pageSize: pagination.pageSize + 40,
                            });
                        }}
                        variant="outline"
                    >
                        Load More
                    </Button>
                )}
            </div>
        </AnimatePresence>
    );
}

export { DataTable };
