"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Trophy, Medal, Award } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { useStudent, type StudentWithRank } from "@/hooks/use-student";

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) {
    return (
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <span className="font-bold text-yellow-500">{rank}</span>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex items-center gap-2">
        <Medal className="h-5 w-5 text-gray-400" />
        <span className="font-bold text-gray-400">{rank}</span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex items-center gap-2">
        <Award className="h-5 w-5 text-amber-600" />
        <span className="font-bold text-amber-600">{rank}</span>
      </div>
    );
  }
  return <span className="font-medium">{rank}</span>;
};

export const columns: ColumnDef<StudentWithRank>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
    cell: ({ row }) => <RankBadge rank={row.getValue("rank")} />,
    enableHiding: false,
  },
  {
    accessorKey: "studentId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student ID
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("studentId")}</div>
    ),
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
  },
  {
    accessorKey: "totalPoints",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Points
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const points = row.getValue("totalPoints") as number;
      return (
        <div className="text-right font-bold text-lg text-green-600">
          {points.toLocaleString()}
        </div>
      );
    },
  },
];

export default function RankingsTable() {
  const { getStudentRankings } = useStudent();
  const [rankings, setRankings] = React.useState<StudentWithRank[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  React.useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const data = await getStudentRankings();
        setRankings(data);
      } catch (err) {
        console.error("Failed to fetch rankings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRankings, 30000);
    return () => clearInterval(interval);
  }, []);

  const table = useReactTable({
    data: rankings,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading rankings...
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Student Rankings
          </h2>
          <p className="text-muted-foreground text-sm">
            Rankings reset monthly. Points accumulate from recycling scans.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by name or student ID..."
          value={
            (table.getColumn("firstName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("firstName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
                <TableRow
                  key={row.id}
                  className={row.original.rank <= 3 ? "bg-muted/50" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No rankings available yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Showing {table.getRowModel().rows.length} of {rankings.length}{" "}
          students
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
