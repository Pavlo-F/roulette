import { useCallback, useContext } from "react";
import { useAtomValue } from "jotai";
import { InteractiveSettingsAtomsCtx } from "./AtomsCtx";

export const useRotateColors = () => {
  const { rootNode, interactiveSettingsAtom } = useContext(InteractiveSettingsAtomsCtx);
  const interactiveSettings = useAtomValue(interactiveSettingsAtom);

  const ExecuteRotateColors = useCallback(() => {
    if (
      !rootNode ||
      !interactiveSettings?.rotateColors?.time ||
      !interactiveSettings?.rotateColors?.enabled
    )
      return;

    rootNode.style.transition = `all ${interactiveSettings.rotateColors.time}s`;
    rootNode.style.filter = `hue-rotate(1800deg)`;

    setTimeout(
      () => {
        rootNode.style.transition = `unset`;
        rootNode.style.filter = `unset`;
      },
      (interactiveSettings.rotateColors.time || 1) * 1000
    );
  }, [rootNode, interactiveSettings.rotateColors]);

  return {
    ExecuteRotateColors,
  };
};
