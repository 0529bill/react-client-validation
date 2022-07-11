# React-Client-Validation

[![npm version](https://badge.fury.io/js/react-client-validation.svg)](https://badge.fury.io/js/react-client-validation)

## Installation

```js
npm i react-client-validation
```

## Working example

[Codesandbox](https://codesandbox.io/s/react-client-validarion-example-zo1gr3?file=/src/App.js)

## Quick start

```js
import handleValidation from 'react-client-validation'

const loginValidation = [
  {
    index: 'username',
    condition: [!username],
    errorMessage: 'User name is not valid!',
  },
  {
    index: 'password',
    //change errorObject's format
    errorFormat: ['invalidPassword'],
    customCondition: (data, errorReturnArray) => {
      if (data.password) {
        errorReturnArray.push(false)
      }
    },
  },
]

const [isPass, loginErrorObject] = handleValidation({
  errorArray: loginValidation,
  defaultErrorMessage: "input can't be blank",
})
```

```js
console.log(isPass); // boolean, true or false
console.log(loginErrorObject);

{
    username: {msg: 'User name is not valid!'},
    password: [ invalidPassword: {msg: "input can't be blank"}]
    //password's value is formatted based on errorFormat from the errorArray
}
```

## Basic Props

1. defaultMessage: string: if errorMessage is not found for the index, then defaultMessage will be applied to its return error message.

2. dataSource: any (is isRequired if using customCondition)

3. errorArray: Array (isRequired)
   - condition: Array (pick one between condition or customCondition)
   - customCondition: Function (pick one between condition or customCondition): (dataSource, returnArray) => [true, false....]
   - index: string (isRequired): will be the key for the return error Object.
   - errorMessage: string: will be the value for the return error message.
   - errorFormat: Array (only allowed when using customCondition) set custom format.

## Example

### errorFormat

```js
//errorFormat example
//only allowed when using customCondition



1. without errorFormat

{ ...,
  customCondition: ...,
}
//returned error object

{
    username: {msg:'User name is not valid!'}
}


2. with errorFormat
//scenario 1

{
    ...,
    errorFormat: ['test'],
    customCondition: ...,

}

//returned error object

{
    username: {test:  {msg:'User name is not valid!'} }
}


//scenario 2
// 'index' will return the current index.


{
    ...,
    errorFormat: ['test', 'index'],
    customCondition: ...,

}

//returned error object

{
    username: {test: { 0:  { msg: 'User name is not valid!'} } }
}

```

### customCondition

```js


//customCondition example

/**
when using customCondition,
push boolean to the errorReturnArray from customCondition
push true if the current condition passed, otherwise push false
**/
{...,
customCondition: (data, errorReturnArray) => {
            if (!data.password) {
               errorReturnArray.push(false)
               // validation failed, will get fail message from the return error object
            }
        }
}
```

## Contract Me

[Github](https://github.com/0529bill/react-client-validation)

Email 0529bill@gmail.com

## License

Released under [MIT License](LICENSE.md).
