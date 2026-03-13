'use strict';

const display = document.getElementById('display');
const buttons = document.querySelectorAll('.calc-btn');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

function updateDisplay(value) {
  display.textContent = value;
}

function handleNumber(value) {
  if (shouldResetDisplay) {
    currentInput = value;
    shouldResetDisplay = false;
  } else {
    currentInput =
      currentInput === '0' ? value : currentInput + value;
  }
  updateDisplay(currentInput);
}

function handleDecimal() {
  if (shouldResetDisplay) {
    currentInput = '0.';
    shouldResetDisplay = false;
    updateDisplay(currentInput);
    return;
  }
  if (!currentInput.includes('.')) {
    currentInput += '.';
    updateDisplay(currentInput);
  }
}

function handleOperator(op) {
  if (operator && !shouldResetDisplay) {
    calculate();
  }
  previousInput = currentInput;
  operator = op;
  shouldResetDisplay = true;
}

function calculate() {
  if (!operator || previousInput === '') return;

  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);
  let result;

  switch (operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      if (current === 0) {
        currentInput = 'Error';
        updateDisplay(currentInput);
        operator = null;
        previousInput = '';
        shouldResetDisplay = true;
        return;
      }
      result = prev / current;
      break;
    default:
      return;
  }

  currentInput = parseFloat(result.toFixed(10)).toString();
  updateDisplay(currentInput);
  operator = null;
  previousInput = '';
  shouldResetDisplay = true;
}

function handleClear() {
  currentInput = '0';
  previousInput = '';
  operator = null;
  shouldResetDisplay = false;
  updateDisplay('0');
}

function handleToggleSign() {
  if (currentInput === '0' || currentInput === 'Error') return;
  currentInput = (parseFloat(currentInput) * -1).toString();
  updateDisplay(currentInput);
}

function handlePercent() {
  if (currentInput === 'Error') return;
  currentInput = (parseFloat(currentInput) / 100).toString();
  updateDisplay(currentInput);
}

function handleBackspace() {
  if (shouldResetDisplay || currentInput === 'Error') {
    handleClear();
    return;
  }
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = '0';
  }
  updateDisplay(currentInput);
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    switch (action) {
      case 'number':
        handleNumber(value);
        break;
      case 'decimal':
        handleDecimal();
        break;
      case 'operator':
        handleOperator(value);
        break;
      case 'equals':
        calculate();
        break;
      case 'clear':
        handleClear();
        break;
      case 'toggle-sign':
        handleToggleSign();
        break;
      case 'percent':
        handlePercent();
        break;
      case 'backspace':
        handleBackspace();
        break;
    }
  });
});

document.addEventListener('keydown', event => {
  const key = event.key;
  if (key >= '0' && key <= '9') handleNumber(key);
  else if (key === '.') handleDecimal();
  else if (key === '+') handleOperator('+');
  else if (key === '-') handleOperator('-');
  else if (key === '*') handleOperator('*');
  else if (key === '/') {
    event.preventDefault();
    handleOperator('/');
  } else if (key === 'Enter' || key === '=') calculate();
  else if (key === 'Escape') handleClear();
  else if (key === 'Backspace') handleBackspace();
  else if (key === '%') handlePercent();
});
