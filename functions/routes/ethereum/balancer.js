
// Imports:
const { ethers } = require('ethers');
const { minABI, balancer } = require('../../static/ABIs.js');
const { query, addBalancerToken } = require('../../static/functions.js');

// Initializations:
const chain = 'eth';
const project = 'balancer';
const vault = '0xBA12222222228d8Ba445958a75a0704d566BF2C8';
const poolIDs = [
  '0x01abc00e86c7e258823b9a055fd62ca6cf61a16300010000000000000000003b',
  '0x021c343c6180f03ce9e48fae3ff432309b9af19900020000000000000000000b',
  '0x0297e37f1873d2dab4487aa67cd56b58e2f27875000200000000000000000003',
  '0x03cd191f589d12b0582a99808cf19851e468e6b500020000000000000000002b',
  '0x06df3b2bbb68adc8b0e302443692037ed9f91b42000000000000000000000063',
  '0x072f14b85add63488ddad88f855fda4a99d6ac9b000200000000000000000027',
  '0x09804caea2400035b18e2173fdd10ec8b670ca09000100000000000000000038',
  '0x0a9e96988e21c9a03b8dc011826a00259e02c46e000200000000000000000055',
  '0x0b09dea16768f0799065c475be02919503cb2a3500020000000000000000001a',
  '0x1050f901a307e7e71471ca3d12dfcea01d0a0a1c00020000000000000000004c',
  '0x14462305d211c12a736986f4e8216e28c5ea7ab4000200000000000000000068',
  '0x148ce9b50be946a96e94a4f5479b771bab9b1c59000100000000000000000054',
  '0x14bf727f67aa294ec36347bd95aba1a2c136fe7a00020000000000000000002c',
  '0x15432ba000e58e3c0ae52a5dec0579215ebc75d0000200000000000000000075',
  '0x16faf9f73748013155b7bc116a3008b57332d1e600020000000000000000001c',
  '0x186084ff790c65088ba694df11758fae4943ee9e000200000000000000000013',
  '0x1b46e4b0791c9383b73b64aabc371360a031a83f000200000000000000000057',
  '0x22939e40cf467de8f5db4f05a4027e5d4c1c658c000200000000000000000059',
  '0x231e687c9961d3a27e6e266ac5c433ce4f8253e4000200000000000000000023',
  '0x29d7a7e0d781c957696697b94d4bc18c651e358e000200000000000000000049',
  '0x2d6e3515c8b47192ca3913770fa741d3c4dac35400020000000000000000007b',
  '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080',
  '0x32fc95287b14eaef3afa92cccc48c285ee3a280a000200000000000000000006',
  '0x344e8f99a55da2ba6b4b5158df2143374e400df2000100000000000000000079',
  '0x36128d5436d2d70cab39c9af9cce146c38554ff0000200000000000000000009',
  '0x38a01c45d86b61a70044fb2a76eac8e75b1ac78e00020000000000000000003a',
  '0x39cd55ff7e7d7c66d7d2736f1d5d4791cdab895b000100000000000000000071',
  '0x3a19030ed746bd1c3f2b0f996ff9479af04c5f0a000100000000000000000005',
  '0x3a271a9838b36ea8c42eaf230f969c6b40e4ac0400020000000000000000004d',
  '0x3a693eb97b500008d4bb6258906f7bbca1d09cc5000200000000000000000065',
  '0x3e5fa9518ea95c3e533eb377c001702a9aacaa32000200000000000000000052',
  '0x3ebf48cd7586d7a4521ce59e53d9a907ebf1480f000200000000000000000028',
  '0x3febe770201cf4d351d33708170b9202ba1c6af7000200000000000000000045',
  '0x41175c3ee2dd49fca9b263f49525c069095b87c7000100000000000000000074',
  '0x45910faff3cbf990fdb204682e93055506682d1700020000000000000000000d',
  '0x4626d81b3a1711beb79f4cecff2413886d461677000200000000000000000011',
  '0x494b26d4aee801cb1fabf498ee24f0af20238743000200000000000000000083',
  '0x4dd7517de8065a688dd0e398ed031b6e469f9f0f000200000000000000000050',
  '0x4e7f40cd37cee710f5e87ad72959d30ef8a01a5d000100000000000000000031',
  '0x4fa6086ed10c971d255aa1b09a6beb1c7be5ca37000200000000000000000051',
  '0x503717b3dc137e230afc7c772520d7974474fb70000200000000000000000081',
  '0x571046eae58c783f29f95adba17dd561af8a871200020000000000000000000c',
  '0x58af920d9dc0bc4e8f771ff013d79215cabcaa9e00010000000000000000005f',
  '0x59e2563c08029f13f80cba9eb610bfd0367ed266000100000000000000000082',
  '0x5aa90c7362ea46b3cbfbd7f01ea5ca69c98fef1c000200000000000000000020',
  '0x5b1c06c4923dbba4b27cfa270ffb2e60aa28615900020000000000000000004a',
  '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014',
  '0x5d563ca1e2daaae3402c36097b934630ab53702c000200000000000000000024',
  '0x5d6e3d7632d6719e04ca162be652164bec1eaa6b000200000000000000000048',
  '0x606e3ccc8c51cbbb1ff07ad03c6f95a84672ab16000100000000000000000067',
  '0x60b4601cdddc4467f31b1f770cb93c51dc7dc728000200000000000000000042',
  '0x614b5038611729ed49e0ded154d8a5d3af9d1d9e000200000000000000000044',
  '0x61d5dc44849c9c87b0856a2a311536205c96c7fd000100000000000000000001',
  '0x647c1fd457b95b75d0972ff08fe01d7d7bda05df000200000000000000000002',
  '0x6602315d19278278578830933aeaac0d684c9c3f00020000000000000000004f',
  '0x67f8fcb9d3c463da05de1392efdbb2a87f8599ea000200000000000000000060',
  '0x6ae82385f76e3742f89cb46343b169f6ee49de1b000200000000000000000016',
  '0x6de69beb66317557e65168bd7d3fff22a89dbb11000200000000000000000056',
  '0x71628c66c502f988fbb9e17081f2bd14e361faf4000200000000000000000078',
  '0x72ab6ff76554f90532e2809cee019ade724e029a000100000000000000000047',
  '0x787546bf2c05e3e19e2b6bde57a203da7f682eff00020000000000000000007c',
  '0x7bf521b4f4c1543a622e11ee347efb1a2374332200010000000000000000005c',
  '0x7eb878107af0440f9e776f999ce053d277c8aca8000200000000000000000012',
  '0x80be0c303d8ad2a280878b50a39b1ee8e54dbd2200020000000000000000000f',
  '0x8339e311265a025fd5792db800daa8eda4264e2c000200000000000000000029',
  '0x85dca8667d020e694fdff06e7ee85e0c5c7c61a4000200000000000000000076',
  '0x87165b659ba7746907a48763063efa3b323c2b0700020000000000000000002d',
  '0x893b30574bf183d69413717f30b17062ec9dfd8b000200000000000000000061',
  '0x89ea4363bd541d27d9811e4df1209daa73154472000200000000000000000034',
  '0x8a92c3afabab59101b4e2426c82a7ddbb66b545000020000000000000000001f',
  '0x8bda1ab5eead21547ba0f33c07c86c5dc48d9baa00010000000000000000005b',
  '0x8e9690e135005e415bd050b11768615de43fe5f8000200000000000000000043',
  '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8000200000000000000000019',
  '0x991aeafbe1b1c7ac8348dc623ae350768d0c65b3000100000000000000000008',
  '0x9c08c7a7a89cfd671c79eacdc6f07c1996277ed5000200000000000000000025',
  '0x9e7fd25ad9d97f1e6716fa5bb04749a4621e892d000100000000000000000039',
  '0x9f19a375709baf0e8e35c2c5c65aca676c4c719100000000000000000000006e',
  '0x9f1f16b025f703ee985b58ced48daf93dad2f7ef00020000000000000000001e',
  '0x9f2b223da9f3911698c9b90ecdf3ffee37dd54a8000200000000000000000041',
  '0xa02e4b3d18d4e6b8d18ac421fbc3dfff8933c40a00020000000000000000004b',
  '0xa0488d89fb8d3085d83ad2426b94b9715cf0286900020000000000000000002f',
  '0xa660ba113f9aabaeb4bcd28a4a1705f4997d5432000200000000000000000022',
  '0xa6f548df93de924d73be7d25dc02554c6bd66db500020000000000000000000e',
  '0xa8d4433badaa1a35506804b43657b0694dea928d00020000000000000000005e',
  '0xaac98ee71d4f8a156b6abaa6844cdb7789d086ce00020000000000000000001b',
  '0xad302e620fedb60078b33514757335545ba05c6d00020000000000000000004e',
  '0xb0401ab1108bd26c85a07243dfdf09f4821d76a200020000000000000000007f',
  '0xb0fba102a03703fe2c1dd6300e7b431eac60e4b6000200000000000000000033',
  '0xb2634e2bfab9664f603626afc3d270be63c09ade000200000000000000000053',
  '0xb6b9b165c4ac3f5233a0cf413126c72be28b468a00010000000000000000005a',
  '0xb82a45ea7c6d7c90bd95e9e2af13242538f2e26900010000000000000000007a',
  '0xbb31b8eebb9c71001562ae56aa5751af313e6d8900020000000000000000002e',
  '0xc6a5032dc4bf638e15b4a66bc718ba7ba474ff73000200000000000000000004',
  '0xce16e7ed7654a3453e8faf748f2c82e57069278f00020000000000000000006d',
  '0xce66904b68f1f070332cbc631de7ee98b650b49900020000000000000000000a',
  '0xd0e43c99c05271fa9fdf82281d4d1831a47be81f00020000000000000000003e',
  '0xd16847480d6bc218048cd31ad98b63cc34e5c2bf00020000000000000000007d',
  '0xd208168d2a512240eb82582205d94a0710bce4e7000100000000000000000072',
  '0xd47c0734a0b5feff3bb2fc8542cd5b9751afeefb000100000000000000000037',
  '0xd57b0ee9e080e3f6aa0c30bae98234359e97ea98000100000000000000000032'
];

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
        response.data.push(...(await getPoolBalances(wallet)));
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

// Function to get all pool balances:
const getPoolBalances = async (wallet) => {
  let balances = [];
  let promises = poolIDs.map(id => (async () => {
    let address = (await query(chain, vault, balancer.vaultABI, 'getPool', [id]))[0];
    let balance = parseInt(await query(chain, address, minABI, 'balanceOf', [wallet]));
    if(balance > 0) {
      let newToken = await addBalancerToken(chain, project, address, balance, wallet, id);
      balances.push(newToken);
    }
  })());
  await Promise.all(promises);
  return balances;
}