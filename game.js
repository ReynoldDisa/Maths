// Global variables
let currentLevel = null;
let playerScore = 0;

// Background music
let bgMusic = null;

// DOM Elements
const levelButtons = document.querySelectorAll('.level-btn');
const gameArea = document.getElementById('game-area');
const levelSelection = document.getElementById('level-selection');
const problemDisplay = document.getElementById('problem-display');
const optionsDiv = document.getElementById('options');
const feedback = document.getElementById('feedback');
const scoreDiv = document.getElementById('score');
const backButton = document.getElementById('back-to-menu');

// Sounds
let correctSound = new Audio('assets/audio/correct.mp3');
let wrongSound = new Audio('assets/audio/wrong.mp3');
let music = new Audio('assets/audio/bg-music.mp3');

// Loop background music
music.loop = true;

// Level button clicks
levelButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentLevel = parseInt(btn.dataset.level);
        playerScore = 0;
        scoreDiv.textContent = `Score: ${playerScore}`;
        levelSelection.style.display = 'none';
        gameArea.style.display = 'flex';
        feedback.textContent = '';
        problemDisplay.textContent = 'Loading...';
        if (!bgMusic) {
            bgMusic = music;
            bgMusic.play();
        }
        generateProblem();
    });
});

// Back button functionality
backButton.addEventListener('click', () => {
    gameArea.style.display = 'none';
    levelSelection.style.display = 'flex';
    optionsDiv.innerHTML = '';
    problemDisplay.textContent = 'Problem will appear here';
    feedback.textContent = '';
});

// Generate a new problem
function generateProblem() {
    optionsDiv.innerHTML = '';
    feedback.textContent = '';

    let operation;
    if (currentLevel === 1) operation = 'add';
    else if (currentLevel === 2) operation = Math.random() < 0.5 ? 'add' : 'sub';
    else if (currentLevel === 3) operation = 'mul';
    else if (currentLevel === 4) operation = ['add','sub','mul'][Math.floor(Math.random()*3)];
    else if (currentLevel === 5) operation = ['add','sub','mul','div'][Math.floor(Math.random()*4)];
    else if (currentLevel === 6) operation = ['add','sub','mul','div'][Math.floor(Math.random()*4)];

    let a, b, answer, question;

    if (operation === 'add') {
        a = Math.floor(Math.random() * 20) + 1;
        b = Math.floor(Math.random() * 20) + 1;
        question = `${a} + ${b} = ?`;
        answer = a + b;
    } else if (operation === 'sub') {
        a = Math.floor(Math.random() * 20) + 1;
        b = Math.floor(Math.random() * 20) + 1;
        if (b > a) [a,b] = [b,a];
        question = `${a} - ${b} = ?`;
        answer = a - b;
    } else if (operation === 'mul') {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        question = `${a} × ${b} = ?`;
        answer = a * b;
    } else if (operation === 'div') {
        b = Math.floor(Math.random() * 10) + 1;
        answer = Math.floor(Math.random() * 10) + 1;
        a = b * answer;
        question = `${a} ÷ ${b} = ?`;
    }

    problemDisplay.textContent = question;

    // Generate options
    let options = [];
    while (options.length < 3) {
        let wrong;
        if (operation === 'mul') wrong = Math.floor(Math.random() * 100) + 1;
        else if (operation === 'div') wrong = Math.floor(Math.random() * 10) + 1;
        else wrong = Math.floor(Math.random() * 40) - 10 + answer;

        if (wrong !== answer && !options.includes(wrong)) options.push(wrong);
    }

    const correctIndex = Math.floor(Math.random() * 4);
    options.splice(correctIndex, 0, answer);

    // Create option buttons
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.addEventListener('click', () => checkAnswer(opt, answer));
        optionsDiv.appendChild(btn);
    });
}

// Check player's answer
function checkAnswer(selected, correct) {
    if (selected === correct) {
        feedback.textContent = 'Correct!';
        feedback.style.color = '#2e7d32';
        correctSound.play();
        playerScore += 10;
    } else {
        feedback.textContent = `Almost got it! Correct answer: ${correct}`;
        feedback.style.color = '#c62828';
        wrongSound.play();
    }

    scoreDiv.textContent = `Score: ${playerScore}`;

    // Win condition for Random Mode
    if (playerScore >= 250 && currentLevel === 6) {
        feedback.textContent = '🎊🎊😄😄Congratulations You Won 😄😄🎊🎊';
        optionsDiv.innerHTML = '';
        return;
    }

    setTimeout(generateProblem, 1000);
}
