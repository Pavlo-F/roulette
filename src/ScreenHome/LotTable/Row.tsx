import React, { PropsWithChildren } from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import styled from "styled-components";
import { DragableTypes, DropType } from "./DragDropModels";
import { TableData } from "../AtomsCtx";

const Root = styled.tr<{ $height: string }>`
  position: relative;
  height: ${({ $height }) => $height};
`;

type Props = PropsWithChildren & {
  height: string;
  tableData: TableData;
  onDrop: (item: DropType) => void;
};

const findTheSame = (monitor: DropTargetMonitor<unknown, unknown>, tableData: TableData) => {
  const item = monitor.getItem();
  if (item) {
    return (item as DropType)?.comment?.toLowerCase()?.includes(tableData.name.toLowerCase());
  }

  return false;
};

export const Row = ({ height, tableData, onDrop, children }: Props) => {
  const [{ isOver, canDrop, isSame }, drop] = useDrop({
    drop: (item) => {
      onDrop(item as DropType);
    },
    accept: DragableTypes.NewLot,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      isSame: findTheSame(monitor, tableData),
    }),
  });

  const isActive = isOver && canDrop;
  let backgroundColor = "transparent";

  if (isSame) {
    backgroundColor = "#ffffff14";
  }

  if (isActive) {
    backgroundColor = "#f9aa3328";
  }

  return (
    <Root $height={height} ref={drop} style={{ backgroundColor }}>
      {children}
    </Root>
  );
};
