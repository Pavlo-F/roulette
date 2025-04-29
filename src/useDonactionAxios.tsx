import React, { useMemo } from "react";
import axios from "axios";

export const useDonactionAxios = () => {
  const instance = useMemo(() => {
    const result = axios.create({
      baseURL: import.meta.env.DEV ? "https://donaction.club" : "https://donaction.club",
    });

    return result;
  }, []);

  return {
    instance,
  };
};
