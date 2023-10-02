import React, {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import styled from "styled-components";
import { Input } from "../../components/Input";
import { TableData } from "../AtomsCtx";

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const InputSt = styled(Input)`
  flex: auto;
`;

const Order = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  padding-left: 0.7rem;
  width: 4rem;
  height: 2rem;
  border: 2px solid var(--borderColor);
  border-radius: 8px;
  background-color: var(--primaryColor700);
  overflow: hidden;
  white-space: nowrap;
`;

const RowNumber = styled.div`
  width: 2rem;
`;

type Props = {
  row: Row<TableData>;
  column: Column<TableData, unknown>;
  table: Table<TableData>;
  getValue: Getter<unknown>;
};

export const ColumnName = memo(({ row, column, table, getValue }: Props) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = useCallback(() => {
    table.options.meta?.updateData(column.id, value, row.original.id);
  }, [column.id, row.original.id, table.options.meta, value]);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    setValue(val);
  }, []);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Root>
      <RowNumber>{row.index + 1}.</RowNumber>
      {/* <Order>№ {row.original.order + 1}</Order> */}
      <InputSt
        value={value as string}
        placeholder="Название"
        onChange={onChange}
        onBlur={onBlur}
      />
    </Root>
  );
});
