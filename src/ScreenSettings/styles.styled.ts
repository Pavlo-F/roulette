import styled from "styled-components";

export const Hint = styled.div`
  color: var(--hintColor);
  font-size: 0.9em;
`;

export const FlexCnt = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  overflow: hidden;
`;

export const Link = styled.a`
  &:hover {
    color: var(--secondaryColor500);
  }
`;
