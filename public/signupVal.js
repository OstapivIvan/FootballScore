const username = document.getElementById("username");
const email = document.getElementById("Email");
const password = document.getElementById("Password");
const confirm_password = document.getElementById("Confirm_password");
const button = document.getElementById("button");
const form =document.getElementById("signup");


button.addEventListener("click", (event) => {
    event.preventDefault();
    validateInputName(username)
    validateInputEmail(email);
    validateInputPassword(password);
    validateInputConfirmPassword(password, confirm_password);
    if (form.checkValidity()) {
        form.submit();
    }
});

