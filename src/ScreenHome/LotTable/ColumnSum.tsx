import React, {
  ChangeEvent,
  KeyboardEvent,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { useAtom } from "jotai";
import styled from "styled-components";
import SvgAdd from "./ic_add.svg";
import { ButtonSvg } from "../../components/ButtonSvg";
import { Input } from "../../components/Input";
import { HomeAtomsCtx, TableData } from "../AtomsCtx";

const Root = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const InputSt = styled(Input)`
  width: 5rem;
  background: transparent;

  &.borderColor {
    animation: borderColor-keyframes 7s;
    @keyframes borderColor-keyframes {
      0% { border-color: var(--secondaryColor500); }
      10% { border-color: var(--secondaryColor500); }
      95% { border-color: var(--secondaryColor500); }
      100% { border-color: var(--borderColor); }
    }
  }
`;

const Plus = styled.div`
  opacity: 0;
  position: absolute;
  top: -8px;
  right: 2px;
  border-radius: 4px;
  font-weight: 600;
  color: var(--secondaryColor500);

  &.fade {
    animation: fade-in-keyframes 7s;
    @keyframes fade-in-keyframes {
      0% { opacity: 0; }
      10% { opacity: 1; top: 10px; right: 48px; }
      95% { opacity: 1; top: 10px; right: 48px; }
      100% { opacity: 0; top: 14px; right: 48px; }
    }
  }
`;

type Props = {
  row: Row<TableData>;
  column: Column<TableData, unknown>;
  table: Table<TableData>;
  getValue: Getter<unknown>;
};

export const ColumnSum = memo(({ row, column, table, getValue }: Props) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const { animateRowAtom } = useContext(HomeAtomsCtx);

  const [isEnterMode, setIsEnterMode] = useState(false);
  const [addValue, setAddValue] = useState<string>("");
  const [animateRow, setAnimateRow] = useAtom(animateRowAtom);

  const onBlur = useCallback(() => {
    table.options.meta?.updateData(column.id, value, row.original.id);
  }, [column.id, row.original.id, table.options.meta, value]);

  const animateEnd = useCallback(() => {
    setAnimateRow(undefined);
  }, [setAnimateRow]);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (!val) {
      setValue(0);
      return;
    }

    const parced = Number.parseInt(val, 10);
    setValue(parced);
  }, []);

  const onChangeMode = useCallback(() => {
    setIsEnterMode(!isEnterMode);
  }, [isEnterMode]);

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (
      Number.isNaN(Number.parseInt(e.key, 10)) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
    ) {
      e.preventDefault();
    }
  }, []);

  const onChangeAddValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (!val) {
      setAddValue("0");
      return;
    }

    const parced = Number.parseInt(val, 10).toString();
    setAddValue(parced);
  }, []);

  const onBlurAddValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let val = Number.parseFloat(e.target.value);

      if (Number.isNaN(val)) {
        val = 0;
      }

      setValue((draft: string) => {
        let parced = Number.parseFloat(draft);
        if (Number.isNaN(parced)) {
          parced = 0;
        }

        const result = parced + val;

        table.options.meta?.updateData(column.id, result, row.original.id);

        return result.toString();
      });

      setAddValue("");
      setIsEnterMode(false);
    },
    [column.id, row.original.id, table.options.meta]
  );

  const onKeyDownAddValue = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        setIsEnterMode(false);

        setValue((draft: string) => {
          let parced = Number.parseFloat(draft);
          if (Number.isNaN(parced)) {
            parced = 0;
          }

          const result = parced + Number.parseFloat(addValue) || 0;

          table.options.meta?.updateData(column.id, result, row.original.id);

          return result.toString();
        });

        setAddValue("");
        return;
      }

      if (
        Number.isNaN(Number.parseInt(e.key, 10)) &&
        e.key !== "Backspace" &&
        e.key !== "Delete" &&
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowRight"
      ) {
        e.preventDefault();
      }
    },
    [addValue, column.id, row.original.id, table.options.meta]
  );

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Root>
      <Plus
        onAnimationEnd={animateEnd}
        className={animateRow?.lotId === row.original.id ? "fade" : ""}>
        + {animateRow?.sum}
      </Plus>

      <InputSt
        value={value as string}
        placeholder="Сумма"
        maxLength={6}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className={animateRow?.lotId === row.original.id ? "borderColor" : ""}
      />

      {!isEnterMode && (
        <ButtonSvg onClick={onChangeMode} title="Добавить к основной сумме">
          <SvgAdd />
        </ButtonSvg>
      )}

      {isEnterMode && (
        <InputSt
          autoFocus
          placeholder="+ к сумме"
          value={addValue}
          maxLength={6}
          onChange={onChangeAddValue}
          onBlur={onBlurAddValue}
          onKeyDown={onKeyDownAddValue}
        />
      )}
    </Root>
  );
});
