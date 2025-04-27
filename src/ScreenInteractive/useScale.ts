import { useCallback, useContext } from "react";
import { useAtomValue } from "jotai";
import { InteractiveSettingsAtomsCtx } from "./AtomsCtx";

export const useScale = () => {
  const { rootNode, interactiveSettingsAtom } = useContext(InteractiveSettingsAtomsCtx);
  const interactiveSettings = useAtomValue(interactiveSettingsAtom);

  const ExecuteScale = useCallback(() => {
    if (!rootNode || !interactiveSettings?.scale?.time || !interactiveSettings?.scale?.enabled)
      return;

    const value = interactiveSettings.scale?.value ? interactiveSettings.scale.value / 100 : 100;

    rootNode.style.scale = value.toString();
    rootNode.style.transition = `all 1s`;

    setTimeout(
      () => {
        rootNode.style.scale = `unset`;
      },
      (interactiveSettings.scale.time || 1) * 1000
    );
  }, [
    rootNode,
    interactiveSettings.scale,
  ]);

  return {
    ExecuteScale,
  };
};
