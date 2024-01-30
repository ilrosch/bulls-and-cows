let counter = 0;

const fadeIn = (el, delay, timeout, display) => {
  const element = el;
  element.style.display = display || 'block';
  element.style.opacity = 0;
  setTimeout(() => {
    element.style.transition = `all ${timeout}s`;
    element.style.opacity = 1;
  }, delay * 1000);
};

const fadeOut = (el, timeout) => {
  const element = el;
  element.style.position = 'absolute';
  element.style.opacity = 1;
  element.style.transition = `all ${timeout}s`;
  element.style.opacity = 0;
  setTimeout(() => {
    element.remove();
  }, timeout * 1000);
};

const createBlock = (tag, atr = {}, content = '') => {
  const element = document.createElement(tag);
  element.innerHTML = content;

  const entries = Object.entries(atr);
  entries.forEach(([key, value]) => element.setAttribute(key, value));

  return element;
};

const displayFinishModal = (time, numArr) => {
  const container = document.querySelector('.container');
  const block = document.querySelector('.block');
  const blockBottom = document.querySelector('.box-bottom');
  const correctNumbers = numArr.join('');
  const overlay = createBlock('div', { class: 'overlay' });
  const overlayContainer = createBlock('div', { class: 'container' });
  const modal = createBlock('div', { class: 'modal block' });
  const modalBody = createBlock('div', { class: 'block__body' });
  const modalTitle = createBlock('h2', { class: 'title fs-20 mb-15' }, 'Поздравляю, <br> вы отгадали число!');
  const modalNum = createBlock('div', { class: 'text mb-10' }, `Задуманное число: <strong>${correctNumbers}</strong>`);
  const modalTime = createBlock('div', { class: 'text mb-10' }, `Время игры: <strong>${time.innerHTML}</strong>`);
  const modalSteps = createBlock('div', { class: 'text mb-15' }, `Кол-во ходов: <strong>${counter}</strong>`);

  const modalBtns = createBlock('div', { class: 'block__btns' });
  const btnFinish = createBlock('button', { class: 'btn btn-border text' }, 'завершить');
  const btnNewGame = createBlock('button', { class: 'btn btn-primary text' }, 'новая игра');

  modalBtns.append(btnFinish, btnNewGame);
  modalBody.append(modalTitle, modalNum, modalTime, modalSteps, modalBtns);
  modal.append(modalBody);
  overlayContainer.append(modal);
  overlay.append(overlayContainer);
  document.body.append(overlay);

  document.body.classList.add('lock');

  fadeIn(overlay, 0.2, 0.3);
  fadeIn(modal, 0.5, 0.3);

  btnFinish.addEventListener('click', () => {
    document.body.classList.remove('lock');

    fadeOut(overlay, 0.05, 0.2);
    fadeOut(modal, 0.1, 0.1);

    // eslint-disable-next-line no-use-before-define
    displayWelcomeBlock();
    counter = 0;
  });

  btnNewGame.addEventListener('click', () => {
    document.body.classList.remove('lock');

    container.classList.remove('content-between');
    container.classList.add('content-center');

    fadeOut(overlay, 0.05, 0.2);
    fadeOut(modal, 0.1, 0.1);
    fadeOut(block, 0.05, 0.15);
    fadeOut(blockBottom, 0.05, 0.15);

    // eslint-disable-next-line no-use-before-define
    startNewGame();
    counter = 0;
  });
};

const createBullsOrCows = (imgName, count) => {
  const div = createBlock('div');
  const image = createBlock('img', { src: `img/${imgName}.svg`, alt: `Изображение ${imgName}` });
  const span = createBlock('sapan', { class: 'text' }, `(${count})`);

  div.append(image, span);
  return div;
};

const countBullsAndCows = (count, correctArr, currentArr) => {
  let countBulls = 0;
  let countCows = 0;

  for (let i = 0; i < count; i += 1) {
    const correctNumber = correctArr[i];
    const currentNumber = currentArr[i];

    if (correctNumber === currentNumber) {
      countBulls += 1;
    } else if (correctArr.includes(currentNumber)) {
      countCows += 1;
    }
  }

  return [countBulls, countCows];
};

const startTime = (span) => {
  let count = 0;

  setInterval(() => {
    let minutesSpan;
    let secondsSpan;

    count += 1;
    const minutes = Math.floor(count / 60);
    const seconds = count - (minutes * 60);

    if (minutes < 10) {
      minutesSpan = `0${minutes}`;
    } else {
      minutesSpan = minutes;
    }

    if (seconds < 10) {
      secondsSpan = `0${seconds}`;
    } else {
      secondsSpan = seconds;
    }

    // eslint-disable-next-line no-param-reassign
    span.innerHTML = `${minutesSpan}:${secondsSpan} `;
  }, 1000);
};

