interface ErrorObject {
  index: string
  condition: boolean[]
  errorMessage?: string
  customCondition?: (dataSource: unknown, conditionReturnArray: boolean[]) => void
  errorFormat?: string[]
}

type errorResult = {
  msg: string
}

type errorValidation = {
  [key: string | number]: errorResult | '' | string | (string | errorResult | null)[]
}

const handleValidation = ({ errorArray = [], dataSource = [], defaultErrorMessage = '' }) => {
  let isPass = true
  const errorValidation: errorValidation = {}
  const defaultMessage = defaultErrorMessage ? { msg: defaultErrorMessage } : ''

  // 接受 condition 為 [ condition1, condition2]
  const handleValidateItem = (errorItem: ErrorObject) => {
    if (errorItem.condition.every((error: boolean) => error !== false)) {
      return false
    }
    return true
  }

  const setNestedErrorMessage = (
    tempErrorObject: Record<number | string, {} | errorResult>,
    currentIndex: number,
    errorFormat: string[],
    errorResult: errorResult
  ) => {
    const format = errorFormat.shift()
    if (!format) return
    const targetIndex = format === 'index' ? currentIndex : format
    if (errorFormat.length === 0) {
      tempErrorObject[targetIndex] = errorResult
      return
    }
    tempErrorObject[targetIndex] = {}
    setNestedErrorMessage(tempErrorObject[targetIndex], currentIndex, errorFormat, errorResult)
  }

  errorArray.forEach((item: ErrorObject) => {
    if (!Array.isArray(item?.condition) && !item?.customCondition) {
      return console.error(
        `Invalid type \`${typeof !item?.condition}"\` supplied to parameter "condition", expected \`array\`;
          type \`${typeof !item?.customCondition}"\` supplied to parameter "customCondition", expected \`function\
        `
      )
    }

    if (typeof item?.index !== 'string') {
      // eslint-disable-next-line no-console
      return console.error(
        `Invalid type \`${typeof item?.index}"\` supplied to parameter "index", expected \`string\`!`
      )
    }

    // 有傳customValidate的情況
    if (item?.customCondition) {
      // errorValidation[item.index] = []
      const conditionReturnArray: boolean[] = []

      // conditionReturnArray ex. [true, true, false, false, true]
      item.customCondition(dataSource, conditionReturnArray)
      if (!Array.isArray(conditionReturnArray)) {
        // eslint-disable-next-line no-console
        return console.error(
          `Invalid type \`${typeof conditionReturnArray}"\` return from parameter "customValidation", expected \`array\`!`
        )
      }
      if (conditionReturnArray.length) {
        const multiple = conditionReturnArray.length > 1
        let returnObject: (null | errorResult | string)[] | string | errorResult | null = multiple
          ? []
          : ''
        // 輸出errorValidation  錯誤的值用error message 正確的值設定為null      ex. [{msg: Message},  null, {msg: Message}]
        conditionReturnArray.forEach((result, index) => {
          let value = true
          if (!result) {
            value = false
            isPass = false
          }

          const tempErrorObject: any = {}
          // let targetTempErrorObject: string[] | null | {} | undefined
          let targetTempErrorObject: errorResult | null

          const errorResult: errorResult | null | '' = value
            ? null
            : item?.errorMessage
            ? { msg: item?.errorMessage }
            : defaultMessage

          if (item?.errorFormat && errorResult) {
            if (!Array.isArray(item?.errorFormat)) {
              // eslint-disable-next-line no-console
              return console.error(
                `Invalid type \`${typeof item?.errorFormat}"\` return from parameter "errorFormat", expected \`array\`!`
              )
            }

            const tempErrorFormat = item?.errorFormat.slice()
            setNestedErrorMessage(tempErrorObject, index, tempErrorFormat, errorResult)
            targetTempErrorObject =
              Object.keys(tempErrorObject).length === 0 ? null : tempErrorObject

            if (multiple && Array.isArray(returnObject)) {
              returnObject.push(targetTempErrorObject)
            } else {
              returnObject = targetTempErrorObject
            }
          } else if (multiple && Array.isArray(returnObject)) {
            returnObject.push(errorResult)
          } else {
            returnObject = errorResult
          }
        })
        errorValidation[item.index] = returnObject
      }
    } else {
      const isValidated = handleValidateItem(item)
      if (!isValidated) {
        errorValidation[item.index] = item?.errorMessage
          ? { msg: item?.errorMessage }
          : defaultMessage
        isPass = false
      }
    }
  })
  return [isPass, errorValidation]
}

export default handleValidation
