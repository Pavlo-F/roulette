import React, { FC, memo, useCallback, useMemo, useState } from "react";
import Context, { IValidateResults } from "./Context";

type Props = {
  children?: React.ReactNode;
};

const ContextProvider = memo(({ children }: Props) => {
  const [validateResults, setValidateResults] = useState<IValidateResults>({});

  const isInvalid = useCallback(() => Object.keys(validateResults).some(_ => validateResults[_]), [validateResults]);

  const ctx = useMemo(
    () => ({
      validateResults,
      setValidateResults,
      isInvalid,
    }),
    [isInvalid, validateResults]
  );

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
});

export default ContextProvider;

export function withProvider(Component: FC): FC {
  return ({ ...props }) => (
    <ContextProvider>
      <Component
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </ContextProvider>
  );
}