const isRepeatNumber = (count, currentNumbersArr) => {
  for (let i = 0; i < count - 1; i += 1) {
    for (let j = i + 1; j < count; j += 1) {
      if (currentNumbersArr[i] === currentNumbersArr[j]
        && Number.isInteger(currentNumbersArr[i])
        && Number.isInteger(currentNumbersArr[j])) {
        return true;
      }
    }
  }

  return false;
};

const getRandomNumber = () => Math.floor(Math.random() * 10);

const getGenerateNumbersArr = (count) => {
  const resultNumbersArr = [];
  for (let i = 0; i < count; i += 1) {
    const randomNumber = getRandomNumber();
    if (resultNumbersArr.includes(randomNumber)) {
      i -= 1;
    } else {
      resultNumbersArr.push(randomNumber);
    }
  }
  return resultNumbersArr;
};

const displayGameInfo = () => {
  const container = document.querySelector('.container');
  const overlay = createBlock('div', { class: 'overlay' });
  const overlayContainer = createBlock('div', { class: 'container' });
  const modal = createBlock('div', { class: 'modal block' });
  const modalBody = createBlock('div', { class: 'block__body' });
  const modalTitle = createBlock('h2', { class: 'title fs-20 mb-15' }, 'Компьютер задумал число. <br> Попробуйте его вычислить, затратив минимум ходов!');
  const modalBtn = createBlock('button', { class: 'btn btn-primary text' }, 'ок');

  container.innerHTML = '';
  modalBody.append(modalTitle, modalBtn);
  modal.append(modalBody);
  overlayContainer.append(modal);
  overlay.append(overlayContainer);
  document.body.append(overlay);

  fadeIn(overlay, 0.5, 0.3);
  fadeIn(modal, 0.7, 0.3);

  document.body.classList.add('lock');

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === modalBtn || e.target === overlayContainer) {
      document.body.classList.remove('lock');

      fadeOut(overlay, 0.3);
      fadeOut(modal, 0.2);
    }
  });
};

const displayGame = (count) => {
  const container = document.querySelector('.container');
  const correctNumbersArr = getGenerateNumbersArr(count);
  const blockGame = createBlock('div', { class: 'block mb-10' });
  const blockGameBody = createBlock('div', { class: 'block__body block__body-p' });

  const blockInfo = createBlock('div', { class: 'block__info' });
  const blockInfoItem1 = createBlock('div', { class: 'block__item' });
  const blockInfoCounter = createBlock('div', { class: 'block__counter text' }, 'Кол-во ходов: ');
  const blockInfoCounterSpan = createBlock('span', { class: 'title fs-20' }, '(0)');
  const blockInfoItem2 = createBlock('div', { class: 'block__item' });
  const imgClock = createBlock('img', { class: 'block__img', src: 'img/clock.svg', alt: 'Иконка часов' });
  const spanClock = createBlock('span', { class: 'title fs-20' }, '00:00');

  const blockDiv = createBlock('div');
  const blockForm = createBlock('div', { class: 'block__form' });
  const input = createBlock('input', { type: 'number', class: 'block__input text' });
  const btnStep = createBlock('button', { class: 'btn btn-primary text' }, 'сделать ход');

  const blockBottom = createBlock('div', { class: 'box-bottom' });
  const numbersBtns = createBlock('div', { class: 'numbers mb-10' });

  blockInfoItem2.append(imgClock, spanClock);
  blockInfoItem1.append(blockInfoCounter, blockInfoCounterSpan);
  blockInfo.append(blockInfoItem1, blockInfoItem2);
  blockForm.append(input, btnStep);
  blockGameBody.append(blockInfo, blockDiv, blockForm);
  blockGame.append(blockGameBody);

  for (let i = 0; i < 10; i += 1) {
    const btn = createBlock('button', { class: 'btn btn-number text' }, i);
    numbersBtns.append(btn);
  }

  blockBottom.append(numbersBtns);
  container.append(blockGame, blockBottom);

  fadeIn(blockGame, 0.5, 0.3);
  fadeIn(blockBottom, 0.5, 0.3);

  const btnsNumbers = document.querySelectorAll('.numbers .btn');
  btnsNumbers.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('present-in-number')) {
        btn.classList.remove('present-in-number');
      } else if (!btn.classList.contains('missing-in-number')) {
        btn.classList.add('missing-in-number');
      } else {
        btn.classList.remove('missing-in-number');
        btn.classList.add('present-in-number');
      }
    });
  });

  btnStep.addEventListener('click', () => {
    const currentNumbersArr = input.value.split('').map((item) => Number(item));
    if (currentNumbersArr.length !== count || isRepeatNumber(count, currentNumbersArr)) {
      input.classList.add('error');
      return;
    }

    if (counter === 0) {
      startTime(spanClock);
    }

    input.classList.remove('error');

    counter += 1;
    blockInfoCounterSpan.innerHTML = `(${counter})`;

    const [bull, cow] = countBullsAndCows(count, correctNumbersArr, currentNumbersArr);
    const item = createBlock('div', { class: 'item mb-15' });
    const itemCurrent = createBlock('div', { class: 'item__current text' }, input.value);
    const itemResult = createBlock('div', { class: 'item__result' });

    const bullItem = createBullsOrCows('bull', bull);
    const cowItem = createBullsOrCows('cow', cow);

    itemResult.append(bullItem, cowItem);
    item.append(itemCurrent, itemResult);
    blockDiv.append(item);

    input.value = '';

    if (bull === count) {
      displayFinishModal(spanClock, correctNumbersArr);
    }
  });
};

