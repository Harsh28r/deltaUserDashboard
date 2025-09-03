'use client';
import React, { useState } from "react";
import {
    createColumnHelper,
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import Image from "next/image";
import TitleIconCard from "@/app/components/shared/TitleIconCard";
import { Label } from "flowbite-react";


const columnHelper = createColumnHelper();

const columns: any = [
    columnHelper.accessor('avatar', {
        header: () => <span>User</span>,
    }),
    columnHelper.accessor('pname', {
        header: () => <span>Project Name</span>,
    }),
    columnHelper.accessor('teams', {
        header: () => <span>Team</span>,
    }),
    columnHelper.accessor('status', {
        header: () => <span>Status</span>,
    }),
    columnHelper.accessor('budget', {
        header: () => <span>Budget</span>,
    }),
];

const EmptyTable = () => {
    const [data] = React.useState([]);
    const [search, setSearch] = useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleSearchChange = (columnId: string, value: string) => {
        setSearch(prev => ({ ...prev, [columnId]: value }));
    };

    return (
        <>
            <TitleIconCard title="Empty Table">
                <div className="border rounded-md border-ld overflow-hidden">
                    <div className="overflow-x-auto">
                        <input
                            type="text"
                            placeholder="search 0 records..."
                            className="ml-4 form-control-input w-auto mt-4"

                        />
                        <table className="min-w-full">
                            <thead>

                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                className="text-base font-semibold text-left border-b border-ld px-4 py-3  whitespace-nowrap"
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <>
                                                        <Label className="mb-1 block">{flexRender(header.column.columnDef.header, header.getContext())}</Label>
                                                        <input
                                                            type="text"
                                                            placeholder={`Search ${header.id}`}
                                                            className="form-control-input sm:w-full w-[150px]"
                                                            onChange={(e) => handleSearchChange(header.id, e.target.value)}
                                                        />
                                                    </>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}

                            </thead>
                            <tbody className="divide-y divide-border dark:divide-darkborder">
                                <tr>
                                    <td colSpan={columns.length} className="text-center py-8 px-4">
                                        <div className="flex flex-col items-center">
                                            <Image
                                                src="/images/svgs/no-data.webp"
                                                alt="No data"
                                                height={100}
                                                width={100}
                                                className="mb-4"
                                            />

                                        </div>
                                    </td>
                                </tr>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                className="text-base font-semibold text-ld text-left px-4 py-3 "
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </TitleIconCard >
        </>
    );
};

export default EmptyTable;
