export default class UI {
  constructor(credsField) {
    this.credsField = credsField;
  }

  displayUserCred(user) {
    db.collection('users').doc(user.uid).get().then((doc) => {
      this.credsField.innerHTML = `
        <div class="profile-heading__shape">
          <span class="profile-heading__nick">${doc.data().nick}</span>
          <span class="profile-heading__email">${user.email}</span>
        </div>
      `;
    });
  }

  clear() {
    this.credsField.innerHTML = '';
  }
}
