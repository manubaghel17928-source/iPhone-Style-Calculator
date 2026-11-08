
const currentDisplay = document.getElementById("current");
const previousDisplay = document.getElementById("previous");
const historyList = document.getElementById("history-list");

let currentValue = "0";
let previousValue = null;
let operator = null;
let shouldReset = false;

function updateDisplay() {
    currentDisplay.textContent = currentValue;

    previousDisplay.textContent =
        previousValue !== null && operator
        ? `${previousValue} ${operator}`
        : "";
}

function inputNumber(number) {
    if (currentValue === "Error") clearCalculator();

    if (shouldReset) {
        currentValue = number;
        shouldReset = false;
    } else {
        currentValue = currentValue === "0"
            ? number
            : currentValue + number;
    }

    updateDisplay();
}

function inputDecimal() {
    if (currentValue === "Error") clearCalculator();

    if (shouldReset) {
        currentValue = "0";
        shouldReset = false;
    }

    if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}

function chooseOperator(selectedOperator) {
    if (currentValue === "Error") return;

    if (operator && !shouldReset) {
        calculate();
    }

    previousValue = Number(currentValue);
    operator = selectedOperator;
    shouldReset = true;

    updateDisplay();
}

function calculate() {
    if (operator === null || previousValue === null) return;

    const first = previousValue;
    const second = Number(currentValue);
    let result;

    switch (operator) {
        case "+":
            result = first + second;
            break;

        case "-":
            result = first - second;
            break;

        case "*":
            result = first * second;
            break;

        case "/":
            if (second === 0) {
                currentValue = "Error";
                previousValue = null;
                operator = null;
                shouldReset = true;
                updateDisplay();
                return;
            }
            result = first / second;
            break;
    }

    const expression = `${first} ${operator} ${second}`;

    result = Number(result.toPrecision(12));

    currentValue = String(result);

    addHistory(`${expression} = ${result}`);

    previousValue = null;
    operator = null;
    shouldReset = true;

    updateDisplay();
}

function clearCalculator() {
    currentValue = "0";
    previousValue = null;
    operator = null;
    shouldReset = false;

    updateDisplay();
}

function deleteNumber() {
    if (currentValue === "Error") {
        clearCalculator();
        return;
    }

    if (shouldReset) {
        currentValue = "0";
        shouldReset = false;
    } else {
        currentValue = currentValue.length > 1
            ? currentValue.slice(0, -1)
            : "0";
    }

    updateDisplay();
}

function percentage() {
    if (currentValue === "Error") return;

    currentValue = String(Number(currentValue) / 100);
    shouldReset = true;

    updateDisplay();
}

function changeSign() {
    if (currentValue === "Error") return;

    if (Number(currentValue) !== 0) {
        currentValue = String(-Number(currentValue));
    }

    updateDisplay();
}

function addHistory(item) {
    const li = document.createElement("li");
    li.textContent = item;

    historyList.prepend(li);

    if (historyList.children.length > 5) {
        historyList.lastElementChild.remove();
    }
}

// Button click events
document.querySelector(".buttons").addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.number !== undefined) {
        inputNumber(button.dataset.number);
    }

    if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
    }

    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;

        case "delete":
            deleteNumber();
            break;

        case "decimal":
            inputDecimal();
            break;

        case "percent":
            percentage();
            break;

        case "sign":
            changeSign();
            break;

        case "calculate":
            calculate();
            break;
    }
});

// Keyboard support
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
    } else if (key === ".") {
        inputDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        calculate();
    } else if (key === "Backspace") {
        deleteNumber();
    } else if (key === "Escape") {
        clearCalculator();
    } else if (key === "%") {
        percentage();
    }
});

updateDisplay();
