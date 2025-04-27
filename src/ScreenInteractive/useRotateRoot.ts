import { useCallback, useContext } from "react";
import { useAtomValue } from "jotai";
import { InteractiveSettingsAtomsCtx } from "./AtomsCtx";

export const useRotateRoot = () => {
  const { rootNode, interactiveSettingsAtom } = useContext(InteractiveSettingsAtomsCtx);
  const interactiveSettings = useAtomValue(interactiveSettingsAtom);

  const ExecuteRotate = useCallback(() => {
    if (
      !rootNode ||
      !interactiveSettings?.rotateRoot?.time ||
      !interactiveSettings?.rotateRoot?.enabled
    ) {
      return;
    }

    rootNode.style.rotate = `${interactiveSettings.rotateRoot.degrees}deg`;
    rootNode.style.transition = `all 1s`;

    setTimeout(
      () => {
        rootNode.style.rotate = `unset`;
      },
      (interactiveSettings.rotateRoot.time || 1) * 1000
    );
  }, [rootNode, interactiveSettings?.rotateRoot]);

  return {
    ExecuteRotate,
  };
};
