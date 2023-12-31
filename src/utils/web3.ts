import { Contract } from '@ethersproject/contracts';
import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from '@ethersproject/providers';
import { BigNumber, ethers, FixedNumber } from 'ethers';
import { ITokenFormattedValues } from '../types';

export default function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

const getDecimal = async (erc20Token: Contract): Promise<string> => {
  if (!sessionStorage[erc20Token.address]) {
    const tokenDecimals = await erc20Token.decimals();
    sessionStorage[erc20Token.address] = tokenDecimals;
    return tokenDecimals;
  }
  return JSON.parse(sessionStorage[erc20Token.address]);
};

export const parseRateAmount = async (
  rateAmount: string,
  rateToken: string,
  decimals?: number,
): Promise<BigNumber> => {
  if (rateToken === ethers.constants.AddressZero) {
    return ethers.utils.parseEther(rateAmount);
  }
  return ethers.utils.parseUnits(rateAmount, decimals);
};

export const formatRateAmount = (
  rateAmount: string,
  rateToken: string,
  tokenDecimals: number,
): ITokenFormattedValues => {
  if (rateToken === ethers.constants.AddressZero) {
    const valueInEther = ethers.utils.formatEther(rateAmount);
    const roundedValue = FixedNumber.from(valueInEther).round(2).toString();
    const exactValue = FixedNumber.from(valueInEther).toString();
    return {
      roundedValue,
      exactValue,
    };
  }
  const valueInToken = ethers.utils.formatUnits(rateAmount, tokenDecimals);
  const roundedValue = FixedNumber.from(valueInToken).round(2).toString();
  const exactValue = FixedNumber.from(valueInToken).toString();
  return {
    roundedValue,
    exactValue,
  };
};
