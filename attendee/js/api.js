const DEV_VERIFICATION_CODE = '123456';

const mockApi = {
    events: [
        {
            id: 1,
            title: 'Tech & Creators Summit 2026',
            date: 'Sat, Oct 17th, 2026',
            time: '8:00 AM',
            day: '17',
            month: 'OCT',
            location: 'Lagos, Nigeria',
            address: 'Landmark Centre, Plot 2 & 3 Water Corporation Road, Victoria Island, Lagos, Nigeria',
            latitude: 6.4315,
            longitude: 3.4144,
            image: 'assets/event-tech.jpg',
            description: 'The Tech & Creators Summit brings together developers, designers, entrepreneurs and creators to share ideas, learn new skills and explore opportunities in the digital world.'
        },
        {
            id: 2,
            title: 'Climate & Innovation Forum',
            date: 'Sun, Oct 18th, 2026',
            time: '10:00 AM',
            day: '18',
            month: 'OCT',
            location: 'Lagos, Nigeria',
            address: 'Landmark Centre, Plot 2 & 3 Water Corporation Road, Victoria Island, Lagos, Nigeria',
            latitude: 6.4315,
            longitude: 3.4144,
            image: 'assets/event-climate.jpg',
            description: 'A gathering for people working on climate action, sustainability and practical innovations for a better future.'
        }
    ],

    getEvents: async function () {
        await new Promise(resolve => setTimeout(resolve, 250));
        return this.events;
    },

    getEvent: async function (id) {
        await new Promise(resolve => setTimeout(resolve, 150));
        return this.events.find(event => event.id === Number(id));
    },

    saveAttendee: async function (details) {
        await new Promise(resolve => setTimeout(resolve, 400));

        const attendee = {
            ...details,
            code: 'CSV-' + Math.floor(100 + Math.random() * 900),
            status: 'Valid'
        };

        localStorage.setItem('attendeeDetails', JSON.stringify(attendee));
        localStorage.setItem('pendingTicket', 'true');

        return attendee;
    },

    verifyTicket: async function (code) {
        await new Promise(resolve => setTimeout(resolve, 350));

        const attendee = JSON.parse(
            localStorage.getItem('attendeeDetails') || 'null'
        );

        const enteredCode = code.trim().toUpperCase();

        if (
            attendee &&
            (
                enteredCode === attendee.code.toUpperCase() ||
                enteredCode === DEV_VERIFICATION_CODE
            )
        ) {
            localStorage.removeItem('pendingTicket');

            return {
                valid: true,
                attendee: attendee
            };
        }

        return {
            valid: false,
            message: 'Incorrect code. Try again.'
        };
    },

    resendCode: async function () {
        await new Promise(resolve => setTimeout(resolve, 250));

        return {
            sent: true
        };
    }
};