import React, { FC, createContext, memo, useEffect, useMemo, useState } from "react";
import { produce } from "immer";
import { PrimitiveAtom, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export enum Commands {
  RotateRoot = "Повернуть экран",
  ChangeBackground = "Сменить фон",
  BadEyes = "Близорукость",
  InvertColor = "Инверсия цветов",
  ChangeCursor = "Поменять курсор",
  Scale = "Поменять масштаб",
  RotateColors = "Дискотека"
}

export type SettingsFields =
  | "rotateRoot"
  | "backgroundRoot"
  | "badEyes"
  | "invertColor"
  | "cursor"
  | "scale"
  | "rotateColors";

export type InteractiveSettings = {
  rotateRoot: {
    degrees?: number;
    time?: number;
    enabled: boolean;
  };
  backgroundRoot: {
    time?: number;
    enabled: boolean;
  };
  badEyes: {
    time?: number;
    enabled: boolean;
  };
  invertColor: {
    time?: number;
    enabled: boolean;
  };
  cursor: {
    time?: number;
    enabled: boolean;
  };
  scale: {
    value?: number;
    time?: number;
    enabled: boolean;
  };
  rotateColors: {
    time?: number;
    enabled: boolean;
  }
};

type IAtoms = {
  interactiveSettingsAtom: PrimitiveAtom<InteractiveSettings>;
};

type IContext = IAtoms & { rootNode?: HTMLElement };

type Props = {
  rootNode?: HTMLElement;
  children: React.ReactNode;
};

const defaultSettings = {
  rotateRoot: {
    degrees: 180,
    time: 60,
    enabled: true,
  },
  backgroundRoot: {
    time: 60,
    enabled: true,
  },
  badEyes: {
    time: 60,
    enabled: true,
  },
  invertColor: {
    time: 60,
    enabled: true,
  },
  cursor: {
    time: 60,
    enabled: true,
  },
  scale: {
    value: 20,
    time: 60,
    enabled: true,
  },
  rotateColors: {
    time: 60,
    enabled: true,
  },
};

const create = () => {
  const r: IAtoms = {
    interactiveSettingsAtom: atomWithStorage<InteractiveSettings>(
      "interactive_settings",
      defaultSettings
    ),
  };

  return r;
};

const Context = createContext<IContext>(create());

const Provider = memo(({ children, rootNode }: Props) => {
  const [atoms] = useState(() => create());
  const setSettings = useSetAtom(atoms.interactiveSettingsAtom);

  useEffect(() => {
    setSettings(
      produce(draft => {
        if (!draft.scale) {
          draft.scale = defaultSettings.scale;
        }
        if (!draft.rotateColors) {
          draft.rotateColors = defaultSettings.rotateColors;
        }
      })
    );
  }, [setSettings]);

  const ctx = useMemo(() => {
    const r: IContext = {
      ...atoms,
      rootNode,
    };
    return r;
  }, [atoms, rootNode]);

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
});

export { Context as InteractiveSettingsAtomsCtx, Provider as InteractiveSettingsAtomsProvider };

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
