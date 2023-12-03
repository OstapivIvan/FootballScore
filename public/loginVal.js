const email = document.getElementById("Email");
const password = document.getElementById("Password");
const form = document.getElementById("login_form");

document.querySelector("button").addEventListener("click", (event) => {
    event.preventDefault();
    validateInputEmail(email);
    validateInputPassword(password);
    if (form.checkValidity()) {
        form.submit();
    }
});
