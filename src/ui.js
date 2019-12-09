export default class UI {
  constructor(credsField) {
    this.credsField = credsField;
  }

  async displayUserCreds(user) {
    try {
      const data = await db.collection('users').doc(user.uid).get();
      this.credsField.innerHTML = `
        <div class="profile-heading__shape">
          <span class="profile-heading__nick">${data.data().nick}</span>
          <span class="profile-heading__email">${user.email}</span>
        </div>
      `;
    } catch (error) {
      this.credsField.innerHTML = `
        <div class="profile-heading__shape">
          <span class="profile-heading__email">There is a problem to get your email and nick</span>
        </div>
      `;
    }
  }

  clear() {
    this.credsField.innerHTML = '';
  }
}
