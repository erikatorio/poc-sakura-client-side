// Initializing a class definition
class Users {
    constructor(userID, userName, group) {
        this.userID = userID;
        this.userName = userName;
        this.group = group;
    }
}

class Report{
    constructor(userID, userName, group, category){
        this.userID = userID;
        this.userName = userName;
        this.group = group;
        this.category = category;
    }
}


reports = []
users = []

// Check browser support
if (typeof(Storage) !== "undefined") {
    // Store
    // localStorage.clear();
    localReports = JSON.parse(localStorage.getItem("reports"));
    localUsers = JSON.parse(localStorage.getItem("users"));
   if(localmovies === null)
      localStorage.setItem("reports", JSON.stringify(reports));
   if(localshowings === null)
      localStorage.setItem("users", JSON.stringify(users));
  } else {
    //document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
  }
