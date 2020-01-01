const listOfTerms = document.querySelector('.create-set__list-of-terms');

export default class Create {
  constructor() {
    this.terms = [];
    this.counter = 0;
    this.messageFields = { // FIELS WHERE THE ERRORS ARE DISPLAYING
      database: document.querySelector('.create-set-error-database'),
      forms: document.querySelector('.create-set-error-forms'),
    };
    this.regex = { // REGEXES TO CHECK TITLE AND TERM FORMS
      start: /^[^@#$%^&*'"\n\t`~<>]/,
      end: /[^@#$%^&*'"\n\t`~<>]$/,
    };
  }

  async createSet(title, uid) {
    if (this.counter < 4) {
      this.displayMessage(this.messageFields.forms, 'You should enter at least 4 terms');
      return false;
    }
    if (title.length === 0) {
      this.displayMessage(this.messageFields.forms, 'Please enter the title');
      return false;
    }
    if (!this.regex.start.test(title) || !this.regex.end.test(title) || title.length > 60) {
      this.displayMessage(this.messageFields.forms, 'Maximum 60 characters expected, strange characters not allowed');
      return false;
    }

    // PUSH TERMS TO DATABASE
    try {
      const userInfo = await db.collection('users').doc(uid).get();
      const set = {
        title,
        creator: userInfo.data().nick,
        terms_number: this.counter,
        created_at: firebase.firestore.Timestamp.fromDate(new Date()),
      };
      const setInfo = await db.collection('sets').add(set);
      this.terms.forEach((term) => {
        db.collection('sets').doc(setInfo.id).collection('terms').add(term);
      });
      const element = document.createElement('div');
      element.setAttribute('data-id', setInfo.id);
      element.setAttribute('data-title', title);
      element.setAttribute('data-terms_number', this.counter);
      element.setAttribute('data-creator', userInfo.data().nick);
      this.clear();
      return element;
    } catch (error) {
      this.displayMessage(this.messageFields.database, error);
      return false;
    }
  }

  addTerm(formAddTerm) {
    const origin = formAddTerm.origin.value.trim();
    const definition = formAddTerm.definition.value.trim();
    formAddTerm.reset();

    // CHECK FOR UNACCEPTABLE THINGS IN FORM
    if (origin.length === 0 || definition.length === 0) {
      this.displayMessage(this.messageFields.forms, 'Both fields must be filled');
      return;
    }

    const splittedOrigin = origin.split(/[,;/]/);
    const trimmedOrigin = splittedOrigin.map((item) => item.trim());
    const joinedOrigin = trimmedOrigin.join(' / ');

    const splittedDefinition = definition.split(/[,;/]/);
    const trimmedDefiniton = splittedDefinition.map((item) => item.trim());
    const joinedDefinition = trimmedDefiniton.join(' / ');

    if ((!this.regex.start.test(joinedOrigin)) || (!this.regex.start.test(joinedDefinition))
    || (!this.regex.end.test(joinedDefinition)) || (!this.regex.end.test(joinedDefinition))
    || (joinedOrigin.length > 60) || (joinedDefinition.length > 60)) {
      this.displayMessage(this.messageFields.forms, 'Maximum 60 characters expected (including 3 characters for joins), strange characters not allowed');
      return;
    }

    this.terms.push({ origin: joinedOrigin, definition: joinedDefinition });
    this.displayAddedTerm(joinedOrigin, joinedDefinition);
  }

  displayAddedTerm(origin, definition) {
    this.counter += 1;
    if (this.counter === 1) {
      listOfTerms.classList.remove('hide');
    }
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
    window.scrollTo(0, 0);
    const messageField = field;
    messageField.textContent = message;
    messageField.classList.remove('hide');
    setTimeout(() => {
      messageField.classList.add('hide');
      messageField.textContent = '';
    }, 3000);
  }

  clear() {
    listOfTerms.innerHTML = '';
    this.terms = [];
    this.counter = 0;
  }
}
