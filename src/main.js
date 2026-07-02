const STORAGE_KEY = 'studentwebsite.users';
const SESSION_KEY = 'studentwebsite.currentUserId';

const starterUsers = [
  { id: 'teacher-1', name: 'Avery Parker', email: 'avery.teacher@example.com', password: 'password', role: 'teacher' },
  { id: 'teacher-2', name: 'Jordan Lee', email: 'jordan.teacher@example.com', password: 'password', role: 'teacher' },
  {
    id: 'student-1', name: 'Mia Chen', email: 'mia.student@example.com', password: 'password', role: 'student', teacherId: 'teacher-1',
    progress: { completedLessons: 8, totalLessons: 12, studyPercentage: 67, recentActivity: 'Completed Fractions practice', assignmentStatus: 'In progress' },
  },
  {
    id: 'student-2', name: 'Noah Smith', email: 'noah.student@example.com', password: 'password', role: 'student', teacherId: 'teacher-1',
    progress: { completedLessons: 11, totalLessons: 12, studyPercentage: 92, recentActivity: 'Submitted science reflection', assignmentStatus: 'Submitted' },
  },
  {
    id: 'student-3', name: 'Sofia Garcia', email: 'sofia.student@example.com', password: 'password', role: 'student', teacherId: 'teacher-2',
    progress: { completedLessons: 5, totalLessons: 12, studyPercentage: 42, recentActivity: 'Started vocabulary review', assignmentStatus: 'Needs attention' },
  },
];

let users = loadUsers();
let currentUserId = localStorage.getItem(SESSION_KEY);
let page = currentUserId ? 'dashboard' : 'login';
const app = document.querySelector('#root');

function loadUsers() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(starterUsers));
  return starterUsers;
}