const startNewGame = () => {
  const container = document.querySelector('.container');
  const block = createBlock('div', { class: 'block' });
  const blockBody = createBlock('div', { class: 'block__body' });
  const title = createBlock('h2', { class: 'title fs-20 mb-15' }, 'Введите в поле ниже длину числа, которое задумает компьютер (доступные значения от 3 до 10)');
  const blockForm = createBlock('div', { class: 'block__form' });
  const input = createBlock('input', { type: 'number', class: 'block__input text', value: 4 });
  const btnStartGame = createBlock('button', { class: 'btn btn-primary text' }, 'начать игру');

  blockForm.append(input, btnStartGame);
  blockBody.append(title, blockForm);
  block.append(blockBody);
  container.append(block);

  fadeIn(block, 0.5, 0.3);
  fadeIn(input, 0.7, 0.3);
  fadeIn(btnStartGame, 0.9, 0.3);

  btnStartGame.addEventListener('click', () => {
    const count = Number(input.value);
    if (count >= 3 && count <= 10) {
      fadeOut(block, 0.2);

      container.classList.remove('content-center');
      container.classList.add('content-between');

      displayGameInfo();
      displayGame(count);
    } else {
      input.classList.add('error');
    }
  });
};

const displayRules = () => {
  const overlay = createBlock('div', { class: 'overlay' });
  const overlayContainer = createBlock('div', { class: 'container' });
  const modal = createBlock('div', { class: 'modal block' });
  const modalBody = createBlock('div', { class: 'block__body' });
  const modalTitle = createBlock('h2', { class: 'title fs-25 mb-15' }, 'Правила игры');
  const modalText = createBlock('p', { class: 'text  mb-15' }, 'Компьютер задумывает число, длину которого указывает игрок, используя различные цифры 0-9. Игрок делает ходы, чтобы узнать эти цифры и их порядок. Каждый ход состоит из различных цифр, 0 может стоять на первом месте. В ответ компьютер показывает число отгаданных цифр, стоящих на своих местах (число быков) и число отгаданных цифр, стоящих не на своих местах (число коров). <br> <br> <strong>Пример</strong>. Компьютер задумал 2034. Игрок сделал ход 1234. Компьютер ответил: 2 быка (цифры 3 и 4) и 1 корова (цифра 2). <br> <br> <strong>Бонус</strong>. Используйте нижнее поле для отметки нужных цифр (один клик - красный крестик; два клика - зеленый кружок).');
  const modalBtn = createBlock('button', { class: 'btn btn-primary text' }, 'ок');

  modalBody.append(modalTitle, modalText, modalBtn);
  modal.append(modalBody);
  overlayContainer.append(modal);
  overlay.append(overlayContainer);
  document.body.append(overlay);

  document.body.classList.add('lock');

  fadeIn(overlay, 0.1, 0.3);
  fadeIn(modal, 0.2, 0.3);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === modalBtn || e.target === overlayContainer) {
      document.body.classList.remove('lock');
      fadeOut(overlay, 0.3);
      fadeOut(modal, 0.2);
    }
  });
};

const displayWelcomeBlock = () => {
  const container = document.querySelector('.container');
  const block = createBlock('div', { class: 'block' });
  const blockBody = createBlock('div', { class: 'block__body' });
  const title = createBlock('div', { class: 'title fs-25 mb-15' }, 'Добро пожаловать <br> в игру “Быки и Коровы”');
  const blockBtns = createBlock('div', { class: 'block__btns' });
  const btnRules = createBlock('button', { class: 'btn btn-primary text' }, 'правила');
  const btnNewGame = createBlock('button', { class: 'btn btn-primary text' }, 'новая игра');
  const btnAutor = createBlock('a', { href: 'https://github.com/ilrosch', target: '_blank', class: 'btn btn-primary text' }, 'автор');

  container.innerHTML = '';
  container.classList.remove('content-between');
  container.classList.add('content-center');

  blockBtns.append(btnRules, btnNewGame, btnAutor);
  blockBody.append(title, blockBtns);
  block.append(blockBody);
  container.append(block);

  fadeIn(block, 0.3, 0.3);
  fadeIn(btnRules, 0.6, 0.3);
  fadeIn(btnNewGame, 0.8, 0.3);
  fadeIn(btnAutor, 1, 0.3);

  btnRules.addEventListener('click', () => { displayRules(); });

  btnNewGame.addEventListener('click', () => {
    fadeOut(block, 0.2);
    startNewGame();
  });
};

displayWelcomeBlock();
