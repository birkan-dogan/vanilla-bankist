// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2023-01-01T10:17:24.185Z",
    "2023-01-18T21:31:17.178Z",
    "2023-01-27T17:01:17.194Z",
    "2023-02-11T23:36:17.929Z",
    "2023-02-12T10:51:36.790Z",
    "2023-02-14T14:11:59.604Z",
    "2023-02-15T09:15:04.904Z",
    "2023-02-17T07:42:02.383Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2023-01-01T10:17:24.185Z",
    "2023-01-18T21:31:17.178Z",
    "2023-01-27T17:01:17.194Z",
    "2023-02-11T23:36:17.929Z",
    "2023-02-12T10:51:36.790Z",
    "2023-02-14T14:11:59.604Z",
    "2023-02-15T09:15:04.904Z",
    "2023-02-17T07:42:02.383Z",
  ],
  currency: "USD",
  locale: "en-US",
};

// const account3 = {
//   owner: "Steven Thomas Williams",
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: "Sarah Smith",
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4]; // to manipulate data as a json.
const accounts = [account1, account2];

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");

// displaying dates
const formatMovementDate = function (date) {
  const calcDaysPassed = function (date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };

  const daysPassed = calcDaysPassed(new Date(), date);

  if (!daysPassed) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed < 7) return `${daysPassed} days ago`;

  const dateArr = date.toISOString().split("-");
  return `${dateArr[2].slice(0, 2)}/${dateArr[1]}/${dateArr[0]}`;
};

// display movements
const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? [...account.movements].sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (mov, index) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(account.movementsDates[index]);
    const displayDate = formatMovementDate(date);

    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>
      `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// to create a username for each account like this "Steven Thomas Williams" -> stw

const createUsernames = function (user) {
  const username = user
    .toLowerCase()
    .split(" ")
    .map((name) => name[0])
    .join("");
  return username;
};

// console.log(createUsernames("Steven Thomas Williams"));  // stw

accounts.forEach(function (account) {
  account["username"] = createUsernames(account.owner);
});

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(function (acc, currentValue) {
    return acc + currentValue;
  }, 0);

  labelBalance.textContent = `${account.balance.toFixed(2)} €`;
};

calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce(function (acc, currentValue) {
      return acc + currentValue;
    }, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const outcomes = account.movements
    .filter((mov) => mov < 0)
    .reduce(function (acc, currentValue) {
      return acc + currentValue;
    }, 0);
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const updateUI = function (currentAccount) {
  // display movements
  displayMovements(currentAccount);

  // display balance
  calcDisplayBalance(currentAccount);

  // display summary
  calcDisplaySummary(currentAccount); // taking movements array and interestRate from account
};

// log in process
const btnLogin = document.querySelector(".login__btn");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const labelWelcome = document.querySelector(".welcome");

let currentAccount;
// default user
currentAccount = account1;
updateUI(currentAccount);

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display ui and welcome message
    labelWelcome.textContent = `Welcome ${
      currentAccount.owner.split(" ")[0]
    } 👋`;

    containerApp.style.opacity = 100;

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

// transfer money
const btnTransfer = document.querySelector(".form__btn--transfer");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferTo.value = inputTransferAmount.value = "";
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    currentAccount.username !== receiverAccount?.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // add transfer date
    currentAccount.movementsDates.push(new Date());
    receiverAccount.movementsDates.push(new Date());

    // updating user interface
    updateUI(currentAccount);
  }
});

// close account process
const btnClose = document.querySelector(".form__btn--close");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    inputClosePin.value == currentAccount.pin
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });

    inputCloseUsername.value = inputClosePin.value = "";
    // delete account
    accounts.splice(index, 1);

    // hide ui
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
  }
});

// loan process
const btnLoan = document.querySelector(".form__btn--loan");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");

/*
Loan logic:

if there is at least one deposit with at least 10% of the requested loan amount
*/
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  const condition2 = currentAccount.movements.some(
    (mov) => mov >= amount * 0.1
  );

  if (amount > 0 && condition2) {
    // add movement
    currentAccount.movements.push(amount);

    // add transfer date
    currentAccount.movementsDates.push(new Date());

    // update ui
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

// to sort array ascending order
const btnSort = document.querySelector(".btn--sort");

let sorted = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// working on date
const labelDate = document.querySelector(".date");

// day/month/year
const now = new Date();
const hour = `${now.getHours()}`.padStart(2, 0);
const min = `${now.getMinutes()}`.padStart(2, 0);

const dateArr = now.toISOString().split("-");
labelDate.textContent = `${dateArr[2].slice(0, 2)}/${dateArr[1]}/${
  dateArr[0]
}, ${hour}:${min}`;
