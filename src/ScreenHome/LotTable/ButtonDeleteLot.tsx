import React, { memo, useCallback, useContext } from "react";
import { useSetAtom } from "jotai";
import SvgDelete from "./ic_delete.svg";
import { ButtonSvg } from "../../components/ButtonSvg";
import { HomeAtomsCtx } from "../AtomsCtx";

type Props = {
  id: string;
};

export const ButtonDeleteLot = memo(({ id }: Props) => {
  const { lotsAtom } = useContext(HomeAtomsCtx);
  const setLots = useSetAtom(lotsAtom);

  const onClick = useCallback(() => {
    setLots(draft => {
      const result = draft.filter(x => x.id !== id);
      return result;
    });
  }, [id, setLots]);

  return (
    <ButtonSvg onClick={onClick}>
      <SvgDelete />
    </ButtonSvg>
  );
});
