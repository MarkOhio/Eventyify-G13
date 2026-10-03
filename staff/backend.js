var backend = {
    user: {
        firstName: "Daniel",
        fullName: "Daniel E.",
        initials: "DE",
        role: "Staff",
        email: "staff@eventify.com",
        password: "password123"
    },

    otpCode: "123456",

    todayText: "Today, 21st Sept 2026",

    events: [
        {
            id: 1,
            name: "Tech & Creators Summit 2026",
            date: "Sat, 27 Sept 2026 10AM",
            dateLong: "Sat, 27 Sept 2026 10:30 AM - 4:30PM",
            location: "Eko Conventional Centre, Victoria Island, Lagos",
            gate: "Gate A",
            status: "Live",
            guests: 500
        },
        {
            id: 2,
            name: "Product Design Summit 2026",
            date: "Thurs, 1 Oct 2026 10AM",
            dateLong: "Thurs, 1 Oct 2026 10:00 AM - 3:00PM",
            location: "Eko Conventional Centre, Victoria Island, Lagos",
            gate: "Gate C",
            status: "Upcoming",
            guests: 5000
        },
        {
            id: 3,
            name: "Hackathon Conference",
            date: "Sat, 3 Oct 2026 12PM",
            dateLong: "Sat, 3 Oct 2026 12:00 PM - 6:00PM",
            location: "Eko Conventional Centre, Victoria Island, Lagos",
            gate: "Gate B",
            status: "Upcoming",
            guests: 500
        },
        {
            id: 4,
            name: "Tech & Creators Summit 2026",
            date: "Wed, 7 Oct 2026 9AM",
            dateLong: "Wed, 7 Oct 2026 9:00 AM - 5:00PM",
            location: "Eko Conventional Centre, Victoria Island, Lagos",
            gate: "Gate D",
            status: "Upcoming",
            guests: 500
        }
    ],

    tickets: {
        "EVT-4582": { name: "John Eze", ticket: "VIP" },
        "EVT-4583": { name: "Adeola Johnson", ticket: "VIP" },
        "EVT-4584": { name: "Christabel Johnson", ticket: "Regular" },
        "EVT-4585": { name: "Patrick Ugwu", ticket: "VVIP" },
        "EVT-4586": { name: "Stephen Ade", ticket: "Regular" },
        "EVT-4587": { name: "Omotola Jade", ticket: "Regular" }
    },

    scanQueue: ["EVT-4582", "EVT-4582", "BAD-0000", "EVT-4583", "EVT-4584", "EVT-4585", "EVT-4586", "EVT-4587"],

    history: [
        { time: "11:48AM", name: "Eze John", code: "EVT-4567", status: "Confirmed", gate: "Gate 1" },
        { time: "11:38AM", name: "Amara Junior", code: "EVT-4566", status: "Confirmed", gate: "Gate 1" },
        { time: "11:30AM", name: "Ezra Johnson", code: "EVT-4565", status: "Confirmed", gate: "Gate 1" },
        { time: "11:18AM", name: "Ola Pelumi", code: "EVT-4561", status: "Duplicate", gate: "Gate 1" },
        { time: "11:08AM", name: "Micheal Friday", code: "EVT-4563", status: "Confirmed", gate: "Gate 1" },
        { time: "10:58AM", name: "Eniola Thomas", code: "EVT-4562", status: "Confirmed", gate: "Gate 1" },
        { time: "10:48AM", name: "David Idowu", code: "AVT-3301", status: "Declined", gate: "Gate 1" },
        { time: "10:30AM", name: "Ola Pelumi", code: "EVT-4561", status: "Confirmed", gate: "Gate 1" },
        { time: "10:18AM", name: "Nancy Clifford", code: "EVT-4559", status: "Confirmed", gate: "Gate 1" }
    ]
};
