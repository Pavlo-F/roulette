import React, { memo, useContext, useEffect, useMemo } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { HomeAtomsCtx } from "./AtomsCtx";
import { DonateAtomsCtx } from "../Services/DonateService";

export const DonateProcess = memo(() => {
  const { donateAtom } = useContext(DonateAtomsCtx);
  const { lotsAtom, newLotsAtom } = useContext(HomeAtomsCtx);

  const [lots, setLots] = useAtom(lotsAtom);
  const setNewLots = useSetAtom(newLotsAtom);
  const donate = useAtomValue(donateAtom);

  const lotExists = useMemo(() => {
    return lots.find(
      x => x.name?.toLowerCase() === donate.comment?.toLowerCase()
    );
  }, [donate.comment, lots]);

  useEffect(() => {
    if (!donate.sum) {
      return;
    }

    if (lotExists) {
      setLots(draft => {
        const result = draft.map(x => {
          if (x.id === lotExists.id) {
            return { ...x, sum: (x.sum || 0) + donate.sum };
          }

          return x;
        });

        return result;
      });
    } else {
      setNewLots(draft => {
        draft.push({
          id: donate.id,
          name: donate.comment,
          sum: donate.sum,
          order: 0,
        });
        return [...draft];
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donate.id, donate.name, donate.sum, setLots, setNewLots]);

  return null;
});
