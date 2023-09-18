import React, { FC, createContext, memo, useMemo, useState } from "react";
import { PrimitiveAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type Settings = {
  timer: {
    defaultMinutes: number;
    addSeconds: number;
    timeForNewPosition: number;
  };
};

type IAtoms = {
  settingsAtom: PrimitiveAtom<Settings>;
};

type IContext = IAtoms;

type Props = {
  children: React.ReactNode;
};

const create = () => {
  const r: IAtoms = {
    settingsAtom: atomWithStorage<Settings>("settings", {
      timer: {
        defaultMinutes: 10,
        addSeconds: 60,
        timeForNewPosition: 60,
      },
    }),
  };

  return r;
};

const Context = createContext<IContext>(create());

const Provider = memo(({ children }: Props) => {
  const [atoms] = useState(() => create());

  const ctx = useMemo(() => {
    const r: IContext = {
      ...atoms,
    };
    return r;
  }, [atoms]);

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
});

export { Context as SettingsAtomsCtx, Provider as SettingsAtomsProvider };

export function withProvider(Component: FC): FC {
  return ({ ...props }) => (
    <Provider>
      <Component
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </Provider>
  );
}
