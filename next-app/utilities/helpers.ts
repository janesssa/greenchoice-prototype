
export const sortArray = (arr:number[]) => {
    return arr.sort((a, b) => a > b ? 1 : a < b ? -1 : 0)
}