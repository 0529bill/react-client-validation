# React-Client-Validation

## Installation

```js
npm i react-client-validation
```

## Quick start

```js
import handleValidation from "react-client-validation";

const loginValidation = [
  {
    index: "username",
    condition: [!username],
    errorMessage: "User name is not valid!",
  },
  {
    index: "password",
    errorFormat: ["invalidPassword"],
    customCondition: (data, errorReturnArray) => {
      if (data.password) {
        errorReturnArray.push(false);
      }
    },
  },
];

const [isPass, loginValidationError] = handleValidation({
  errorArray: loginValidation,
  defaultErrorMessage: "input can't be blank",
});
```

```js
console.log(isPass); // boolean, true or false
console.log(loginValidationError);

{
    username: {msg: 'User name is not valid!'},
    password: [ invalidPassword: {msg: "input can't be blank"}]
}
```

## Basic Props

1. defaultMessage: string: if errorMessage is not found for the index, then defaultMessage will be applied to its return error message.

2. dataSource: any (is isRequired if using customCondition)

3. errorArray: Array (isRequired)

- condition: Array (pick one between condition or customCondition)
- index: string (isRequired): will be the key for the return error Object.
- errorMessage: string: will be the value for the return error message.
- errorFormat: Array (only allowed when using customCondition) set custom format.

```js
//errorFormat example
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

- customCondition: Function (pick one between condition or customCondition): (dataSource, returnArray) => [true, false....]

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
