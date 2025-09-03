'use client';
import React, { useState } from 'react';
import { useReactTable, createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, SortingState } from '@tanstack/react-table';
import { Badge, Progress } from 'flowbite-react';
import Image from 'next/image';
import { IconArrowBackUp, IconCheck, IconX } from '@tabler/icons-react';
import TitleIconCard from "@/app/components/shared/TitleIconCard";



export interface TableType4 {
    invoice: string;
    status: string;
    statuscolor: string;
    statusicon?: any;
    avatar: string;
    name: string;
    handle: string;
    progress: number;
}

const basicTableData: TableType4[] = [
    {
        invoice: 'INV-3066',
        status: 'paid',
        statuscolor: 'primary',
        statusicon: IconCheck,
        avatar: '/images/profile/user-8.jpg',
        name: 'Olivia Rhye',
        handle: 'olivia@ui.com',
        progress: 60
    },
    {
        invoice: 'INV-3067',
        status: 'cancelled',
        statuscolor: 'error',
        statusicon: IconX,
        avatar: '/images/profile/user-4.jpg',
        name: 'Barbara Steele',
        handle: 'steele@ui.com',
        progress: 30
    },
    {
        invoice: 'INV-3068',
        status: 'paid',
        statuscolor: 'primary',
        statusicon: IconCheck,
        avatar: '/images/profile/user-3.jpg',
        name: 'Leonard Gordon',
        handle: 'olivia@ui.com',
        progress: 45
    },
    {
        invoice: 'INV-3069',
        status: 'refunded',
        statuscolor: 'secondary',
        statusicon: IconArrowBackUp,
        avatar: '/images/profile/user-4.jpg',
        name: 'Evelyn Pope',
        handle: 'steele@ui.com',
        progress: 37
    },
    {
        invoice: 'INV-3070',
        status: 'cancelled',
        statuscolor: 'error',
        statusicon: IconX,
        avatar: '/images/profile/user-5.jpg',
        name: 'Tommy Garza',
        handle: 'olivia@ui.com',
        progress: 87
    },
    {
        invoice: 'INV-3071',
        status: 'refunded',
        statuscolor: 'secondary',
        statusicon: IconArrowBackUp,
        avatar: '/images/profile/user-9.jpg',
        name: 'Isabel Vasquez',
        handle: 'steele@ui.com',
        progress: 32
    }
];

const columnHelper = createColumnHelper<TableType4>();

const columns = [
    columnHelper.accessor('invoice', {
        cell: info => <h6 className="text-sm">{info.getValue()}</h6>,
        header: () => <span>Invoice</span>,
        meta: {
            sortType: 'alphanumeric',
        }
    }),
    columnHelper.accessor('status', {
        cell: info => (
            <Badge
                color={`light${info.row.original.statuscolor}`}
                className="capitalize"
                icon={() => <info.row.original.statusicon size={15} className="me-1" />}
            >
                {info.getValue()}
            </Badge>
        ),
        header: () => <span>Status</span>,
        meta: {
            sortType: 'alphanumeric',
        }
    }),
    columnHelper.accessor('avatar', {
        cell: info => (
            <div className="flex gap-3 items-center">
                <Image
                    src={info.getValue()}
                    alt="icon"
                    height={50}
                    width={50}
                    className="h-10 w-10 rounded-full"
                />
                <div className="truncate line-clamp-2 max-w-56">
                    <h6 className="text-base">{info.row.original.name}</h6>
                    <p className="text-sm ">{info.row.original.handle}</p>
                </div>
            </div>
        ),
        header: () => <span>Customer</span>,
    }),
    columnHelper.accessor('progress', {
        cell: info => (
            <div className=" text-sm flex items-center gap-3">
                <div className="w-full">
                    <Progress
                        progress={info.getValue()}
                        className="w-full"
                        color="primary"
                        size={"sm"}
                    />
                </div>
                {info.getValue()}%
            </div>
        ),
        header: () => <span>Progress</span>,
    }),
];

const SortingTable = () => {
    const [data] = useState<TableType4[]>(basicTableData);
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting
        },
        onSortingChange: setSorting,
    });

    const handleDownload = () => {
        const headers = ["Invoice", "Status", "Customer", "Progress"];
        const rows = data.map(item => [
            item.invoice,
            item.status,
            item.name,
            item.progress
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(e => e.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "table-data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <TitleIconCard title="Sorting Table" onDownload={handleDownload}>
                <div className="border rounded-md border-ld overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                className="text-base text-ld font-semibold py-3 text-left border-b border-ld px-4 cursor-pointer"
                                                onClick={() => header.column.toggleSorting()}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                                <span>
                                                    {header.column.getIsSorted()
                                                        ? (header.column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽')
                                                        : ''}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-border dark:divide-darkborder">
                                {table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map(row => (
                                        <tr key={row.id}>
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id} className="whitespace-nowrap py-3 px-4">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length} className="text-center py-4">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </TitleIconCard>
        </>
    );
};

export default SortingTable;

