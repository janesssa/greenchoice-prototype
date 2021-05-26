const { calcMean, sortArray, getKeyByValue, getNextPercentile, convertWhTokWh } = require('../helpers')

test('calculate mean', () => {
    expect(calcMean([3,2,1])).toStrictEqual(3)
})

test('convert Wh to kWh', () => {
    expect(convertWhTokWh(1000)).toStrictEqual(1)
})

test('sorts array of numbers ascending', () => {
    expect(sortArray([3, 2, 1])).toStrictEqual([1, 2, 3])
})

test('get key from object by value', () => {
    expect(getKeyByValue({ "first": "1", "second": "2" }, 1).toStrictEqual("second"))
})

test.each([['pc50', 'pc55'], ['pc100', 'pc100']])('create next percentile key', (input, expected) => {
    expect(getNextPercentile(input).toStrictEqual(expected))
})

