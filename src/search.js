const searchSetsContainer = document.querySelector('.search-sets');

export default class Search {
  // DISPLAY ALL SETS AT SEARCH SETS PAGE AFTER ENTER THIS PAGE
  async displayAllSets() {
    searchSetsContainer.innerHTML = '';
    try {
      const sets = await db.collection('sets').orderBy('created_at', 'desc').get();
      sets.forEach((doc) => {
        const data = doc.data();
        searchSetsContainer.innerHTML += `
        <div class="set set-view-link" data-id="${doc.id}">
          <div class="set__title set-view-link">${data.title}</div>
          <div class="set__terms set-view-link">${data.terms_number} terms</div>
          <div class="set__creator set-view-link">${data.creator}</div>
        </div>
      `;
      });
    } catch (error) {
      console.log(error);
    }
  }
}
