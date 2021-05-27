export const calcMean = (arr: number[], size?: number) => {
    let total: number = 0;
    arr.forEach(num => {
        total += num;
    })
    if(size){
        return total / size
    }
    return total / arr.length
}

export const convertWhTokWh = (value: number) => {
    return Math.round(value / 1000 * 100) / 100
}

export const sortArray = (arr: number[]) => {
    return arr.sort((a, b) => a > b ? 1 : a < b ? -1 : 0)
}

export const getKeyByValue = (object: {}, value: any) => {
    return Object.keys(object).find(key => object[key] === value);
}

export const getNextPercentile: (v: string) => string = (value: string) => {
    if (value === 'pc100') {
        return value
    }
    const temp: string = value.substring(2)
    const num: number = parseFloat(temp)
    const newNum: number = num + 5
    const newPC: string = `pc${newNum}`
    return newPC
}

export const calcPercentage: (p: number, w: number) => string = (part: number, whole: number) => {
    const percentage: number = part / whole * 100
    const rounded: number = Math.round(percentage * 100) / 100
    if(rounded.toString().includes('.')){
        return `${rounded}%`
    } else {
        return `${Math.round(percentage)}%`
    }
}