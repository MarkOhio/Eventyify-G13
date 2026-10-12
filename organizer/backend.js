var backend = {
    organizer: {
        firstName: "Justice",
        lastName: "Doe",
        fullName: "Justice Doe",
        initials: "JD",
        role: "Program coordinator",
        email: "organizer@eventify.com",
        password: "password123"
    },

    otpCode: "123456",

    totalAttendance: 1250,
    totalTickets: 1250,
    checkedInTotal: 942,

    events: [
        {
            id: 1,
            name: "Tech & Creators Summit 2026",
            day: "27",
            month: "Sep",
            date: "Sat, 27th Sep 2026",
            longDate: "Sat, Oct 17th, 2026 - 10:00 AM",
            time: "10:00AM",
            dateInput: "17th Oct, 2026",
            timeInput: "10:00AM",
            location: "Eko Conventional Center, V.I, Lagos",
            city: "Lagos, Nigeria.",
            image: "assets/event1.png",
            status: "Active",
            category: "Technology",
            capacity: "1,000",
            about: "The Tech & Creators Summit 2026 is the ultimate convergence point for developers, digital creators, designers, and tech entrepreneurs. Dive deep into the future of the creator economy, explore cutting-edge AI tools, and connect with global innovators. Join us to transform your craft, build sustainable digital businesses, and scale your impact.",
            totalTickets: 500,
            checkedIn: 324,
            remaining: 176
        },
        {
            id: 2,
            name: "Business Growth Forum",
            day: "01",
            month: "Oct",
            date: "Thu, 1st Oct 2026",
            longDate: "Thu, Oct 1st, 2026 - 11:00 AM",
            time: "11:00AM",
            dateInput: "1st Oct, 2026",
            timeInput: "11:00AM",
            location: "Havens Hall, Ikeja, Lagos",
            city: "Ikeja, Lagos.",
            image: "assets/event2.png",
            status: "Upcoming",
            category: "Business",
            capacity: "800",
            about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            totalTickets: 800,
            checkedIn: 410,
            remaining: 390
        },
        {
            id: 3,
            name: "Networking Mixer",
            day: "17",
            month: "Oct",
            date: "Sat, 17th Oct 2026",
            longDate: "Sat, Oct 17th, 2026 - 10:00 AM",
            time: "10:00AM",
            dateInput: "17th Oct, 2026",
            timeInput: "10:00AM",
            location: "Eko Conventional Center, V.I, Lagos",
            city: "Lagos, Nigeria.",
            image: "assets/event3.png",
            status: "Upcoming",
            category: "Networking",
            capacity: "300",
            about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            totalTickets: 300,
            checkedIn: 108,
            remaining: 192
        },
        {
            id: 4,
            name: "Product Design Summit",
            day: "24",
            month: "Oct",
            date: "Sat, 24th Oct 2026",
            longDate: "Sat, Oct 24th, 2026 - 9:00 AM",
            time: "9:00AM",
            dateInput: "24th Oct, 2026",
            timeInput: "9:00AM",
            location: "Landmark Centre, Victoria Island, Lagos",
            city: "Lagos, Nigeria.",
            image: "assets/event2.png",
            status: "Upcoming",
            category: "Design",
            capacity: "600",
            about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            totalTickets: 600,
            checkedIn: 0,
            remaining: 600
        },
        {
            id: 5,
            name: "Hackathon Conference",
            day: "07",
            month: "Nov",
            date: "Sat, 7th Nov 2026",
            longDate: "Sat, Nov 7th, 2026 - 12:00 PM",
            time: "12:00PM",
            dateInput: "7th Nov, 2026",
            timeInput: "12:00PM",
            location: "Yaba Tech Hub, Lagos",
            city: "Yaba, Lagos.",
            image: "assets/event1.png",
            status: "Upcoming",
            category: "Technology",
            capacity: "400",
            about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            totalTickets: 400,
            checkedIn: 0,
            remaining: 400
        }
    ],

    ticketCodes: [
        { batch: "TKTS647", tickets: 120, status: "Active", eventId: 1 }
    ],

    ticketTypes: [
        { name: "VIP", price: "₦50,000", sold: 220, available: 180, status: "Active", gate: "Gate 1" },
        { name: "Regular", price: "₦25,000", sold: 420, available: 380, status: "Active", gate: "Gate 1" },
        { name: "Student", price: "₦15,000", sold: 210, available: 290, status: "Active", gate: "Gate 1" },
        { name: "Early Bird", price: "₦20,000", sold: 150, available: 50, status: "Active", gate: "Gate 1" }
    ],

    promoCodes: [
        { code: "EARLY20", discount: "20% off", used: 35, status: "Active" },
        { code: "STUDENT10", discount: "10% off", used: 80, status: "Active" },
        { code: "VIPFREE", discount: "100% off", used: 5, status: "Expired" }
    ],

    staff: [
        { name: "Gabriel Martins", email: "gabriel@eventify.com", role: "Host", events: 1, status: "Active", gate: "Gate 1" },
        { name: "Eniola Okafor", email: "eniola@eventify.com", role: "Check-in", events: 2, status: "Active", gate: "Gate 1" },
        { name: "Blessing Nneme", email: "blessing@eventify.com", role: "Support", events: 3, status: "Active", gate: "Gate 1" }
    ],

    staffCandidates: [
        { name: "James Aaron", email: "james@eventify.com", role: "Manager" },
        { name: "Meg Jane", email: "meg@eventify.com", role: "Check-in" },
        { name: "Nancy Enny", email: "nancy@eventify.com", role: "Support" }
    ],

    liveAttendance: {
        total: 191,
        checkedIn: 128
    },

    liveAttendees: [
        { name: "John Matt", ticket: "VIP", time: "10:34AM", gate: "Gate 1" },
        { name: "Sarah Meg", ticket: "VVIP", time: "10:40AM", gate: "Gate 1" },
        { name: "Chioma Okafor", ticket: "VVIP", time: "10:44AM", gate: "Gate 1" },
        { name: "Daniel James", ticket: "Regular", time: "10:48AM", gate: "Gate 1" },
        { name: "Grace Bello", ticket: "Regular", time: "10:52AM", gate: "Gate 1" }
    ],

    attendees: [
        { name: "James Matt", ticket: "VIP", time: "10:34AM", status: "Active", gate: "Gate 1" },
        { name: "Sarah Meg", ticket: "VVIP", time: "10:40AM", status: "Active", gate: "Gate 1" },
        { name: "Tunde Ojo", ticket: "Regular", time: "10:45AM", status: "Invalid", gate: "Gate 1" },
        { name: "Amara Ada", ticket: "Regular", time: "10:47AM", status: "Active", gate: "Gate 1" },
        { name: "Amara Ada", ticket: "Regular", time: "10:50AM", status: "Invalid", gate: "Gate 1" },
        { name: "Amara Ada", ticket: "Regular", time: "10:54AM", status: "Active", gate: "Gate 1" },
        { name: "Amara Ada", ticket: "Regular", time: "10:59AM", status: "Invalid", gate: "Gate 1" }
    ],

    report: {
        date: "Sat, Oct 7th, 2026",
        range: "Sep 27 - Oct 17, 2026",
        total: 482,
        checkedIn: 458,
        percent: 95,
        ticketTypes: [
            { name: "Regular", value: 203 },
            { name: "VIP", value: 160 },
            { name: "VVIP", value: 70 },
            { name: "Slot", value: 49 }
        ],
        eventRates: [
            { name: "Networking Mixer", rate: 58 },
            { name: "Business Growth Forum", rate: 72 },
            { name: "Tech & Creators Summit 2026", rate: 68 }
        ],
        noShow: 408
    }
};
