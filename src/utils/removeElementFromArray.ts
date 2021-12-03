export function removeElementFromArrayByIndex<T>(arr: T[],i: number) {
  if (i < 0) {
    return arr
  }
  let result = [...arr]
  result.splice(i, 1)
  return result
}

export function removeElementFromArray<T>(arr: T[], target: T) {
  return removeElementFromArrayByIndex(arr, arr.indexOf(target))
}