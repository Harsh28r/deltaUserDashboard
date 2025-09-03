"use client";
import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Badge, Button, Dropdown } from "flowbite-react";
import Image from "next/image";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDots,
} from "@tabler/icons-react";
import { Icon } from "@iconify/react";
import TitleIconCard from "@/app/components/shared/TitleIconCard";

export interface PaginationTableType {
  id?: string;
  avatar?: string | any;
  name?: string;
  handle?: string;
  courses: {
    status: string;
    statuscolor: string;
  }[];
  users?: string;
  actions?: any;
}

const basicTableData5: PaginationTableType[] = [
  {
    avatar: "/images/blog/blog-img1.jpg",
    name: "Top Authors",
    handle: "Successful Fellas",
    users: "4300 Users",
    courses: [
      {
        status: "Angular",
        statuscolor: "error",
      },
      {
        status: "PHP",
        statuscolor: "primary",
      },
    ],
  },
  {
    avatar: "/images/blog/blog-img2.jpg",
    name: "Popular Authors",
    handle: "Most Successful",
    users: "1200 Users",
    courses: [
      {
        status: "Bootstrap",
        statuscolor: "primary",
      },
    ],
  },
  {
    avatar: "/images/blog/blog-img3.jpg",
    name: "New Users",
    handle: "Awesome Users",
    users: "2000 Users",
    courses: [
      {
        status: "Reactjs",
        statuscolor: "success",
      },
      {
        status: "Angular",
        statuscolor: "error",
      },
    ],
  },
  {
    avatar: "/images/blog/blog-img4.jpg",
    name: "Active Customers",
    handle: "Best Customers",
    users: "1500 Users",
    courses: [
      {
        status: "Bootstrap",
        statuscolor: "primary",
      },
    ],
  },
  {
    avatar: "/images/blog/blog-img5.jpg",
    name: "Bestseller Theme",
    handle: "Amazing Templates",
    users: "9500 Users",
    courses: [
      {
        status: "Angular",
        statuscolor: "error",
      },
      {
        status: "Reactjs",
        statuscolor: "success",
      },
    ],
  },
  {
    avatar: "/images/blog/blog-img1.jpg",
    name: "Top Authors",
    handle: "Successful Fellas",
    users: "4300 Users",
    courses: [
      {
        status: "Angular",
        statuscolor: "error",
      },
      {
        status: "PHP",
        statuscolor: "primary",
      },
    ],
  },
  {
    avatar: "/images/blog/blog-img2.jpg",
    name: "Popular Authors",
    handle: "Most Successful",
    users: "1200 Users",
    courses: [
      {
        status: "Bootstrap",
        statuscolor: "primary",
      },
    ],
  },
  {
    avatar: "/images/blog/blog-img1.jpg",
    name: "Top Authors",
    handle: "Successful Fellas",
    users: "4300 Users",
    courses: [
      {
        status: "Angular",
        statuscolor: "error",
      },
      {
        status: "PHP",
        statuscolor: "primary",
      },
    ],
  },
  {
    avatar: "/images/blog/blog-img2.jpg",
    name: "Popular Authors",
    handle: "Most Successful",
    users: "1200 Users",
    courses: [
      {
        status: "Bootstrap",
        statuscolor: "primary",
      },
    ],
  },
  {
    avatar: "/images/blog/blog-img3.jpg",
    name: "New Users",
    handle: "Awesome Users",
    users: "2000 Users",
    courses: [
      {
        status: "Reactjs",
        statuscolor: "success",
      },
      {
        status: "Angular",
        statuscolor: "error",
      },
    ],
  },
  {
    avatar: "/images/blog/blog-img4.jpg",
    name: "Active Customers",
    handle: "Best Customers",
    users: "1500 Users",
    courses: [
      {
        status: "Bootstrap",
        statuscolor: "primary",
      },
    ],
  },
  {
    avatar: "/images/blog/blog-img5.jpg",
    name: "Bestseller Theme",
    handle: "Amazing Templates",
    users: "9500 Users",
    courses: [
      {
        status: "Angular",
        statuscolor: "error",
      },
      {
        status: "Reactjs",
        statuscolor: "success",
      },
    ],
  },
  {
    avatar: "/images/blog/blog-img1.jpg",
    name: "Top Authors",
    handle: "Successful Fellas",
    users: "4300 Users",
    courses: [
      {
        status: "Angular",
        statuscolor: "error",
      },
      {
        status: "PHP",
        statuscolor: "primary",
      },
    ],
  },
  {
    avatar: "/images/blog/blog-img2.jpg",
    name: "Popular Authors",
    handle: "Most Successful",
    users: "1200 Users",
    courses: [
      {
        status: "Bootstrap",
        statuscolor: "primary",
      },
    ],
  },
];

const columnHelper = createColumnHelper<PaginationTableType>();

