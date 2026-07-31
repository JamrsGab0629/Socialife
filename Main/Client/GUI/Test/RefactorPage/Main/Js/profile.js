document.addEventListener('DOMContentLoaded', () => {

  const profileForm = document.getElementById('profileForm');
  const birthdate = document.getElementById('birthdate');

  const today = new Date().toISOString().split('T')[0];
  birthdate.setAttribute('max', today);

  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Profile submitted:', Object.fromEntries(new FormData(profileForm)));
    window.location.href = 'landing.html';
  });

});
