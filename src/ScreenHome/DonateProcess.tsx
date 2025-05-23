import React, { memo, useContext, useEffect, useMemo } from "react";
import levenshtein from "fast-levenshtein";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { HomeAtomsCtx } from "./AtomsCtx";
import { TimerAtomsCtx } from "./Timer/AtomsCtx";
import { SettingsAtomsCtx } from "../ScreenSettings/AtomsCtx";
import { DonateAtomsCtx } from "../Services/DonateService";

export const DonateProcess = memo(() => {
  const { donateAtom } = useContext(DonateAtomsCtx);
  const { lotsAtom, newLotsAtom, animateRowAtom } = useContext(HomeAtomsCtx);
  const { addTime } = useContext(TimerAtomsCtx);
  const { settingsAtom } = useContext(SettingsAtomsCtx);

  const [lots, setLots] = useAtom(lotsAtom);
  const setNewLots = useSetAtom(newLotsAtom);
  const donate = useAtomValue(donateAtom);
  const settings = useAtomValue(settingsAtom);
  const setAnimateRow = useSetAtom(animateRowAtom);

  const lotExists = useMemo(() => {
    const b = donate.comment?.trim().toLowerCase() || "";

    return lots.find(x => {
      const a = x.name?.trim().toLowerCase() || "";
      const distance = levenshtein.get(a, b);
      const percent = 1 - distance / a.length;

      return percent >= 0.8;
    });
  }, [donate, lots]);

  useEffect(() => {
    if (!donate.sum || !donate.comment) {
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

      setAnimateRow({ lotId: lotExists.id, sum: donate.sum });
    } else {
      setNewLots(draft => {
        const found = draft.find(x => {
          const a = x.comment?.trim().toLowerCase() || "";
          const distance = levenshtein.get(a, donate.comment);
          const percent = 1 - distance / a.length;
    
          return percent >= 0.8;
        });

        if (found) {
          found.sum += donate.sum;
        } else {
          draft.push(donate);
        }

        return [...draft];
      });
    }

    if (settings.timer.timeByDonate) {
      addTime(settings.timer.timeByDonate * 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donate, setLots, setNewLots, addTime, settings.timer.timeByDonate]);

  return null;
});
