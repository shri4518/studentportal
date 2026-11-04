// Student records are saved in this browser using localStorage.
const form = document.getElementById('registrationForm');
const table = document.getElementById('studentTable');
const message = document.getElementById('message');
const searchInput = document.getElementById('searchInput');
let students = JSON.parse(localStorage.getItem('students')) || [];

function saveStudents() {
  localStorage.setItem('students', JSON.stringify(students));
}

function showStudents(list = students) {
  table.innerHTML = '';
  document.getElementById('studentCount').textContent = `${students.length} Student${students.length === 1 ? '' : 's'}`;
  document.getElementById('emptyState').style.display = list.length ? 'none' : 'block';
  list.forEach((student, index) => {
    const row = document.createElement('tr');
    [index + 1, student.name, student.email, student.phone, student.course].forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });
    const actionCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-btn';
    deleteButton.addEventListener('click', () => deleteStudent(student.id));
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);
    table.appendChild(row);
  });
}

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const name = document.getElementById('full_name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const course = document.getElementById('course').value;

  if (name.length < 2) { message.textContent = 'Please enter a name with at least 2 characters.'; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { message.textContent = 'Please enter a valid email address.'; return; }
  if (!/^[0-9]{10}$/.test(phone)) { message.textContent = 'Mobile number must contain exactly 10 digits.'; return; }
  if (!course) { message.textContent = 'Please select a course.'; return; }
  if (students.some(s => s.email.toLowerCase() === email.toLowerCase())) { message.textContent = 'This email is already registered.'; return; }

  students.push({ id: Date.now(), name, email, phone, course });
  saveStudents();
  showStudents();
  form.reset();
  message.textContent = 'Student registered successfully!';
});

function deleteStudent(id) {
  if (!confirm('Are you sure you want to delete this student?')) return;
  students = students.filter(student => student.id !== id);
  saveStudents();
  filterStudents();
}

function filterStudents() {
  const term = searchInput.value.toLowerCase();
  const filtered = students.filter(s => `${s.name} ${s.email} ${s.course}`.toLowerCase().includes(term));
  showStudents(filtered);
}

searchInput.addEventListener('input', filterStudents);
document.getElementById('clearAll').addEventListener('click', () => {
  if (!students.length) return;
  if (confirm('Delete ALL student records? This cannot be undone.')) {
    students = [];
    saveStudents();
    showStudents();
  }
});

showStudents();
