'use strict';

// starting total
function setTotal(value = 0) {
  localStorage.setItem('total', value);
  document.getElementById('orderTotal').textContent = `Order Total: $ ${value}`;
}

// gets total cost from stored value in local storage
function getTotal() {
  const total = `Order Total: $${Number(localStorage.getItem('total')).toFixed(
    2
  )}`;
  if (!localStorage.getItem('total')) {
    localStorage.setItem('total', 0);
    document.getElementById('orderTotal').textContent = total;
  } else {
    document.getElementById('orderTotal').textContent = total;
  }
}

// Validates address form in check out
function submitForm(err) {
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (!validateName()) {
      return err = true;
    };
    storeValues();
    return err = false;
  });
}

// Saves address in local storage
function storeValues() {
  const details = {};
  document.querySelectorAll('input.address').forEach((detail) => {
    details[detail.id] = detail.value;
  });

  localStorage.setItem('details', JSON.stringify(details));
}

// Validates name field
function validateName() {
  const name = document.forms['addressForm']['name'].value;
  const letters = /([A-Z])\w+/;


  if (name.match(letters)) {
    validateAddress();
    return true;
  } else if (name == '') {
    window.alert('Name must be filled out');
  } else  {
    window.alert('Invalid Name.');
  }

  return false;

}

// validates street address in form field
function validateAddress() {
  const address = document.getElementById('inputAddress');
  if (address == '') {
    window.alert('Address must be filled out');
  } else {
    validateCity();
  }
}

// validates city
function validateCity() {
  const city = document.getElementById('inputCity').value;
  const letters = /([A-Z])\w+/;
  if (city == '') {
    window.alert('City must be filled out');
  } else if (city.match(letters)) {
    validateState();
  } else {
    window.alert('Invalid City.');
  }
}

// validates state
function validateState() {
  const state = document.getElementById('inputState').value;
  const letters = /([A-Z])\w+/;
  if (state == '' || state.length > 2 || state.length < 2) {
    window.alert('Inavlid. State must be two letters, ex: NY');
  } else if (state.match(letters) && state.length === 2) {
    validateZip();
  } else {
    window.alert('Invalid State.');
  }
}

// validates zip
function validateZip() {
  const zip = document.getElementById('inputZip').value;
  if (zip == '') {
    window.alert('Enter Zip.');
  } else if (!isNaN(zip) && zip.length === 5) {
    if (document.getElementById('phoneNumber')) {
      validatePhone();
    }
  } else {
    window.alert('Invalid Zip.');
  }
}

// validates phone #
function validatePhone() {
  const phone = document.getElementById('phoneNumber').value;
  const numbers = /^\d{10}$/;
  if (phone.match(numbers) && phone.length === 10) {
    validateEmail();
  } else {
    window.alert('Invalid Phone Number');
  }
}

// validates email
function validateEmail() {
  const email = document.getElementById('email').value;
  const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.match(emailValidation)) {
    window.location = 'order.html';
  } else {
    window.alert('Invalid Email');
  }
}

// exports values for other JS files to use
export {
  setTotal,
  getTotal,
  validateAddress,
  validateCity,
  validateEmail,
  validateName,
  validatePhone,
  validateState,
  validateZip,
  submitForm,
};
