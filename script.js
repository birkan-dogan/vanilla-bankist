// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4]; // to manipulate data as a json.

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");

const displayMovements = function (movements) {
  movements.forEach(function (mov, index) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
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

  labelBalance.textContent = `${account.balance} €`;
};

calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce(function (acc, currentValue) {
      return acc + currentValue;
    }, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = account.movements
    .filter((mov) => mov < 0)
    .reduce(function (acc, currentValue) {
      return acc + currentValue;
    }, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function (currentAccount) {
  // display movements
  displayMovements(currentAccount.movements);

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
