import { useMemo } from "react";
import dayjs from "dayjs";

export const useIsChristmas = () => {
  const result = useMemo(() => {
    const current = dayjs();
    return (
      (current.month() === 11 && current.date() >= 15) ||
      (current.month() === 0 && current.date() <= 14)
    );
  }, []);

  return result;
};
