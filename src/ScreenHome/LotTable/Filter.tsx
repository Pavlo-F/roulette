import React from "react";
import { Column, Table } from "@tanstack/react-table";
import styled from "styled-components";
import { DebouncedInput } from "./DebouncedInput";

const Root = styled.div`
  display: flex;
  margin-bottom: 1rem;
  padding-left: 3rem;
`;

export const Filter = ({ column }: { column: Column<any, unknown>; table: Table<any> }) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <Root>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={value => column.setFilterValue(value)}
        placeholder="Поиск лота..."
        list={`${column.id}list`}
      />
    </Root>
  );
};
