async function getReports() {
  clearValues();
  let locCat = [];
  let locReps = [];
  let locGrps = []
  await db
    .collection("reports")
    .orderBy("created", "desc")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        locReps.push(doc.data());
      });
    });

  await db
    .collection("categories")
    .orderBy("id")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        locCat.push(doc.data().name);
      });
    });

  await db
    .collection("groups")
    .orderBy("id")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        locGrps.push(doc.data().name);
      });
    });
  reports = locReps;
  categories = locCat;
  groups = locGrps;
  initializeCounts();

    for (let i = 0; i < reports.length; i++) {
        for (let j = 0; j < categories.length; j++) {
            if (reports[i].category == categories[j]) {
                categoriesCount[j] += 1;
            }
        }

        for (let k = 0; k < groups.length; k++) {
            if (reports[i].group - 1 == k) {
                groupsCount[k] += 1;
            }
        }
    }

  initArray();
  byGroup();
  byCategory();
  findMax();
  return;
}

function notifyReport(report) {
    PNotify.info({
        title: "New Report",
        text:
            "Username: " +
            report.data().username +
            " Category: " +
            report.data().category +
            " Group: " +
            report.data().group +
            " " +
            report
                .data()
                .created.toDate()
                .toLocaleString(),
        delay: 3000,
        modules: {
            Buttons: {
                closer: true,
                closerHover: true,
                sticker: false
            },
            Desktop: {
                desktop: true,
                fallback: true,
                icon: null
            },
            Mobile: {
                swipeDismiss: true,
                styling: true
            }
        }
    });
}

async function reportsTable() {
    let cat = {};
    let group = {};
    let cCtr = {};
    let gCtr = {};
    let ctr = 0;

    //Add Head
    let head =
        "<table id='reportsTable' class='table table-striped table-responsive' style='display:block;'>" +
        "<thead class='thead-inverse bg-custom text-custom'>" +
        "<tr>" +
        "<th style='width:4em; text-align:center;'>User</th>" +
        "<th style='width:8em; text-align:center;'>Group</th>" +
        "<th style=' text-align:center;'>Category</th>" +
        "<th style='width:16em; text-align:center;'>Date " +
        "</th>" +
        "<th style='width:0.5em;'>" +
        "<div class='btn-group'>" +
        "<a href='javascript:download()' title='Download as CSV' class='material-icons' style='text-decoration:none'>cloud_download</a>" +
        "</div>" +
        "</th>" +
        "</th></tr></thead>";

    let head2 =
        "<table id='reportsTable2' class='table m-0 table-responsive' style='display:block;'>" +
        "<thead class='bg-custom text-custom'>" +
        "<tr>" +
        "<th style='width:4em; text-align:center;' class='p-0'>User</th>" +
        "<th style='width:10em; text-align:center;' class='p-0'>Group</th>" +
        "<th style='width:2em; text-align:center;' class='p-0'>Category</th>" +
        "</td>" +
        "</th></tr></thead>";

    //Add body
    let body2 = '<tbody class="scroll-secondary">';
    let body = '<tbody class="scroll-secondary">';
    reports.forEach(function (report) {
        ctr += 1;
        if (typeof cCtr[report.category] === "undefined") {
            cCtr[report.category] = 0;
        } else {
            cCtr[report.category] += 1;
        }
        if (typeof gCtr[report.group] === "undefined") {
            gCtr[report.group] = 0;
        } else {
            gCtr[report.group] += 1;
        }

        let date = new Date(report.created["seconds"] * 1000);

        body +=
            "<tr>" +
            "<td style='width:8em;'>" +
            report.username +
            "</td>" +
            "<td style='width:6em;'>" +
            report.group +
            "</td>" +
            "<td style='width:6em;'>" +
            report.category +
            "</td>" +
            "<td style='width:12em;display:flex;justify-content:space-between;'>" +
            report.created.toDate().toLocaleString("en-US") +
            "</td><td style='width:0.5em;'><a class='cursor-pointer' id=" + report.id + " onClick= selectReport(" + report.id + ")> <i class='material-icons'>unfold_more</i ></a ></td > " +
            "</tr>";
        if (ctr <= 5) {
            body2 +=
                "<tr>" +
                "<td style='width:12em;'>" +
                report.username +
                "</td>" +
                "<td style='width:14em;'>" +
                report.group +
                "</td>" +
                "<td style='width:6em;'>" +
                report.category +
                "</td>" +
                "</tr>";
        }
        csvData.push({
            user: report.username,
            group: report.group,
            category: report.category,
            date:
                date.getMonth() +
                1 +
                "-" +
                date.getDay() +
                "-" +
                date.getFullYear() +
                " " +
                date.getHours() +
                ":" +
                date.getMinutes()
        });
    });

    $.each(cCtr, function (key, value) {
        if (cat["value"] < value || typeof cat["value"] === "undefined") {
            cat = { key, value };
        }
    });

    $.each(gCtr, function (key, value) {
        if (group["value"] < value || typeof group["value"] === "undefined") {
            group = { key, value };
        }
    });

    $("#allReports > div:last-child").append(head + body + "</tbody></table>");

    $("#categoryCount").text(cat["key"]);
    $("#groupCount").text(group["key"]);
    $("#reportCount").text(reports.length);
    $("#latestReport").append(head2 + body2 + "</tbody></table>");
}

