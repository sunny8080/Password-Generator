const inputSlider = document.querySelector(".slider");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector(".display");
const copyBtn = document.querySelector(".copyBtn");
const copyMsg = document.querySelector("[copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector(".indicator");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const allSymbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// initial value
let password = "";
let passwordLength = 10;
let checkCount = 1;
handleSlider();
setIndicator("#ccc"); // initial gray color

// set passwordLength
function handleSlider() {
    console.log("sad");
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // set color of slider
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) / (max - min)) * 100 + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 12px 5px ${color}`;
}

const getRandInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const getRandDigit = () => getRandInt(0, 9);
const getRandLowerCase = () => String.fromCharCode(getRandInt(97, 123));
const getRandUpperCase = () => String.fromCharCode(getRandInt(65, 91));
const getRandSymbol = () => allSymbols.charAt(getRandInt(0, allSymbols.length));

function calStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });

    // special condition
    if (checkCount > passwordLength) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) copyContent();
});

function shufflePassword(pass) {
    // using fisher yates method
    let arr = Array.from(pass);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(getRandInt(0, i + 1));
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    let str = "";
    arr.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener("click", () => {
    if (checkCount == 0) return;
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";
    let funArr = [];
    if (uppercaseCheck.checked) funArr.push(getRandUpperCase);
    if (lowercaseCheck.checked) funArr.push(getRandLowerCase);
    if (numbersCheck.checked) funArr.push(getRandDigit);
    if (symbolsCheck.checked) funArr.push(getRandSymbol);

    // password contains atleast 1 char of every type
    for (let i = 0; i < funArr.length; i++) password += funArr[i]();

    for (let i = funArr.length; i < passwordLength; i++) {
        let j = getRandInt(0, funArr.length);
        password += funArr[j]();
    }
    password = shufflePassword(password);

    passwordDisplay.value = password;
    calStrength();
});
