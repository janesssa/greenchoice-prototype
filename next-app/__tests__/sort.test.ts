import { sortArray } from '../utilities/helpers';

test('sorts array of numbers ascending', () => {
    expect(sortArray([3,2,1])).toBe([1,2,3])
})