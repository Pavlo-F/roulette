import { useCallback } from "react";
import { useSetAtom } from "jotai";
import { contextuallyAtom, showWinWindowAtom } from "./atoms";
import { useContextuallyService } from "../../../Services/ContextuallyService";

export const useGetTip = () => {
  const { getTip } = useContextuallyService();
  const showWinWindow = useSetAtom(showWinWindowAtom);
  const setContextually = useSetAtom(contextuallyAtom);

  const getTipFn = useCallback(() => {
    getTip().then(data => {
      if (data.data.completed) {
        showWinWindow(data.data);
      }

      setContextually(draft => {
        const result = [...draft];
        result.push({ ...data.data, id: new Date().getTime().toString() });
        return result;
      });
    });
  }, [getTip, setContextually, showWinWindow]);

  return getTipFn;
};
