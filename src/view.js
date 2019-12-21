// QUERY THE SET VIEW PAGE ELEMENTS
const setTitle = document.querySelector('.set-view__heading');
const setTermsNumber = document.querySelector('.set-view__terms-number');
const setCreator = document.querySelector('.set-view__creator-nick');
const listOfTerms = document.querySelector('.set-view__list-of-terms');

// QUERY THE GENERAL STRUCTURE OF TEST PAGE
const testPage = document.querySelector('.test-page');
const testWriteSection = document.querySelector('.test-write');
const testSelectionSection = document.querySelector('.test-selection');
const summarySection = document.querySelector('.test-summary');

// QUERY TEST ELEMENTS
const writeCounter = testWriteSection.querySelector('.write-counter');
const writeWord = testWriteSection.querySelector('.test__word-write');
const writeWordCorrect = testWriteSection.querySelector('.test__word-write-correct');
const writeFormGlobal = testWriteSection.querySelector('.test__form');
const writeButtonView = testWriteSection.querySelector('.write-button');

const selectionCounter = testSelectionSection.querySelector('.selection-counter');
const selectionWord = testSelectionSection.querySelector('.test__word-selection');
const selectionButtonView = testSelectionSection.querySelector('.selection-button');
const selectionAnswersBox = testSelectionSection.querySelector('.test__answers');
const selectionAnswers = testSelectionSection.querySelectorAll('.test__answer');

const summaryScoreValue = summarySection.querySelector('.test-summary__score-value');

export default class View {
  constructor() {
    this.terms = []; // TERMS WHICH ARE IN ACTUAL SET
    this.numberTotal = 0; // HOW MANY TERMS ARE IN ACTUAL SET
    this.termsToTest = []; // TERMS WHICH ARE IN ACTUAL TEST GENERALLY
    this.termsToRandom = []; // TERMS AVAILABLE TO RANDOM AS TERM TO DISPLAY
    this.actualTerm = {}; // TERM WHICH ACTUAL DISPLAYS AT TEST PAGE
    this.counterCorrect = 0; // HOW MANY ANSWERS ARE CORRECT
    this.counterGivenAnswers = 0; // HOW MANY ANSWERS ARE GIVEN
    this.numberOfActualTerms = 0; // CURRENT TEST'S TERMS NUMBER
  }

