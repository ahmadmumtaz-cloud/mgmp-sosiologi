const adminLoginContainer = document.getElementById('admin-login-container');
const questionManagerContainer = document.getElementById('question-manager-container');
const adminLoginBtn = document.getElementById('admin-login-btn');
const adminPasswordInput = document.getElementById('admin-password');

const ADMIN_PASSWORD = "sociology2025"; // Ini password rahasia kita

adminLoginBtn.addEventListener('click', () => {
    const enteredPassword = adminPasswordInput.value;
    if (enteredPassword === ADMIN_PASSWORD) {
        adminLoginContainer.style.display = 'none';
        questionManagerContainer.style.display = 'block';
        loadQuestionsForAdmin();
    } else {
        alert('Password salah!');
    }
});

async function loadQuestionsForAdmin() {
    const questionListDiv = document.getElementById('question-list');
    questionListDiv.innerHTML = '<p>Memuat soal dari server...</p>';
    // Logika lengkap untuk memuat, mengedit, dan menyimpan akan ditambahkan
    // setelah kita menyiapkan Netlify Functions.
}