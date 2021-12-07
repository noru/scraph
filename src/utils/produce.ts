export function produce<T = any>(updater: (input: T) => any) {
  return original => {
    let copy = Array.isArray(original) ? [...original] : { ...original }
    return updater(copy) || original
  }
}

export const produceMerge = newVals => produce(prev => {
  if (prev) {
    Object.assign(prev, newVals)
    return
  } else {
    return { ...newVals }
  }
})
