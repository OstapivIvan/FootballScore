function isValidName(name) {
    return /^[A-Za-z]+$/.test(name);
}

function isValidEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function validateInputEmail(email) {
    if (email.value.trim() === "") {
        onError(email, "Email cannot be empty");
    } else if (!isValidEmail(email.value.trim())) {
        onError(email, "Email is not valid");
    } else {
        onSuccess(email);
    }
}

function validateInputName(username) {
    if (username.value.trim() === "") {
        onError(username, "Username cannot be empty");
    } else if (!isValidName(username.value.trim())) {
        onError(username, "The field should contain only Latin letters");
    } else {
        onSuccess(username);
    }
}

function validateInputPassword(password) {
    if (password.value.trim() === "") {
        onError(password, "Password cannot be empty");
    } else if (password.value.length < 8) {
        onError(password, "The password must contain at least 8 characters");
    } else {
        onSuccess(password);
    }
}

function validateInputConfirmPassword(password, confirmPassword) {
    if (confirmPassword.value.trim() === "") {
        onError(confirmPassword, "Confirm password cannot be empty");
    } else if (confirmPassword.value.length < 8) {
        onError(confirmPassword, "The password must contain at least 8 characters");
    } else {
        if (password.value.trim() !== confirmPassword.value.trim()) {
            onError(confirmPassword, "Password & Confirm password not matching");
        } else {
            onSuccess(confirmPassword);
        }
    }
}

function onSuccess(input) {
    let parent = input.parentElement;
    let messageEle = parent.querySelector("small");
    messageEle.style.visibility = "hidden";
    parent.classList.remove("error");
    parent.classList.add("success");
}

function onError(input, message) {
    let parent = input.parentElement;
    let messageEle = parent.querySelector("small");
    messageEle.style.visibility = "visible";
    messageEle.innerText = message;
    parent.classList.add("error");
    parent.classList.remove("success");
}

