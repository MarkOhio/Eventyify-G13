(function(){

function q(s){
return document.querySelector(s);
}

function qa(s){
return document.querySelectorAll(s);
}

function go(url){
window.location.href=url;
}

function notice(text){
var old=q(".notice");

if(old){
old.remove();
}

var n=document.createElement("div");

n.className="notice";
n.textContent=text;

document.body.appendChild(n);

setTimeout(function(){
n.remove();
},3000);
}

function userName(){
var u=EventifyBackend.getUser();

return u&&u.name?u.name:"Event Staff";
}

var page=document.body.dataset.page;

if(page==="signup"){

q("#signupForm").addEventListener("submit",function(e){

e.preventDefault();

var name=q("#name").value.trim();
var email=q("#email").value.trim();
var password=q("#password").value;

if(!name||!email||!password){
q("#message").textContent="Please fill in all fields.";
return;
}

EventifyBackend.setUser({
name:name,
email:email,
password:password,
verified:false
});

go("verify.html");

});

q("#loginLink").addEventListener("click",function(){
go("login.html");
});

}

if(page==="verify"){

var user=EventifyBackend.getUser();

if(!user){
go("signup.html");
}

q("#emailText").textContent=user?user.email:"";

qa(".code-row input").forEach(function(input,index){

input.addEventListener("input",function(){

if(input.value.length>0&&index<5){
qa(".code-row input")[index+1].focus();
}

});

});

q("#verifyForm").addEventListener("submit",function(e){

e.preventDefault();

var code=[].slice.call(qa(".code-row input")).map(function(x){
return x.value;
}).join("");

if(code.length!==6){
q("#message").textContent="Enter the 6 digit code.";
return;
}

user.verified=true;

EventifyBackend.setUser(user);

q("#message").className="message success";
q("#message").textContent="Email verified successfully.";

setTimeout(function(){
go("login.html");
},900);

});

q("#resend").addEventListener("click",function(){
notice("A new verification code has been sent.");
});

}

if(page==="login"){

q("#loginForm").addEventListener("submit",function(e){

e.preventDefault();

var email=q("#email").value.trim();
var password=q("#password").value;
var user=EventifyBackend.getUser();

if(!email||!password){
q("#message").textContent="Enter your email and password.";
return;
}

if(!user||user.email!==email||user.password!==password){
q("#message").textContent="Email or password is incorrect.";
return;
}

if(!user.verified){
go("verify.html");
return;
}

go("dashboard.html");

});

q("#signupLink").addEventListener("click",function(){
go("signup.html");
});

}

if(page==="dashboard"){

var user=EventifyBackend.getUser();

if(!user){
go("login.html");
}

q("#userName").textContent=userName();

var grid=q("#events");

EventifyBackend.getEvents().forEach(function(event){

var card=document.createElement("div");

card.className="event-card";

card.innerHTML=
'<div class="event-img">'+event.name+'</div>'+
'<div class="event-name">'+event.name+'</div>'+
'<div class="event-info">'+
event.date+'<br>'+
event.time+'<br>'+
event.location+'<br>'+
event.gate+
'</div>'+
'<div class="event-bottom">'+
'<span class="badge '+(event.live?"live":"")+'">'+
(event.live?"LIVE":"UPCOMING")+
'</span>'+
'<button class="scan-btn">Scan</button>'+
'</div>';

card.querySelector(".scan-btn").addEventListener("click",function(){

if(!event.live){
notice("This event has not started yet.");
return;
}

EventifyBackend.setSelectedEvent(event.id);

go("scanner.html");

});

grid.appendChild(card);

});

q("#logout").addEventListener("click",function(){

localStorage.removeItem("eventify_user");

go("login.html");

});

q("#checkin").addEventListener("click",function(){
go("checkin.html");
});

}

if(page==="scanner"){

var event=EventifyBackend.getSelectedEvent();

if(!event){
go("dashboard.html");
}

q("#eventName").textContent=event.name;

q("#eventInfo").textContent=
event.date+" • "+
event.location+" • "+
event.gate;

var video=q("#camera");
var placeholder=q("#placeholder");

if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia){

navigator.mediaDevices.getUserMedia({
video:{
facingMode:{
ideal:"environment"
}
},
audio:false
})

.then(function(stream){

video.srcObject=stream;

video.classList.remove("hidden");

placeholder.classList.add("hidden");

})

.catch(function(){

placeholder.textContent=
"Camera access was not allowed. Use the test buttons below.";

});

}else{

placeholder.textContent=
"Camera is not available in this browser.";

}

qa("[data-result]").forEach(function(btn){

btn.addEventListener("click",function(){

EventifyBackend.setScanResult(
btn.dataset.result
);

go("result.html");

});

});

q("#checkedIn").addEventListener("click",function(){
go("checkin.html");
});

q("#backDashboard").addEventListener("click",function(){
go("dashboard.html");
});

}

if(page==="result"){

var result=EventifyBackend.getScanResult()||"confirmed";

var event=EventifyBackend.getSelectedEvent();

var data={

confirmed:{
title:"Check-in Successful!",
text:"Attendee confirmed and checked in.",
className:"green",
icon:"✓",
status:"Confirmed"
},

duplicate:{
title:"Duplicate Ticket",
text:"This ticket has already been scanned.",
className:"orange",
icon:"!",
status:"Duplicate"
},

invalid:{
title:"Invalid QR Code",
text:"This QR code could not be verified.",
className:"red",
icon:"×",
status:"Invalid"
}

}[result];

q("#resultIcon").className=
"result-icon "+data.className;

q("#resultIcon").textContent=data.icon;

q("#resultTitle").textContent=data.title;

q("#resultText").textContent=data.text;

q("#resultEvent").textContent=
event?event.name:"Eventify Event";

q("#resultStatus").textContent=data.status;

q("#scanAgain").addEventListener("click",function(){
go("scanner.html");
});

q("#viewCheckin").addEventListener("click",function(){
go("checkin.html");
});

}

if(page==="checkin"){

var event=EventifyBackend.getSelectedEvent();

if(event){
q("#historyEvent").textContent=event.name;
}

var tbody=q("#attendees");

EventifyBackend.getAttendees().forEach(function(person){

var tr=document.createElement("tr");

var status=person.status.toLowerCase();

tr.innerHTML=
"<td>"+person.name+"</td>"+
"<td>"+person.ticket+"</td>"+
"<td>"+(person.scanned?"Scanned":"Not scanned")+"</td>"+
"<td><span class=\"status "+
status+
"\">"+
person.status+
"</span></td>";

tbody.appendChild(tr);

});

q("#backScan").addEventListener("click",function(){

if(event){
go("scanner.html");
}else{
go("dashboard.html");
}

});

q("#dashboardLink").addEventListener("click",function(){
go("dashboard.html");
});

}

})();