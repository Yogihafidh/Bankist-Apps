'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// DISPLAY SECTION
function displayMovements(movements, sort = false) {
  containerMovements.innerHTML = ''; // Menghapus element awal

  // Mengatur short
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  // Menampilkan movement ke dalam UI
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html); // Menambah element html ke DOM
  });
}

function displayBalance(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
}

function displaySummary(acc) {
  const deposit = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${deposit}€`;

  const withdrawal = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(withdrawal)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interest) / 100)
    .filter((mov, i, arr) => {
      // console.log(arr);
      return mov >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
}

// UPDATE UI
function updateUI(acc) {
  // Display Movement
  displayMovements(acc.movements);
  // Display Balance
  displayBalance(acc);
  // Display Summary
  displaySummary(acc);
}

// CREATE SECTION
function createrUsernames(accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}
createrUsernames(accounts);

// Eventlistener

// Button Login
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  // 1. Menemukan objek
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  // 2. Memeriksa pin untuk mengunci pengguna
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // 3. Display UI and Massage
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // 4. Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }

  // 5. Update UI
  updateUI(currentAccount);
});

// Button Transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  // 1. Menangkap akun yang akan dikirm dan nilai yang akan dikirim
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // 2. Clear input fields
  inputTransferTo.value = inputTransferAmount.value = '';

  // 3. Melakukan Transfer dan pengujian logika
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
  }

  // 5. Update UI
  updateUI(currentAccount);
});
console.log(account1);

// Button loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  // 1. Menangkap nilai dari inputan
  const amount = inputLoanAmount.value;

  // 2. Pengecekan kondisi
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // 3. Menambahkan ke movement
    currentAccount.movements.push(amount);

    // 4. Update UI
    updateUI(currentAccount);

    // 5. Clear input fields
    inputLoanAmount.value = '';
  }
});

// Button Delete Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // 1. Pengecekan Logika
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // 2. Mencari index account yang akan dihapus
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // 3. Menghapus account
    accounts.splice(index, 1);
  }

  // 4. Hide UI
  containerApp.style.opacity = 0;

  // 5. Clear input fields
  inputCloseUsername.value = inputClosePin.value = '';
});

// Button Short
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

/* 1. Looping array yang berisi objek dengan melakukan oprasi perhitungan 
di setiap  iterasinya lalu menambahkannya ke objek sebagai properti baru 
tanpa membuat array baru atau memberikan efek */
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

/* 2. Menemukan obejek dengan mencari nama di dalam properti objek
itu sendiri lalu menentukan kondisinya  */
const sarahDogs = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(sarahDogs);
console.log(
  `Sarah dogs is eating too ${
    sarahDogs.curFood < sarahDogs.recFood ? 'much' : 'litle'
  }`
);

/* 3. Membuat array baru dengan syarat atau kondisi yang sudah ditentukan
lalu menjadikannya satu array dan mengubahnya menjadi string*/
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners)
  .join(' and ');
console.log(`${ownersEatTooMuch} dogs eat too much!`);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners)
  .join(' and ');
console.log(`${ownersEatTooLittle} dogs eat too little!`);

/* 5. Mengecek apakah ada nilai yang sama persis*/
const anyFood = dogs.some(dog => dog.curFood === dog.recFood);
console.log(anyFood);

/* 6. Mengembalikan true atau false jika ada nilai yang memenuhi 
kondisi tertentu yang sudah ditentukan*/
const chackEatingOkay = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

console.log(dogs.some(chackEatingOkay));
/* 7. Menyaring objek yang memenuhi kondisi yang sudah ditentukan*/
console.log(dogs.filter(chackEatingOkay));

/* 8. Membuat salainan array lalu Mengurutkan objek berdasarkan 
properti yang ada didalamnya */
console.log(dogs.slice().sort((a, b) => a.recFood - b.recFood));
