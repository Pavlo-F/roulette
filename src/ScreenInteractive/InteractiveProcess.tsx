import React, { memo, useContext, useEffect, useMemo } from "react";
import levenshtein from "fast-levenshtein";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Commands } from "./AtomsCtx";
import { useChangeBackground } from "./useChangeBackground";
import { useChangeCursor } from "./useChangeCursor";
import { useColorFilter } from "./useFilter";
import { useRotateColors } from "./useRotateColors";
import { useRotateRoot } from "./useRotateRoot";
import { useScale } from "./useScale";
import { DonateAtomsCtx } from "../Services/DonateService";

let executedId = "";

export const InteractiveProcess = memo(() => {
  const { donateAtom } = useContext(DonateAtomsCtx);
  const donate = useAtomValue(donateAtom);

  const { ExecuteRotate } = useRotateRoot();
  const { ChangeBackground } = useChangeBackground(donate.name);
  const { ColorFilter } = useColorFilter();
  const { ChangeCursor } = useChangeCursor();
  const { ExecuteScale } = useScale();
  const { ExecuteRotateColors } = useRotateColors();

  const commandMap = useMemo(() => {
    const result: Record<Commands, () => void> = {
      "Повернуть экран": ExecuteRotate,
      "Сменить фон": ChangeBackground,
      "Близорукость": () => ColorFilter("blur(3px)"),
      "Инверсия цветов": () => ColorFilter("invert()"),
      "Поменять курсор": ChangeCursor,
      "Поменять масштаб": ExecuteScale,
      "Дискотека": ExecuteRotateColors,
    };

    return result;
  }, [
    ExecuteRotate,
    ChangeBackground,
    ColorFilter,
    ChangeCursor,
    ExecuteScale,
    ExecuteRotateColors,
  ]);

  useEffect(() => {
    if (!donate.sum || !donate.comment || executedId === donate.id) {
      return;
    }

    executedId = donate.id;

    const comment = donate.comment?.trim().toLowerCase() || "";

    Object.keys(commandMap).forEach((key: string) => {
      if (comment.includes(key.toLocaleLowerCase())) {
        commandMap[key as Commands]();
      }
    });
  }, [commandMap, donate]);

  return null;
});

// const lotExists = useMemo(() => {

//   return lots.find(x => {

//     const distance = levenshtein.get(a, b);
//     const percent = 1 - distance / a.length;

//     return percent >= 0.8;
//   });
// }, [donate, lots]);
