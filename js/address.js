'use strict';
import { getTotal, submitForm } from './helpers.js';

(function () {
  getTotal();

  // Validates the type of address delivery

  const other = document.getElementById('addressTypeList');
  other.addEventListener('click', (e) => {
    e.preventDefault();
    const otherValue = document.getElementById('addressTypeList').value;
    if (otherValue === 'Other') {
      document.getElementById('hiddenOther').style.display = 'initial';
    } else {
      document.getElementById('hiddenOther').style.display = 'none';
    }
  });
})();

submitForm();
