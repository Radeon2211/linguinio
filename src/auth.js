const authFunctionality = (modalBoxLogin, modalBoxRegister, hideModals) => {
  // GET INTRO AND MAIN CONTAINERS TO SHOW / HIDE THEM
  const introductionContainer = document.querySelector('.introduction-container');
  const mainContainer = document.querySelector('.main-container');

  // LISTEN FOR AUTH STATUS CHANGED
  auth.onAuthStateChanged((user) => {
    if (user) {
      if (!introductionContainer.classList.contains('hide')) {
        introductionContainer.classList.add('hide');
      }
      if (mainContainer.classList.contains('hide')) {
        mainContainer.classList.remove('hide');
      }
    } else {
      if (introductionContainer.classList.contains('hide')) {
        introductionContainer.classList.remove('hide');
      }
      if (!mainContainer.classList.contains('hide')) {
        mainContainer.classList.add('hide');
      }
    }
  });


  // FUNCTION WHICH DISPLAYS ERROR IN FORMS (field where error displays, error)
  const displayError = (field, error) => {
    const fieldError = field;
    fieldError.innerHTML = error.message;
    if (fieldError.classList.contains('hide')) {
      fieldError.classList.remove('hide');
    }
  };

  // FUNCTION WHICH HIDES FIELD WITH ERROR AFTER SUCCESSFUL LOGIN AND REGISTERATION
  const hideError = (field) => {
    if (!field.classList.contains('hide')) {
      field.classList.add('hide');
    }
  };

  // REGISTER START
  const formRegister = document.querySelector('#form-register');
  formRegister.addEventListener('submit', (e) => {
    e.preventDefault();
    const errorField = formRegister.querySelector('.modal-form__error');
    const nick = formRegister.nick.value.trim();
    const regex = /^[a-z\d]{4,14}$/;
    if (!regex.test(nick)) {
      displayError(errorField, { message: 'Nick should have 4-14 characters, only letters and digits' });
      return;
    }
    auth.createUserWithEmailAndPassword(formRegister.email.value.trim(), formRegister.password.value.trim()).then((cred) => db.collection('users').doc(cred.user.uid).set({ // return db.collection ...
      nick,
    })).then(() => {
      window.location.reload(true);
      formRegister.reset();
      hideModals(modalBoxRegister);
      hideError(errorField);
    }).catch((error) => {
      displayError(errorField, error);
    });
  });
  // REGISTER END


  // LOGIN START
  const formLogin = document.querySelector('#form-login');
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const errorField = formLogin.querySelector('.modal-form__error');
    auth.signInWithEmailAndPassword(formLogin.email.value.trim(), formLogin.password.value.trim()).then((cred) => {
      window.location.reload(true);
      formLogin.reset();
      hideModals(modalBoxLogin);
      hideError(errorField);
    }).catch((error) => {
      displayError(errorField, error);
    });
  });
  // LOGIN END

  // LOGOUT
  const logoutLinks = document.querySelectorAll('.logout-link');
  logoutLinks.forEach((link) => {
    link.addEventListener('click', () => {
      auth.signOut().then(() => {
        window.location.reload(true);
      });
    });
  });
};

export { authFunctionality as default };
