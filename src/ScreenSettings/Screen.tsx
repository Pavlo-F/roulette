import React, { memo } from "react";
import styled from "styled-components";
import { FieldDefaultTime } from "./FieldDefaultTime";
import { FieldAddTime } from "./FieldAddTime";
import { FieldAddTimeForNewPosition } from "./FieldAddTimeForNewPosition";

const Row = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  margin-bottom: 1rem;
  font-size: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 20rem 2rem;
  align-items: center;
  row-gap: 1rem;
`;

export const Screen = memo(() => {
  return (
    <>
      <Row>
        <Header>Таймер</Header>

        <Grid>
          <div>Начальное время</div>
          <FieldDefaultTime />

          <div>Время ручного прибавления таймера</div>
          <FieldAddTime />

          <div>Время прибавления за новую позицию</div>
          <FieldAddTimeForNewPosition />
        </Grid>
      </Row>
    </>
  );
});
