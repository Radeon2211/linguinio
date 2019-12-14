const setTitle = document.querySelector('.set-view__heading');
const setTermsNumber = document.querySelector('.set-view__terms-number');
const setCreator = document.querySelector('.set-view__creator-nick');
const listOfTerms = document.querySelector('.set-view__list-of-terms');

export default class View {
  constructor() {
    this.terms = [];
    this.number = 0;
  }

  // WRITE INFO ABOUT SET
  async writeSetInfo(id, title, termsNumber, creator) {
    // CLEAR LIST OF TERMS
    listOfTerms.innerHTML = '';
    // WRITE BASIC INFO AND SET NUMBER OF TERMS
    setTitle.innerHTML = title;
    setTermsNumber.innerHTML = `(${termsNumber})`;
    setCreator.innerHTML = creator;

    // GET TERMS FROM DATABASE
    try {
      const data = await db.collection('sets').doc(id).collection('terms').get();
      data.forEach((doc) => {
        const term = doc.data();
        this.terms.push(term);
        this.number += 1;
        listOfTerms.innerHTML += `
          <div class="term">
            <span class="term__number">${this.number}.</span>
            <div class="term__words">
              <span class="term__word">${term.origin}</span>
              <span class="term__word">${term.definition}</span>
            </div>
          </div>
        `;
      });
    } catch (error) {
      console.log(error);
    }
  }
}
