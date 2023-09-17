import { memo, useCallback, useContext } from "react";
import { ButtonSvg } from "../../components/ButtonSvg";
import SvgDelete from "./ic_delete.svg";
import { HomeAtomsCtx } from "../AtomsCtx";
import { useSetAtom } from "jotai";

type Props = {
  id: string;
};

export const ButtonDeleteLot = memo(({ id }: Props) => {
  const { lotsAtom } = useContext(HomeAtomsCtx);
  const setLots = useSetAtom(lotsAtom);

  const onClick = useCallback(() => {
    setLots((draft) => {
      const result = draft.filter((x) => x.id !== id);
      return result;
    });
  }, [id, setLots]);

  return (
    <ButtonSvg onClick={onClick}>
      <SvgDelete />
    </ButtonSvg>
  );
});
