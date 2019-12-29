const credsField = document.querySelector('.profile-heading');
const setsCreated = document.querySelector('.profile-sets-created');
const setsCreatedInfo = document.querySelector('.profile-sets-info-created');
const setsStarted = document.querySelector('.profile-sets-started');
const setsStartedInfo = document.querySelector('.profile-sets-info-started');
const recentSet = document.querySelector('.home-page__recent-set');
const recentSetTitle = document.querySelector('.home-page__recent-set-title');

export default class Profile {
  constructor() {
    this.id = '';
    this.nick = '';
    this.lastSet = '';
    this.startedSets = [];
  }

  async displayUserCreds(user) {
    try {
      const info = await db.collection('users').doc(user.uid).get();
      const data = await info.data();
      credsField.innerHTML = `
        <div class="profile-heading__shape">
          <span class="profile-heading__nick">${data.nick}</span>
          <span class="profile-heading__email">${user.email}</span>
        </div>
      `;
      this.id = user.uid;
      this.nick = data.nick;
      this.lastSet = data.lastSet;
      this.startedSets = data.started_sets;
      this.displayLastSet();
      this.displayStartedSets();
      this.displayCreatedSets();
    } catch (error) {
      credsField.innerHTML = `
        <div class="profile-heading__shape">
          <span class="profile-heading__email">There is a problem to get your email and nick</span>
        </div>
      `;
    }
  }

  async displayLastSet() {
    if (this.lastSet) {
      try {
        const info = await db.collection('sets').doc(this.lastSet).get();
        const data = await info.data();
        recentSetTitle.textContent = `${data.title}`;
        recentSet.setAttribute('data-id', info.id);
        recentSet.setAttribute('data-title', data.title);
        recentSet.setAttribute('data-terms_number', data.terms_number);
        recentSet.setAttribute('data-creator', data.creator);
        recentSet.classList.remove('hide');
        recentSet.classList.add('set-view-link');
      } catch (error) {
        console.log(error);
      }
    }
  }

  async displayCreatedSets() {
    setsCreated.innerHTML = '';
    try {
      const sets = await db.collection('sets').where('creator', '==', this.nick).orderBy('created_at', 'desc').get();
      if (sets.size === 0) {
        if (setsCreatedInfo.classList.contains('hide')) {
          setsCreatedInfo.classList.remove('hide');
        }
      } else {
        if (!setsCreatedInfo.classList.contains('hide')) {
          setsCreatedInfo.classList.add('hide');
        }
        sets.forEach((set) => {
          const data = set.data();
          this.appendSetToList(setsCreated, data, set.id);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  updateCreatedSets(data) {
    if (!setsCreatedInfo.classList.contains('hide')) {
      setsCreatedInfo.classList.add('hide');
    }
    const info = {
      id: data.getAttribute('data-id'),
      title: data.getAttribute('data-title'),
      terms_number: data.getAttribute('data-terms_number'),
      creator: data.getAttribute('data-creator'),
    };
    this.prependSetToList(setsCreated, info, info.id);
  }

  async displayStartedSets() {
    setsStarted.innerHTML = '';
    if (this.startedSets.length === 0) {
      setsStartedInfo.classList.remove('hide');
      return;
    }
    this.startedSets.forEach((set) => {
      db.collection('sets').doc(set).get().then((info) => {
        const data = info.data();
        this.appendSetToList(setsStarted, data, info.id);
      })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  async updateLastSetAndStartedSets(currentSetId) {
    if (!setsStartedInfo.classList.contains('hide')) {
      setsStartedInfo.classList.add('hide');
    }
    // UPDATE LAST SET OF CURRENT USER
    if (this.lastSet !== currentSetId) {
      this.lastSet = currentSetId;
      try {
        db.collection('users').doc(this.id).update({
          lastSet: currentSetId,
        });
      } catch (error) {
        console.log(error);
      }
      this.displayLastSet();
    }

    // ADD CURRENT SET TO SETS ARRAY IN USER DOCUMENT
    let isTheSame = false;
    this.startedSets.forEach((set) => {
      if (set === currentSetId) {
        isTheSame = true;
      }
    });
    if (!isTheSame) {
      this.startedSets.unshift(currentSetId);
      try {
        // UPDATE STARTED SETS IN USER DOCUMENT
        db.collection('users').doc(this.id).update({
          started_sets: this.startedSets,
        });
        // UPDATE UI IN PROFILE PAGE (STARTED SETS)
        const info = await db.collection('sets').doc(currentSetId).get();
        const data = await info.data();
        this.prependSetToList(setsStarted, data, info.id);
      } catch (error) {
        console.log(error);
      }
    }
  }

  appendSetToList(container, data, id) {
    const listOfSets = container;
    listOfSets.innerHTML += `
      <div class="set set-view-link" data-id="${id}" data-title="${data.title}" data-terms_number="${data.terms_number}" data-creator="${data.creator}">
        <div class="set__title">${data.title}</div>
        <div class="set__terms">${data.terms_number} terms</div>
        <div class="set__creator">${data.creator}</div>
      </div>
    `;
  }

  prependSetToList(container, data, id) {
    const listOfSets = container;
    const element = document.createElement('div');
    element.classList.add('set', 'set-view-link');
    element.setAttribute('data-id', id);
    element.setAttribute('data-title', data.title);
    element.setAttribute('data-terms_number', data.terms_number);
    element.setAttribute('data-creator', data.creator);
    element.innerHTML = `
      <div class="set__title">${data.title}</div>
      <div class="set__terms">${data.terms_number} terms</div>
      <div class="set__creator">${data.creator}</div>
    `;
    listOfSets.prepend(element);
  }
}
