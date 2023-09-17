import { ChangeEvent, memo, useCallback, useContext } from "react";
import { Input } from "../components/Input";
import { HomeAtomsCtx } from "./AtomsCtx";
import { useAtom } from "jotai";
import styled from "styled-components";

const InputSt = styled(Input)`
  width: 30rem;
`;

export const FieldLotName = memo(() => {
  const { lotAtom } = useContext(HomeAtomsCtx);
  const [lot, setLot] = useAtom(lotAtom);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      setLot((draft) => {
        draft.name = newValue;
        return draft;
      });
    },
    [setLot]
  );

  return (
    <InputSt
      value={lot.name}
      placeholder="Введите название лота"
      onChange={onChange}
    />
  );
});
