const { AlphaRouter } = require('@uniswap/smart-order-router')
const { Token, CurrencyAmount } = require('@uniswap/sdk-core')
const { JSBI, TradeType } = require('@uniswap/sdk')
const { Tokens } = require('./constants.js')
const ethers = require('ethers')

function encodePath(path, fees) {
  if (path.length != fees.length + 1) {
    return
  }
  const FEE_SIZE = 3

  let encoded = '0x'
  for (let i = 0; i < fees.length; i++) {
    // 20 byte encoding of the address
    encoded += path[i].slice(2)
    // 3 byte encoding of the fee
    encoded += fees[i].toString(16).padStart(2 * FEE_SIZE, '0')
  }
  // encode the final token
  encoded += path[path.length - 1].slice(2)

  return encoded.toLowerCase()
}

const init = async () => {
  const url = 'https://rinkeby.infura.io/v3/8d28d6befffa4536b51652325a3d54e5'
  const customHttpProvider = new ethers.providers.JsonRpcProvider(url)
  const router = new AlphaRouter({ chainId: 4, provider: customHttpProvider })

  const USDT = new Token(4, Tokens.USDT.address, 18, Tokens.USDT.name, Tokens.USDT.name)

  const TokenTo = new Token(4, Tokens.DAI.address, 18, Tokens.DAI.name, Tokens.DAI.name)

  const amountWei = '100000000000000'
  //const amountWei = '203858000000000'

  //TokenTo - USDT
  // const amount = CurrencyAmount.fromRawAmount(TokenTo, JSBI.BigInt(amountWei))
  // const route = await router.route(amount, USDT, TradeType.EXACT_INPUT)
  // console.log(`Quote Exact In (${amount.toFixed(2)} ${TokenTo.symbol}) = ${route.quote.toFixed(6)} ${USDT.symbol})`)

  //USDT - TokenTo
  const amount = CurrencyAmount.fromRawAmount(USDT, JSBI.BigInt(amountWei))
  const data = await router.route(amount, TokenTo, TradeType.EXACT_INPUT)
  console.log(`Quote Exact In (${amount.toFixed(12)} ${USDT.symbol}) = ${data.quote.toFixed(12)} ${TokenTo.symbol})`)

  if (data.route) {
    const routes = data.route

    routes.map((route, index) => {
      console.log('route ', index)
      console.log('protocol: ', route.protocol)
      const { pools, tokenPath } = route.route

      let feeArr = []
      let pathArr = []

      if (pools) {
        pools.map((pool, index) => {
          console.log('pool: ', index)
          console.log(`token0 (${pool.token0.symbol}): ${pool.token0.address}`)
          console.log(`token1 (${pool.token1.symbol}): ${pool.token1.address}`)
          console.log('poolFee: ', pool.fee)
          feeArr.push(pool.fee)
        })
      }

      if (tokenPath) {
        tokenPath.map((path, index) => {
          console.log('path: ', index)
          console.log(`${path.symbol}: ${path.address}`)
          pathArr.push(path.address)
        })
      }

      console.log('pool addresses: ', route.poolAddresses)
      console.log('path: ', pathArr)
      console.log('poolFee: ', feeArr)

      console.log('path encoded: ', encodePath(pathArr, feeArr))

      console.log('---------------------')
    })
  }

  //console.log('route: ', JSON.stringify(route))
}

init()
