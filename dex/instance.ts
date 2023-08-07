class DexInstance {
    tokens?: Array<Token>
    pairs?: Array<Pair>
    name: string


    constructor(name: string) {
        this.name = name
    }

    addLiquidity(pairId: number) {

    }

    createPair(token1: Token, token2: Token) {

    }

    swap(inputToken: string, outputToken: string, amount: number) {

    }

    getPair(pairId: number) {

    }

    getPriceDataForPair(pairId: number) {

    }

}


class Pair {
    token1: Token;
    token2: Token;

    constructor(token1: Token, token2: Token) {
        this.token1 = token1;
        this.token2 = token2;
    }
}


class Token {
    name: string
    symbol: string
    id: string

    constructor(name: string, symbol: string) {
        this.name = name;
        this.symbol = symbol;
        this.id = crypto.randomUUID()
    }
}