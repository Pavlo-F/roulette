import React, { memo, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { useAtom } from "jotai";
import Konva from "konva";
import { WheelData } from "./models";
import { Mode, RouletteAtomsCtx } from "../AtomsCtx";

Konva.angleDeg = false;
let angularVelocity = 2;
let startAngularVelocity = 0;
let angularVelocities: number[] = [];
let lastRotation = 0;
let controlled = true;
const angularFriction = 0.4;
let target: any;
let activeWedge: any;
let stage: Konva.Stage;
let layer: any;
let wheel: Konva.Group;
let pointer: any;
let finished = false;
let anim: Konva.Animation;

let totalAngle = 0;
let totalRotation = 0;
let inProgress = false;

let rotationOrders: number[] = [];
let prevRotationRad = 0;
let rotationOrder = 1;

type Props = {
  radius: number;
  mode: Mode;
  onSlow: () => void;
  onSelected: (value: WheelData) => void;
  onWin: (value: WheelData) => void;
};

type DataWithPercent = WheelData & { percent: number };

export const Roulette = memo(({ radius, mode, onSlow, onSelected, onWin }: Props) => {
  const { wheelDataAtom } = useContext(RouletteAtomsCtx);
  const [rouletteData, setRouletteData] = useAtom(wheelDataAtom);
  const colorMap = useRef<Record<string, Array<number>>>({});

  const dataWithPercent = useMemo(() => {
    const total = rouletteData.reduce((a, b) => a + b.value, 0);

    let result: DataWithPercent[] = [];
    rouletteData.forEach(x => {
      if (x.value) {
        const item: DataWithPercent = {
          id: x.id,
          name: x.name,
          value: x.value,
          percent: x.value / total,
        };
        result.push(item);
      }
    });

    if (mode === Mode.Elimination) {
      const totalInvert = 1 / result.reduce((a, b) => a + 1 / b.percent, 0);

      const result2 = result.map(x => {
        const item: DataWithPercent = {
          id: x.id,
          name: x.name,
          value: x.value,
          percent: totalInvert / x.percent,
        };

        return item;
      });

      result = result2;
    }

    return result;
  }, [mode, rouletteData]);

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

  const getColor = useCallback(
    (id: string) => {
      const color = colorMap.current[id];
      if (color) {
        return color;
      }

      const r = 50 + Math.round(Math.random() * 55);
      const g = 50 + Math.round(Math.random() * 55);
      const b = 50 + Math.round(Math.random() * 55);

      const result = purifyColor([r, g, b]);
      colorMap.current[id] = result;

      return result;
    },
    [purifyColor]
  );

  const process = useCallback(
    (selected: Konva.Node | undefined) => {
      if (mode === Mode.Classic) {
        onWin(selected?.attrs.original);
      }

      if (mode === Mode.Elimination) {
        const result = rouletteData.filter(x => x.id !== selected?.attrs.original.id);
        if (result.length === 1) {
          onWin(result[0]);
        } else {
          onSelected(selected?.attrs.original);
        }

        setRouletteData(result);
      }
    },
    [mode, onSelected, onWin, rouletteData, setRouletteData]
  );

  const addWedge = useCallback(
    (item: DataWithPercent) => {
      const s = getColor(item.id);
      const reward = item.name;
      let r = s[0];
      let g = s[1];
      let b = s[2];
      const angle = 2 * Math.PI * item.percent;

      const endColor = `rgb(${r},${g},${b})`;
      r += 80;
      g += 80;
      b += 80;

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
        fill: "#5f6d75",
        fillPriority: "radial-gradient",
        stroke: "#5f6d75",
        strokeWidth: 1,
      });

      wedge.add(wedgeBackground);

      const text = new Konva.Text({
        text: reward,
        fontFamily: "Calibri",
        fontSize: 24,
        fill: "white",
        stroke: "#fff",
        strokeWidth: 1,
        ellipsis: true,
        wrap: "none",
        rotation: angle / 2,
        offsetX: -radius / 4,
        offsetY: 11,
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
    [getColor, radius]
  );

  const animate = useCallback(
    (frame: any) => {
      // handle wheel spin
      const angularVelocityChange =
        (angularVelocity * frame.timeDiff * (1 - angularFriction)) / 1000;
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
        if (diff > 0.00005) {
          wheel.rotate(diff * rotationOrder);
          totalRotation += diff;
        } else if (!finished && !controlled) {
          if (shape) {
            if (totalRotation < 10) {
              onSlow?.();
            } else {

              const parent = shape.getParent();
              if (parent) {
                const selected = parent?.findOne("Text");

                if (mode === Mode.Elimination) {
                  const tmp = new Konva.Tween({
                    node: parent,
                    duration: 1,
                    opacity: 0,
                    easing: Konva.Easings.EaseOut,
                  });
    
                  tmp.onFinish = () => {
                    process(selected as Konva.Node);
                  };

                  tmp.play();
                } else {
                  process(selected as Konva.Node);
                }
              }
            }
          }
          finished = true;
        } else if (finished) {
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
    },
    [mode, onSlow, process]
  );

  const initStage = useCallback(() => {
    stage = new Konva.Stage({
      container: "rouletteContainer",
      width: radius * 2,
      height: radius * 2,
    });
    layer = new Konva.Layer();
    wheel = new Konva.Group({
      x: radius,
      y: radius,
    });

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

    const shadowCircle = new Konva.Circle({
      x: radius,
      y: radius,
      radius: radius - 40,
      stroke: "#232f34",
      shadowColor: "#fff",
      shadowBlur: 35,
    });

    // add components to the stage
    layer.add(shadowCircle);
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
      angularVelocity = Math.abs(getAverageAngularVelocity() * 1.5);

      if (angularVelocity > 50) {
        angularVelocity = 50;
      }

      startAngularVelocity = angularVelocity;

      angularVelocities = [];

      inProgress = true;
    });

    stage.addEventListener("mousemove touchmove", () => {
      const mousePos = stage.getPointerPosition();
      if (controlled && mousePos && target) {
        // @ts-ignore
        const x = mousePos.x - wheel.getX();
        // @ts-ignore
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

    anim = new Konva.Animation(animate, layer);
    anim.start();
  }, [animate, getAverageAngularVelocity, radius]);

  const refreshData = useCallback(() => {
    totalAngle = 0;

    wheel.getChildren().forEach(x => {
      x.remove();
    });

    dataWithPercent.forEach(x => {
      addWedge(x);
    });
  }, [addWedge, dataWithPercent]);

  useEffect(() => {
    initStage();
    refreshData();

    return () => {
      anim.stop();
      inProgress = false;
      wheel.off("mousedown touchstart");
      stage.removeEventListener("mousemove touchmove");
      stage.removeEventListener("mouseup touchend");
    };
  }, [initStage, refreshData]);

  return <div id="rouletteContainer" />;
});
