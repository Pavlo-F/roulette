import styled from "styled-components";

export const ButtonSvg = styled.button`
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  outline: none;
  padding: 0px;
  background: transparent;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  color: var(--primaryTextColor);

  &:disabled {
    color: #6c6c6f;
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    color: var(--secondaryColor500);
  }
  &:not(:disabled):focus {
    color: var(--secondaryColor500);
  }
  &:not(:disabled):active {
    color: var(--secondaryColor500);
  }
`;
