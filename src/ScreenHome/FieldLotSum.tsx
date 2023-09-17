import {
  ChangeEvent,
  KeyboardEvent,
  memo,
  useCallback,
  useContext,
} from "react";
import { Input } from "../components/Input";
import { HomeAtomsCtx } from "./AtomsCtx";
import { useAtom } from "jotai";
import styled from "styled-components";

const InputSt = styled(Input)`
  width: 5rem;
`;

// const regex = /[+-]?([0-9]*[.])?[0-9]+/g;

export const FieldLotSum = memo(() => {
  const { lotAtom } = useContext(HomeAtomsCtx);
  const [lot, setLot] = useAtom(lotAtom);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (!newValue) {
        setLot((draft) => {
          draft.sum = undefined;
          return draft;
        });
        return;
      }

      setLot((draft) => {
        draft.sum = Number.parseFloat(newValue);
        return draft;
      });
    },
    [setLot]
  );

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (
      isNaN(Number.parseInt(e.key, 10)) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
    ) {
      e.preventDefault();
    }
  }, []);

  return (
    <InputSt
      maxLength={6}
      value={lot.sum}
      placeholder="Сумма"
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
});
