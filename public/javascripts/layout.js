
//a terrible implementation of hiding nav wrtten by thee





window.onload = function(){ 
    // your code 
    var button = document.getElementById("mobile");
var col = document.getElementById("col2");
    var visible =false;

    console.log("work?");


button.addEventListener("click",hamburger);

function hamburger(){
    if(visible){//breaks out if true to restart
        col.style.display ="none";
        
        return visible = false;

            }
    visible=true;

console.log(visible);
console.log("got here?");

    return col.style.display ="block";


    }
  
};

//any resize pop it back in which is kind of unfriendly if your doing that
window.addEventListener('resize',function(){//adds window.resize as event listener
    
    console.log("work dammit work");
    var col = document.getElementById("col2");
    if(col.style.display=="none"){
    return col.style.display ="block";
    }
});



