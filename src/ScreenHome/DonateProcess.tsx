import React, { memo, useContext, useEffect, useMemo } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import levenshtein from "fast-levenshtein";
import { HomeAtomsCtx } from "./AtomsCtx";
import { DonateAtomsCtx } from "../Services/DonateService";
import { TimerAtomsCtx } from "./Timer/AtomsCtx";
import { SettingsAtomsCtx } from "../ScreenSettings/AtomsCtx";

export const DonateProcess = memo(() => {
  const { donateAtom } = useContext(DonateAtomsCtx);
  const { lotsAtom, newLotsAtom, participantsAtom } = useContext(HomeAtomsCtx);
  const { addTime } = useContext(TimerAtomsCtx);
  const { settingsAtom } = useContext(SettingsAtomsCtx);

  const [lots, setLots] = useAtom(lotsAtom);
  const setNewLots = useSetAtom(newLotsAtom);
  const donate = useAtomValue(donateAtom);
  const setParticipants = useSetAtom(participantsAtom);
  const settings = useAtomValue(settingsAtom);

  const lotExists = useMemo(() => {
    const b = donate.comment?.trim().toLowerCase() || "";

    return lots.find(
      x => {
        const a = x.name?.trim().toLowerCase() || "";
        const distance = levenshtein.get(a, b);
        const percent = 1 - (distance / a.length);

        return percent > 0.6;
      }
    );
  }, [donate, lots]);

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

    if (settings.timer.timeByDonate) {
      addTime(settings.timer.timeByDonate * 1000);
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
