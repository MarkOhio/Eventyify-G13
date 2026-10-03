
(function(){
var screens=document.querySelectorAll(".screen");
var order=["splash","intro1","intro2","intro3","intro4","roles"];
var current=0;
var backButton=document.getElementById("backButton");

function show(index){
screens.forEach(function(screen,i){
screen.classList.toggle("active",i===index);
});
current=index;
backButton.classList.toggle("visible",index>=2);
window.scrollTo(0,0);
}

function next(){
if(current<order.length-1)show(current+1);
}

backButton.addEventListener("click",function(){
show(1);
});

document.querySelectorAll("[data-next]").forEach(function(button){
button.addEventListener("click",next);
});

document.querySelector("[data-skip]").addEventListener("click",function(){
show(order.length-1);
});

document.querySelectorAll("[data-role]").forEach(function(card){
card.addEventListener("click",function(){
document.querySelectorAll("[data-role]").forEach(function(item){
item.classList.remove("selected");
});
card.classList.add("selected");
document.getElementById("roleContinue").classList.add("visible");
});
});

document.getElementById("roleContinue").addEventListener("click",function(){
var selected=document.querySelector("[data-role].selected");
if(!selected)return;
alert(selected.dataset.role==="organizer"?"Organizer flow selected.":"Event staff flow selected.");
});

document.getElementById("loginButton").addEventListener("click",function(){
alert("Login route placeholder.");
});

setTimeout(function(){
show(1);
},1600);
})();
