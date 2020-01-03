const searchSetsContainer = document.querySelector('.search-sets');

export default class Search {
  constructor() {
    this.block = false;
  }

  // DISPLAY ALL SETS AT SEARCH SETS PAGE AFTER ENTER THIS PAGE
  async displayAllSets() {
    this.block = true;
    searchSetsContainer.innerHTML = '';
    try {
      const sets = await db.collection('sets').orderBy('created_at', 'desc').get();
      sets.forEach((doc) => {
        const data = doc.data();
        searchSetsContainer.innerHTML += `
        <div class="set set-view-link" data-id="${doc.id}" data-title="${data.title}" data-terms_number="${data.terms_number}" data-creator="${data.creator}">
          <div class="set__title">${data.title}</div>
          <div class="set__terms">${data.terms_number} terms</div>
          <div class="set__creator">${data.creator}</div>
        </div>
      `;
      });
    } catch (error) {
      console.log(error);
    }
  }

  getBlock() {
    return this.block;
  }

  setBlock(block) {
    this.block = block;
  }
}
