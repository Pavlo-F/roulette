import React from "react";
import styled from "styled-components";

const BackgroundHummer = styled.div`
  position: absolute;
  animation: Hummer-rotating-function 600s linear infinite;
  width: 67vw;
  height: 100vh;
  right: 4rem;
  transform-origin: 0% 100%;
  transform: scaleX(-1);
  background-image: url("ic_hammer.svg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  opacity: 0.3;
  z-index: 0;

  @keyframes Hummer-rotating-function {
    0% {
      transform: rotate(-30deg);
    }

    50% {
      transform: rotate(20deg);
    }

    100% {
      transform: rotate(-30deg);
    }
  }
`;

const BackgroundStar = styled.div`
  position: absolute;
  animation: Star-rotating-function 500s linear infinite;
  width: 100vh;
  height: 95vh;
  background-image: url("star.svg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  opacity: 0.3;
  right: 0;
  top: 1rem;
  z-index: 0;

  @keyframes Star-rotating-function {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

let prevIndex = -1;

export const BackAnimations = () => {
  let result = prevIndex + 1;
  if (result > 1) {
    result = 0;
  }

  prevIndex = result;

  return (
    <>
      {result === 0 && <BackgroundStar />}
      {result === 1 && <BackgroundHummer />}
    </>
  );
};
