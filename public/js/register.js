var password = document.getElementById("password")
  , confirm_password = document.getElementById("confirmPassword");

function validatePassword(){
  if(password.value != confirmPassword.value) {
       confirmPassword.setCustomValidity("Passwords Don't Match");
  } else {
       alert("Successully Registered");
       window.location.replace("http://127.0.0.1:5500/login.html");
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;