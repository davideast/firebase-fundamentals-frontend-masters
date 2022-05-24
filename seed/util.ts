export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function convertMockarooData<T = any>(array: any[], mapCallback: (value: T) => T) {
  return Object.entries(array).map(arr => arr[1]).flat().map(value => {
    return mapCallback(value as T);
  })
}
