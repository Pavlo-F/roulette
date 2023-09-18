import React, { memo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import SvgHammer from "./ic_hammer.svg";
import SvgChart from "./ic_pieChart.svg";
import SvgSettings from "./ic_settings.svg";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-right: 1px solid var(--borderColor);
  flex: auto;
  padding: 0.5rem 2rem 0 0.5rem;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  height: 2.5rem;
  gap: 1rem;
`;

const Icon = styled.div`
  width: 2rem;
  height: 2rem;
`;

export const Form = memo(() => {
  return (
    <Root>
      <NavItem>
        <Icon>
          <SvgHammer />
        </Icon>
        <Link to="/">Аукцион</Link>
      </NavItem>
      <NavItem>
        <Icon>
          <SvgChart />
        </Icon>
        <Link to="/roulette">Испытать удачу</Link>
      </NavItem>
      <NavItem>
        <Icon>
          <SvgSettings />
        </Icon>
        <Link to="/settings">Настройки</Link>
      </NavItem>
    </Root>
  );
});
