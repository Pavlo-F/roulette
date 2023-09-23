import React, { memo, useCallback, useEffect } from "react";
import Konva from "konva";
import styled from "styled-components";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
`;

Konva.angleDeg = false;
let angularVelocity = 22;
let angularVelocities: number[] = [];
let lastRotation = 0;
let controlled = false;
const numWedges = 10;
const angularFriction = 0.2;
let target: any;
let activeWedge: any;
let stage: Konva.Stage;
let layer: any;
let wheel: any;
let pointer: any;
let finished = false;

type Props = {
  radius: number;
};

export const Form = memo(({ radius }: Props) => {
  const getAverageAngularVelocity = useCallback(() => {
    let total = 0;
    const len = angularVelocities.length;

    if (len === 0) {
      return 0;
    }

    for (let n = 0; n < len; n += 1) {
      total += angularVelocities[n];
    }

    return total / len;
  }, []);

  const purifyColor = useCallback((color: number[]) => {
    const randIndex = Math.round(Math.random() * 3);
    const result = [...color];
    result[randIndex] = 0;

    return result;
  }, []);

  const getRandomColor = useCallback(() => {
    const r = 100 + Math.round(Math.random() * 55);
    const g = 100 + Math.round(Math.random() * 55);
    const b = 100 + Math.round(Math.random() * 55);

    return purifyColor([r, g, b]);
  }, [purifyColor]);

  const getRandomReward = useCallback((n: number) => {
    return `${n}00 000 000 000 000 000 000 000`;
  }, []);

  const addWedge = useCallback(
    (n: number) => {
      const s = getRandomColor();
      const reward = getRandomReward(n);
      let r = s[0];
      let g = s[1];
      let b = s[2];
      const angle = (2 * Math.PI) / numWedges;

      const endColor = `rgb(${r},${g},${b})`;
      r += 10;
      g += 10;
      b += 10;

      const startColor = `rgb(${r},${g},${b})`;

      const wedge = new Konva.Group({
        rotation: (2 * n * Math.PI) / numWedges,
      });

      const wedgeBackground = new Konva.Wedge({
        radius: radius - 40,
        angle,
        fillRadialGradientStartPoint: { x: 0, y: 0 },
        fillRadialGradientStartRadius: 0,
        fillRadialGradientEndPoint: { x: 0, y: 0 },
        fillRadialGradientEndRadius: radius - 40,
        fillRadialGradientColorStops: [0, startColor, 1, endColor],
        fill: "#808080",
        fillPriority: "radial-gradient",
        stroke: "#ccc",
        strokeWidth: 1,
      });

      wedge.add(wedgeBackground);

      const text = new Konva.Text({
        text: reward,
        fontFamily: "Calibri",
        fontSize: 15,
        fill: "white",
        align: "center",
        stroke: "#fff",
        strokeWidth: 1,
        ellipsis: true,
        wrap: "none",
        rotation: angle / 2,
        offsetX: -radius / 4,
        offsetY: 5,
        listening: false,
        width: radius * 0.5,
      });

      wedge.add(text);
      text.cache();

      // @ts-ignore
      wedge.startRotation = wedge.rotation();

      wheel.add(wedge);
    },
    [getRandomColor, getRandomReward, radius]
  );

  const animate = useCallback((frame: any) => {
    // handle wheel spin
    const angularVelocityChange = (angularVelocity * frame.timeDiff * (1 - angularFriction)) / 1000;
    angularVelocity -= angularVelocityChange;

    // activate / deactivate wedges based on point intersection
    const shape = stage.getIntersection({
      x: stage.width() / 2,
      y: 100,
    });

    if (controlled) {
      if (angularVelocities.length > 10) {
        angularVelocities.shift();
      }

      angularVelocities.push(((wheel.rotation() - lastRotation) * 1000) / frame.timeDiff);
    } else {
      const diff = (frame.timeDiff * angularVelocity) / 1000;
      if (diff > 0.0001) {
        wheel.rotate(diff);
      } else if (!finished && !controlled) {
        if (shape) {
          const tmp = shape.getParent()?.findOne("Text");
          // @ts-ignore
          const text = tmp?.text();
          const price = text.split("\n").join("");
          console.log(`Your price is ${price}`);
        }
        finished = true;
      }
    }
    lastRotation = wheel.rotation();

    if (shape) {
      // eslint-disable-next-line no-underscore-dangle
      if (shape && (!activeWedge || shape._id !== activeWedge._id)) {
        pointer.y(45);

        new Konva.Tween({
          node: pointer,
          duration: 0.3,
          y: 50,
          easing: Konva.Easings.ElasticEaseOut,
        }).play();

        if (activeWedge) {
          activeWedge.fillPriority("radial-gradient");
        }
        shape.fillPriority("fill");
        activeWedge = shape;
      }
    }
  }, []);

  const init = useCallback(() => {
    stage = new Konva.Stage({
      container: "container",
      width: radius * 2,
      height: radius * 2,
    });
    layer = new Konva.Layer();
    wheel = new Konva.Group({
      x: radius,
      y: radius,
    });

    for (let n = 0; n < numWedges; n += 1) {
      addWedge(n);
    }
    pointer = new Konva.Wedge({
      fillRadialGradientStartPoint: { x: 0, y: 0 },
      fillRadialGradientStartRadius: 0,
      fillRadialGradientEndPoint: { x: 0, y: 0 },
      fillRadialGradientEndRadius: 0,
      fillRadialGradientColorStops: [0, "white", 1, "red"],
      stroke: "white",
      strokeWidth: 1,
      lineJoin: "round",
      angle: 1,
      radius: 30,
      x: stage.width() / 2,
      y: 45,
      rotation: -90,
      shadowColor: "black",
      shadowOffsetX: 3,
      shadowOffsetY: 3,
      shadowBlur: 2,
      shadowOpacity: 0.5,
    });

    // add components to the stage
    layer.add(wheel);
    layer.add(pointer);
    stage.add(layer);

    // bind events
    wheel.on("mousedown touchstart", (evt: any) => {
      angularVelocity = 0;
      controlled = true;
      target = evt.target;
      finished = false;
    });
    // add listeners to container
    stage.addEventListener("mouseup touchend", () => {
      controlled = false;
      angularVelocity = getAverageAngularVelocity() * 5;

      if (angularVelocity > 20) {
        angularVelocity = 20;
      } else if (angularVelocity < -20) {
        angularVelocity = -20;
      }

      angularVelocities = [];
    });

    stage.addEventListener("mousemove touchmove", (evt: any) => {
      const mousePos = stage.getPointerPosition();
      if (controlled && mousePos && target) {
        const x = mousePos.x - wheel.getX();
        const y = mousePos.y - wheel.getY();
        const atan = Math.atan(y / x);
        const rotation = x >= 0 ? atan : atan + Math.PI;
        const targetGroup = target.getParent();

        wheel.rotation(rotation - targetGroup.startRotation - target.angle() / 2);
      }
    });

    const anim = new Konva.Animation(animate, layer);

    // // wait one second and then spin the wheel
    setTimeout(() => {
      anim.start();
    }, 1000);
  }, [addWedge, animate, getAverageAngularVelocity, radius]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Root>
      <div id="container" />
    </Root>
  );
});
