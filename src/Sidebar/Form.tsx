import React, { memo, useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import SvgDoubleArrow from "./ic_double-arrow.svg";
import SvgHammer from "./ic_hammer.svg";
import SvgInfo from "./ic_info.svg";
import SvgChart from "./ic_pieChart.svg";
import SvgSettings from "./ic_settings.svg";

const Root = styled.div<{ $hide: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--borderColor);
  flex: auto;
  overflow: hidden;
  width: ${props => (props.$hide ? "3rem" : "13rem")};

  transition: width 180ms;
`;

const NavItem = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  height: 3rem;
  gap: 1rem;
  padding: 0 2rem 0 0.5rem;
  cursor: pointer;
  white-space: nowrap;

  ${props => {
    if (props.selected) {
      return css`
        background-color: var(--primaryColor700);
      `;
    }

    return css`
      &:hover {
        background-color: var(--primaryColor650);
      }
    `;
  }};
`;

const Icon = styled.div`
  min-width: 2rem;
  min-height: 2rem;
  max-width: 2rem;
  max-height: 2rem;
`;

const ShowHide = styled.div<{ $hide: boolean }>`
  display: flex;
  position: absolute;
  top: 50%;
  width: 1.2rem;
  height: 1.2rem;
  right: 0;
  cursor: pointer;

  :hover {
    color: var(--secondaryColor500);
  }

  svg {
    transform: rotate(${({ $hide }) => ($hide ? "180deg" : "0deg")});
    transition: transform 0.3s;
  }
`;

const Hr = styled.hr`
  width: 90%;
  border: none;
  border-top: 1px solid var(--borderColor);
`;

export const Form = memo(() => {
  const location = useLocation();

  const [hide, setHide] = useState(false);

  const onHideClick = useCallback(() => {
    setHide(old => !old);
  }, []);

  return (
    <Root $hide={hide}>
      <ShowHide $hide={hide} onClick={onHideClick}>
        <SvgDoubleArrow />
      </ShowHide>

      <Link to="/">
        <NavItem selected={location.pathname === "/"}>
          <Icon>
            <SvgHammer />
          </Icon>
          <div>Аукцион</div>
        </NavItem>
      </Link>

      <Link to="/roulette">
        <NavItem selected={location.pathname === "/roulette"}>
          <Icon>
            <SvgChart />
          </Icon>
          <div>Испытать удачу</div>
        </NavItem>
      </Link>

      <Link to="/settings">
        <NavItem selected={location.pathname === "/settings"}>
          <Icon>
            <SvgSettings />
          </Icon>
          <div>Настройки</div>
        </NavItem>
      </Link>

      <Hr />

      <a href="https://donaction.club/exclusive" target="_blank" rel="noopener noreferrer">
        <NavItem>
          <Icon>
            <SvgInfo />
          </Icon>
          Другие проекты
        </NavItem>
      </a>
    </Root>
  );
});
