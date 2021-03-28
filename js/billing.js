'use strict';
import { getTotal, submitForm } from './helpers.js';

// Starting Variables
(function () {
  getTotal();

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const years = ['2021', '2022', '2023', '2024', '2025', '2026'];

  const cvc = document.getElementById('cvc');
  const yearInput = document.getElementById('yearDropdownMenuButton');
  const monthInput = document.getElementById('monthDropdownMenuButton');
  let err;

  monthInput.required = true;
  yearInput.required = true;
  cvc.required = true;
  cvc.maxLength = 4;

  // Address Check
  document.querySelectorAll('input').forEach((field) => {
    if (field.id !== 'inputAddress2' && field.id !== 'addressCheck') {
      field.required = true;
    }
  });

  // stores credit card number
  document.addEventListener('keyup', (event) => {
    if (event.target.matches('input#creditCard')) {
      let value = document.getElementById('creditCard').value;
      displayCardType(value);
    }
  });

  // event listenters for order submission
  document.addEventListener('click', (event) => {
    const target = event.target;

    if (target.matches('#completePayment')) {
      localStorage.clear();
      window.location.href = 'index.html';
    }

    if (target.matches('#submitBtn')) {
      event.preventDefault();
      submit();
    }

    if (target.matches('#addressCheck')) {
      const details = JSON.parse(localStorage.getItem('details'));

      for (let key in details) {
        let field = document.getElementById(key);
        field.value = details[key];
        field.disabled = true;
      }

      if (document.getElementById('addressCheck').checked === false) {
        for (let key in details) {
          let field = document.getElementById(key);
          field.value = '';
          field.disabled = false;
        }
      }
    }

    if (target.matches('.months .dropdown-item')) {
      monthInput.textContent = months[months.indexOf(target.textContent)];
    }

    if (target.matches('.years .dropdown-item')) {
      yearInput.textContent = years[years.indexOf(target.textContent)];
    }
  });

  // shows type of card being used
  function displayCardType(e) {
    document.getElementById('creditCard').maxLength = 16;
    const field = document.getElementById('displayCard');
    let card = '';

    if (field.textContent === '') field.textContent = '';

    if (e.match(/\D/g)) {
      field.textContent = 'Valid cards should only contain numbers.';
      console.log('Error');
      err = true;
      return false;
    }

    if (e.startsWith(4)) {
      field.textContent = 'Visa';
      card = 'Visa';
    } else if (e.match(/^5[1-5]{1}/g)) {
      field.textContent = 'MasterCard';
      card = 'MasterCard';
    } else if (e.startsWith(37)) {
      document.getElementById('creditCard').maxLength = 15;
      field.textContent = 'American Express';
      card = 'American Express';
    } else {
      err = true;
      field.textContent = 'Invalid card.';
    }

    err = false;
  }

  // CVC validation
  function validateCVC(err) {
    if (cvc.value.match(/\D/)) {
      window.alert('Invalid CVC Code. Only numbers are allowed.');
      return (err = true);
    } else if (cvc.value === '') {
      window.alert('CVC Code is empty, please fill it out.');
      return (err = true);
    } else if (cvc.value.length < 3) {
      window.alert('Invalid CVC Code. CVC Codes must contain 3 digits.');
      return (err = true);
    } else {
      return err = false;
    }
  }

  // CC expiration validation
  function validateExpiration(err) {
    console.log(
      months.indexOf(monthInput.textContent),
      months.indexOf(monthInput.value)
    );
      console.log(monthInput);
    if (months.indexOf(monthInput.textContent) <= 1) {
      window.alert('Card has expired');
      return (err = true);
    }

    return err = false;
  }

  // CC number validation
  function validateCreditCard(err) {
    let card = document.getElementById('creditCard').value;

    if (card.length <= 13) {
      window.alert("Invalid Credit Card Number.");
      return err = true;
    }

    return err = false;
  }

  // submission checks before order is complete
  function submit() {
    let err = false;
    err = err || submitForm(err);
    err = err || validateCreditCard(err);
    err = err || validateCVC(err);
    err = err || validateExpiration(err);
    
    console.log(err);
    if (err === false) {
      success();
      document.getElementById('formModal').style.display = 'block';
    }
  }

  // submits order once all information is accepted
  function success() {
    const modalBody = document.getElementById('successMessage');
    modalBody.textContent = `Your payment of $${localStorage.getItem(
      'total'
    )} has been accepted. Pizza is on the way!`;
  }
})();
