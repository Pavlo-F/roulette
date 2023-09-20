import styled from "styled-components";

export const Input = styled.input`
  outline: none;
  cursor: default;
  height: 40px;
  color: var(--primaryTextColor);
  background: var(--primaryColor800);
  padding: 1px 15px;
  border: 1px solid var(--borderColor);
  border-radius: 8px;
  font-size: 1rem;
  line-height: 20px;

  &::placeholder {
    font-size: 1rem;
    color: var(--placeholderColor);
  }

  &:hover:not(:disabled) {
    padding: 0 14px;
    border-width: 2px;
  }

  &:focus {
    border-color: var(--secondaryColor500);
    outline: none;
  }

  &:invalid:not(:disabled),
  &.invalid:not(:disabled) {
    border-color: var(--invalid);
  }

  &:invalid:not(:disabled):focus,
  &.invalid:not(:disabled):focus {
    border-color: var(--invalid);
    outline: 1px solid #fff;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    color: #acacac;
    border-color: #acacac;
  }

  &:disabled::placeholder {
    color: transparent;
  }
`;
