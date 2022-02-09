// To authenticate a User
function auth() {
    let mail = document.getElementById("input-mail").value;
    let pass = document.getElementById("pass-mail").value;
    console.log(mail);
    console.log(pass);
    let valid;
    fetch(`http://localhost:8080/api/auth/${mail}/${pass}`, {
        method: 'GET'})
    .then(res => {
        if(res.ok){
            return res.json();
        }
    }).then(data => {
        console.log(data.mailid);
        if(data.mailid != mail){
            document.getElementById("wrong-auth").innerHTML = "Invalid MailId/Password"; 
        }
        else {
            localStorage.setItem("valid", true);
            localStorage.setItem("mail", mail);
            window.location.replace('stocks.html');
        }
    });
}

// To SignUp new user
function signUp() {
    let mail = document.getElementById("input-mail").value;
    let pass = document.getElementById("pass-mail").value;
    let name = "demo";
    fetch(`http://localhost:8080/api/createuser/${mail}/${name}/${pass}`, {
        method: 'POST',
    }).then(res => {
        if(res.ok){
            return res.json();
        }
        else throw new error;
    }).then(data => {
        if(data.mailid == "exists"){
            document.getElementById("wrong-auth").innerHTML = "User already Exists.";
        }
        else{
            localStorage.setItem("valid", true);
            localStorage.setItem("mail", mail);
            window.location.replace('stocks.html');
        }
    }).catch(err => {
        console.log("SignUp error")
    });
}
