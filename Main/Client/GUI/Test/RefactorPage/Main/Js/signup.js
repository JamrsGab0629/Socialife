document.addEventListener('DOMContentLoaded', () => {

  const signupForm = document.getElementById('signupForm');

  document.querySelectorAll('.pw-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = document.getElementById(toggle.dataset.target);
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      toggle.textContent = isHidden ? 'Hide' : 'Show';
      toggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    });
  });

  const signupPassword = document.getElementById('signupPassword');
  const strengthBar = document.querySelector('.pw-strength-bar span');
  const strengthLabel = document.querySelector('.pw-strength-label');

  function scorePassword(value) {
    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return score;
  }

  signupPassword.addEventListener('input', () => {
    const value = signupPassword.value;
    const score = scorePassword(value);

    let width = '0%', label = 'Weak', color = 'var(--danger)';
    if (!value) {
      width = '0%'; label = 'Weak';
    } else if (score <= 2) {
      width = '33%'; label = 'Weak'; color = 'var(--danger)';
    } else if (score <= 3) {
      width = '66%'; label = 'Medium'; color = 'var(--warn)';
    } else {
      width = '100%'; label = 'Strong'; color = 'var(--success)';
    }

    strengthBar.style.width = width;
    strengthBar.style.background = color;
    strengthLabel.textContent = label;
  });

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Signup submitted:', Object.fromEntries(new FormData(signupForm)));
  });

});
