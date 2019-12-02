const authFunctionality = (modalBoxLogin, modalBoxRegister, hideModals) => {
  const introductionContainer = document.querySelector('.introduction-container'); // get introduction container to show / hide it
  const mainContainer = document.querySelector('.main-container'); // get main container to show / hide it

  // REGISTER
  const formRegister = document.querySelector('#form-register');
  formRegister.addEventListener('submit', (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-undef
    auth.createUserWithEmailAndPassword(formRegister.email.value.trim(), formRegister.password.value.trim()).then((cred) => {
      introductionContainer.style.display = 'none';
      mainContainer.style.display = 'grid';
      formRegister.reset();
      hideModals(modalBoxRegister);
    });
  });

  // LOGIN
  const formLogin = document.querySelector('#form-login');
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-undef
    auth.signInWithEmailAndPassword(formLogin.email.value.trim(), formLogin.password.value.trim()).then((cred) => {
      introductionContainer.style.display = 'none';
      mainContainer.style.display = 'grid';
      formLogin.reset();
      hideModals(modalBoxLogin);
    });
  });

  // LOGOUT
  const logoutLink = document.querySelector('.logout-link');
  logoutLink.addEventListener('click', () => {
    auth.signOut().then(() => {
      mainContainer.style.display = 'none';
      introductionContainer.style.display = 'grid';
    });
  });
};

export { authFunctionality as default };
