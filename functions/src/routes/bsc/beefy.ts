
// Imports:
import axios from 'axios';
import { minABI, beefy } from '../../ABIs';
import { initResponse, query, addToken, addLPToken, add4BeltToken, addBeltToken, addAlpacaToken } from '../../functions';
import type { Request } from 'express';
import type { Chain, Address, Token, LPToken } from 'cookietrack-types';

// Initializations:
const chain: Chain = 'bsc';
const project = 'beefy';
const staking: Address = '0x453d4ba9a2d594314df88564248497f7d74d6b2c';
const bifi: Address = '0xca3f508b8e4dd382ee878a314789373d80a5190a';
const wbnb: Address = '0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7';
const chars = 'abcdefghijklmnopqrstuvwxyz';
const randomChar = chars[Math.floor(Math.random() * chars.length)];

/* ========================================================================================================================================================================= */

// GET Function:
exports.get = async (req: Request): Promise<string> => {

  // Initializing Response:
  let response = initResponse(req);

  // Fetching Response Data:
  if(response.status === 'ok') {
    try {
      let wallet = req.query.address as Address;
      let vaults = ((await axios.get(`https://api.beefy.finance/vaults?${randomChar}`)).data).filter((vault: any) => vault.chain === 'bsc' && vault.status === 'active' && vault.tokenAddress);
      response.data.push(...(await getVaultBalances(wallet, vaults)));
      response.data.push(...(await getStakedBIFI(wallet)));
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

// Function to get vault balances:
const getVaultBalances = async (wallet: Address, vaults: any): Promise<(Token | LPToken)[]> => {
  let balances: (Token | LPToken)[] = [];
  let promises = vaults.map((vault: any) => (async () => {
    let balance = parseInt(await query(chain, vault.earnedTokenAddress, minABI, 'balanceOf', [wallet]));
    if(balance > 0) {
      let decimals = parseInt(await query(chain, vault.earnedTokenAddress, minABI, 'decimals', []));
      let exchangeRate = parseInt(await query(chain, vault.earnedTokenAddress, beefy.vaultABI, 'getPricePerFullShare', []));
      let underlyingBalance = balance * (exchangeRate / (10 ** decimals));

      // Unique Vaults (3+ Assets):
      if(vault.assets.length > 2) {
        if(vault.id === 'belt-4belt') {
          let newToken = await add4BeltToken(chain, project, vault.tokenAddress, underlyingBalance, wallet);
          balances.push(newToken);
        }

      // LP Token Vaults:
      } else if(vault.assets.length === 2 && vault.id != 'omnifarm-usdo-busd-ot' && vault.id != 'ellipsis-renbtc') {
        let newToken = await addLPToken(chain, project, vault.tokenAddress, underlyingBalance, wallet);
        balances.push(newToken);

      // Single-Asset Vaults:
      } else if(vault.assets.length === 1) {
        if(vault.platform === 'Belt') {
          let newToken = await addBeltToken(chain, project, vault.tokenAddress, underlyingBalance, wallet);
          balances.push(newToken);
        } else if(vault.platform === 'Alpaca') {
          let newToken = await addAlpacaToken(chain, project, vault.tokenAddress, underlyingBalance, wallet);
          balances.push(newToken);
        } else {
          let newToken = await addToken(chain, project, vault.tokenAddress, underlyingBalance, wallet);
          balances.push(newToken);
        }
      }
    }
  })());
  await Promise.all(promises);
  return balances;
}

// Function to get staked BIFI balance:
const getStakedBIFI = async (wallet: Address): Promise<Token[]> => {
  let balances: Token[] = [];
  let balance = parseInt(await query(chain, staking, minABI, 'balanceOf', [wallet]));
  if(balance > 0) {
    let newToken = await addToken(chain, project, bifi, balance, wallet);
    balances.push(newToken);
  }
  let pendingRewards = parseInt(await query(chain, staking, beefy.stakingABI, 'earned', [wallet]));
  if(pendingRewards > 0) {
    let newToken = await addToken(chain, project, wbnb, pendingRewards, wallet);
    balances.push(newToken);
  }
  return balances;
}