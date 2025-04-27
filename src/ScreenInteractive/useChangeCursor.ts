import { useCallback, useContext } from "react";
import { useAtomValue } from "jotai";
import { InteractiveSettingsAtomsCtx } from "./AtomsCtx";

export const useChangeCursor = () => {
  const { rootNode, interactiveSettingsAtom } = useContext(InteractiveSettingsAtomsCtx);
  const interactiveSettings = useAtomValue(interactiveSettingsAtom);

  const ChangeCursor = useCallback(
    () => {
      if (
        !rootNode ||
        !interactiveSettings?.cursor?.time ||
        !interactiveSettings?.cursor?.enabled
      )
        return;

      rootNode.style.cursor = `url(ic_claw.svg), auto`;

      setTimeout(
        () => {
          rootNode.style.cursor = "default";
        },
        (interactiveSettings?.cursor?.time || 1) * 1000
      );
    },
    [rootNode, interactiveSettings?.cursor?.enabled, interactiveSettings?.cursor?.time]
  );

  return {
    ChangeCursor,
  };
};
