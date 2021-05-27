const { calcMean, sortArray, getKeyByValue, getNextPercentile, convertWhTokWh } = require('../helpers')

test.each([
    [[3,2,1], 2, null],
    [[3,2,1], 1.5, 4]
])('calculate mean', (v: number[], e:number, s?: number) => {
    if(s !== null){
        expect(calcMean(v, s)).toStrictEqual(e)
    } else {
        expect(calcMean(v)).toStrictEqual(e)
    }
})

test('convert Wh to kWh', () => {
    expect(convertWhTokWh(1000)).toStrictEqual(1)
})

test('sorts array of numbers ascending', () => {
    expect(sortArray([3, 2, 1])).toStrictEqual([1, 2, 3])
})

test('get key from object by value', () => {
    expect(getKeyByValue({ "first": "1", "second": "2" }, "1")).toStrictEqual("first")
})

test.each([
    ['pc50', 'pc55'], 
    ['pc100', 'pc100']
])('create next percentile key', (i: string, e: string) => {
    expect(getNextPercentile(i)).toStrictEqual(e)
})

// To get around ES6 TS problems
export {}
