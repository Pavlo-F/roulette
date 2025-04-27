import styled from "styled-components";

const ButtonPrimary = styled.button`
  position: relative;
  outline: none;
  padding: 8px 22px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid var(--borderColor);
  background-color: transparent;
  color: var(--primaryTextColor);
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &&& > svg {
    margin-right: 4px;
  }

  &:hover:not(:disabled):not(:active) {
    background: var(--primaryColor700);
  }

  &:active {
    color: var(--primaryColor800);
    background: var(--secondaryColor500);
  }

  &:focus:not(:active) {
    border: 1px solid var(--secondaryColor500);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export default ButtonPrimary;
