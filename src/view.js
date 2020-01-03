// SET VIEW PAGE ELEMENTS
const setTitle = document.querySelector('.set-view__heading');
const setChooseTermsNumber = document.querySelector('.set-view__choose-how-many-select-input');
const setChooseRequireOne = document.querySelector('.set-view__choose-how-many-checkbox-input');
const setTermsNumber = document.querySelector('.set-view__terms-number');
const setCreator = document.querySelector('.set-view__creator-nick');
const listOfTerms = document.querySelector('.set-view__list-of-terms');

// GENERAL STRUCTURE OF TEST PAGE
const testPage = document.querySelector('.test-page');
const testWriteSection = document.querySelector('.test-write');
const testSelectionSection = document.querySelector('.test-selection');
const summarySection = document.querySelector('.test-summary');

// TEST ELEMENTS
const writeCounter = testWriteSection.querySelector('.write-counter');
const writeWord = testWriteSection.querySelector('.test__word-write');
const writeWordCorrect = testWriteSection.querySelector('.test__word-write-correct');
const writeWordIncorrect = testWriteSection.querySelector('.test__word-write-incorrect');
const writeForm = testWriteSection.querySelector('.test__form');
const writeButtonView = testWriteSection.querySelector('.write-button');

const selectionCounter = testSelectionSection.querySelector('.selection-counter');
const selectionWord = testSelectionSection.querySelector('.test__word-selection');
const selectionAnswers = testSelectionSection.querySelectorAll('.test__answer');
const selectionButtonView = testSelectionSection.querySelector('.selection-button');

const summaryScoreValue = summarySection.querySelector('.test-summary__score-value');
const summaryButton = summarySection.querySelector('.test-summary__button');

export default class View {
  constructor() {
    this.id = '';
    this.terms = []; // TERMS WHICH ARE IN ACTUAL SET
    this.numberTotal = 0; // HOW MANY TERMS ARE IN ACTUAL SET
    this.termsToTest = []; // TERMS WHICH ARE IN ACTUAL TEST GENERALLY
    this.termsToRandom = []; // TERMS AVAILABLE TO RANDOM AS TERM TO DISPLAY
    this.actualTerm = {}; // TERM WHICH ACTUAL DISPLAYS AT TEST PAGE
    this.counterCorrect = 0; // HOW MANY ANSWERS ARE CORRECT
    this.counterGivenAnswers = 0; // HOW MANY ANSWERS ARE GIVEN
    this.numberOfActualTerms = 0; // CURRENT TEST'S TERMS NUMBER
    this.checkBlocker = false; // BLOCK CHECKING ANSWER JUST AFTER SELECTING ANSWER
    this.goNextBlocker = true; // BLOCK GO NEXT BUTTON WHEN THEY ARE DEFAULT HIDE
    this.requireOneAnswer = false;
  }

  // WRITE INFO ABOUT SET
  async writeSetInfo(set) {
    this.clearBasicAndSetViewUI();

    const id = set.getAttribute('data-id');
    const title = set.getAttribute('data-title');
    const termsNumber = set.getAttribute('data-terms_number');
    const creator = set.getAttribute('data-creator');

    this.id = id;
    setTitle.textContent = title;
    for (let i = termsNumber; i >= 4; i -= 1) {
      setChooseTermsNumber.innerHTML += `
        <option value="${i}" class="set-view__choose-how-many-option">${i}</option>
      `;
    }
    setTermsNumber.textContent = termsNumber;
    setCreator.textContent = creator;

    // GET TERMS FROM DATABASE AND DISPLAY THEM
    try {
      const data = await db.collection('sets').doc(id).collection('terms').get();
      data.forEach((doc) => {
        const term = doc.data();
        this.terms.push(term);
        this.numberTotal += 1;
        listOfTerms.innerHTML += `
          <div class="term">
            <span class="term__number">${this.numberTotal}.</span>
            <div class="term__words">
              <span class="term__word">${term.origin}</span>
              <span class="term__word">${term.definition}</span>
            </div>
          </div>
        `;
      });
    } catch (error) {
      console.log(error);
    }
  }