const columns = [
  columnHelper.accessor("avatar", {
    cell: (info) => (
      <div className="flex gap-3 items-center">
        <Image
          src={info.getValue()}
          width={50}
          height={50}
          alt="icon"
          className="h-10 w-10 rounded-md"
        />
        <div className="truncate line-clamp-2 max-w-56">
          <h6 className="text-base">{info.row.original.name}</h6>
          <p className="text-sm text-darklink dark:text-bodytext">
            {info.row.original.handle}
          </p>
        </div>
      </div>
    ),
    header: () => <span>Authors</span>,
  }),
  columnHelper.accessor("courses", {
    cell: (info) => (
      <div className="flex gap-2">
        {info.getValue().map((course, index) => (
          <Badge
            key={index}
            color={`light${course.statuscolor}`}
            className="capitalize"
          >
            {course.status}
          </Badge>
        ))}
      </div>
    ),
    header: () => <span>Courses</span>,
  }),
  columnHelper.accessor("users", {
    cell: (info) => (
      <p className="text-darklink dark:text-bodytext text-sm">
        {info.getValue()}
      </p>
    ),
    header: () => <span>Users</span>,
  }),
  columnHelper.accessor("actions", {
    cell: () => (
      <Dropdown
        label=""
        dismissOnClick={false}
        renderTrigger={() => (
          <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
            <IconDots size={22} />
          </span>
        )}
      >
        {[
          { icon: "solar:add-circle-outline", listtitle: "Add" },
          { icon: "solar:pen-new-square-broken", listtitle: "Edit" },
          { icon: "solar:trash-bin-minimalistic-outline", listtitle: "Delete" },
        ].map((item, index) => (
          <Dropdown.Item key={index} className="flex gap-3">
            <Icon icon={item.icon} height={18} />
            <span>{item.listtitle}</span>
          </Dropdown.Item>
        ))}
      </Dropdown>
    ),
    header: () => <span></span>,
  }),
];

function PaginationTable() {
  const [data] = React.useState(() => [...basicTableData5]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const rerender = React.useReducer(() => ({}), {})[1];

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    state: {
      columnFilters,
    },
    onColumnFiltersChange: (filters: any) => setColumnFilters(filters),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  const handleDownload = () => {
    const headers = ["Name", "Handle", "Users", "Courses"];
    const rows = data.map((item) => [
      item.name,
      item.handle,
      item.users,
      item.courses.map((course) => course.status).join(", "),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
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
      <TitleIconCard title="Pagination Table" onDownload={handleDownload}>
        <div className="border rounded-md border-ld overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-base text-ld font-semibold py-3 text-left border-b border-ld px-4 py-3"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-border dark:divide-darkborder">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="whitespace-nowrap py-3 px-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sm:flex  gap-2 p-3 items-center justify-between">
            <div className="flex items-center gap-2">
              <Button color="primary" onClick={() => rerender()}>
                Force Rerender
              </Button>
              <h1 className="text-gray-700">
                {table.getPrePaginationRowModel().rows.length} Rows
              </h1>
            </div>
            <div className="sm:flex  items-center gap-2 sm:mt-0 mt-3">
             
              <div className="sm:flex items-center gap-2">
                <div className="flex ">
                  <h2 className="text-gray-700 pe-1">Page</h2>
                  <h2 className="font-semibold text-gray-900">
                    {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                  </h2>
                </div>
                <div className="flex items-center gap-2 ">
                  | Go to page:
                  <input
                    type="number"
                    min="1"
                    max={table.getPageCount()}
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
                      table.setPageIndex(page);
                    }}
                    className="w-16  form-control-input"
                  />
                </div>
                <div className="select-md sm:mt-0 mt-3">
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                      table.setPageSize(Number(e.target.value));
                    }}
                    className="border  w-20"
                  >
                    {[10, 15, 20, 25].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 sm:mt-0 mt-3">
                  <Button
                    size="small"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="bg-lightgray dark:bg-dark hover:bg-lightprimary dark:hover:bg-lightprimary disabled:opacity-50"
                  >
                    <IconChevronsLeft className="text-ld" size={20} />
                  </Button>
                  <Button
                    size="small"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="bg-lightgray dark:bg-dark hover:bg-lightprimary dark:hover:bg-lightprimary disabled:opacity-50"
                  >
                    <IconChevronLeft className="text-ld" size={20} />
                  </Button>
                  <Button
                    size="small"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="bg-lightgray dark:bg-dark hover:bg-lightprimary dark:hover:bg-lightprimary disabled:opacity-50"
                  >
                    <IconChevronRight className="text-ld" size={20} />
                  </Button>
                  <Button
                    size="small"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="bg-lightgray dark:bg-dark hover:bg-lightprimary dark:hover:bg-lightprimary disabled:opacity-50"
                  >
                    <IconChevronsRight className="text-ld" size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TitleIconCard>
    </>
  );
}

export default PaginationTable;
