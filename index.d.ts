export interface ErrorObject {
  index: string
  condition: (string | number | boolean | undefined | null)[]
  errorMessage?: string
  customCondition?: (dataSource: unknown, conditionReturnArray: boolean[]) => boolean[]
  errorFormat?: string[]
}
export declare type ErrorResult = {
  msg: string
}
export declare type ErrorValidation = {
  [key: string | number]: ErrorResult | '' | string | null | (string | ErrorResult | null)[]
}
export declare const handleValidation: ({
  errorArray,
  dataSource,
  defaultErrorMessage,
}: {
  errorArray: ErrorObject[]
  dataSource?: unknown
  defaultErrorMessage?: string | undefined
}) => (boolean | ErrorValidation)[]
export default handleValidation
