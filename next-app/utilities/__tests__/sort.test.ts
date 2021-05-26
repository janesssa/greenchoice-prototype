const { sortArray } = require('../helpers')

test('sorts array of numbers ascending', () => {
    expect(sortArray([3,2,1])).toStrictEqual([1,2,3])
})