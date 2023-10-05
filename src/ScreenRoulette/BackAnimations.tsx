import React from "react";
import styled from "styled-components";

const BackgroundGollum = styled.div`
  position: absolute;
  width: 23.1rem;
  height: 30rem;
  right: 0rem;
  background-image: url("gollum.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  bottom: 1rem;
  z-index: 0;

  animation: Gollum-rotating-function 100s linear infinite;
  @keyframes Gollum-rotating-function {
    0% {
      transform: scaleX(1);
    }

    50% {
      transform: scaleX(0.6);
    }

    100% {
      transform: scaleX(1);
      }
  }
`;

const BackgroundDragon = styled.div`
  position: absolute;
  width: 30rem;
  height: 19rem;
  right: -3rem;
  background-image: url("dragon.svg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  bottom: 1rem;
  z-index: 0;

  animation: Dragon-move-function 700s linear infinite;
  @keyframes Dragon-move-function {
    0% {
      bottom: -30%;
      right: 2rem;
    }

    25% {
      bottom: 30%;
      right: -6rem;
    }

    50% {
      bottom: 80%;
      right: 3rem;
    }

    75% {
      bottom: 30%;
      right: -6rem;
    }

    100% {
      bottom: -30%;
      right: 2rem;
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
      {result === 0 && <BackgroundGollum />}
      {result === 1 && <BackgroundDragon />}
    </>
  );
};
