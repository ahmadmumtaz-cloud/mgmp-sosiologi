const loginContainer = document.getElementById('login-container');
const quizContainer = document.getElementById('quiz-container');
const resultsContainer = document.getElementById('results-container');
const startQuizBtn = document.getElementById('start-quiz-btn');
const userNameInput = document.getElementById('user-name');
const userSchoolInput = document.getElementById('user-school');
const userClassInput = document.getElementById('user-class');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const rationaleElement = document.getElementById('rationale');
const nextButton = document.getElementById('next-btn');
const resultsTitle = document.getElementById('results-title');
const scoreText = document.getElementById('score-text');
const downloadPdfBtn = document.getElementById('download-pdf-btn');
const restartButton = document.getElementById('restart-btn');

let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let userData = {};

async function loadQuestions() {
    try {
        const response = await fetch('questions.json?t=' + new Date().getTime());
        if (!response.ok) {
            throw new Error('Gagal memuat soal. File questions.json tidak ditemukan.');
        }
        quizData = await response.json();
    } catch (error) {
        questionElement.innerHTML = error.message;
        console.error(error);
    }
}

startQuizBtn.addEventListener('click', () => {
    const name = userNameInput.value.trim();
    const school = userSchoolInput.value.trim();
    const userClass = userClassInput.value.trim();

    if (!name || !school || !userClass) {
        alert('Harap isi semua data diri!');
        return;
    }

    userData = { name, school, userClass };
    loginContainer.style.display = 'none';
    quizContainer.style.display = 'block';
    startQuiz();
});

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.style.display = 'none';
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = quizData[currentQuestionIndex];
    questionElement.innerHTML = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;
    currentQuestion.answerOptions.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        if (answer.isCorrect) button.dataset.correct = "true";
        button.dataset.rationale = answer.rationale || "Tidak ada penjelasan.";
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.style.display = "none";
    rationaleElement.style.display = "none";
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    if (selectedBtn.dataset.correct === "true") {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }

    rationaleElement.innerText = selectedBtn.dataset.rationale;
    rationaleElement.style.display = "block";

    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") button.classList.add("correct");
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore() {
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    resultsTitle.innerText = `Hasil untuk ${userData.name}`;
    scoreText.innerHTML = `Selamat! Anda berhasil menjawab benar <strong>${score}</strong> dari <strong>${quizData.length}</strong> soal.`;
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        showQuestion();
    } else {
        showScore();
    }
});

restartButton.addEventListener("click", () => {
    resultsContainer.style.display = 'none';
    loginContainer.style.display = 'block';
    userNameInput.value = '';
    userSchoolInput.value = '';
    userClassInput.value = '';
});

downloadPdfBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const quizTitle = "HASIL KUIS: PREDIKSI SOAL TKA & US 2025";
    const publisher = "MGMP SOSIOLOGI KAB. BOGOR";
    const now = new Date();
    const timestamp = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ', ' + now.toLocaleTimeString('id-ID');

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(quizTitle, 105, 20, null, null, 'center');
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(publisher, 105, 28, null, null, 'center');
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Nama Siswa:", 20, 50);
    doc.setFont("helvetica", "normal");
    doc.text(userData.name, 60, 50);

    doc.setFont("helvetica", "bold");
    doc.text("Sekolah:", 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text(userData.school, 60, 60);
    
    doc.setFont("helvetica", "bold");
    doc.text("Kelas:", 20, 70);
    doc.setFont("helvetica", "normal");
    doc.text(userData.userClass, 60, 70);
    
    doc.setFont("helvetica", "bold");
    doc.text("Waktu:", 20, 80);
    doc.setFont("helvetica", "normal");
    doc.text(timestamp, 60, 80);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("SKOR AKHIR", 105, 100, null, null, 'center');
    
    doc.setFontSize(22);
    doc.text(`${score} / ${quizData.length}`, 105, 110, null, null, 'center');
    doc.setFontSize(12);
    doc.text("Jawaban Benar", 105, 118, null, null, 'center');

    const filename = `Hasil Kuis - ${userData.name} - Sosiologi.pdf`;
    doc.save(filename);
});

loadQuestions();