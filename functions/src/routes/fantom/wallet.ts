
// Imports:
const { ethers } = require('ethers');
import { minABI } from '../../ABIs';
import { ftm_data } from '../../tokens';
import { initResponse, query, addNativeToken, addTrackedToken } from '../../functions';
import type { Request } from 'express';
import type { Chain, Address, Token } from 'cookietrack-types';
const rpcs: Record<Chain, URL[]> = require('../../../static/rpcs.json');

// Initializations:
const chain: Chain = 'ftm';

/* ========================================================================================================================================================================= */

// GET Function:
export const get = async (req: Request) => {

  // Initializing Response:
  let response = initResponse(req);

  // Fetching Response Data:
  if(response.status === 'ok') {
    try {
      let wallet = req.query.address as Address;
      response.data.push(...(await getFTM(wallet)));
      response.data.push(...(await getTokenBalances(wallet)));
    } catch(err: any) {
      console.error(err);
      response.status = 'error';
      response.data = [{error: 'Internal API Error'}];
    }
  }

  // Returning Response:
  return JSON.stringify(response, null, ' ');
}

/* ========================================================================================================================================================================= */

// Function to get native wallet balance:
const getFTM = async (wallet: Address) => {
  try {
    let ftm = new ethers.providers.JsonRpcProvider(rpcs[chain][0]);
    let balance = parseInt(await ftm.getBalance(wallet));
    if(balance > 0) {
      let newToken = await addNativeToken(chain, balance, wallet);
      return [newToken];
    } else {
      return [];
    }
  } catch {
    let ftm = new ethers.providers.JsonRpcProvider(rpcs[chain][1]);
    let balance = parseInt(await ftm.getBalance(wallet));
    if(balance > 0) {
      let newToken = await addNativeToken(chain, balance, wallet);
      return [newToken];
    } else {
      return [];
    }
  }
}

// Function to get token balances:
const getTokenBalances = async (wallet: Address) => {
  let tokens: Token[] = [];
  let promises = ftm_data.tokens.map(token => (async () => {
    let balance = parseInt(await query(chain, token.address, minABI, 'balanceOf', [wallet]));
    if(balance > 0) {
      let newToken = await addTrackedToken(chain, 'wallet', 'none', token, balance, wallet);
      tokens.push(newToken);
    }
  })());
  await Promise.all(promises);
  return tokens;
}