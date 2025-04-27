import { useCallback, useContext } from "react";
import { useAtomValue } from "jotai";
import { InteractiveSettingsAtomsCtx } from "./AtomsCtx";

const stringToColor = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  return `hsl(${hash % 360}, 50%, 20%)`;
};

export const useChangeBackground = (userName: string) => {
  const { rootNode, interactiveSettingsAtom } = useContext(InteractiveSettingsAtomsCtx);
  const interactiveSettings = useAtomValue(interactiveSettingsAtom);

  const ChangeBackground = useCallback(() => {
    if (
      !rootNode ||
      !interactiveSettings?.backgroundRoot?.time ||
      !interactiveSettings?.backgroundRoot.enabled
    ) {
      return;
    }

    rootNode.style.background = stringToColor(userName);
    rootNode.style.transition = `all 1s`;

    setTimeout(
      () => {
        rootNode.style.backgroundColor = "var(--primaryColor800)";
      },
      (interactiveSettings?.backgroundRoot?.time || 1) * 1000
    );
  }, [rootNode, interactiveSettings?.backgroundRoot, userName]);

  return {
    ChangeBackground,
  };
};
