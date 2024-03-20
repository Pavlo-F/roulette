import React from "react";
import styled from "styled-components";

const Root = styled.div`
  color: #fff;
`;

export const Rules = () => {
  
  return <Root>
    <div>Цель игры - угадать секретное слово.</div>
    <div>Основные правила:</div>
    <ul>
      <li>У тебя есть неограниченное количество попыток.</li>
      <li>Все слова в списке ранжированы по их схожести с секретным словом.</li>
      <li>Чем меньше его номер, тем оно ближе к секретному слову</li>
    </ul>
    <div>Принцип работы - как игра горячо-холодно. Например, если секретное слово &quot;кот&quot;, то &quot;кошка&quot; ближе к &quot;коту&quot; по сравнению с &quot;собака&quot;.</div>
  </Root>;
};