function saveUsers(nextUsers) {
  users = nextUsers;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function defaultProgress() {
  return { completedLessons: 0, totalLessons: 10, studyPercentage: 0, recentActivity: 'Account created', assignmentStatus: 'Not started' };
}

function currentUser() {
  return users.find((user) => user.id === currentUserId) ?? null;
}

function teachers() {
  return users.filter((user) => user.role === 'teacher');
}

function setSession(userId) {
  currentUserId = userId;
  if (userId) localStorage.setItem(SESSION_KEY, userId);
  else localStorage.removeItem(SESSION_KEY);
  page = userId ? 'dashboard' : 'login';
  render();
}

function render() {
  const user = currentUser();
  app.innerHTML = `
    <div class="app-shell">
      ${renderHeader(user)}
      <main class="container">${renderPage(user)}</main>
    </div>
  `;
  bindEvents();
}

function renderHeader(user) {
  return `
    <header class="site-header">
      <div>
        <p class="eyebrow">Student Progress Portal</p>
        <h1>Simple classroom progress tracking</h1>
      </div>
      <nav aria-label="Primary navigation">
        ${user ? `
          <span class="role-pill">${user.role}</span>
          <button class="active" data-page="dashboard">Dashboard</button>
          <button data-action="logout">Log out</button>
        ` : `
          <button class="${page === 'login' ? 'active' : ''}" data-page="login">Login</button>
          <button class="${page === 'signup' ? 'active' : ''}" data-page="signup">Sign up</button>
        `}
      </nav>
    </header>
  `;
}

function renderPage(user) {
  if (!user && page === 'signup') return renderSignup();
  if (!user) return renderLogin();
  if (user.role === 'student') return renderStudentDashboard(user);
  return renderTeacherDashboard(user);
}

function renderLogin(error = '') {
  return `
    <section class="card auth-card">
      <h2>Login</h2>
      <p>Use a sample account like <strong>avery.teacher@example.com</strong> or <strong>mia.student@example.com</strong> with password <strong>password</strong>.</p>
      <form id="login-form">
        <label>Email<input name="email" type="email" required></label>
        <label>Password<input name="password" type="password" required></label>
        ${error ? `<p class="error">${error}</p>` : ''}
        <button class="primary" type="submit">Login</button>
      </form>
      <button class="link-button" data-page="signup">Create a new account</button>
    </section>
  `;
}

function renderSignup(error = '') {
  const teacherOptions = teachers().map((teacher) => `<option value="${teacher.id}">${teacher.name}</option>`).join('');
  return `
    <section class="card auth-card">
      <h2>Create account</h2>
      <form id="signup-form">
        <label>Name<input name="name" required></label>
        <label>Email<input name="email" type="email" required></label>
        <label>Password<input name="password" type="password" required minlength="6"></label>
        <label>Role<select name="role" id="role-select"><option value="student">Student</option><option value="teacher">Teacher</option></select></label>
        <label id="teacher-field">Assigned teacher<select name="teacherId" required>${teacherOptions}</select></label>
        ${error ? `<p class="error">${error}</p>` : ''}
        <button class="primary" type="submit">Sign up</button>
      </form>
      <button class="link-button" data-page="login">Already have an account?</button>
    </section>
  `;
}

function renderStudentDashboard(user) {
  const teacher = teachers().find((item) => item.id === user.teacherId);
  const progress = user.progress;
  return `
    <section class="dashboard-grid">
      <div class="card hero-card"><p class="eyebrow">Student dashboard</p><h2>Welcome, ${user.name}</h2><p>Your assigned teacher is <strong>${teacher?.name ?? 'Not assigned'}</strong>.</p></div>
      <div class="progress-grid">
        <article class="card metric"><span>Completed lessons</span><strong>${progress.completedLessons}/${progress.totalLessons}</strong></article>
        <article class="card metric"><span>Study percentage</span><strong>${progress.studyPercentage}%</strong></article>
        <article class="card metric"><span>Recent activity</span><strong>${progress.recentActivity}</strong></article>
        <article class="card metric"><span>Assignment status</span><strong>${progress.assignmentStatus}</strong></article>
      </div>
    </section>
  `;
}

function renderTeacherDashboard(teacher) {
  const students = users.filter((user) => user.role === 'student' && user.teacherId === teacher.id);
  return `
    <section class="card">
      <p class="eyebrow">Teacher dashboard</p><h2>${teacher.name}'s students</h2><p>Only students assigned to your teacher account are shown here.</p>
      <div class="student-list">
        ${students.length ? students.map(renderStudentRow).join('') : '<p>No students assigned yet.</p>'}
      </div>
    </section>
  `;
}

function renderStudentRow(student) {
  const progress = student.progress;
  return `<article class="student-row"><div><h3>${student.name}</h3><p>${progress.recentActivity}</p></div><span>${progress.completedLessons}/${progress.totalLessons} lessons</span><span>${progress.studyPercentage}%</span><span class="status">${progress.assignmentStatus}</span></article>`;
}

function bindEvents() {
  document.querySelectorAll('[data-page]').forEach((button) => button.addEventListener('click', () => { page = button.dataset.page; render(); }));
  document.querySelector('[data-action="logout"]')?.addEventListener('click', () => setSession(null));
  document.querySelector('#role-select')?.addEventListener('change', (event) => {
    document.querySelector('#teacher-field').hidden = event.target.value !== 'student';
  });
  document.querySelector('#login-form')?.addEventListener('submit', handleLogin);
  document.querySelector('#signup-form')?.addEventListener('submit', handleSignup);
}

function handleLogin(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const user = users.find((item) => item.email.toLowerCase() === form.get('email').toLowerCase() && item.password === form.get('password'));
  if (!user) {
    app.querySelector('main').innerHTML = renderLogin('No user found with that email and password.');
    bindEvents();
    return;
  }
  setSession(user.id);
}

function handleSignup(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  if (users.some((user) => user.email.toLowerCase() === form.get('email').toLowerCase())) {
    app.querySelector('main').innerHTML = renderSignup('An account already exists for that email.');
    bindEvents();
    return;
  }
  const role = form.get('role');
  const newUser = {
    id: `${role}-${crypto.randomUUID()}`,
    name: form.get('name'),
    email: form.get('email'),
    password: form.get('password'),
    role,
    ...(role === 'student' ? { teacherId: form.get('teacherId'), progress: defaultProgress() } : {}),
  };
  saveUsers([...users, newUser]);
  setSession(newUser.id);
}

render();
