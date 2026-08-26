const exprDisplay = document.getElementById("expr-value");
const resultDisplay = document.getElementById("result-value");
const calcGrid = document.querySelector(".calc-grid");

let expr = [];
let currentValue = "";
let answer = null;
let justSolved = false;
let error = false;

const operators = ["+", "-", "×", "÷"];

function render() {
  exprDisplay.textContent = expr.join(" ");
  resultDisplay.textContent = currentValue || "0";
}

function tooBig(value) {
  return value.replace(/[-.]/g, "").length > 15;
}

function calculate(tokens) {
  let numbers = [];
  let ops = [];

  numbers.push(parseFloat(tokens[0]));

  for (let i = 1; i < tokens.length; i += 2) {
    ops.push(tokens[i]);
    numbers.push(parseFloat(tokens[i + 1]));
  }

  for (let i = 0; i < ops.length;) {
    if (ops[i] === "×" || ops[i] === "÷") {
      const result =
        ops[i] === "×"
          ? numbers[i] * numbers[i + 1]
          : numbers[i] / numbers[i + 1];

      numbers.splice(i, 2, result);
      ops.splice(i, 1);
    } else {
      i++;
    }
  }

  let result = numbers[0];

  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === "+") {
      result += numbers[i + 1];
    } else if (ops[i] === "-") {
      result -= numbers[i + 1];
    }
  }

  return result;
}

calcGrid.addEventListener("click", function (e) {
  if (!e.target.classList.contains("calc-btn")) return;

  const value = e.target.dataset.value || e.target.textContent;

  if (error && value !== "AC") return;

  if (value === "AC") {
    expr = [];
    currentValue = "";
    answer = null;
    justSolved = false;
    error = false;
    render();
    return;
  }

  if (!isNaN(parseFloat(value))) {
    if (justSolved) {
      expr = [];
      currentValue = "";
      justSolved = false;
    }

    if (tooBig(currentValue + value)) {
      currentValue = "Too big";
      error = true;
      render();
      return;
    }

    currentValue += value;
    render();
    return;
  }

  if (value === ".") {
    if (justSolved) {
      expr = [];
      currentValue = "0.";
      justSolved = false;
    } else if (currentValue === "") {
      currentValue = "0.";
    } else if (!currentValue.includes(".")) {
      currentValue += ".";
    }

    render();
    return;
  }

  if (value === "%") {
    if (!currentValue || currentValue === "-") return;

    currentValue = String(parseFloat(currentValue) / 100);

    if (tooBig(currentValue)) {
      currentValue = "Too big";
      error = true;
    }

    render();
    return;
  }

  if (operators.includes(value)) {
    if (currentValue === "-") return;

    if (justSolved) {
      expr = [currentValue, value];
      currentValue = "";
      justSolved = false;
    } else if (currentValue === "") {
      if (expr.length > 0) {
        expr[expr.length - 1] = value;
      } else if (value === "-") {
        currentValue = "-";
      }
    } else {
      expr.push(currentValue, value);
      currentValue = "";
    }

    render();
    return;
  }

  if (value === "solve") {
    if (!currentValue || currentValue === "-") return;

    const fullExpr = [...expr, currentValue];

    answer = calculate(fullExpr);

    if (!Number.isFinite(answer)) {
      currentValue = "Too big";
      error = true;
      render();
      return;
    }

    answer = Number(answer.toFixed(5));

    if (tooBig(String(answer))) {
      currentValue = "Too big";
      error = true;
      render();
      return;
    }

    expr = fullExpr;
    currentValue = String(answer);
    justSolved = true;

    render();
    return;
  }
});