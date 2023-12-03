const groupString = (value: string): Record<string, number>[] => {
  const splittedValue = value.split('')
  const validFlag = ['[', '{']
  const validCloseFlag = [']', '}']
  const validSubFlag = ['-', '+']
  let flag = ''
  let key = 0
  let collection = [] as Record<string, number>[]
  while(key <= value.length-1) {
    const currentChar = splittedValue[key]
    const prevChar = splittedValue[key-1]
    const nextChar = splittedValue[key+1]

    const currentCollection = collection[collection.length - 1]
    const validFlagKey = validFlag.indexOf(flag)

    if (flag) {
      if (currentChar === validCloseFlag[validFlagKey] && prevChar === validSubFlag[validFlagKey]) {
        if (flag === '[' && nextChar === '{') {
          flag = nextChar
        } else {
          flag = ''
        }
      }
      currentCollection.to = key + 1
    } else {
      const validCurrentCharFlagKey = validFlag.indexOf(currentChar)
      if (validCurrentCharFlagKey >= 0) {
        collection.push({ from: key })
        flag = currentChar
      }
    }

    key += 1
  }
  return collection
}

const getSubstring = (text: string, char1: string, char2: string) => {
  return text.slice(
    text.indexOf(char1) + 1,
    text.lastIndexOf(char2),
  );
}

const getSuggestionReplacement = (value: string):Record<string, string> => {
  const toReplace = value.includes('[-') ? getSubstring(value, '[-', '-]').replaceAll('-', '') : ''
  const suggestion = value.includes('{+') ? getSubstring(value, '{+', '+}').replace('+', '') : ''
  return {
    toReplace,
    suggestion,
  }
}

const replaceAtIndex = (value: string, from: number, toReplace: string) => {
  const end = value[from] === ' ' ? from+1 : from
  return value.substring(0,end) + ` <strong>${toReplace}</strong> ` + value.substring(from+toReplace.length+1)
}

export { groupString, getSubstring, getSuggestionReplacement, replaceAtIndex }
