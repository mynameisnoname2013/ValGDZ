function checkCode() {
    const userInput = document.getElementById('code').value;
    const secretCode = '6754'; 

    if (userInput === secretCode) {
        alert("Добро пожаловать!");
        window.location.href = 'index2.html'; 
    } else {
        alert('Неверный код!');
    }
}

