import React, { memo, useCallback, useEffect, useMemo } from "react";
import Konva from "konva";
import styled from "styled-components";
import { WheelData } from "./models";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
`;

Konva.angleDeg = false;
let angularVelocity = 22;
let startAngularVelocity = 0;
let angularVelocities: number[] = [];
let lastRotation = 0;
let controlled = true;
const angularFriction = 0.5;
let target: any;
let activeWedge: any;
let stage: Konva.Stage;
let layer: any;
let wheel: any;
let pointer: any;
let finished = false;

let totalAngle = 0;
let totalRotation = 0;
let inProgress = false;

let rotationOrders: number[] = [];
let prevRotationRad = 0;
let rotationOrder = 1;

type Props = {
  radius: number;
  data: WheelData[];
};

type DataWithPercent = WheelData & { percent: number };

export const Form = memo(({ radius, data }: Props) => {
  const numWedges = useMemo(() => {
    return data.length;
  }, [data.length]);

  const dataWithPercent = useMemo(() => {
    const result: DataWithPercent[] = [];
    const total = data.reduce((a, b) => a + b.value, 0);

    data.forEach(x => {
      const item: DataWithPercent = {
        id: x.id,
        name: x.name,
        value: x.value,
        percent: x.value / total,
      };

      result.push(item);
    });

    return result;
  }, [data]);

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

  const addWedge = useCallback(
    (item: DataWithPercent) => {
      const s = getRandomColor();
      const reward = item.name;
      let r = s[0];
      let g = s[1];
      let b = s[2];
      const angle = 2 * Math.PI * item.percent;

      const endColor = `rgb(${r},${g},${b})`;
      r += 10;
      g += 10;
      b += 10;

      const startColor = `rgb(${r},${g},${b})`;

      const wedge = new Konva.Group({
        rotation: totalAngle,
      });

      totalAngle += angle;

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
        stroke: "#fff",
        strokeWidth: 1,
        ellipsis: true,
        wrap: "none",
        rotation: angle / 2,
        offsetX: -radius / 4,
        offsetY: 5,
        listening: false,
        width: radius * 0.55,

        // custom
        original: item,
      });

      wedge.add(text);
      text.cache();

      // @ts-ignore
      wedge.startRotation = wedge.rotation();

      wheel.add(wedge);
    },
    [getRandomColor, radius]
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
        wheel.rotate(diff * rotationOrder);
        totalRotation += diff;
      } else if (!finished && !controlled) {
        if (shape) {
          if (totalRotation < 5) {
            if (Math.abs(startAngularVelocity) < 2 && startAngularVelocity !== 0) {
              console.log("слишком слабо");
            }
          } else {
            const selected = shape.getParent()?.findOne("Text");
            console.log(`Your price is:`, selected?.attrs.original);
          }
        }
        finished = true;
        inProgress = false;
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
      addWedge(dataWithPercent[n]);
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
      if (inProgress) {
        return;
      }

      rotationOrders = [];
      totalRotation = 0;
      startAngularVelocity = 0;
      angularVelocity = 0;
      controlled = true;
      target = evt.target;
      finished = false;
    });
    // add listeners to container
    stage.addEventListener("mouseup touchend", () => {
      if (inProgress) {
        return;
      }

      const order = rotationOrders.reduce((a, b) => a + b, 0);
      rotationOrder = order > 0 ? 1 : -1;

      controlled = false;
      angularVelocity = Math.abs(getAverageAngularVelocity() * 5);

      if (angularVelocity > 50) {
        angularVelocity = 50;
      }

      startAngularVelocity = angularVelocity;

      angularVelocities = [];

      inProgress = true;
    });

    stage.addEventListener("mousemove touchmove", (evt: any) => {
      const mousePos = stage.getPointerPosition();
      if (controlled && mousePos && target) {
        const x = mousePos.x - wheel.getX();
        const y = mousePos.y - wheel.getY();
        const atan = Math.atan(y / x);
        const rotation = x >= 0 ? atan : atan + Math.PI;
        const targetGroup = target.getParent();

        const rotationRad = rotation - targetGroup.startRotation - target.angle() / 2;

        if (prevRotationRad > rotationRad) {
          rotationOrders.push(-1);
        } else {
          rotationOrders.push(1);
        }

        prevRotationRad = rotationRad;

        wheel.rotation(rotationRad);
      }
    });

    const anim = new Konva.Animation(animate, layer);

    // // wait one second and then spin the wheel
    setTimeout(() => {
      anim.start();
    }, 1000);
  }, [addWedge, animate, dataWithPercent, getAverageAngularVelocity, numWedges, radius]);

  useEffect(() => {
    totalAngle = 0;
    init();
  }, [init]);

  return (
    <Root>
      <div id="container" />
    </Root>
  );
});
