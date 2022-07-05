const handleValidation = ({
  errorArray = [],
  dataSource = [],
  defaultErrorMessage = '',
}) => {
  let isPass = true
  const errorValidation = {}
  const defaultMessage = defaultErrorMessage ? { msg: defaultErrorMessage } : ''

  // 接受 condition 為 [ condition1, condition2]
  const handleValidateItem = (errorItem) => {
    if (errorItem.condition.every((error) => error !== false)) {
      return false
    }
    return true
  }

  const setNestedErrorMessage = (
    tempErrorObject,
    currentIndex,
    errorFormat,
    errorResult,
  ) => {
    const format = errorFormat.shift()
    const targetIndex = format === 'index' ? currentIndex : format
    if (errorFormat.length === 0) {
      tempErrorObject[targetIndex] = errorResult
      return
    }
    tempErrorObject[targetIndex] = {}
    setNestedErrorMessage(
      tempErrorObject[targetIndex],
      currentIndex,
      errorFormat,
      errorResult,
    )
  }

  errorArray.forEach((item) => {
    if (!Array.isArray(item?.condition) && !item?.customCondition) {
      return console.error(
        `Invalid type \`${typeof !item?.condition}"\` supplied to parameter "condition", expected \`array\`;
          type \`${typeof !item?.customCondition}"\` supplied to parameter "customCondition", expected \`function\
        `,
      )
    }

    if (typeof item?.index !== 'string') {
      // eslint-disable-next-line no-console
      return console.error(
        `Invalid type \`${typeof item?.index}"\` supplied to parameter "index", expected \`string\`!`,
      )
    }

    // 有傳customValidate的情況
    if (item?.customCondition) {
      errorValidation[item.index] = []
      const conditionReturnArray = []

      // conditionReturnArray ex. [true, true, false, false, true]
      item.customCondition(dataSource, conditionReturnArray)
      if (!Array.isArray(conditionReturnArray)) {
        // eslint-disable-next-line no-console
        return console.error(
          `Invalid type \`${typeof conditionReturnArray}"\` return from parameter "customValidation", expected \`array\`!`,
        )
      }
      if (conditionReturnArray.length) {
        const multiple = conditionReturnArray.length > 1
        let returnObject = multiple ? [] : null
        // 輸出errorValidation  錯誤的值用error message 正確的值設定為null      ex. [{msg: Message},  null, {msg: Message}]
        conditionReturnArray.forEach((result, index) => {
          let value = true
          if (!result) {
            value = false
            isPass = false
          }

          const tempErrorObject = {}
          let targetTempErrorObject

          const errorResult = value
            ? null
            : item?.errorMessage
              ? { msg: item?.errorMessage }
              : defaultMessage

          if (item?.errorFormat && errorResult) {
            const tempErrorFormat = item?.errorFormat.slice()
            setNestedErrorMessage(
              tempErrorObject,
              index,
              tempErrorFormat,
              errorResult,
            )
            targetTempErrorObject = Object.keys(tempErrorObject).length === 0
              ? null
              : tempErrorObject

            if (multiple) {
              returnObject.push(targetTempErrorObject)
            } else {
              returnObject = targetTempErrorObject
            }
          } else if (multiple) {
            returnObject.push(errorResult)
          } else {
            returnObject = errorResult
          }
        })
        errorValidation[item.index] = returnObject
        //    errorValidation[item.index][index] = errorResult;
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
