var valid = require('card-validator');

var numberValidation = valid.number('5234 2134 3399 3181');

if (!numberValidation.isPotentiallyValid) {
  renderInvalidCardNumber();
}

if (numberValidation.card) {
  console.log(numberValidation.card); // 'visa'
}