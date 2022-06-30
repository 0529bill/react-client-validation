import PropTypes from 'prop-types';

/**
 *
 * @param {array} errorArray
 *      @param {string} index    驗證的Id/key
 *      @param {array} condition 驗證的條件式 可以為單一array或是多個array ex.[ condition1, condition2 ] or [condition1]
 *      @param {func} customCondition
 *        @returns [true, false, ... ] 應回傳 array  回傳格式必須為 ex. [true, false, true, false, false ...]
 *      @param {string} errorMessage 不符合驗證後回傳的 i18n內容
 *
 * @param {*} dataSource 用在有 customValidate時做自定義驗證
 * @param {*} defaultErrorMessage
 */

const handleValidation = ({
  errorArray = [],
  dataSource = [],
  defaultErrorMessage = '',
}) => {
  let isPass = true;
  let errorValidation = {};
  let defaultMessage = defaultErrorMessage ? { msg: defaultErrorMessage } : '';

  //接受 condition 為 [ condition1, condition2]
  const handleValidateItem = (errorItem) => {
    if (errorItem.condition.every((error) => error !== false)) {
      return false;
    }
    return true;
  };

  errorArray.forEach((item) => {
    if (!Array.isArray(item?.condition) && !item?.customCondition) {
      // eslint-disable-next-line no-console
      return console.error('condition must be an array!');
    }

    if (typeof item?.index !== 'string') {
      // eslint-disable-next-line no-console
      return console.error('index must be string!');
    }

    // 有傳customValidate的情況
    if (item?.customCondition) {
      errorValidation[item.index] = [];

      //validatedResult ex. [true, true, false, false, true]
      const validatedResult = item.customCondition(dataSource);

      if (!Array.isArray(validatedResult)) {
        // eslint-disable-next-line no-console
        return console.error('customCondition must be an array!');
      }
      if (validatedResult.length) {
        //輸出errorValidation  錯誤的值用error message 正確的值設定為null      ex. [{msg: Message},  null, {msg: Message}]
        validatedResult.forEach((result, index) => {
          let value = true;
          if (!result) {
            value = false;
            isPass = false;
          }

          const errorResult = value
            ? null
            : item?.errorMessage
            ? { msg: item?.errorMessage }
            : defaultMessage;
          errorValidation[item.index][index] = errorResult;
        });
      }
      return;
    } else {
      const isValidated = handleValidateItem(item);
      if (!isValidated) {
        errorValidation[item.index] = item?.errorMessage
          ? { msg: item?.errorMessage }
          : defaultMessage;
        isPass = false;
      }
    }
  });
  return [isPass, errorValidation];
};

handleValidation.propTypes = {
  errorArray: PropTypes.array.isRequired,
  dataSource: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.number,
    PropTypes.object,
  ]),
  defaultErrorMessage: PropTypes.string,
};

export default handleValidation;
