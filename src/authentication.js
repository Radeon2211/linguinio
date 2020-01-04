export default class Authentication {
  // FUNCTION WHICH DISPLAYS ERROR IN FORMS (field where error displays, error)
  displayError(field, { message }) {
    const fieldError = field;
    fieldError.textContent = message;
    if (fieldError.classList.contains('hide')) {
      fieldError.classList.remove('hide');
    }
  }

  // HIDES FIELD WITH ERROR AFTER SUCCESSFUL LOGIN AND REGISTERATION
  hideError(field) {
    if (!field.classList.contains('hide')) {
      field.classList.add('hide');
    }
  }

  async register(form, hideModals, modal) {
    const errorField = form.querySelector('.modal-form__error');
    const nick = form.nick.value.trim();
    const regex = /^[a-z\d]{4,14}$/;
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    if (!regex.test(nick)) {
      this.displayError(errorField, { message: 'Nick should have 4-14 characters, only letters and digits' });
      return;
    }
    auth.createUserWithEmailAndPassword(email, password).then((cred) => db.collection('users').doc(cred.user.uid).set({ // return db.collection ...
      nick,
      lastSet: false,
      started_sets: [],
    })).then(() => {
      window.location.reload(true);
      hideModals(modal);
      this.hideError(errorField);
    }).catch((error) => {
      this.displayError(errorField, error);
    });
  }

  login(form, hideModals, modal) {
    const errorField = form.querySelector('.modal-form__error');
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    auth.signInWithEmailAndPassword(email, password).then(() => {
      window.location.reload(true);
      hideModals(modal);
      this.hideError(errorField);
    }).catch((error) => {
      this.displayError(errorField, error);
    });
  }

  logOut() {
    auth.signOut().then(() => {
      window.location.reload(true);
    }).catch((error) => {
      console.log(error);
    });
  }

  addAdmin(email, form) {
    const addAdminRole = functions.httpsCallable('addAdminRole'); // get function which adds admin
    addAdminRole({ email }).then((result) => {
      console.log(result);
      form.reset();
      if (auth.currentUser.email === email) { // if actual user equals email in form,reload the page
        window.location.reload(true);
      }
    }).catch((error) => {
      console.log(error);
    });
  }
}
