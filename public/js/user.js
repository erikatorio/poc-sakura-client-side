async function getCategories(){
    await db.collection("categories").orderBy("name").get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
             categories.push(doc.data().name)
        });
    });
}

function initializeButtons(){
    var Ctgcontainer = document.getElementById("categoryContainer"); 
    var ctgDesc =  document.getElementById("ctgDesc"); 
    var jBoxes = []
    for(let i=0; i<categories.length; i++){
        Ctgcontainer.innerHTML += `<div class="col-sm">
             <button type="button" id="category` + categories[i] + `" class="col-sm btn btn-secondary w-75 mx-4 my-2"  style=" height: 120px;">
             Category ` + categories[i] + `</button>
           </div>`;
    }
}

function updateDesc(i){
    var ctgDesc =  document.getElementById("ctgDesc"); 
    if(buttons[i].hasAttribute('disabled'))
        return;
    ctgDesc.innerHTML =  '<h6 class="pt-4">Category ' + categories[i] + `:</h6>
    <p><small>Category ` + categories[i] +  ` is a Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</small></p>`;
}

function removeDesc(){
    if(isClicked)
       return;
    var ctgDesc =  document.getElementById("ctgDesc"); 
    ctgDesc.innerHTML = '';
}

function disabledButtons(i, j){
    if(j.hasAttribute('disabled')){
        $('#picture').attr('src', "Images/buttonD.jpg");
        $('#picture').attr('disabled', true);
        $('#picture').attr('data-toggle', false);
        for(let k=0; k<buttons.length; k++){
            if(k!=i)
                buttons[k].removeAttribute("disabled");
        }
        isClicked = false;
    }else{
        $('#picture').attr('src', "Images/buttonA.jpg");
        $('#picture').attr('data-toggle', "modal");
        $('#picture').attr('disabled', false);
        for(let k=0; k<buttons.length; k++){
            if(k!=i){
                buttons[k].setAttribute("disabled", "disabled");
                getCategory(buttons[i].id.replace('category',''));
            }        
        }
        isClicked = true;
    }
   
}

function disableAll(){
    for(let i=0; i<buttons.length; i++){
        buttons[i].removeAttribute("disabled");
    }
}


$(document).ready(function() {
    if(sessionStorage.getItem("username") !== null){
        document.getElementById("userName").innerHTML = sessionStorage.getItem("username");
    }
    getCategories().then(function () {
        initializeButtons();
        buttons = $("button[id^='category']");
        for(let i=0; i<buttons.length; i++){
            let j = i==buttons.length - 1 ? 0 : i+1;
            buttons[i].onclick = function(){disabledButtons(i, buttons[j])};
            buttons[i].onmouseover = function(){updateDesc(i,buttons[i] )};
            buttons[i].onmouseout = function(){removeDesc()};
        }
    });;
    
    $("#picture").click(function(){
        if (jQuery('#picture')[0].hasAttribute('disabled')) {
            $('#picture').attr('src', "Images/buttonD.jpg");
            $('#picture').attr('data-toggle', false);
            $('#picture').attr('disabled', true);
            disableAll();
        }else{
            $('#picture').attr('data-toggle', "modal");
            $('#picture').attr('src', "Images/buttonD.jpg");
            $('#picture').attr('disabled', true);
            disableAll();
        }
    });

    $("#closemodal").click(function(){
        $('#picture').attr('src', "Images/buttonD.jpg");
        $('#picture').attr('data-toggle', false);
        $('#picture').attr('disabled', true);
        disableAll();
    });
});
