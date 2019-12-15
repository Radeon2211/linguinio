import '@babel/polyfill';
import displayingModals, { modalBoxRegister, modalBoxLogin, hideModals } from './modals';
import Authentication from './authentication';
import Profile from './profile';
import Create from './create';
import Search from './search';
import View from './view';

displayingModals();

// AUTHENTICATION CLASS - CREATE INSTANCE
const authentication = new Authentication();

// PROFILE CLASS - CREATE INSTANCE
const profile = new Profile();

// SET CLASS - CREATE INSTANCE
const create = new Create();

// SEARCH CLASS - CREATE INSTANCE
const search = new Search();

// VIEW CLASS - CREATE INSTANCE
const view = new View();

// GET INTRO AND MAIN CONTAINERS TO SHOW / HIDE THEM
const introductionContainer = document.querySelector('.introduction-container');
const mainContainer = document.querySelector('.main-container');
const adminItems = document.querySelectorAll('.admin-item');

// LISTEN FOR AUTH STATUS CHANGED START
auth.onAuthStateChanged((user) => {
  if (user) {
    user.getIdTokenResult().then((idTokenResult) => {
      const userToEdit = user;
      userToEdit.admin = idTokenResult.claims.admin;
      if (user.admin) { // if user is admin, show admin items
        adminItems.forEach((item) => {
          item.classList.remove('hide');
        });
      }
    });

    // USER CREDENTIALS DISPLAY
    profile.displayUserCreds(user);

    // CREATE SET PAGE ACTIONS - LISTEN START
    // title
    const formSetTitle = document.querySelector('.create-set__form-title');
    formSetTitle.addEventListener('submit', (e) => {
      e.preventDefault();
    });

    // create set
    const buttonsCreateSet = document.querySelectorAll('.create-set-button');
    buttonsCreateSet.forEach((button) => {
      button.addEventListener('click', () => {
        const title = formSetTitle.title.value.trim();
        create.createSet(title, user.uid);
      });
    });

    // add term
    const formAddTerm = document.querySelector('.create-set__form-add-term');
    formAddTerm.addEventListener('submit', (e) => {
      e.preventDefault();
      create.addTerm(formAddTerm);
    });
    // CREATE SET PAGE ACTIONS - LISTEN

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
// AUTH STATUS CHANGED - LISTEN END


// REGISTER START
const formRegister = document.querySelector('#form-register');
formRegister.addEventListener('submit', (e) => {
  e.preventDefault();
  // call register method
  authentication.register(formRegister, hideModals, modalBoxRegister);
});
// REGISTER END

// LOGIN START
const formLogin = document.querySelector('#form-login');
formLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  // call login method
  authentication.login(formLogin, hideModals, modalBoxLogin);
});
// LOGIN END

// LOGOUT START
const logoutLinks = document.querySelectorAll('.logout-link');
logoutLinks.forEach((link) => {
  link.addEventListener('click', () => {
    // call logout method
    authentication.logOut();
  });
});
// LOGOUT END

// ADD ADMIN ROLE START
const formAddAdmin = document.querySelector('#form-add-admin');
formAddAdmin.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = formAddAdmin.email.value.trim();
  // call addAdmin method
  authentication.addAdmin(email, formAddAdmin);
});
// ADD ADMIN ROLE END


// DISPLAYING PAGES AND NAV ITEMS MANAGEMENT
const mainPages = document.querySelectorAll('.main-page'); // all pages
const navToggler = document.querySelector('#nav-toggler'); // side navigation toggler

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

// SEARCH SETS PAGE by clicking the panel at home page nav link
const linksToSearchSets = document.querySelectorAll('.search-sets-link');
const searchSetsPage = document.querySelector('.search-sets-page');
linksToSearchSets.forEach((link) => {
  link.addEventListener('click', () => {
    hideAllPagesAndShowOne(searchSetsPage);
    search.displayAllSets();
  });
});

// PROFILE PAGE by clicking the nav link
const linksToProfilePage = document.querySelectorAll('.profile-link');
const profilePage = document.querySelector('.profile-page');
linksToProfilePage.forEach((link) => {
  link.addEventListener('click', () => {
    hideAllPagesAndShowOne(profilePage);
    profile.displayCreatedSets();
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


// SET CLICK - LISTEN START
const setViewPage = document.querySelector('.set-view-page');
// GET ALL LIST OF SETS (AT PROFILE AND SEARCH SETS PAGE)
const listsOfSets = document.querySelectorAll('.list-of-sets');
listsOfSets.forEach((list) => {
  list.addEventListener('click', (e) => {
    // CHECK IF CLICKED ELEMENT IS A SET
    let clickedElement = null;
    if (e.target.classList.contains('set-view-link')) {
      clickedElement = e.target;
    } else if (e.target.parentElement.classList.contains('set-view-link')) {
      clickedElement = e.target.parentElement;
    }
    if (clickedElement) {
      hideAllPagesAndShowOne(setViewPage);
      // GET INFO ABOUT SET FROM DATA ATTRIBUTES
      const id = clickedElement.getAttribute('data-id');
      const title = clickedElement.getAttribute('data-title');
      const termsNumber = clickedElement.getAttribute('data-terms_number');
      const creator = clickedElement.getAttribute('data-creator');
      // WRITE ALL INFO IN SET VIEW PAGE
      view.writeSetInfo(id, title, termsNumber, creator);
    }
  });
});
// SET CLICK - LISTEN END
