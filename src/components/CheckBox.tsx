import React, { forwardRef, memo, useMemo } from "react";
import type { ForwardedRef, InputHTMLAttributes } from "react";
import styled from "styled-components";

export const Checkmark = styled.div`
  flex: initial;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Border = styled.div`
  flex: initial;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: solid 1.5px #6c6c6f;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dot = styled.div`
  flex: initial;
  width: 10px;
  height: 10px;
  border-radius: 1px;
  background-color: #fff;
`;

export const Text = styled.div`
  flex: auto;
  height: 20px;
  font-size: 16px;
  line-height: 20px;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Root = styled.label`
  height: 32px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  user-select: none;
  cursor: pointer;

  input:not(:checked) ~ ${Checkmark} > ${Border} > * {
    display: none;
  }

  input:checked ~ ${Checkmark} > ${Border} {
    border: solid 1px #fff;
  }

  input[disabled] ~ ${Checkmark} {
    opacity: 0.4;
    cursor: not-allowed;
  }

  input[disabled] ~ ${Text} {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Input = styled.input.attrs(() => ({
  type: "checkbox",
}))`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const CheckBox = forwardRef((props: Props, forwardedRef: ForwardedRef<HTMLInputElement>) => {
  const { className, style, title, children, ...inputProps } = props;

  const label = useMemo(() => {
    if (title != null) {
      return title;
    }

    if (typeof children === "string") {
      return children;
    }

    return undefined;
  }, [title, children]);

  return (
    <Root title={label} className={className} style={style}>
      <Input
        title={title}
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...inputProps}
        ref={forwardedRef}
      />
      <Checkmark>
        <Border>
          <Dot />
        </Border>
      </Checkmark>
      <Text>{children}</Text>
    </Root>
  );
});
