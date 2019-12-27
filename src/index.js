import '@babel/polyfill';
import displayingModals, { modalBoxRegister, modalBoxLogin, hideModals } from './modals';
import Authentication from './authentication';
import Profile from './profile';
import Create from './create';
import Search from './search';
import View from './view';

displayingModals();

const authentication = new Authentication();
const profile = new Profile();
const create = new Create();
const search = new Search();
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

    profile.displayUserCreds(user);

    // CREATE SET PAGE ACTIONS - LISTEN START
    const formSetTitle = document.querySelector('.create-set__form-title');
    formSetTitle.addEventListener('submit', (e) => {
      e.preventDefault();
    });

    const buttonsCreateSet = document.querySelectorAll('.create-set-button');
    buttonsCreateSet.forEach((button) => {
      button.addEventListener('click', () => {
        const title = formSetTitle.title.value.trim();
        create.createSet(title, user.uid);
      });
    });

    const formAddTerm = document.querySelector('.create-set__form-add-term');
    formAddTerm.addEventListener('submit', (e) => {
      e.preventDefault();
      create.addTerm(formAddTerm);
    });
    // CREATE SET PAGE ACTIONS - LISTEN END

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

// REGISTER
const formRegister = document.querySelector('#form-register');
formRegister.addEventListener('submit', (e) => {
  e.preventDefault();
  authentication.register(formRegister, hideModals, modalBoxRegister);
});

// LOGIN
const formLogin = document.querySelector('#form-login');
formLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  authentication.login(formLogin, hideModals, modalBoxLogin);
});

// LOGOUT
const logoutLinks = document.querySelectorAll('.logout-link');
logoutLinks.forEach((link) => {
  link.addEventListener('click', () => {
    authentication.logOut();
  });
});

// ADD ADMIN ROLE
const formAddAdmin = document.querySelector('#form-add-admin');
formAddAdmin.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = formAddAdmin.email.value.trim();
  authentication.addAdmin(email, formAddAdmin);
});

// DISPLAYING PAGES AND NAV ITEMS MANAGEMENT
const mainPages = document.querySelectorAll('.main-page'); // all pages
const navToggler = document.querySelector('#nav-toggler'); // side navigation toggler

const hideAllPagesAndShowOne = (pageToShow) => {
  mainPages.forEach((page) => {
    if (!page.classList.contains('hide')) {
      page.classList.add('hide');
    }
  });
  pageToShow.classList.remove('hide');
  navToggler.checked = false;
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });

  // IF PAGE TO SHOW ISN'T A TEST PAGE && TERMS TO TEST IS EMPTY - CLEAR VIEW CLASS && TEST PAGE UI
  if (!pageToShow.classList.contains('test-page') && view.termsToTest.length > 0) {
    view.clear();
  }
  // IF PAGE TO SHOW ISN'T TEST OR SET VIEW PAGE, VIEW TERMS > 0 - CLEAR TERMS ARRAY && THEIR NUMBER
  if (!pageToShow.classList.contains('test-page') && !pageToShow.classList.contains('set-view-page') && view.terms.length > 0) {
    view.clearBasicAndSetViewUI();
  }
};

// HOME PAGE
const linksToHomePage = document.querySelectorAll('.home-link');
const homePage = document.querySelector('.home-page');
linksToHomePage.forEach((link) => {
  link.addEventListener('click', () => {
    hideAllPagesAndShowOne(homePage);
  });
});

// CREATE SET PAGE
const linksToCreateSet = document.querySelectorAll('.create-set-link');
const createSetPage = document.querySelector('.create-set-page');
linksToCreateSet.forEach((link) => {
  link.addEventListener('click', () => {
    hideAllPagesAndShowOne(createSetPage);
  });
});

// SEARCH SETS PAGE
const linksToSearchSets = document.querySelectorAll('.search-sets-link');
const searchSetsPage = document.querySelector('.search-sets-page');
linksToSearchSets.forEach((link) => {
  link.addEventListener('click', () => {
    hideAllPagesAndShowOne(searchSetsPage);
    search.displayAllSets();
  });
});

// PROFILE PAGE
const linksToProfilePage = document.querySelectorAll('.profile-link');
const profilePage = document.querySelector('.profile-page');
linksToProfilePage.forEach((link) => {
  link.addEventListener('click', () => {
    hideAllPagesAndShowOne(profilePage);
    profile.displayCreatedSets();
  });
});

// ADMIN PAGE
const linksToAdminPage = document.querySelectorAll('.admin-link');
const adminPage = document.querySelector('.admin-page');
linksToAdminPage.forEach((link) => {
  link.addEventListener('click', () => {
    hideAllPagesAndShowOne(adminPage);
  });
});


// SET ONCLICK
const setViewPage = document.querySelector('.set-view-page');
const listsOfSets = document.querySelectorAll('.list-of-sets');
listsOfSets.forEach((list) => {
  list.addEventListener('click', (e) => {
    // CHECK IF CLICKED ELEMENT IS A SET
    let clickedElement = null;
    if (e.target.classList.contains('set-view-link')) {
      clickedElement = e.target;
    } else if (e.target.parentElement.classList.contains('set-view-link')) {
      clickedElement = e.target.parentElement;
    } else if (e.target.parentElement.parentElement.classList.contains('set-view-link')) {
      clickedElement = e.target.parentElement.parentElement;
    }
    if (clickedElement) {
      hideAllPagesAndShowOne(setViewPage);
      view.writeSetInfo(clickedElement);
    }
  });
});

// SET VIEW ACTIONS
const testPage = document.querySelector('.test-page');

const panelWriteTest = document.querySelector('.panel-write-test');
panelWriteTest.addEventListener('click', () => {
  hideAllPagesAndShowOne(testPage);
  view.initClassInGeneral('write');
  profile.updateLastSetAndStartedSets(view.getID());
});

const panelSelectionTest = document.querySelector('.panel-selection-test');
panelSelectionTest.addEventListener('click', () => {
  hideAllPagesAndShowOne(testPage);
  view.initClassInGeneral('selection');
  profile.updateLastSetAndStartedSets(view.getID());
});

const testBackLinks = document.querySelectorAll('.test-back-link');
testBackLinks.forEach((link) => {
  link.addEventListener('click', () => {
    hideAllPagesAndShowOne(setViewPage);
  });
});

const writeForm = document.querySelector('.test__form');
writeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (view.termsToTest.length > 0) {
    view.checkWriteAnswer(writeForm);
  }
});

const writeButtonIndex = document.querySelector('.write-button');
writeButtonIndex.addEventListener('click', () => {
  if (!view.goNextBlocker) {
    view.writeGoToNextTerm();
  }
});

const selectionAnswersBox = document.querySelector('.test__answers');
selectionAnswersBox.addEventListener('click', (e) => {
  if (e.target.classList.contains('test__answer') && view.termsToTest.length > 0) {
    view.checkSelectionAnswer(e);
  }
});

const selectionButtonIndex = document.querySelector('.selection-button');
selectionButtonIndex.addEventListener('click', () => {
  if (!view.goNextBlocker) {
    view.selectionGoToNextTerm();
  }
});
