import React, { ChangeEvent, memo, useCallback, useEffect, useMemo, useState } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import styled from "styled-components";
import { Input } from "../../components/Input";
import { TableData } from "../AtomsCtx";
import { useTotalAmount } from "./useTotalAmount";

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const InputSt = styled(Input)`
  flex: auto;
  background: transparent;
`;

const RowNumber = styled.div`
  width: 2rem;
`;

const UserCnt = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--borderColor);
  max-width: 20rem;
`;

const User = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Percent = styled.div`
  color: var(--borderColor);
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
  const totalAmount = useTotalAmount();

  const percent = useMemo(() => {
    return (row.original.sum || 0) / (totalAmount || 1) * 100;
  }, [row.original.sum, totalAmount]);

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
      <InputSt value={value as string} placeholder="Название" onChange={onChange} onBlur={onBlur} />

      {row.original.userName && (
        <UserCnt>
          <User title="Инициатор">{row.original.userName}</User>
        </UserCnt>
      )}

      <Percent>{percent.toFixed(2)}%</Percent>
    </Root>
  );
});
