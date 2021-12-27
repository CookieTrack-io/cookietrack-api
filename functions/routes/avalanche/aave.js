
// Imports:
const { ethers } = require('ethers');
const { minABI, aave } = require('../../static/ABIs.js');
const { query, addToken, addDebtToken } = require('../../static/functions.js');

// Initializations:
const chain = 'avax';
const project = 'aave';
const registry = '0x65285E9dfab318f57051ab2b139ccCf232945451';
const tokens = [
  '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab', // WETH.e
  '0xd586e7f844cea2f87f50152665bcbc2c279d8d70', // DAI.e
  '0xc7198437980c041c805a1edcba50c1ce5db95118', // USDT.e
  '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664', // USDC.e
  '0x63a72806098bd3d9520cc43356dd78afe5d386d9', // AAVE.e
  '0x50b7545627a5162f82a992c33b87adc75187b218', // WBTC.e
  '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7'  // WAVAX
];
const incentives = '0x01D83Fe6A10D2f2B7AF17034343746188272cAc9';
const wavax = '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7';

/* ========================================================================================================================================================================= */

// GET Function:
exports.get = async (req) => {

  // Initializing Response:
  let response = {
    status: 'ok',
    data: [],
    request: req.originalUrl
  }

  // Getting Wallet Address:
  const wallet = req.query.address;

  // Checking Parameters:
  if(wallet != undefined) {
    if(ethers.utils.isAddress(wallet)) {
      try {
        response.data.push(...(await getMarketBalances(wallet)));
        response.data.push(...(await getIncentives(wallet)));
      } catch(err) {
        console.error(err);
        response.status = 'error';
        response.data = [{error: 'Internal API Error'}];
      }
    } else {
      response.status = 'error';
      response.data = [{error: 'Invalid Wallet Address'}];
    }
  } else {
    response.status = 'error';
    response.data = [{error: 'No Wallet Address in Request'}];
  }

  // Returning Response:
  return JSON.stringify(response);
}

/* ========================================================================================================================================================================= */

// Function to get lending market balances:
const getMarketBalances = async (wallet) => {
  let balances = [];
  let promises = tokens.map(token => (async () => {
    let addresses = await query(chain, registry, aave.registryABI, 'getReserveTokensAddresses', [token]);

    // Lending Balances:
    let balance = parseInt(await query(chain, addresses.aTokenAddress, minABI, 'balanceOf', [wallet]));
    if(balance > 0) {
      let newToken = await addToken(chain, project, token, balance, wallet);
      balances.push(newToken);
    }

    // Borrowing Balances:
    let stableDebt = parseInt(await query(chain, addresses.stableDebtTokenAddress, minABI, 'balanceOf', [wallet]));
    let variableDebt = parseInt(await query(chain, addresses.variableDebtTokenAddress, minABI, 'balanceOf', [wallet]));
    let totalDebt = stableDebt + variableDebt;
    if(totalDebt > 0) {
      let newToken = await addDebtToken(chain, project, token, totalDebt, wallet);
      balances.push(newToken);
    }
  })());
  await Promise.all(promises);
  return balances;
}

// Function to get unclaimed incentives:
const getIncentives = async (wallet) => {
  let rewards = parseInt(await query(chain, incentives, aave.incentivesABI, 'getUserUnclaimedRewards', [wallet]));
  if(rewards > 0) {
    let newToken = await addToken(chain, project, wavax, rewards, wallet);
    return [newToken];
  } else {
    return [];
  }
}