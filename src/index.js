import '@babel/polyfill';
import displayingModals, { modalBoxRegister, modalBoxLogin, hideModals } from './modals';
import Authentication from './authentication';
import Profile from './profile';
import Create from './create';
import Search from './search';
import View from './view';

displayingModals();

const listOfTermsCreate = document.querySelector('.create-set__list-of-terms');

const authentication = new Authentication();
const profile = new Profile();
const create = new Create(listOfTermsCreate);
const search = new Search();
const view = new View();

const introductionContainer = document.querySelector('.introduction-container');
const mainContainer = document.querySelector('.main-container');
const adminItems = document.querySelectorAll('.admin-item');
const buttonsCreateSet = document.querySelectorAll('.create-set-button');
const formAddTerm = document.querySelector('.create-set__form-add-term');
const formSetTitle = document.querySelector('.create-set__form-title');

const mainPages = document.querySelectorAll('.main-page');
const navToggler = document.querySelector('#nav-toggler');
const setViewPage = document.querySelector('.set-view-page');
const backIcon = document.querySelector('.topbar__back');
const pagesHistory = ['home-page'];

const hideAllPagesAndShowOne = (pageToShow, isBack = false) => {
  if (auth.currentUser === null) {
    return;
  }
  // HISTORY MANAGEMENT
  const classOfPageToShow = pageToShow.getAttribute('class').split(' ')[1];
  if (classOfPageToShow !== pagesHistory[pagesHistory.length - 1]) {
    pagesHistory.push(classOfPageToShow);
    if (isBack) {
      pagesHistory.splice(pagesHistory.length - 3, 2);
    } else if (pagesHistory[pagesHistory.length - 2] === 'test-page') {
      pagesHistory.splice(pagesHistory.length - 2, 1);
    }
  }
  if (pagesHistory.length > 1) {
    backIcon.setAttribute('data-target', pagesHistory[pagesHistory.length - 2]);
  }
  // HIDING AND SHOWING PAGES
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
  // CLEAR ALMOST ALL SET VIEW PAGE UI AND ATTRIBUTES
  if (!pageToShow.classList.contains('test-page') && Object.entries(view.getActualTerm()).length !== 0) {
    view.clear();
  }
};

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

    // CREATE SET PAGE ACTIONS - START
    formSetTitle.addEventListener('submit', (e) => {
      e.preventDefault();
    });

    buttonsCreateSet.forEach((button) => {
      button.addEventListener('click', () => {
        const title = formSetTitle.title.value.trim();
        create.createSet(title, user.uid).then((data) => {
          if (data) {
            view.writeSetInfo(data);
            hideAllPagesAndShowOne(setViewPage);
            formSetTitle.reset();
            formAddTerm.reset();
            profile.updateCreatedSets(data);
          }
        });
      });
    });

    formAddTerm.addEventListener('submit', (e) => {
      e.preventDefault();
      create.addTerm(formAddTerm);
    });
    // CREATE SET PAGE ACTIONS - END

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
    if (!search.getBlock()) {
      search.displayAllSets().then(() => {
        setTimeout(() => {
          search.setBlock(false);
        }, 500);
      });
    }
  });
});

// PROFILE PAGE
const linksToProfilePage = document.querySelectorAll('.profile-link');
const profilePage = document.querySelector('.profile-page');
linksToProfilePage.forEach((link) => {
  link.addEventListener('click', () => {
    hideAllPagesAndShowOne(profilePage);
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

// SET CLICK
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

// SET VIEW & TEST ACTIONS
const testPage = document.querySelector('.test-page');

const howManyTermsForm = document.querySelector('.set-view__choose-how-many');
howManyTermsForm.addEventListener('submit', (e) => {
  e.preventDefault();
});

const panelWriteTest = document.querySelector('.panel-write-test');
panelWriteTest.addEventListener('click', () => {
  if (view.getTerms().length <= 0) {
    return;
  }
  hideAllPagesAndShowOne(testPage);
  const numberOfTerms = howManyTermsForm.termsNumber.value;
  view.initClassInGeneral('write', numberOfTerms);
  profile.updateLastSetAndStartedSets(view.getID());
});

const panelSelectionTest = document.querySelector('.panel-selection-test');
panelSelectionTest.addEventListener('click', () => {
  if (view.getTerms().length <= 0) {
    return;
  }
  hideAllPagesAndShowOne(testPage);
  const numberOfTerms = howManyTermsForm.termsNumber.value;
  view.initClassInGeneral('selection', numberOfTerms);
  profile.updateLastSetAndStartedSets(view.getID());
});

const testBackLinks = document.querySelectorAll('.test-back-link');
testBackLinks.forEach((link) => {
  link.addEventListener('click', () => {
    hideAllPagesAndShowOne(setViewPage, true);
  });
});

const writeForm = document.querySelector('.test__form');
writeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!view.getCheckBlocker()) {
    view.checkWriteAnswer();
  }
});

const writeButtonIndex = document.querySelector('.write-button');
writeButtonIndex.addEventListener('click', () => {
  if (!view.getGoNextBlocker()) {
    view.writeGoToNextTerm();
  }
});

const selectionAnswersBox = document.querySelector('.test__answers');
selectionAnswersBox.addEventListener('click', (e) => {
  if (e.target.classList.contains('test__answer') && !view.getCheckBlocker()) {
    view.checkSelectionAnswer(e);
  }
});

const selectionButtonIndex = document.querySelector('.selection-button');
selectionButtonIndex.addEventListener('click', () => {
  if (!view.goNextBlocker) {
    view.selectionGoToNextTerm();
  }
});

// BACK TO PREVIOUS PAGE
backIcon.addEventListener('click', () => {
  const pageToShow = document.querySelector(`.${backIcon.getAttribute('data-target')}`);
  hideAllPagesAndShowOne(pageToShow, true);
});

// DELETE TERM FROM LIST AT CREATE SET PAGE
listOfTermsCreate.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-term')) {
    let termToDelete = null;
    if (e.target.parentElement.classList.contains('delete-term')) {
      termToDelete = e.target.parentElement.parentElement;
    } else {
      termToDelete = e.target.parentElement;
    }
    create.deleteTerm(termToDelete);
  }
});
