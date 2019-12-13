export default class Set {
  constructor() {
    this.terms = []; // THERE ARE STORED THE TERMS
    this.counter = 0; // COUNTER OF TERMS
    this.errorFields = { // FIELS WHERE THE ERRORS ARE DISPLAYING
      database: document.querySelector('.create-set-error-database'),
      forms: document.querySelector('.create-set-error-forms'),
    };
    this.regex = { // REGEXES TO CHECK TITLE AND TERM FORM
      first: /^[^@#$%^&*'"\n\t`~<>]/,
      second: /[^@#$%^&*'"\n\t`~<>]$/,
    };
  }

  async createSet(title, uid) {
    // CHECK NUMBER OF TERMS AND FOR UNACCEPTABLE THINGS IN FORM
    if (this.counter < 4) {
      this.displayError(this.errorFields.forms, 'You should enter at least 4 terms');
      return;
    }
    if (title.length === 0) {
      this.displayError(this.errorFields.forms, 'Please enter the title');
      return;
    }
    if (!this.regex.first.test(title) || !this.regex.second.test(title) || title.length > 60) {
      this.displayError(this.errorFields.forms, 'Maximum 60 characters expected, strange characters not allowed');
      return;
    }

    // PUSH TERMS TO DATABASE
    try {
      // GET NICK OF CURRENT USER
      const userInfo = await db.collection('users').doc(uid).get();

      const now = new Date();

      const set = {
        name: title,
        creator: userInfo.data().nick,
        terms_number: this.counter,
        created_at: firebase.firestore.Timestamp.fromDate(now),
      };

      // WRITE INFO ABOUT SET
      const setInfo = await db.collection('sets').add(set);

      // WRITE TERMS TO SET
      this.terms.forEach((term) => {
        db.collection('sets').doc(setInfo.id).collection('terms').add(term);
      });
    } catch (error) {
      this.displayError(this.errorFields.database, error);
      return;
    }
    this.displayError(this.errorFields.database, 'Set created successfully');
  }

  addTerm(formAddTerm, listOfTerms) {
    const origin = formAddTerm.origin.value.trim();
    const definition = formAddTerm.definition.value.trim();
    // CHECK FOR UNACCEPTABLE THINGS IN FORM
    if (origin.length === 0 || definition.length === 0) {
      this.displayError(this.errorFields.forms, 'Both fields must be filled');
      return;
    }
    if ((!this.regex.first.test(origin)) || (!this.regex.first.test(definition))
    || (!this.regex.second.test(definition)) || (!this.regex.second.test(definition))
    || (origin.length > 60) || (definition.length > 60)) {
      this.displayError(this.errorFields.forms, 'Maximum 60 characters expected, strange characters not allowed');
      return;
    }
    // PUSH TERM TO ARRAY, INCREMENT THE COUNTER OF TERMS, SHOW TERM, RESET THE FROM
    this.terms.push({ origin, definition });
    this.counter += 1;
    this.showAddedTerm(origin, definition, listOfTerms);
    formAddTerm.reset();
  }

  showAddedTerm(origin, definition, listOfTerms) {
    const list = listOfTerms;
    if (this.counter === 1) {
      list.classList.remove('hide');
    }
    list.innerHTML += `
      <div class="term">
        <span class="term__number">${this.counter}.</span>
        <div class="term__words">
          <span class="term__word">${origin}</span>
          <span class="term__word">${definition}</span>
        </div>
      </div>
    `;
  }

  displayError(field, error) {
    // DISPLAY ERROR AND HIDE IT AFTER 3 SECONDS
    const errorField = field;
    errorField.innerHTML = error;
    errorField.classList.remove('hide');
    setTimeout(() => {
      errorField.classList.add('hide');
      errorField.innerHTML = '';
    }, 5000);
  }
}
