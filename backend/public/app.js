async function login(event) {
  event.preventDefault();

  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const messageEl = document.getElementById('login-message');

  messageEl.textContent = '';
  messageEl.className = 'message';

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    messageEl.textContent = 'Please enter both username and password.';
    messageEl.classList.add('error');
    return;
  }

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      messageEl.textContent = data.error || 'Login failed';
      messageEl.classList.add('error');
      return;
    }

    messageEl.textContent = data.message || 'Login successful';
    messageEl.classList.add('success');
  } catch (error) {
    console.error('Login error:', error);
    messageEl.textContent = 'Something went wrong. Please try again.';
    messageEl.classList.add('error');
  }
}

async function register(event) {
  event.preventDefault();

  const usernameInput = document.getElementById('register-username');
  const emailInput = document.getElementById('register-email');
  const phoneInput = document.getElementById('register-phone');
  const passwordInput = document.getElementById('register-password');
  const messageEl = document.getElementById('register-message');

  messageEl.textContent = '';
  messageEl.className = 'message';

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    messageEl.textContent = 'Username and password are required.';
    messageEl.classList.add('error');
    return;
  }

  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, email, phone })
    });

    const data = await response.json();

    if (!response.ok) {
      messageEl.textContent = data.error || 'Registration failed';
      messageEl.classList.add('error');
      return;
    }

    messageEl.textContent = data.message || 'Registration successful';
    messageEl.classList.add('success');

    // Optionally clear fields
    passwordInput.value = '';
  } catch (error) {
    console.error('Registration error:', error);
    messageEl.textContent = 'Something went wrong. Please try again.';
    messageEl.classList.add('error');
  }
}

function initAuthForms() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegisterBtn = document.getElementById('show-register');

  if (loginForm) {
    loginForm.addEventListener('submit', login);
  }

  if (registerForm) {
    registerForm.addEventListener('submit', register);
  }

  if (showRegisterBtn && registerForm) {
    showRegisterBtn.addEventListener('click', () => {
      registerForm.classList.toggle('hidden');
    });
  }
}

document.addEventListener('DOMContentLoaded', initAuthForms);