  // INIT GENREAL THE CLASS AFTER CHOOSING THE TEST TYPE
  initClassInGeneral(type, chosenNumberOfTerms) {
    writeForm.reset();
    this.requireOneAnswer = setChooseRequireOne.checked;
    this.checkBlocker = false;
    this.goNextBlocker = true;
    if (this.terms.length === chosenNumberOfTerms) {
      this.termsToTest = [...this.terms];
    } else {
      const termsToRandomToTest = [...this.terms];
      for (let i = 0; i < chosenNumberOfTerms; i += 1) {
        const indexOfTerm = Math.floor(Math.random() * termsToRandomToTest.length);
        this.termsToTest.push(termsToRandomToTest[indexOfTerm]);
        termsToRandomToTest.splice(indexOfTerm, 1);
      }
    }

    // COPY THE TERMS TO TEST, GET LENGTH OF THAT
    this.termsToRandom = [...this.termsToTest];
    this.numberOfActualTerms = this.termsToRandom.length;

    // SHOW PROPER SECTION, RANDOM AND DISPLAY TERM
    if (type === 'write') {
      testWriteSection.classList.remove('hide');
      this.writeRandomAndDisplayTerm();
    } else {
      testSelectionSection.classList.remove('hide');
      this.selectionRandomAndDisplayTerm();
    }
  }

  randomActualTerm() {
    const indexOfMainTerm = Math.floor(Math.random() * this.termsToRandom.length);
    this.actualTerm = this.termsToRandom[indexOfMainTerm];
    this.termsToRandom.splice(indexOfMainTerm, 1);
  }

  restoreTermToRandomizing() {
    this.counterGivenAnswers -= 1;
    this.termsToRandom.push(this.actualTerm);
  }

  writeRandomAndDisplayTerm() {
    this.counterGivenAnswers += 1;
    if (this.counterGivenAnswers > this.numberOfActualTerms) {
      this.displaySummary();
      return;
    }

    this.randomActualTerm();

    // WRITE OUT ALL CONTENT
    writeCounter.textContent = `${this.counterGivenAnswers} / ${this.numberOfActualTerms}`;
    writeWord.textContent = this.actualTerm.origin;
    writeWordCorrect.textContent = this.actualTerm.definition;
    writeForm.definition.removeAttribute('disabled');
    writeForm.definition.focus();
  }

  selectionRandomAndDisplayTerm() {
    this.checkBlocker = false;
    this.counterGivenAnswers += 1;
    if (this.counterGivenAnswers > this.numberOfActualTerms) {
      this.displaySummary();
      return;
    }

    this.randomActualTerm();

    // RANDOM ADDITIONAL TERMS
    const termsToRandomToDisplay = [...this.terms];
    const termsToDisplay = [];
    const indexActualTerm = termsToRandomToDisplay.findIndex((index) => index === this.actualTerm);

    termsToRandomToDisplay.splice(indexActualTerm, 1);

    for (let i = 0; i < 3; i += 1) {
      const indexOfAdditional = Math.floor(Math.random() * termsToRandomToDisplay.length);
      termsToDisplay.push(termsToRandomToDisplay[indexOfAdditional]);
      termsToRandomToDisplay.splice(indexOfAdditional, 1);
    }

    // DISPLAY TERMS
    selectionAnswers.forEach((answer) => {
      if (answer.classList.contains('correct')) {
        answer.classList.remove('correct');
      }
    });
    const numberOfBox = Math.floor(Math.random() * selectionAnswers.length);
    selectionAnswers[numberOfBox].textContent = this.actualTerm.definition;
    selectionAnswers[numberOfBox].classList.add('correct');

    selectionAnswers.forEach((answer) => {
      if (!answer.classList.contains('correct')) {
        const indexOfAdditional = Math.floor(Math.random() * termsToDisplay.length);
        const box = answer;
        box.textContent = termsToDisplay[indexOfAdditional].definition;
        termsToDisplay.splice(indexOfAdditional, 1);
      }
    });

    selectionCounter.textContent = `${this.counterGivenAnswers} / ${this.numberOfActualTerms}`;
    selectionWord.textContent = this.actualTerm.origin;
  }

