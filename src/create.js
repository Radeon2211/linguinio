// GET DOM ELEMENTS
const listOfTerms = document.querySelector('.create-set__list-of-terms');

export default class Create {
  constructor() {
    this.terms = []; // THERE ARE STORED THE TERMS
    this.counter = 0; // COUNTER OF TERMS
    this.messageFields = { // FIELS WHERE THE ERRORS ARE DISPLAYING
      success: document.querySelector('.create-set-success'),
      database: document.querySelector('.create-set-error-database'),
      forms: document.querySelector('.create-set-error-forms'),
    };
    this.regex = { // REGEXES TO CHECK TITLE AND TERM FORM
      start: /^[^@#$%^&*'"\n\t`~<>]/,
      end: /[^@#$%^&*'"\n\t`~<>]$/,
    };
  }

  async createSet(title, uid) {
    // CHECK NUMBER OF TERMS AND FOR UNACCEPTABLE THINGS IN FORM
    if (this.counter < 4) {
      this.displayMessage(this.messageFields.forms, 'You should enter at least 4 terms');
      return;
    }
    if (title.length === 0) {
      this.displayMessage(this.messageFields.forms, 'Please enter the title');
      return;
    }
    if (!this.regex.start.test(title) || !this.regex.end.test(title) || title.length > 60) {
      this.displayMessage(this.messageFields.forms, 'Maximum 60 characters expected, strange characters not allowed');
      return;
    }

    // PUSH TERMS TO DATABASE
    try {
      // GET NICK OF CURRENT USER
      const userInfo = await db.collection('users').doc(uid).get();

      const set = {
        title,
        creator: userInfo.data().nick,
        terms_number: this.counter,
        created_at: firebase.firestore.Timestamp.fromDate(new Date()),
      };

      // WRITE INFO ABOUT SET
      const setInfo = await db.collection('sets').add(set);

      // WRITE TERMS TO SET
      this.terms.forEach((term) => {
        db.collection('sets').doc(setInfo.id).collection('terms').add(term);
      });
    } catch (error) {
      this.displayMessage(this.messageFields.database, error);
      return;
    }
    this.displayMessage(this.messageFields.success, 'Set created successfully!');
  }

  addTerm(formAddTerm) {
    const origin = formAddTerm.origin.value.trim();
    const definition = formAddTerm.definition.value.trim();
    // CHECK FOR UNACCEPTABLE THINGS IN FORM
    if (origin.length === 0 || definition.length === 0) {
      this.displayMessage(this.messageFields.forms, 'Both fields must be filled');
      return;
    }
    if ((!this.regex.start.test(origin)) || (!this.regex.start.test(definition))
    || (!this.regex.end.test(definition)) || (!this.regex.end.test(definition))
    || (origin.length > 60) || (definition.length > 60)) {
      this.displayMessage(this.messageFields.forms, 'Maximum 60 characters expected, strange characters not allowed');
      return;
    }
    // PUSH TERM TO ARRAY, INCREMENT THE COUNTER OF TERMS, SHOW TERM, RESET THE FROM
    this.terms.push({ origin, definition });
    this.counter += 1;
    this.displayAddedTerm(origin, definition);
    formAddTerm.reset();
  }

  displayAddedTerm(origin, definition) {
    if (this.counter === 1) {
      // SHOW LIST OF TERMS
      listOfTerms.classList.remove('hide');
    }

    // SHOW ADDED TERMS
    const element = document.createElement('div');
    element.classList.add('term');
    element.innerHTML = `
      <span class="term__number">${this.counter}.</span>
      <div class="term__words">
        <span class="term__word">${origin}</span>
        <span class="term__word">${definition}</span>
      </div>
    `;
    listOfTerms.prepend(element);
  }

  displayMessage(field, message) {
    // SCROLL TO THE TOP, DISPLAY ERROR AND HIDE IT AFTER 3 SECONDS
    window.scrollTo(0, 0);
    const messageField = field;
    messageField.textContent = message;
    messageField.classList.remove('hide');
    setTimeout(() => {
      messageField.classList.add('hide');
      messageField.textContent = '';
    }, 3000);
  }
}