function convertToCSV(objArray) {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "";

    for (var i = 0; i < array.length; i++) {
        var line = "";
        for (var index in array[i]) {
            if (line != "") line += ",";

            line += array[i][index];
        }

        str += line + "\r\n";
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = this.convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + ".csv" || "export.csv";

    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

async function selectReport(reportID) {
    reports.forEach(async function (report) {
        if (report.id === reportID) {
            await db.collection("reports").where('id', '==', report.id).get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    db.collection("reports").doc(doc.id).update({
                        read: true
                    });
                });
            });
            loadReportDetails(report).then(() => {
                $('#reportDetails').modal('show');
            })
        }
    })
}

async function loadReportDetails(reportSelected) {
    $("#reportTitle").text(reportSelected.username + " " + reportSelected.created.toDate());
    $("#sgroup").text("Group: " + reportSelected.group);
    $("#scategory").text("Category: " + reportSelected.category);
    $("#sdateInfo").text("Occurence: " + reportSelected.datInfo);
    $("#sotherDetails").text("Other Details: " + reportSelected.otherDetails);
    $("#spersonInfo").text("Subject: " + reportSelected.personInfo);
    if (reportSelected.attachFile === "") {
        $("#sattachment").html('Link to attachment: No attachment');
    } else {
        $("#sattachment").html('Link to attachment: <a target=_blank href= ' + reportSelected.attachFile + '>Link</a>');
    }
}

function download() {
    let headers = {
        user: "Username",
        group: "Group",
        category: "Category",
        date: "Date"
    };
    let csvDataFormated = [];
    // format the data
    csvData.forEach(item => {
        csvDataFormated.push({
            user: item.user,
            group: item.group,
            category: item.category,
            date: item.date
        });
    });

    let date = new Date(Date.now());
    let formatedDate =
        date.getMonth() +
        1 +
        "-" +
        date.getDay() +
        "-" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes();
    var fileTitle = "reports(" + formatedDate + ")";

    exportCSVFile(headers, csvDataFormated, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
}

async function addCategory() {
    let name = document.getElementById("catName").value;
    let desc = document.getElementById("catdesc").value;
    if (name == "" || desc == "")
        return
    let size = 0;

    await db.collection("ids").get().then(function (querySnapshot) {
        size = querySnapshot.docs[0].data().categoryID + 1;
        querySnapshot.forEach(function (doc) {
            let newID = doc.data().categoryID + 1
            db.collection("ids").doc(doc.id).update({
                categoryID: newID
            });
        });
    });

    db.collection("categories").doc().set({
        id: size,
        name: name,
        description: desc
    })
        .then(async function () {
            console.log("Document successfully written!");
            sessionStorage.removeItem("category");

            PNotify.success({
                title: "Successfully added Category",
                delay: 2000,
                modules: {
                    Buttons: {
                        closer: true,
                        closerHover: true,
                        sticker: false
                    },
                    Mobile: {
                        swipeDismiss: true,
                        styling: true
                    }
                }
            });

            let displayBy = $('input[name="inlineRadioOptions"]:checked').val();
            await getReports();
            generateColors(displayBy);

            $("#reportCount").text(reports.length);

            loadData(displayBy).then(function () {
                drawVisualization(data);
                drawPie(displayBy);
                drawVisualization2d(search, displayBy);
            });

            document.getElementById("catName").value = "";
            document.getElementById("catdesc").value = "";

        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });
}