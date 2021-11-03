
// Required Packages:
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

// Ethereum Routes:
const eth_wallet = require('./routes/ethereum/wallet.js');
const eth_aave = require('./routes/ethereum/aave.js');

// BSC Routes:
const bsc_wallet = require('./routes/bsc/wallet.js');

// Polygon Routes:
const poly_wallet = require('./routes/polygon/wallet.js');

// Fantom Routes:
const ftm_wallet = require('./routes/fantom/wallet.js');

// Avalanche Routes:
const avax_wallet = require('./routes/avalanche/wallet.js');
const avax_snowball = require('./routes/avalanche/snowball.js');

// Harmony Routes:
const one_wallet = require('./routes/harmony/wallet.js');

// Partnership Routes:
const snowball_wallet = require('./routes/partnerships/snowball/wallet.js');
const snowball_strats = require('./routes/partnerships/snowball/strats.js');

// Initializing Express Server:
const app = express();
app.use(cors());

/* ========================================================================================================================================================================= */

// Default Endpoint:
app.get('/', (req, res) => {
  res.send(`
    <title>CookieTrack API</title>
    <p>Click <a href="https://github.com/Ncookiez/cookietrack-api">here</a> to see the docs and endpoints available.</p>
  `);
});

/* ========================================================================================================================================================================= */

// Ethereum Wallet:
app.get('/ethereum/wallet', async (req, res) => {
  res.end(await eth_wallet.get(req));
});

// BSC Wallet:
app.get('/bsc/wallet', async (req, res) => {
  res.end(await bsc_wallet.get(req));
});

// Polygon Wallet:
app.get('/polygon/wallet', async (req, res) => {
  res.end(await poly_wallet.get(req));
});

// Fantom Wallet:
app.get('/fantom/wallet', async (req, res) => {
  res.end(await ftm_wallet.get(req));
});

// Avalanche Wallet:
app.get('/avalanche/wallet', async (req, res) => {
  res.end(await avax_wallet.get(req));
});

// Harmony Wallet:
app.get('/harmony/wallet', async (req, res) => {
  res.end(await one_wallet.get(req));
});

/* ========================================================================================================================================================================= */

// Aave (Ethereum):
app.get('/ethereum/aave', async (req, res) => {
  res.end(await eth_aave.get(req));
});

// Aave (Polygon):
// Aave (Avalanche):
// PancakeSwap (BSC):
// AutoFarm (BSC):
// AutoFarm (Polygon):
// AutoFarm (Fantom):
// AutoFarm (Avalanche):
// Compound (Ethereum):
// Yearn (Ethereum):
// Balancer (Ethereum):
// Balancer (Polygon):
// Belt (BSC):
// Venus (BSC):
// Beefy (BSC):
// Beefy (Polygon):
// Beefy (Fantom):
// Beefy (Avalanche):
// Beefy (Harmony):
// Wault (BSC):
// Wault (Polygon):
// QuickSwap (Polygon):
// SpookySwap (Fantom):
// BenQi (Avalanche):
// Pangolin (Avalanche):
// HoneyFarm (BSC):
// YieldYak (Avalanche):
// Trader Joe (Avalanche):
// mStable (Ethereum):
// mStable (Polygon):
// Penguin (Avalanche):
// Scream (Fantom):

// Snowball (Avalanche):
app.get('/avalanche/snowball', async (req, res) => {
  res.end(await avax_snowball.get(req));
});

// Cycle (Avalanche):
// PoolTogether (Ethereum):
// PoolTogether (BSC):
// PoolTogether (Polygon):
// Lydia (Avalanche):
// Teddy (Avalanche):
// Everest (Avalanche):
// ApeSwap (BSC):
// ApeSwap (Polygon):
// SushiSwap (Ethereum):
// SushiSwap (BSC):
// SushiSwap (Polygon):
// SushiSwap (Fantom):
// SushiSwap (Avalanche):
// SushiSwap (Harmony):
// Cream (Ethereum):
// Cream (BSC):
// Cream (Polygon):
// Cream (Fantom):
// Cream (Avalanche):
// Curve (Ethereum):
// Curve (Polygon):
// Curve (Fantom):
// Curve (Avalanche):
// Iron (Polygon):
// Wonderland (Avalanche):
// Bouje (Fantom):

/* ========================================================================================================================================================================= */

// Snowball Partnership Endpoints:
app.get('/snowball/wallet', async (req, res) => {
  res.end(await snowball_wallet.get(req));
});
app.get('/snowball/strats', async (req, res) => {
  res.end(await snowball_strats.get(req));
});

/* ========================================================================================================================================================================= */

// Starting Local Server:
// app.listen(3000, () => { console.log('\nAPI Up on 127.0.0.1:3000'); });

// Exporting Express App:
exports.app = functions.runWith({ memory: '256MB', timeoutSeconds: 120 }).https.onRequest(app);