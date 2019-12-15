const credsField = document.querySelector('.profile-heading');
const setsCreated = document.querySelector('.profile-sets-created');
const setsCreatedInfo = document.querySelector('.profile-sets-info-created');

export default class Profile {
  constructor() {
    this.nick = '';
  }

  // SHOW NICK AND EMAIL OF CURRENT USER
  async displayUserCreds(user) {
    try {
      const data = await db.collection('users').doc(user.uid).get();
      credsField.innerHTML = `
        <div class="profile-heading__shape">
          <span class="profile-heading__nick">${data.data().nick}</span>
          <span class="profile-heading__email">${user.email}</span>
        </div>
      `;
      this.nick = data.data().nick;
    } catch (error) {
      credsField.innerHTML = `
        <div class="profile-heading__shape">
          <span class="profile-heading__email">There is a problem to get your email and nick</span>
        </div>
      `;
    }
  }

  // GET AND SHOW CREATED SETS BY CURRENT USER
  async displayCreatedSets() {
    setsCreated.innerHTML = '';
    try {
      const sets = await db.collection('sets').where('creator', '==', this.nick).orderBy('created_at', 'desc').get();
      if (sets.size === 0) {
        // SHOW INFO TO USER
        if (setsCreatedInfo.classList.contains('hide')) {
          setsCreatedInfo.classList.remove('hide');
        }
      } else {
        // HIDE INFO TO USER
        if (!setsCreatedInfo.classList.contains('hide')) {
          setsCreatedInfo.classList.add('hide');
        }
        // SHOW CURRENT USER'S SETS
        sets.forEach((doc) => {
          const data = doc.data();
          setsCreated.innerHTML += `
            <div class="set set-view-link" data-id="${doc.id}" data-title="${data.title}" data-terms_number="${data.terms_number}" data-creator="${data.creator}">
              <div class="set__title">${data.title}</div>
              <div class="set__terms">${data.terms_number} terms</div>
              <div class="set__creator">${data.creator}</div>
            </div>
          `;
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