  // WRITE INFO ABOUT SET
  async writeSetInfo(id, title, termsNumber, creator) {
    // CLEAR LIST OF TERMS AND RESET NUMBER OF TERMS
    listOfTerms.innerHTML = '';

    // WRITE BASIC INFO AND SET NUMBER OF TERMS
    setTitle.textContent = title;
    setTermsNumber.textContent = `${termsNumber}`;
    setCreator.textContent = creator;

    // GET TERMS FROM DATABASE
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
  initClassInGeneral(type) {
    // IF TERMS ARE <= 10 COPY ORIGINAL ARRAY TO TERMS TO TEST ARRAY
    if (this.terms.length <= 10) {
      this.termsToTest = [...this.terms];
    } else {
      // ELSE RANDOM 10 TERMS TO TEST
      const termsToRandomToTest = [...this.terms]; // ARRAY FROM WHICH TERMS WILL BE RANDOMIZING
      for (let i = 0; i < 10; i += 1) {
        const indexOfTerm = Math.floor(Math.random() * termsToRandomToTest.length); // RAND INDEX
        this.termsToTest.push(termsToRandomToTest[indexOfTerm]); // PUSH TERMS TO PROPER ARRAY
        termsToRandomToTest.splice(indexOfTerm, 1); // DELETE RANDOMED TERM FROM ARRAY TO RANDOMIZE
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

  writeRandomAndDisplayTerm() {
    this.counterGivenAnswers += 1;

    if (this.counterGivenAnswers > this.numberOfActualTerms) {
      this.displaySummary();
      return;
    }

    // RANDOM AN INDEX OF TERM AND ASSIGN THIS ELEMENT TO VARIABLE, REMOVE FROM ARRAY TO RANDOMING
    const indexOfMainTerm = Math.floor(Math.random() * this.termsToRandom.length);
    this.actualTerm = this.termsToRandom[indexOfMainTerm];
    this.termsToRandom.splice(indexOfMainTerm, 1);

    // WRITE OUT ALL CONTENT
    writeCounter.textContent = `${this.counterGivenAnswers} / ${this.numberOfActualTerms}`; // COUNTER
    writeWord.textContent = this.actualTerm.origin; // ORIGIN WORD
    writeWordCorrect.textContent = this.actualTerm.definition; // DEFINITION WORD

    // FOCUS WRITE BUTTON
    writeButtonView.focus();
  }

  // SELECTION TEST - RANDOM TERM AND SETUP UI
  selectionRandomAndDisplayTerm() {
    // GIVEN ANSWERS COUNTER INCREMENT
    this.counterGivenAnswers += 1;

    if (this.counterGivenAnswers > this.numberOfActualTerms) {
      this.displaySummary();
      return;
    }

    // RANDOM AN ACTUAL TERM
    const indexOfTerm = Math.floor(Math.random() * this.termsToRandom.length);
    this.actualTerm = this.termsToRandom[indexOfTerm];
    this.termsToRandom.splice(indexOfTerm, 1);

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
    const numberOfBox = Math.floor(Math.random() * selectionAnswers.length);
    selectionAnswers[numberOfBox].textContent = this.actualTerm.definition;
    selectionAnswers[numberOfBox].classList.add('correct');

    selectionAnswers.forEach((answer) => {
      if (answer.textContent === '') {
        const indexOfAdditional = Math.floor(Math.random() * termsToDisplay.length);
        const box = answer;
        box.textContent = termsToDisplay[indexOfAdditional].definition;
        if (box.classList.contains('correct')) {
          box.classList.remove('correct');
        }
        termsToDisplay.splice(indexOfAdditional, 1);
      }
    });

    selectionCounter.textContent = `${this.counterGivenAnswers} / ${this.numberOfActualTerms}`;
    selectionWord.textContent = this.actualTerm.origin;

    writeButtonView.focus();
  }

  checkWriteAnswer(writeForm) {
    // RETURN IF THE TEST IS NOT IN PROGRESS
    if (!this.termsToTest.length > 0) {
      return;
    }

    const definition = writeForm.definition.value.trim().toLowerCase();
    writeForm.reset();
    writeForm.definition.setAttribute('disabled', true);

    if (this.actualTerm.definition.toLowerCase() === definition) {
      testPage.classList.add('test-page--correct'); // GREEN BACKGROUND ANIMATION
      setTimeout(() => {
        testPage.classList.remove('test-page--correct');
      }, 600);
      writeForm.definition.removeAttribute('disabled');
      this.counterCorrect += 1;
      this.writeRandomAndDisplayTerm();
    } else {
      // INCORRECT
      testPage.classList.add('test-page--incorrect'); // RED BACKGROUND ANIMATION
      setTimeout(() => {
        testPage.classList.remove('test-page--incorrect');
      }, 600);
      writeWordCorrect.classList.remove('hide');
      writeForm.classList.add('hide');
      writeButtonView.classList.remove('hide');
      writeButtonView.focus();
    }
  }

  writeGoToNextTerm() {
    writeWordCorrect.classList.add('hide'); // HIDE CORRECT WORD
    writeButtonView.classList.add('hide'); // HIDE WRITE BUTTON
    writeFormGlobal.classList.remove('hide'); // SHOW FORM
    writeFormGlobal.definition.removeAttribute('disabled'); // INPUT DISABLED FALSE
    this.writeRandomAndDisplayTerm(); // GO NEXT
  }

  // SUMMARY OF TEST
  displaySummary() {
    // HIDE TESTS SECTION AND SHOW SUMMARY SECTION
    this.hideTestSections();
    summarySection.classList.remove('hide');

    const percentageScoreValue = (100 / this.numberOfActualTerms) * this.counterCorrect;
    let outputValue = 0;
    const timer = setInterval(() => {
      summaryScoreValue.textContent = outputValue;
      if (outputValue === percentageScoreValue) {
        clearInterval(timer);
      } else {
        outputValue += 1;
      }
    }, 10);
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
    // ATTRIBUTES
    this.termsToTest = [];
    this.termsToRandom = [];
    this.actualTerm = {};
    this.counterCorrect = 0;
    this.counterGivenAnswers = 0;
    this.numberOfActualTerms = 0;

    // DOM
    this.hideTestSections();
    if (!summarySection.classList.contains('hide')) {
      summarySection.classList.add('hide');
    }

    writeCounter.textContent = '';
    writeWord.textContent = '';
    writeWordCorrect.textContent = '';
    selectionCounter.textContent = '';
    selectionWord.textContent = '';
    selectionAnswers.forEach((answer) => {
      const box = answer;
      box.textContent = '';
      if (box.classList.contains('correct')) {
        box.classList.remove('correct');
      }
      if (box.classList.contains('test__answer--green')) {
        box.classList.remove('test__answer--green');
      }
      if (box.classList.contains('test__answer--red')) {
        box.classList.remove('test__answer--red');
      }
    });
    summaryScoreValue.textContent = '';
    if (!writeWordCorrect.classList.contains('hide')) {
      writeWordCorrect.classList.add('hide');
    }
    if (!writeButtonView.classList.contains('hide')) {
      writeButtonView.classList.add('hide');
    }
    writeFormGlobal.definition.removeAttribute('disabled');
    if (writeFormGlobal.classList.contains('hide')) {
      writeFormGlobal.classList.remove('hide');
    }
  }

  // CLEAR TERMS ARRAY AND THEIR NUMBER
  clearBasicAndSetViewUI() {
    this.terms = [];
    this.numberTotal = 0;
    setTitle.textContent = '';
    setTermsNumber.textContent = '';
    setCreator.textContent = '';
    listOfTerms.innerHTML = '';
  }
}
