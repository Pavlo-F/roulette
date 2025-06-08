import React, { memo, useCallback, useContext } from "react";
import { useSetAtom } from "jotai";
import styled from "styled-components";
import { IMAGES } from "..";
import SvgClose from "./ic_close.svg";
import { DonateSource } from "../../Services/DonateService/AtomsCtx";
import { ButtonSvg } from "../../components/ButtonSvg";
import { HomeAtomsCtx } from "../AtomsCtx";

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 16rem;
`;

const Name = styled.span`
  color: var(--secondaryColor500);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Sum = styled.span`
  white-space: nowrap;
`;

const IconCnt = styled.div`
  grid-area: icon;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

type Props = {
  id: string;
  userName: string;
  sum: number;
  currency: string;
  source: DonateSource;
};

export const Header = memo(({ id, currency, sum, userName, source }: Props) => {
  const { newLotsAtom } = useContext(HomeAtomsCtx);
  const setNewLots = useSetAtom(newLotsAtom);

  const onClose = useCallback(() => {
    setNewLots(old => {
      const result = old.filter(x => x.id !== id);
      return result;
    });
  }, [id, setNewLots]);

  return (
    <Root>
      <User>
        <IconCnt key={id}>
          {source === DonateSource.DonatePay && <Icon src={IMAGES.PngDonatePay} alt="DonatePay" />}
          {source === DonateSource.DonationAlerts && (
            <Icon src={IMAGES.PngDonationAlerts} alt="DonationAlerts" />
          )}
          {source === DonateSource.Twitch && <Icon src={IMAGES.PngTwitch} alt="Twitch" />}
        </IconCnt>
        <Sum>
          {sum} {currency?.toLowerCase()}
        </Sum>
        <Name>{userName}</Name>
      </User>

      <ButtonSvg onClick={onClose}>
        <SvgClose />
      </ButtonSvg>
    </Root>
  );
});
