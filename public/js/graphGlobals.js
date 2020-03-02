//3D Graph Globals
var data = null;
var graph = null;
var reports = [];
var categoriesCount = [];
var groupsCount = [];
var myPieChart = null;
var categories = [];
var groups = [];
var colors = [];
var pieColors = [];
var loaded = false;
var csvData = [];
var reportSelected = {};

//2D Graph Globals
var barGraph = null;
var search = 0;
var byGroupCount = [];
var byCategoryCount = [];
var maxCategoryCount = 0;
var maxGroupCount = 0;

function clearValues() {
  categoriesCount = [];
  groupsCount = [];
  categories = [];
  groups = [];
  reports = [];
  groupsCount = [];
  colors = [];
  pieColors = [];
  return; 
}

//Array initializations
function initializeCounts() {
    for (let i = 0; i < categories.length; i++) {
        categoriesCount[i] = 0;
    }

    for (let i = 0; i < groups.length; i++) {
        groupsCount[i] = 0;
    }
}

function initArray(){
    for(let i=0; i<groups.length; i++){
        byGroupCount[i] = [];
    }

    for(let i=0; i<categories.length; i++){
        byCategoryCount[i] = [];
    }

    for(let i=0; i<categories.length; i++){
        for(let j=0; j<groups.length; j++){
            byCategoryCount[i][j] = 0;
        }
    }

    for(let i=0; i<groups.length; i++){
        for(let j=0; j<categories.length; j++){
            byGroupCount[i][j] = 0;
        }
    }
}

function initSearchValue(){
    search = parseInt(document.getElementById("search").value);
}