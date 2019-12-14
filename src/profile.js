const credsField = document.querySelector('.profile-heading');

export default class Profile {
  async displayUserCreds(user) {
    try {
      const data = await db.collection('users').doc(user.uid).get();
      credsField.innerHTML = `
        <div class="profile-heading__shape">
          <span class="profile-heading__nick">${data.data().nick}</span>
          <span class="profile-heading__email">${user.email}</span>
        </div>
      `;
    } catch (error) {
      credsField.innerHTML = `
        <div class="profile-heading__shape">
          <span class="profile-heading__email">There is a problem to get your email and nick</span>
        </div>
      `;
    }
  }
}
