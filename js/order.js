'use strict';

import { getTotal, setTotal } from './helpers.js';

// Availble options for various pizzas.
(function () {
  getTotal();

  // Starting Order
  const order = {
    dough: '',
    size: '',
    cheese: 0,
    sauce: '',
    toppings: 0,
    total: 0,
  };

    // Pizza Options
  const pizzas = {
    handTossed: {
      sizes: ['Small', 'Medium', 'Large'],
      prices: [9.99, 12.99, 14.99],
    },
    thinCrust: {
      sizes: ['Medium', 'Large'],
      prices: [11.99, 13.99],
    },
    newYorkStyle: {
      sizes: ['Large', 'Extra Large'],
      prices: [16.99, 19.99],
    },
    glutenFree: {
      sizes: ['Small'],
      prices: [10.99],
    },
  };

  const radioButtons = document.querySelectorAll('div input.radio');

  hasDough();
  hasSize();

  // Stores pricing information in local storage
  (function () {
    if (localStorage.getItem('dough')) {
      radioButtons.forEach((dough) => {
        if (dough.id === localStorage.getItem('dough')) {
          dough.checked = true;
          order.dough = localStorage.getItem('dough');
          order.cheese = localStorage.getItem('cheese') || 'Normal';
          order.size =
            localStorage.getItem('size') || pizzas[dough.id].sizes[0];
          order.sauce = localStorage.getItem('sauce') || 0;
          setText('sizeDropdownMenuButton', order.size);
          setText('cheeseDropdownMenuButton', order.cheese);
          setText('sauceDropdownMenuButton', order.sauce || 'Regular Tomato');
          getValues();
          hasDough();
          hasSize();
          resetSizes(order.dough);
          showPizzaSizes(pizzas[dough.id]);
          calculateSizes();
        }
      });
    }
  })();

  function setText(id, value) {
    document.getElementById(`${id}`).textContent = value;
  }

  // Cheese & Sauce costs
  function getValues() {
    getCheeseValue();
    getSauceValue();
  }
  
  // Cheese costs
  function getCheeseValue() {
    switch (order.cheese) {
      case 'Extra':
        order.cheese = 2.99;
        break;
      case 'Double':
        order.cheese = 3.99;
        break;
      default:
        order.cheese = 0;
        break;
    }
  }

  // Sause costs
  function getSauceValue() {
    switch (order.sauce) {
      case 'Hearty Tomato':
        order.sauce = 0.99;
        break;
      case 'BBQ Sauce':
        order.sauce = 1.99;
        break;
      default:
        order.sauce = 0;
        break;
    }
  }

  // Pizza sizes
  function showPizzaSizes(pizza) {
    for (let i = 0; i < pizza.sizes.length; i++) {
      let item = document.createElement('a');
      let size = pizza.sizes[i];
      item.className = 'dropdown-item';
      item.innerText = size;
      item.value = size.toLowerCase();
      document.getElementById('pizzaSizes').append(item);
    }
  }

  // Dough pricing updates
  function resetSizes(dough) {
    const sizeOptions = document.querySelectorAll('div#pizzaSizes a');
    if (sizeOptions) {
      sizeOptions.forEach((dough) => {
        if (dough) {
          dough.remove();
        }
      });
      hasSize();
      document.getElementById('sizeDropdownMenuButton').textContent =
        pizzas[dough].sizes[0];
      getTotal();
    }
  }

  // calculates total based on pizza and toppings
  function calculateTotal(
    cheese = 0,
    sauce = 0,
    toppings = order.toppings || 0
  ) {
    let dough = order.dough;
    let priceIndex = pizzas[dough].sizes.indexOf(order.size);
    console.log(cheese, sauce, toppings);

    toppings = toppings * 0.99;
    order.total = Number(
      pizzas[dough].prices[priceIndex] + cheese + sauce + toppings
    ).toFixed(2);
    setTotal(Number(order.total));
  }

  // updates stored DOUGH selection
  radioButtons.forEach((dough) => {
    dough.addEventListener('change', (e) => {
      const choice = e.target.value;
      order.dough = choice;
      order.size = pizzas[choice].sizes[0];

      order.sauce < 1
        ? (document.getElementById('sauceDropdownMenuButton').textContent =
            'Regular Tomato')
        : (document.getElementById('sauceDropdownMenuButton').textContent =
            pizzas[choice].prices[order.sauce]);
      resetSizes(choice);

      calculateTotal(order.cheese, order.sauce, order.toppings);
      showPizzaSizes(pizzas[choice]);
      localStorage.setItem('dough', choice);
      hasDough();
      calculateSizes();
    });
  });

  // Displays DOUGH options 
  function hasDough(optional = false) {
    const size = document.getElementById('sizeDropdownMenuButton');

    if (order.dough === '' || optional === true) {
      size.disabled = true;
    } else {
      size.disabled = false;
    }
  }

  // Diplays Cheese / Sauce / Toppings once pizz size is selected
  function hasSize() {
    const cheese = document.getElementById('cheeseDropdownMenuButton');
    const sauce = document.getElementById('sauceDropdownMenuButton');
    const toppings = document.querySelectorAll('div#toppings input');

    if (order.size === '') {
      cheese.disabled = true;
      sauce.disabled = true;
      toppings.forEach((topping) => {
        topping.disabled = true;
      });
    } else {
      cheese.disabled = false;
      sauce.disabled = false;
      toppings.forEach((topping) => {
        topping.disabled = false;
      });
    }
  }

  // Updates pricing with Pizza sizes
  function calculateSizes() {
    document.querySelectorAll('div#pizzaSizes a').forEach((size) => {
      size.addEventListener('click', (e) => {
        order.size = e.target.textContent;
        localStorage.setItem('size', order.size);
        document.getElementById('sizeDropdownMenuButton').textContent =
          e.target.textContent;
        calculateTotal(order.cheese, order.sauce, order.toppings);
        hasSize();
      });
    });
  }

  // Event Listener to update pricing with topping selections
  document.addEventListener('click', (event) => {
    if (event.target.matches('div#cheese a')) {
      const cheese = event.target.textContent;
      if (cheese === 'Normal' || cheese === 'Light') {
        order.cheese = 0;
        calculateTotal(0, order.sauce, order.toppings);
      } else if (cheese === 'Extra') {
        order.cheese = 2.99;
        calculateTotal(2.99, order.sauce, order.toppings);
      } else if (cheese === 'Double') {
        order.cheese = 3.99;
        calculateTotal(3.99, order.sauce, order.toppings);
      }

      localStorage.setItem('cheese', cheese);
      document.getElementById('cheeseDropdownMenuButton').textContent = cheese;
    }

    if (event.target.matches('div#sauce a')) {
      console.log('sauce');
      let sauce = event.target.textContent;

      if (sauce === 'Regular Tomato') {
        order.sauce = 0;
        calculateTotal(order.cheese, 0, 0);
      } else if (sauce === 'Hearty Tomato') {
        order.sauce = 0.99;
        calculateTotal(order.cheese, 0.99, 0);
      } else if (sauce === 'BBQ Sauce') {
        order.sauce = 1.99;
        calculateTotal(order.cheese, 1.99, 0);
      }

      localStorage.setItem('sauce', sauce);
      document.getElementById('sauceDropdownMenuButton').textContent = sauce;
    }

    if (event.target.matches('div#toppings input')) {
      console.log('toppings');
      if (event.target.checked) {
        document.getElementById(event.target.id).checked = true;
        order.toppings++;
      } else {
        document.getElementById(event.target.id).checked = false;
        order.toppings--;
      }

      localStorage.setItem('toppings', order.toppings);
      if (typeof order.sauce === 'string') order.sauce = 0;

      calculateTotal(order.cheese, order.sauce, +order.toppings);
    }
  });
})();
