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

  // !!! WRITE SECTION START !!!
  writeTest() {
    // IF TERMS ARE <= 10 COPY ORIGINAL ARRAY TO TERMS TO TEST ARRAY
    if (this.terms.length <= 10) {
      this.termsToTest = [...this.terms];
    } else {
      // ELSE RANDOM 10 TERMS TO TEST
      const termsToRandomToTest = [...this.terms]; // ARRAY FROM WHICH TERMS WILL BE RANDOMIZING
      for (let i = 0; i < 10; i += 1) {
        const indexOfTerm = Math.floor(Math.random() * (termsToRandomToTest.length)); // RAND INDEX
        this.termsToTest.push(termsToRandomToTest[indexOfTerm]); // PUSH TERMS TO PROPER ARRAY
        termsToRandomToTest.splice(indexOfTerm, 1); // DELETE RANDOMED TERM FROM ARRAY TO RANDOMIZE
      }
    }

    // COPY THE TERMS TO TEST, GET LENGTH OF THAT, WRITE OUT COUNTER CONTENT (1 / NUMBER OF TERMS)
    this.termsToRandom = [...this.termsToTest];
    this.numberOfActualTerms = this.termsToRandom.length;
    writeCounter.textContent = `1 / ${this.numberOfActualTerms}`;

    // SHOW WRITE SECTION AND HIDE SELECTION SECTION
    testWriteSection.classList.remove('hide');
    if (!testSelectionSection.classList.contains('hide')) {
      testSelectionSection.classList.add('hide');
    }

    // CALL RANDOM AND DISPLAY TERM FUNCTION
    this.writeRandomAndDisplayTerm();
  }

  // RANDOM TERM AND DISPLAY IT
  writeRandomAndDisplayTerm() {
    // GIVEN ANSWERS COUNTER INCREMENT
    this.counterGivenAnswers += 1;

    if (this.counterGivenAnswers > this.numberOfActualTerms) {
      this.displaySummary();
      return;
    }

    // RANDOM AN INDEX OF TERM AND ASSIGN THIS ELEMENT TO VARIABLE, REMOVE FROM ARRAY TO RANDOMING
    const indexOfTerm = Math.floor(Math.random() * (this.termsToRandom.length));
    this.actualTerm = this.termsToRandom[indexOfTerm];
    this.termsToRandom.splice(indexOfTerm, 1);

    // WRITE OUT ALL CONTENT
    writeCounter.textContent = `${this.counterGivenAnswers} / ${this.numberOfActualTerms}`; // COUNTER
    writeWord.textContent = this.actualTerm.origin; // ORIGIN
    writeWordCorrect.textContent = this.actualTerm.definition; // DEFINITION

    // WRITE BUTTON FOCUS
    writeButtonView.focus();
  }

  // CHECK IF GIVEN DEFINITION IS CORRECT
  checkWriteAnswer(writeForm) {
    // RETURN IF THE TEST IS NOT IN PROGRESS
    if (!this.termsToTest.length > 0) {
      return;
    }

    // GET DEFINITION, RESET FORM, SET INPUT DISABLED TO TRUE
    const definition = writeForm.definition.value.trim().toLowerCase();
    writeForm.reset();
    writeForm.definition.setAttribute('disabled', true);

    // CORRECT - ADD GREEN BACKGROUND ANIMATION
    if (this.actualTerm.definition.toLowerCase() === definition) {
      testPage.classList.add('test-page--correct'); // GREEN BACKGROUND ANIMATION
      setTimeout(() => {
        testPage.classList.remove('test-page--correct');
      }, 600);
      writeForm.definition.removeAttribute('disabled'); // INPUT DISABLED FALSE
      this.counterCorrect += 1; // INCREMENT OF CORRECT ANSWERS NUMBER
      this.writeRandomAndDisplayTerm(); // GO NEXT
    } else {
      // INCORRECT
      testPage.classList.add('test-page--incorrect'); // RED BACKGROUND ANIMATION
      setTimeout(() => {
        testPage.classList.remove('test-page--incorrect');
      }, 600);
      writeWordCorrect.classList.remove('hide'); // CORRECT DEFINITION - SHOW
      writeForm.classList.add('hide'); // FORM - HIDE
      writeButtonView.classList.remove('hide'); // WRITE BUTTON - SHOW
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
  // !!! WRITE SECTION END !!!

  selectionTest() {
    // SHOW SELECTION SECTION AND HIDE WRITE SECTION
    testSelectionSection.classList.remove('hide');
    if (!testWriteSection.classList.contains('hide')) {
      testWriteSection.classList.add('hide');
    }
  }

  // SUMMARY OF TEST
  displaySummary() {
    // HIDE TESTS SECTION AND SHOW SUMMARY SECTION
    if (!testWriteSection.classList.contains('hide')) {
      testWriteSection.classList.add('hide');
    }
    if (!testSelectionSection.classList.contains('hide')) {
      testSelectionSection.classList.add('hide');
    }
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
    if (!testSelectionSection.classList.contains('hide')) {
      testSelectionSection.classList.add('hide');
    }
    if (!testWriteSection.classList.contains('hide')) {
      testWriteSection.classList.add('hide');
    }
    if (!summarySection.classList.contains('hide')) {
      summarySection.classList.add('hide');
    }

    writeCounter.textContent = '';
    writeWord.textContent = '';
    writeWordCorrect.textContent = '';
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
