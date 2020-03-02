function displayLogin() {
    var x = document.getElementById("anonlogin");
    var y = document.getElementById("logindiv1");
    var z = document.getElementById("logindiv2");
    if (x.style.display === "none") {
      z.style.animation = "fadeout .3s ease 0s forwards";
      y.style.animation = "fadeout .3s ease 0s forwards";
      setTimeout(function(){ 
        z.style.display = "none";
        y.style.display = "none";
        x.style.display = "block";
      },400);
    } else {
        z.style.animation = "fadein .3s ease 0s forwards";
        y.style.animation = "fadein .3s ease 0s forwards";
        z.style.display = "block";
        y.style.display = "block";
        x.style.display = "none";
    }
  }
