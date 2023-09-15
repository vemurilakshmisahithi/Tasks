const display = document.getElementById('display');
let currentValue = ''; 

function appendToDisplay(value) {
    currentValue += value; 
    display.value = currentValue; 
}

function calculate() {
    try {
        const result = eval(currentValue);
        display.value = result;
        currentValue = result.toString(); 
    } catch (error) {
        display.value = 'Error';
    }
}

function clearDisplay() {
    display.value = '';
    currentValue = ''; 
}

function backspace() {
    if (currentValue.length > 0) {
        currentValue = currentValue.slice(0, -1); 
        display.value = currentValue; 
    }
}

function calculatePowerOfTwo() {
    try {
        const result = Math.pow(parseFloat(currentValue), 2);
        if (!isNaN(result)) {
            display.value = result;
            currentValue = result.toString(); 
        } else {
            display.value = 'Error';
        }
    } catch (error) {
        display.value = 'Error';
    }
}

function calculateReciprocal() {
    const parsedValue = parseFloat(currentValue);
    if (parsedValue !== 0) {
        const result = 1 / parsedValue;
        display.value = result;
        currentValue = result.toString(); 
    } else {
        display.value = 'Cannot Divide by Zero';
    }
}
