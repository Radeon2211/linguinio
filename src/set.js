export default class Set {
  constructor() {
    this.terms = [];
    // this.counter = 0;
    this.errorFields = {
      database: document.querySelector('.create-set-error-database'),
      forms: document.querySelector('.create-set-error-forms'),
    };
    this.regex = {
      first: /^[^@#$%^&*'"\n\t`~<>]/,
      second: /[^@#$%^&*'"\n\t`~<>]$/,
    };
  }

  createSet(title, uid) {

  }

  addTerm(origin, definition) {
    if (origin.length === 0 || definition.length === 0) {
      this.displayError(this.errorFields.forms, 'Both fields must be filled');
      return;
    }
    if (!this.regex.first.test(origin) || !this.regex.first.test(definition)
    || !this.regex.second.test(definition) || !this.regex.second.test(definition)
    || origin.length > 60 || definition.length > 60) {
      this.displayError(this.errorFields.forms, '3-60 characters expected, strange characters not allowed');
      return;
    }
  }

  showAddedTerm(origin, definiton) {

  }

  displayError(field, error) {
    const errorField = field;
    errorField.innerHTML = error;
    errorField.classList.remove('hide');
    setTimeout(() => {
      errorField.classList.add('hide');
      errorField.innerHTML = '';
    }, 3000);
  }
}
