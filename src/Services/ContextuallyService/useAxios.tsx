import React, { useMemo } from "react";
import axios from "axios";

export const useAxios = () => {
  const instance = useMemo(() => {
    const result = axios.create({
      baseURL: "https://апи.контекстно.рф",
    });

    return result;
  }, []);

  return {
    instance,
  };
};
