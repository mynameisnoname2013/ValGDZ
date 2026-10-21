function checkCode() {
    const userInput = document.getElementById('code').value;
    const secretCode = '6752'; 

    if (userInput === secretCode) {
        alert("Добро пожаловать!");
        window.location.href = 'teachermode.html'; 
    } else {
        alert('Неверный код!');
    }
}

