import displayingModals, { modalBoxRegister, modalBoxLogin, hideModals } from './modals';
import UI from './ui';

displayingModals();

// GET INTRO AND MAIN CONTAINERS TO SHOW / HIDE THEM
const introductionContainer = document.querySelector('.introduction-container');
const mainContainer = document.querySelector('.main-container');
const adminItems = document.querySelectorAll('.admin-item');

// GET ELEMENTS NEEDED TO UI CLASS
const credsField = document.querySelector('.profile-heading');

// CREATE INSTANCE OF UI CLASS
const ui = new UI(credsField);

// LISTEN FOR AUTH STATUS CHANGED
auth.onAuthStateChanged((user) => {
  if (user) {
    user.getIdTokenResult().then((idTokenResult) => {
      user.admin = idTokenResult.claims.admin;
      if (user.admin) { // if user is admin, show admin items
        adminItems.forEach((item) => {
          item.classList.remove('hide');
        });
      }
    });

    // hide introduction page and show main page
    if (!introductionContainer.classList.contains('hide')) {
      introductionContainer.classList.add('hide');
    }
    if (mainContainer.classList.contains('hide')) {
      mainContainer.classList.remove('hide');
    }
  } else {
    // show introduction container and hide main page
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
  const email = formRegister.email.value.trim();
  const password = formRegister.password.value.trim();
  auth.createUserWithEmailAndPassword(email, password).then((cred) => db.collection('users').doc(cred.user.uid).set({ // return db.collection ...
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
  const email = formLogin.email.value.trim();
  const password = formLogin.password.value.trim();
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
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


// ADD ADMIN ROLE
const formAddAdmin = document.querySelector('#form-add-admin');
formAddAdmin.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = formAddAdmin.email.value.trim();
  const addAdminRole = functions.httpsCallable('addAdminRole'); // get function which adds admin
  addAdminRole({ email }).then((result) => {
    console.log(result);
    formAddAdmin.reset();
    if (auth.currentUser.email === email) { // if current user equals email in form, reload the page
      window.location.reload(true);
    }
  }).catch((error) => {
    console.log(error);
  });
});


// DISPLAYING PAGES AND NAV ITEMS MANAGEMENT
const mainPages = document.querySelectorAll('.main-page'); // all pages
const navToggler = document.querySelector('#nav-toggler'); // side navigation toggler
const notAtHomeItems = document.querySelectorAll('.not-at-home-item'); // nav items which shouldn 't display at home page

// HIDING ALL PAGES AND SHOWING WHICH USER WANTS
const hideAllPagesAndShowOne = (pageToShow) => {
  // hide all pages
  mainPages.forEach((page) => {
    if (!page.classList.contains('hide')) {
      page.classList.add('hide');
    }
  });
  // show page to show
  pageToShow.classList.remove('hide');

  // if page to show is home page, hide not home items from navs
  if (pageToShow.classList.contains('home-page')) {
    notAtHomeItems.forEach((item) => {
      item.classList.add('hide');
    });
  } else {
    notAtHomeItems.forEach((item) => { // else, show them
      item.classList.remove('hide');
    });
  }

  // set sidenav toggler checkbox to false
  navToggler.checked = false;
};


// HOME PAGE by clicking the nav link
const linksToHomePage = document.querySelectorAll('.home-link');
const homePage = document.querySelector('.home-page');
linksToHomePage.forEach((link) => {
  link.addEventListener('click', () => {
    hideAllPagesAndShowOne(homePage);
  });
});

// CREATE SET PAGE by clicking the panel at home page or nav link
const linksToCreateSet = document.querySelectorAll('.create-set-link');
const createSetPage = document.querySelector('.create-set-page');
linksToCreateSet.forEach((link) => {
  link.addEventListener('click', () => {
    hideAllPagesAndShowOne(createSetPage);
  });
});

// SEARCH SETS PAGE by clicking the nav link
const linksToSearchSets = document.querySelectorAll('.search-sets-link');
const searchSetsPage = document.querySelector('.search-sets-page');
linksToSearchSets.forEach((link) => {
  link.addEventListener('click', () => {
    hideAllPagesAndShowOne(searchSetsPage);
  });
});

// PROFILE PAGE by clicking the nav link
const linksToProfilePage = document.querySelectorAll('.profile-link');
const profilePage = document.querySelector('.profile-page');
linksToProfilePage.forEach((link) => {
  link.addEventListener('click', () => {
    hideAllPagesAndShowOne(profilePage);
    if (auth.currentUser) {
      ui.displayUserCred(auth.currentUser);
    }
  });
});

// ADMIN PAGE by clicking the nav link
const linksToAdminPage = document.querySelectorAll('.admin-link');
const adminPage = document.querySelector('.admin-page');
linksToAdminPage.forEach((link) => {
  link.addEventListener('click', () => {
    hideAllPagesAndShowOne(adminPage);
  });
});