  checkWriteAnswer() {
    writeForm.definition.setAttribute('disabled', true);
    const givenDefinition = writeForm.definition.value.toLowerCase();
    writeForm.reset();
    const splittedGivenDefinition = givenDefinition.split(/[,;/]/);
    const trimmedGivenDefinition = splittedGivenDefinition.map((item) => item.trim());
    const joinedGivenDefinition = trimmedGivenDefinition.join(' / ');

    const correctDefinition = this.actualTerm.definition.toLowerCase();
    const splittedCorrectDefinition = correctDefinition.split(/[,;/]/);
    const trimmedCorrectDefinition = splittedCorrectDefinition.map((item) => item.trim());

    let badCharacterPosition = '';
    let howManyDifferences = 0;
    let isFullCorrect = true;
    if (joinedGivenDefinition.length === correctDefinition.length) {
      if (trimmedCorrectDefinition.length < 2) {
        [...joinedGivenDefinition].forEach((letter, i) => {
          if (letter !== correctDefinition[i]) {
            howManyDifferences += 1;
            badCharacterPosition = i;
            isFullCorrect = false;
          }
        });
      } else {
        let correctAnswersCounter = 0;
        trimmedCorrectDefinition.forEach((correct) => {
          trimmedGivenDefinition.forEach((given) => {
            if (given === correct) {
              correctAnswersCounter += 1;
            }
          });
        });
        if (correctAnswersCounter < trimmedCorrectDefinition.length) {
          isFullCorrect = false;
        }
      }
    } else if (trimmedGivenDefinition.length < trimmedCorrectDefinition.length
      && this.requireOneAnswer) {
      let correctAnswersCounter = 0;
      trimmedCorrectDefinition.forEach((correct) => {
        trimmedGivenDefinition.forEach((given) => {
          if (given === correct) {
            correctAnswersCounter += 1;
          }
        });
      });
      if (correctAnswersCounter < trimmedGivenDefinition.length) {
        isFullCorrect = false;
      }
    } else {
      isFullCorrect = false;
    }

    if (isFullCorrect) {
      testPage.classList.add('test-page--correct'); // GREEN BACKGROUND ANIMATION
      setTimeout(() => {
        testPage.classList.remove('test-page--correct');
      }, 600);
      this.counterCorrect += 1;
      setTimeout(() => {
        this.writeRandomAndDisplayTerm();
      }, 300);
    } else {
      this.goNextBlocker = false;
      if (howManyDifferences === 1) {
        testPage.classList.add('test-page--almost-correct'); // ORANGE BACKGROUND ANIMATION
        setTimeout(() => {
          testPage.classList.remove('test-page--almost-correct');
        }, 600);
        writeWordIncorrect.classList.add('test__word-write-incorrect--almost');
        [...joinedGivenDefinition].forEach((letter, i) => {
          if (i !== badCharacterPosition) {
            writeWordIncorrect.innerHTML += letter;
          } else {
            writeWordIncorrect.innerHTML += `<span class="test__word-write-correction">${letter}</span>`;
          }
        });
        this.restoreTermToRandomizing();
      } else {
        testPage.classList.add('test-page--incorrect'); // RED BACKGROUND ANIMATION
        setTimeout(() => {
          testPage.classList.remove('test-page--incorrect');
        }, 600);
        writeWordIncorrect.textContent = joinedGivenDefinition;
      }
      writeWordIncorrect.classList.remove('hide');
      writeWordCorrect.classList.remove('hide');
      writeForm.classList.add('hide');
      writeButtonView.classList.remove('hide');
      writeButtonView.focus();
    }
  }

  checkSelectionAnswer(e) {
    if (this.checkBlocker) {
      return;
    }
    const selectedAnswer = e.target;
    if (selectedAnswer.classList.contains('correct')) {
      this.checkBlocker = true;
      selectedAnswer.classList.add('test__answer--green');
      this.counterCorrect += 1;
      setTimeout(() => {
        selectedAnswer.classList.remove('test__answer--green');
        this.selectionRandomAndDisplayTerm();
      }, 300);
    } else {
      this.checkBlocker = true;
      this.goNextBlocker = false;
      selectedAnswer.classList.add('test__answer--red');
      testSelectionSection.querySelector('.correct').classList.add('test__answer--green');
      selectionAnswers.forEach((answer) => {
        if (!answer.classList.contains('test__answer--green') && !answer.classList.contains('test__answer--red')) {
          answer.classList.add('hide');
        }
      });
      selectionButtonView.classList.remove('hide');
      selectionButtonView.focus();
    }
  }

