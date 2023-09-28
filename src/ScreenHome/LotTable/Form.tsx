import React, { Fragment, memo, useContext, useMemo } from "react";
import {
  ColumnDef,
  RowData,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import styled from "styled-components";
import { useAtom } from "jotai";
import { ColumnName } from "./ColumnName";
import { ColumnSum } from "./ColumnSum";
import { ColumnActions } from "./ColumnActions";
import { TableData, HomeAtomsCtx } from "../AtomsCtx";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (columnId: string, value: unknown, rowId: string) => void;
  }
}

const Root = styled.div`
  display: flex;
`;

const TableSt = styled.table`
  flex: auto;
  border-collapse: collapse;
  margin-right: 2rem;
`;

const Td = styled.td<{ $width: string }>`
  width: ${({ $width }) => $width};
`;

const Tr = styled.tr<{ $height: string }>`
  position: relative;
  height: ${({ $height }) => $height};
`;

export const Form = memo(() => {
  const { lotsAtom } = useContext(HomeAtomsCtx);
  const [lots, setLots] = useAtom(lotsAtom);

  const sortedLots = useMemo(() => {
    const result = lots.sort((a, b) => {
      return (b.sum || 0) - (a.sum || 0);
    });

    return result;
  }, [lots]);

  const columns = React.useMemo<ColumnDef<TableData>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        id: "name",
        header: "",
        enableColumnFilter: false,
        cell: ({ getValue, row, column, table }) => (
          <ColumnName
            key={`ColumnName_${row.original.id}`}
            row={row}
            column={column}
            table={table}
            getValue={getValue}
          />
        ),
        footer: (props) => props.column.id,
      },
      {
        id: "columnSpaceId",
        enableColumnFilter: false,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.sum,
        id: "sum",
        enableColumnFilter: false,
        header: "",
        cell: ({ getValue, row, column, table }) => (
          <ColumnSum
            key={`ColumnSum_${row.original.id}`}
            row={row}
            column={column}
            table={table}
            getValue={getValue}
          />
        ),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.id,
        id: "columnActionsId",
        enableColumnFilter: false,
        header: "",
        cell: ({ row }) => (
          <ColumnActions
            key={`ColumnActions_${row.original.id}`}
            id={row.original.id}
          />
        ),
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  const table = useReactTable({
    data: sortedLots,
    columns,
    meta: {
      updateData: (columnId: string, value: unknown, rowId: string) => {
        setLots((old) =>
          old.map((row) => {
            if (row.id === rowId) {
              return {
                ...row,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: false,
  });

  return (
    <Root>
      <TableSt>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <Tr $height="50px" key={`Tr_${row.id}`}>
                {row.getVisibleCells().map((cell) => {
                  let size = "auto";
                  if (cell.column.id === "sum") {
                    size = "120px";
                  } else if (cell.column.id === "columnActionsId") {
                    size = "20px";
                  }

                  return (
                    <Fragment key={`Cell_${cell.id}`}>
                      {cell.column.id !== "columnSpaceId" && (
                        <Td $width={size} key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Td>
                      )}

                      {cell.column.id === "columnSpaceId" && (
                        <Td $width="24px" key={`${cell.id}`} />
                      )}
                    </Fragment>
                  );
                })}
              </Tr>
            );
          })}
        </tbody>
      </TableSt>
    </Root>
  );
});
