export function deepSearchObject(data: any, query: Lowercase<string>, visited = new Set) {
  if (!data || visited.has(data)) {
    return null
  }
  visited.add(data)
  let type = typeof data
  if (type === 'number' || type === 'string' || type === 'boolean') {
    return isMatch(data, query) ? data : null
  }
  if (Array.isArray(data)) {
    return data.map(o => deepSearchObject(o, query, visited)).filter(Boolean)
  }
  if (data instanceof Set) {
    let result: any = null
    for (let i of data) {
      if (deepSearchObject(i, query, visited)) {
        result = data
        break
      }
    }
    return result
  }
  if (data instanceof Map) {
    let result: any = null
    for (let i of data) {
      if (isMatch(i[0], query) || deepSearchObject(i[1], query, visited)) {
        result = data
        break
      }
    }
    return result
  }
  // for object
  let keys = Object.getOwnPropertyNames(data)
  let result = keys.reduce((res, key) => {
    let val = data[key]
    if (isMatch(query, key)) {
      res[key] = val
    } else if (Array.isArray(val) || val instanceof Set || val instanceof Map || typeof val === 'object') {
      val = deepSearchObject(val, query, visited)
    } else {
      val = isMatch(query, val) ? val : null
    }
    if (!isEmpty(val)) {
      res[key] = val
    }
    return res
  }, {})
  return isEmpty(result) ? null : result
}

function isMatch(query: Lowercase<string> = '', target: any) {
  return String(target).toLowerCase().indexOf(query.toLocaleLowerCase()) > -1
}

function isEmpty(target: any) {
  if (target === undefined || target === null) {
    return true
  }
  let type = typeof target
  if (Array.isArray(target) || type === 'string') {
    return target.length === 0
  }
  if (typeof target === 'object') {
    return Object.keys(target).length === 0
  }
  return false
}