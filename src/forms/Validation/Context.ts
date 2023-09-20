import React, { createContext } from "react";

export type IValidateResults = { [key: string]: boolean };

export interface IContext {
  validateResults: IValidateResults;
  setValidateResults: React.Dispatch<React.SetStateAction<IValidateResults>>;

  isInvalid: () => boolean;
}

const initial: IContext = {
  validateResults: {},
  setValidateResults: () => undefined,

  isInvalid: () => false,
};

const Context = createContext<IContext>(initial);

export default Context;
