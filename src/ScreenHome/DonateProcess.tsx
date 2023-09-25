import React, { memo, useContext, useEffect, useMemo } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { HomeAtomsCtx } from "./AtomsCtx";
import { DonateAtomsCtx } from "../Services/DonateService";

export const DonateProcess = memo(() => {
  const { donateAtom } = useContext(DonateAtomsCtx);
  const { lotsAtom, newLotsAtom, participantsAtom } = useContext(HomeAtomsCtx);

  const [lots, setLots] = useAtom(lotsAtom);
  const setNewLots = useSetAtom(newLotsAtom);
  const donate = useAtomValue(donateAtom);
  const setParticipants = useSetAtom(participantsAtom);

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
        draft.push(donate);
        return [...draft];
      });
    }

    setParticipants(old => {
      if (old.includes(donate.name)) {
        return old;
      }

      const result = [...old];
      result.push(donate.name);
      
      return result;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donate.id, donate.name, donate.sum, setLots, setNewLots]);

  return null;
});
