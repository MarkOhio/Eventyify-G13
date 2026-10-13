var now = new Date().getTime();
var hour = 60 * 60 * 1000;

var backend = {
    staff: {
        firstName: "Daniel",
        fullName: "Daniel .E",
        initials: "DE",
        role: "Staff",
        email: "staff@eventify.com",
        password: "password123"
    },

    otpCode: "123456",

    events: [
        {
            id: 1,
            name: "Tech & Creators Summit 2026",
            image:"assets/event1.png",
            location: "Eko Conventional Centre, Victoria Island, Lagos",
            shortLocation: "Eko Conventional Center, V.I, Lagos",
            gate: "Gate A",
            guests: 500,
            startsAt: now - 1 * hour,
            endsAt: now + 5 * hour,
            status: "accepted"
        },
        {
            id: 2,
            name: "Design Challenge Sprint, 2026",
            image: "assets/event2.png",
            location: "Eko Conventional Centre, Victoria Island, Lagos",
            shortLocation: "Eko Conventional Center, V.I, Lagos",
            gate: "Gate C",
            guests: 5000,
            startsAt: now + 30 * hour,
            endsAt: now + 38 * hour,
            status: "accepted"
        },
        {
            id: 3,
            name: "Product Design Summit 2026",
            image: "assets/event3.png",
            location: "Eko Conventional Centre, Victoria Island, Lagos",
            shortLocation: "Eko Conventional Center, V.I, Lagos",
            gate: "Gate B",
            guests: 800,
            startsAt: now + 52 * hour,
            endsAt: now + 60 * hour,
            status: "invited"
        },
        {
            id: 4,
            name: "Hackathon Conference",
            image: "assets/event1.png",
            location: "Yaba Tech Hub, Lagos",
            shortLocation: "Yaba Tech Hub, Lagos",
            gate: "Gate D",
            guests: 400,
            startsAt: now + 100 * hour,
            endsAt: now + 108 * hour,
            status: "invited"
        }
    ],

    tickets: {
        "EVT-4582": { name: "John Eze", type: "VIP", eventId: 1 },
        "EVT-4583": { name: "Adeola Johnson", type: "VIP", eventId: 1 },
        "EVT-4584": { name: "Christabel Johnson", type: "Regular", eventId: 1 },
        "EVT-4585": { name: "Patrick Ugwu", type: "VVIP", eventId: 1 },
        "EVT-4586": { name: "Stephen Ade", type: "Regular", eventId: 1 },
        "EVT-4587": { name: "Omotola Jade", type: "Regular", eventId: 1 },
        "EVT-4590": { name: "Grace Bello", type: "Regular", eventId: 2 }
    },

    checkIns: [
        { eventId: 1, time: "11:48AM", name: "Eze John", code: "EVT-4567", type: "Regular", status: "Confirmed", gate: "Gate 1" },
        { eventId: 1, time: "11:38AM", name: "Amara Junior", code: "EVT-4566", type: "Regular", status: "Confirmed", gate: "Gate 1" },
        { eventId: 1, time: "11:30AM", name: "Ezra Johnson", code: "EVT-4565", type: "VIP", status: "Confirmed", gate: "Gate 1" },
        { eventId: 1, time: "11:18AM", name: "Ola Pelumi", code: "EVT-4561", type: "Regular", status: "Duplicate", gate: "Gate 1" },
        { eventId: 1, time: "11:08AM", name: "Micheal Friday", code: "EVT-4563", type: "VIP", status: "Confirmed", gate: "Gate 1" },
        { eventId: 1, time: "10:58AM", name: "Eniola Thomas", code: "EVT-4562", type: "Regular", status: "Confirmed", gate: "Gate 1" },
        { eventId: 1, time: "10:48AM", name: "David Idowu", code: "AVT-3301", type: "Regular", status: "Declined", gate: "Gate 1" },
        { eventId: 1, time: "10:30AM", name: "Ola Pelumi", code: "EVT-4561", type: "Regular", status: "Confirmed", gate: "Gate 1" },
        { eventId: 1, time: "10:18AM", name: "Nancy Clifford", code: "EVT-4559", type: "VVIP", status: "Confirmed", gate: "Gate 1" }
    ]
};
