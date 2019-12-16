// QUERY THE SET VIEW PAGE ELEMENTS
const setTitle = document.querySelector('.set-view__heading');
const setTermsNumber = document.querySelector('.set-view__terms-number');
const setCreator = document.querySelector('.set-view__creator-nick');
const listOfTerms = document.querySelector('.set-view__list-of-terms');

// QUERY THE GENERAL STRUCTURE OF TEST PAGE
const testPage = document.querySelector('.test-page');
const testWriteSection = document.querySelector('.test-write');
const testSelectionSection = document.querySelector('.test-selection');

// QUERY WRITE TEST ELEMENTS
const writeCounter = testWriteSection.querySelector('.write-counter');
const writeWord = testWriteSection.querySelector('.test__word-write');
const writeWordCorrect = testWriteSection.querySelector('.test__word-write-correct');
const writeFormGlobal = testWriteSection.querySelector('.test__form');
const writeButtonView = testWriteSection.querySelector('.write-button');

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
    this.numberTotal = 0;

    // WRITE BASIC INFO AND SET NUMBER OF TERMS
    setTitle.innerHTML = title;
    setTermsNumber.innerHTML = `${termsNumber}`;
    setCreator.innerHTML = creator;

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
    // if (this.terms.length <= 10) {
    this.termsToTest = [...this.terms];
    // }

    // COPY THE TERMS TO TEST, GET LENGTH OF THAT, WRITE OUT COUNTER CONTENT (1 / NUMBER OF TERMS)
    this.termsToRandom = [...this.termsToTest];
    this.numberOfActualTerms = this.termsToTest.length;
    writeCounter.innerHTML = `1 / ${this.numberOfActualTerms}`;

    // SHOW WRITE SECTION
    testWriteSection.classList.remove('hide');

    // CALL RANDOM AND DISPLAY TERM FUNCTION
    this.randomWriteAndDisplayTerm();
  }

  // RANDOM TERM AND DISPLAY IT
  randomWriteAndDisplayTerm() {
    // RANDOM AN INDEX OF TERM AND ASSIGN THIS ELEMENT TO VARIABLE, REMOVE FROM ARRAY TO RANDOMING
    const indexOfTerm = Math.floor(Math.random() * (this.termsToRandom.length));
    this.actualTerm = this.termsToRandom[indexOfTerm];
    this.termsToRandom.splice(indexOfTerm, 1);

    // GIVEN ANSWERS COUNTER INCREMENT
    this.counterGivenAnswers += 1;
    console.log(this.counterGivenAnswers);

    // WRITE OUT ALL CONTENT
    writeCounter.innerHTML = `${this.counterGivenAnswers} / ${this.numberOfActualTerms}`; // COUNTER
    writeWord.innerHTML = this.actualTerm.origin; // ORIGIN
    writeWordCorrect.innerHTML = this.actualTerm.definition; // DEFINITION

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
      }, 1000);
      writeForm.definition.removeAttribute('disabled'); // INPUT DISABLED FALSE
      this.counterCorrect += 1; // INCREMENT OF CORRECT ANSWERS NUMBER
      this.randomWriteAndDisplayTerm(); // GO NEXT
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
    this.randomWriteAndDisplayTerm(); // GO NEXT
  }
  // !!! WRITE SECTION END !!!

  selectionTest() {
    // SHOW SELECTION SECTION
    testSelectionSection.classList.remove('hide');
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

    writeCounter.innerHTML = '';
    writeWord.innerHTML = '';
    writeWordCorrect.innerHTML = '';
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
  clearBasicAttributes() {
    this.terms = [];
    this.numberTotal = 0;
  }
}
