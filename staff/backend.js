(function(){
var defaultEvents=[
{id:"event1",name:"Tech & Innovation Summit 2026",date:"October 12, 2026",time:"10:00 AM - 6:00 PM",location:"Abuja International Conference Centre",gate:"Gate A",live:true},
{id:"event2",name:"Creative Business Expo",date:"October 18, 2026",time:"9:00 AM - 5:00 PM",location:"Central Event Hall",gate:"Gate B",live:false},
{id:"event3",name:"Future Leaders Conference",date:"October 24, 2026",time:"11:00 AM - 4:00 PM",location:"Civic Centre",gate:"Gate C",live:false},
{id:"event4",name:"Digital Creators Meetup",date:"October 29, 2026",time:"2:00 PM - 8:00 PM",location:"Innovation Hub",gate:"Gate A",live:true},
{id:"event5",name:"Startup & Tech Night",date:"November 3, 2026",time:"5:00 PM - 10:00 PM",location:"City View Hall",gate:"Gate D",live:false},
{id:"event6",name:"Music & Culture Festival",date:"November 8, 2026",time:"12:00 PM - 9:00 PM",location:"Festival Grounds",gate:"Gate B",live:false}
];

var defaultAttendees=[
{name:"John Okafor",ticket:"EV-1001",status:"Confirmed",scanned:true},
{name:"Sarah Ahmed",ticket:"EV-1002",status:"Confirmed",scanned:true},
{name:"Daniel James",ticket:"EV-1003",status:"Pending",scanned:false},
{name:"Mary Johnson",ticket:"EV-1004",status:"Duplicate",scanned:true},
{name:"David Musa",ticket:"EV-1005",status:"Confirmed",scanned:true},
{name:"Grace Peter",ticket:"EV-1006",status:"Pending",scanned:false},
{name:"Michael Brown",ticket:"EV-1007",status:"Confirmed",scanned:false},
{name:"Esther Paul",ticket:"EV-1008",status:"Pending",scanned:false},
{name:"Samuel Bello",ticket:"EV-1009",status:"Confirmed",scanned:true},
{name:"Ruth James",ticket:"EV-1010",status:"Pending",scanned:false},
{name:"Brian Cole",ticket:"EV-1011",status:"Invalid",scanned:true},
{name:"Linda Adams",ticket:"EV-1012",status:"Confirmed",scanned:false}
];

function getEvents(){
if(!localStorage.getItem("eventify_events")){
localStorage.setItem("eventify_events",JSON.stringify(defaultEvents));
}
return JSON.parse(localStorage.getItem("eventify_events"));
}

function getAttendees(){
if(!localStorage.getItem("eventify_attendees")){
localStorage.setItem("eventify_attendees",JSON.stringify(defaultAttendees));
}
return JSON.parse(localStorage.getItem("eventify_attendees"));
}

function getUser(){
return JSON.parse(localStorage.getItem("eventify_user")||"null");
}

function setUser(user){
localStorage.setItem("eventify_user",JSON.stringify(user));
}

function getSelectedEvent(){
var id=localStorage.getItem("eventify_selected_event");
return getEvents().find(function(e){
return e.id===id;
});
}

function setSelectedEvent(id){
localStorage.setItem("eventify_selected_event",id);
}

function setScanResult(result){
localStorage.setItem("eventify_scan_result",result);
}

function getScanResult(){
return localStorage.getItem("eventify_scan_result")||"";
}

function clearScanResult(){
localStorage.removeItem("eventify_scan_result");
}

window.EventifyBackend={
getEvents:getEvents,
getAttendees:getAttendees,
getUser:getUser,
setUser:setUser,
getSelectedEvent:getSelectedEvent,
setSelectedEvent:setSelectedEvent,
setScanResult:setScanResult,
getScanResult:getScanResult,
clearScanResult:clearScanResult
};
})();