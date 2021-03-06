import { ChainId } from '@uniswap/sdk'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'

import styled from 'styled-components'

import Logo from '../../assets/svg/logo.svg'
import ArbLogo from '../../assets/images/arbiswap2.png'

import LogoDark from '../../assets/svg/logo_white.svg'
import Wordmark from '../../assets/svg/wordmark.svg'
import WordmarkDark from '../../assets/svg/wordmark_white.svg'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import useTwitter  from '../../hooks/useTwitter'

import { useETHBalances } from '../../state/wallet/hooks'
import TwitterImg from '../../assets/images/tr.png'

import { YellowCard } from '../Card'
import Settings from '../Settings'
import Menu from '../Menu'

import Row, { RowBetween } from '../Row'
import Web3Status from '../Web3Status'
import VersionSwitch from './VersionSwitch'
import Loader from '../Loader'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: absolute;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    width: calc(100%);
    position: relative;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0.5rem;
`};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }
`

const TitleText = styled(Row)`
  width: fit-content;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;

  :focus {
    border: 1px solid blue;
  }
`

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
  pointer-events: auto;
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    img { 
      width: 4.5rem;
    }
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const GetStarted = styled(Text)`
    cursor: pointer;
      // background-color: ${({ theme }) => ( theme.bg3)};
`


const TweetLink = styled.a`
  position: relative;
  box-sizing: border-box;
  padding: 8px;
  background-color: #def0ff;
  color: #1b95e0;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  font-family: Helvetica;
  border-radius: 8px;
  margin-left: 5px;
  font-size: 15px;
  display: flex;

`
const TweetButton = () => {
  const handleClick = useTwitter()
  return (
    <TweetLink target="_blank" onClick={handleClick}>
      <span> Request Tokens   </span>  <img width="20" height="20" src={TwitterImg}/> 
    </TweetLink>
  )
}
const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: null,
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.ARBITRUM]: 'Arbitrum'
}
interface props {
  setShouldOpenModalCache: (b: boolean) => void
}
export default function Header( { setShouldOpenModalCache } : props) {
  const { account, chainId } = useActiveWeb3React()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isDark] = useDarkModeManager()
  const unconnected = typeof chainId === 'number' && chainId !== ChainId.ARBITRUM  
    
  
  return (
    <HeaderFrame>
      <RowBetween style={{ alignItems: 'flex-start' }} padding="1rem 1rem 0 1rem">
        <HeaderElement>
          <Title href="." style={{textDecoration:"none", color:"black", fontStyle:"normal"}}>
            <UniIcon>
              <img width="30" src={ArbLogo} alt="logo" />
            </UniIcon>
            <TitleText>
              <span style={{ marginLeft: '4px', fontFamily:"Ariel", color: isDark ? "white": "black"}}>ARBISWAP</span>
              {/* <img style={{ marginLeft: '4px', marginTop: '4px' }} src={isDark ? WordmarkDark : Wordmark} alt="logo" /> */}
            </TitleText>
          </Title>
        </HeaderElement>
        <HeaderControls>
          <HeaderElement onClick ={()=> setShouldOpenModalCache(true)}>
            <GetStarted style={ unconnected ? {color: 'red'}: {}}> { unconnected ? 'Connect to Arbitrum' : 'Get Started'} </GetStarted>
          </HeaderElement>
          {! unconnected && <HeaderElement >
            <TweetButton/>
          </HeaderElement>}
          <HeaderElement>
            <TestnetWrapper>
              {!isMobile && chainId && NETWORK_LABELS[chainId] && <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>}
            </TestnetWrapper>
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  { userEthBalance ? `${userEthBalance.toSignificant(4)} ETH` : <Loader/> }
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
          </HeaderElement>
          <HeaderElementWrap>
            <VersionSwitch />
            <Settings />
            <Menu />
          </HeaderElementWrap>
        </HeaderControls>
      </RowBetween>
    </HeaderFrame>
  )
}
