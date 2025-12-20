import React, { Fragment, memo, useCallback, useContext, useMemo } from "react";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  RowData,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";
import { ColumnActions } from "./ColumnActions";
import { ColumnName } from "./ColumnName";
import { ColumnSum } from "./ColumnSum";
import { DropType } from "./DragDropModels";
import { Filter } from "./Filter";
import { Row } from "./Row";
import { SettingsAtomsCtx } from "../../ScreenSettings/AtomsCtx";
import { HomeAtomsCtx, TableData } from "../AtomsCtx";
import { TimerAtomsCtx } from "../Timer/AtomsCtx";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}
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

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

export const Form = memo(() => {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const { lotsAtom, newLotsAtom, animateRowAtom } = useContext(HomeAtomsCtx);
  const [lots, setLots] = useAtom(lotsAtom);
  const setNewLots = useSetAtom(newLotsAtom);
  const setAnimateRow = useSetAtom(animateRowAtom);

  const { addTime } = useContext(TimerAtomsCtx);
  const { settingsAtom } = useContext(SettingsAtomsCtx);
  const settings = useAtomValue(settingsAtom);

  const sortedLots = useMemo(() => {
    const result = lots.sort((a, b) => {
      return (b.sum || 0) - (a.sum || 0);
    });

    return result;
  }, [lots]);

  const columns = useMemo<ColumnDef<TableData>[]>(
    () => [
      {
        accessorFn: row => row.name,
        id: "name",
        header: "",
        enableColumnFilter: true,
        cell: ({ getValue, row, column, table }) => (
          <ColumnName
            key={`ColumnName_${row.original.id}`}
            row={row}
            column={column}
            table={table}
            getValue={getValue}
          />
        ),
        footer: props => props.column.id,
      },
      {
        id: "columnSpaceId",
        enableColumnFilter: false,
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.sum,
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
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.id,
        id: "columnActionsId",
        enableColumnFilter: false,
        header: "",
        cell: ({ row }) => (
          <ColumnActions key={`ColumnActions_${row.original.id}`} id={row.original.id} />
        ),
        footer: props => props.column.id,
      },
    ],
    []
  );

  const table = useReactTable({
    data: sortedLots,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
    },
    meta: {
      updateData: (columnId: string, value: unknown, rowId: string) => {
        setLots(old =>
          old.map(row => {
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
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),

    debugTable: false,
  });

  const handleDrop = useCallback(
    (target: TableData, item: DropType) => {
      setLots(old => {
        let isChanged = false;
        const result = old.map(row => {
          if (target.id === row.id) {
            isChanged = true;

            return {
              ...row,
              sum: (row.sum || 0) + item.sum,
            };
          }
          return row;
        });

        if (isChanged) {
          setNewLots(prev => {
            const filtered = prev.filter(x => x.id !== item.id);
            return filtered;
          });

          if (settings.timer.timeByDonate) {
            addTime(settings.timer.timeByDonate * 1000);
          }

          setAnimateRow({ lotId: target.id, sum: item.sum });
        }

        return result;
      });
    },
    [addTime, setAnimateRow, setLots, setNewLots, settings.timer.timeByDonate]
  );

  return (
    <Root>
      <TableSt>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    )}
                    {header.column.getCanFilter() && (
                      <Filter column={header.column} table={table} />
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <Row
                height="50px"
                tableData={row.original as TableData}
                key={`Tr_${row.id}`}
                onDrop={(item: DropType) => handleDrop(row.original as TableData, item)}>
                {row.getVisibleCells().map(cell => {
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
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Td>
                      )}

                      {cell.column.id === "columnSpaceId" && (
                        <Td $width="24px" key={`${cell.id}`} />
                      )}
                    </Fragment>
                  );
                })}
              </Row>
            );
          })}
        </tbody>
      </TableSt>
    </Root>
  );
});
