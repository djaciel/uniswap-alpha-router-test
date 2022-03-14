const { AlphaRouter } = require('@uniswap/smart-order-router')
const { Token, CurrencyAmount } = require('@uniswap/sdk-core')
const { JSBI, TradeType } = require('@uniswap/sdk')
const { Tokens } = require('./constants.js')
const ethers = require('ethers')

const init = async () => {
  const url = 'https://rinkeby.infura.io/v3/infurakey'
  const customHttpProvider = new ethers.providers.JsonRpcProvider(url)
  const router = new AlphaRouter({ chainId: 4, provider: customHttpProvider })

  const USDT = new Token(4, Tokens.jUSDT.address, 18, Tokens.jUSDT.name, Tokens.jUSDT.name)

  const TokenTo = new Token(4, Tokens.jWBTC.address, 18, Tokens.jWBTC.name, Tokens.jWBTC.name)

  const amountWei = '1000000000000000000'

  //TokenTo - USDT
  const amount = CurrencyAmount.fromRawAmount(TokenTo, JSBI.BigInt(amountWei))
  const route = await router.route(amount, USDT, TradeType.EXACT_INPUT)
  console.log(`Quote Exact In (${amount.toFixed(2)} ${TokenTo.symbol}) = ${route.quote.toFixed(6)} ${USDT.symbol})`)

  //USDT - TokenTo
  // const amount = CurrencyAmount.fromRawAmount(USDT, JSBI.BigInt(amountWei))
  // const route = await router.route(amount, TokenTo, TradeType.EXACT_INPUT)
  // console.log(`Quote Exact In (${amount.toFixed(2)} ${USDT.symbol}) = ${route.quote.toFixed(6)} ${TokenTo.symbol})`)

  if (route.route) {
    const routes = route.route

    routes.map((item) => {
      console.log('path', item.poolAddresses)
    })
  }

  //console.log('route: ', JSON.stringify(route))
}

init()
