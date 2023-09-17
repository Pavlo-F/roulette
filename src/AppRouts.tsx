import { memo } from "react";
import { Route, Routes } from "react-router-dom";
import { Screen as ScreenHome } from "./ScreenHome/Screen";
import { Screen as ScreenRoulette } from "./ScreenRoulette/Screen";
import { Screen as ScreenSettings } from "./ScreenSettings/Screen";

export const AppRouts = memo(() => {
  return (
    <Routes>
      <Route path="/" element={<ScreenHome />} />
      <Route path="/roulette" element={<ScreenRoulette />} />
      <Route path="/settings" element={<ScreenSettings />} />
    </Routes>
  );
});