  writeGoToNextTerm() {
    this.goNextBlocker = true;
    writeWordIncorrect.classList.add('hide');
    if (writeWordIncorrect.classList.contains('test__word-write-incorrect--almost')) {
      writeWordIncorrect.classList.remove('test__word-write-incorrect--almost');
    }
    writeWordIncorrect.textContent = '';
    writeWordCorrect.classList.add('hide');
    writeButtonView.classList.add('hide');
    writeForm.classList.remove('hide');
    writeForm.definition.removeAttribute('disabled');
    this.writeRandomAndDisplayTerm();
  }

  selectionGoToNextTerm() {
    this.goNextBlocker = true;
    this.checkBlocker = false;
    selectionButtonView.classList.add('hide');
    selectionAnswers.forEach((answer) => {
      if (answer.classList.contains('hide')) {
        answer.classList.remove('hide');
      }
      if (answer.classList.contains('test__answer--green')) {
        answer.classList.remove('test__answer--green');
      }
      if (answer.classList.contains('test__answer--red')) {
        answer.classList.remove('test__answer--red');
      }
    });
    this.selectionRandomAndDisplayTerm();
  }

  displaySummary() {
    this.checkBlocker = true;
    this.hideTestSections();
    summarySection.classList.remove('hide');
    const percentageScoreValue = Math.floor((100 / this.numberOfActualTerms) * this.counterCorrect);
    let outputValue = 0;
    const timer = setInterval(() => {
      summaryScoreValue.textContent = outputValue;
      if (outputValue === percentageScoreValue) {
        clearInterval(timer);
      } else {
        outputValue += 1;
      }
    }, 10);
    summaryButton.focus();
  }

  hideTestSections() {
    if (!testWriteSection.classList.contains('hide')) {
      testWriteSection.classList.add('hide');
    }
    if (!testSelectionSection.classList.contains('hide')) {
      testSelectionSection.classList.add('hide');
    }
  }

  // CLEAR CLASS ATTRIBUTES AND DOM ELEMENTS (SOMETIMES EXCEPT ALL TERMS AND THEIR NUMBER)
  clear() {
    this.termsToTest = [];
    this.termsToRandom = [];
    this.actualTerm = {};
    this.counterCorrect = 0;
    this.counterGivenAnswers = 0;
    this.numberOfActualTerms = 0;
    this.checkBlocker = false;
    this.goNextBlocker = true;
    this.requireOneAnswer = false;

    this.hideTestSections();
    if (!summarySection.classList.contains('hide')) {
      summarySection.classList.add('hide');
    }

    writeCounter.textContent = '';
    writeWordIncorrect.textContent = '';
    writeWord.textContent = '';
    writeWordCorrect.textContent = '';
    selectionCounter.textContent = '';
    selectionWord.textContent = '';
    selectionAnswers.forEach((answer) => {
      const box = answer;
      box.textContent = '';
      if (box.classList.contains('correct')) box.classList.remove('correct');
      if (box.classList.contains('test__answer--green')) box.classList.remove('test__answer--green');
      if (box.classList.contains('test__answer--red')) box.classList.remove('test__answer--red');
      if (box.classList.contains('hide')) box.classList.remove('hide');
    });
    if (!selectionButtonView.classList.contains('hide')) selectionButtonView.classList.add('hide');
    summaryScoreValue.textContent = '';
    if (!writeWordIncorrect.classList.contains('hide')) writeWordIncorrect.classList.add('hide');
    if (writeWordIncorrect.classList.contains('test__word-write-incorrect--almost')) {
      writeWordIncorrect.classList.remove('test__word-write-incorrect--almost');
    }
    if (!writeWordCorrect.classList.contains('hide')) writeWordCorrect.classList.add('hide');
    if (!writeButtonView.classList.contains('hide')) writeButtonView.classList.add('hide');
    if (writeForm.classList.contains('hide')) writeForm.classList.remove('hide');
    writeForm.definition.removeAttribute('disabled');
  }

  clearBasicAndSetViewUI() {
    this.id = '';
    this.terms = [];
    this.numberTotal = 0;
    setTitle.textContent = '';
    setChooseTermsNumber.innerHTML = '';
    setChooseRequireOne.checked = false;
    setTermsNumber.textContent = '';
    setCreator.textContent = '';
    listOfTerms.innerHTML = '';
  }

  getID() {
    return this.id;
  }

  getTerms() {
    return this.terms;
  }

  getTermsToTest() {
    return this.termsToTest;
  }
}
