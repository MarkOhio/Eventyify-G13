var backend = {
    organizer: {
        firstName: "Justice",
        fullName: "Justice Doe",
        role: "Program coordinator",
        email: "organizer@eventify.com",
        password: "password123"
    },

    otpCode: "123456",

    totalAttendance: 2480,
    checkedIn: 1662,
    totalTickets: 2480,

    events: [
        {
            id: 1,
            name: "Tech & Creators Summit 2026",
            date: "Sat, 2nd Oct 2026",
            longDate: "Sat, Oct 17th, 2026",
            time: "10:00AM",
            timeRange: "10:00 AM - 4:00PM",
            location: "Eko Conventional Center, Lagos",
            city: "Lagos, Nigeria.",
            image: "https://www.figma.com/api/mcp/asset/ad3f2438-d11c-4c3e-9680-22f85b272022/6aeac.png",
            category: "Technology",
            capacity: "1,000",
            tags: "Creators, Tech, Networking",
            about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            registered: 1250,
            checkedIn: 862,
            pending: 388
        },
        {
            id: 2,
            name: "Summer Fest 2026",
            date: "Fri, 9th Oct 2026",
            longDate: "Fri, Oct 9th, 2026",
            time: "11:00AM",
            timeRange: "11:00 AM - 6:00PM",
            location: "Havens Hall, Ikeja, Lagos",
            city: "Ikeja, Lagos.",
            image: "https://www.figma.com/api/mcp/asset/ad3f2438-d11c-4c3e-9680-22f85b272022/472d3.png",
            category: "Entertainment",
            capacity: "800",
            tags: "Music, Food, Fun",
            about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            registered: 1230,
            checkedIn: 800,
            pending: 430
        }
    ],

    ticketCodes: [
        { batch: "TKTS647", tickets: 120, status: "Active" },
        { batch: "TKTS746", tickets: 200, status: "Active" }
    ],

    ticketTypes: [
        { name: "VIP", price: "₦50,000", sold: 220, available: 180, status: "Active", gate: "Gate 1" },
        { name: "Regular", price: "₦25,000", sold: 420, available: 380, status: "Active", gate: "Gate 1" },
        { name: "Student", price: "₦15,000", sold: 210, available: 290, status: "Active", gate: "Gate 1" },
        { name: "Early Bird", price: "₦20,000", sold: 150, available: 50, status: "Active", gate: "Gate 1" }
    ],

    staff: [
        { name: "Gabriel Martins", email: "gabriel@eventify.com", role: "Host", events: 4, status: "Active", gate: "Gate 1" },
        { name: "Eniola Okafor", email: "eniola@eventify.com", role: "Check-in", events: 6, status: "Active", gate: "Gate 1" },
        { name: "Blessing Nneme", email: "blessing@eventify.com", role: "Support", events: 2, status: "Active", gate: "Gate 1" },
        { name: "James Aaron", email: "james@eventify.com", role: "Manager", events: 4, status: "Active", gate: "Gate 1" },
        { name: "Meg Jane", email: "meg@eventify.com", role: "Check-in", events: 3, status: "Active", gate: "Gate 1" },
        { name: "Nancy Enny", email: "nancy@eventify.com", role: "Support", events: 1, status: "Active", gate: "Gate 1" }
    ],

    liveAttendance: {
        total: 500,
        checkedIn: 324,
        remaining: 176,
        percent: 67
    },

    attendees: [
        { name: "John Matt", ticket: "VIP", time: "10:34AM", status: "Valid", gate: "Gate 1" },
        { name: "Sarah Meg", ticket: "VVIP", time: "10:40AM", status: "Valid", gate: "Gate 1" },
        { name: "Tunde Ojo", ticket: "Regular", time: "10:45AM", status: "Invalid", gate: "Gate 1" },
        { name: "Mike Johnson", ticket: "Regular", time: "10:47AM", status: "Valid", gate: "Gate 1" },
        { name: "Chigozie Dan", ticket: "VIP", time: "10:50AM", status: "Invalid", gate: "Gate 1" },
        { name: "Kevin Dee", ticket: "Regular", time: "10:53AM", status: "Valid", gate: "Gate 1" },
        { name: "Okafor Mary", ticket: "VVIP", time: "10:55AM", status: "Valid", gate: "Gate 1" },
        { name: "Daniel Jay", ticket: "Regular", time: "10:58AM", status: "Valid", gate: "Gate 1" },
        { name: "Amara Ada", ticket: "VIP", time: "11:01AM", status: "Invalid", gate: "Gate 1" }
    ],

    report: {
        date: "Sat, Oct 17th, 2026",
        range: "Sep 27- Oct 3",
        total: 482,
        checkedIn: 458,
        percent: 95,
        regular: 203,
        vip: 160,
        vvip: 70,
        slot: 49,
        totalAttendees: 1250,
        reportCheckedIn: 842,
        noShow: 408,
        rate: 67,
        eventRates: [
            { name: "Networking Mixer", rate: 58 },
            { name: "Business Growth Forum", rate: 72 },
            { name: "Tech & Creators Summit 2026", rate: 68 }
        ]
    }
};
