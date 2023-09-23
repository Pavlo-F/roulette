import React, { memo, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Roulette } from "./Roulette";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
`;

export const Screen = memo(() => {
  const cnt = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(0);

  useEffect(() => {
    if (cnt && cnt.current) {
      const result = Math.min(cnt.current.offsetWidth, cnt.current.offsetHeight); 
      setRadius(result);
    }
  }, []);

  return (
    <Root ref={cnt}>{radius && <Roulette radius={(radius) / 2 } />}</Root>
  );
});
