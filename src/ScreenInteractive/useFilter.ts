import { useCallback, useContext } from "react";
import { useAtomValue } from "jotai";
import { InteractiveSettingsAtomsCtx } from "./AtomsCtx";

export const useColorFilter = () => {
  const { rootNode, interactiveSettingsAtom } = useContext(InteractiveSettingsAtomsCtx);
  const interactiveSettings = useAtomValue(interactiveSettingsAtom);

  const ColorFilter = useCallback(
    (filter: string) => {
      if (
        !rootNode ||
        !interactiveSettings?.badEyes?.time ||
        !interactiveSettings?.badEyes?.enabled
      )
        return;

      rootNode.style.filter = filter;
      rootNode.style.transition = "all 1s";

      setTimeout(
        () => {
          rootNode.style.filter = "unset";
        },
        (interactiveSettings?.badEyes?.time || 1) * 1000
      );
    },
    [rootNode, interactiveSettings?.badEyes?.enabled, interactiveSettings?.badEyes?.time]
  );

  return {
    ColorFilter,
  };
};
