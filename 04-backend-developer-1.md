# Group 13 --- Backend Developer Guide

## Your Job

You build the brain of the system.

The frontend shows information to the user.

The backend stores information, checks tickets, and decides whether a
ticket is valid.

## 1. Database

Create tables for at least:

### Events

Fields can include:

-   event_id
-   event_name
-   date
-   time
-   venue
-   price

### Tickets

Fields can include:

-   ticket_id
-   ticket_code
-   event_id
-   attendee_name
-   attendee_email
-   status
-   created_at
-   checked_in_at

### Attendance

Fields can include:

-   attendance_id
-   ticket_id
-   event_id
-   checked_in_at
-   scanner/device

## 2. Ticket API

Provide endpoints for:

-   Creating tickets.
-   Getting tickets.
-   Getting event information.
-   Importing ticket data.
-   Exporting ticket data.

## 3. Verification API

Create an endpoint such as:

``` text
POST /verify-ticket
```

The frontend sends a ticket code.

The backend checks:

1.  Does the ticket exist?
2.  Does it belong to this event?
3.  Is it valid?
4.  Has it already been used?

Return a clear result such as:

``` text
VALID
ALREADY_USED
WRONG_EVENT
INVALID
```

## 4. Check-In

When a valid ticket is scanned:

``` text
UNUSED
   ↓
CHECK IN
   ↓
USED
   ↓
Save check-in time
```

The backend must prevent two scanners from successfully checking in the
same ticket at the same time.

## 5. Local Event Server

The event should be able to operate through:

``` text
Online Backend
      ↓
Download event/ticket data
      ↓
Local Event Server
      ↓
Local Wi-Fi
      ↓
Scanner Phones
```

During an internet outage, the local server becomes the event-day
authority.

## 6. Synchronization

When internet returns:

``` text
Local Database
      ↓
Sync
      ↓
Online Database
```

The system should also be able to check for new ticket information while
internet is available.

## 7. CSV

Support ticket data import/export where required.

Example columns:

``` text
Ticket Code
Name
Email
Event
Status
```

## Important Warning

Do not allow the local server and cloud server to independently approve
the same ticket during an outage.

The system needs a clear authority model so the same ticket cannot be
accepted twice.

## Deliverables

-   Database.
-   API.
-   Ticket creation.
-   Ticket validation.
-   Duplicate prevention.
-   Check-in recording.
-   Event management.
-   CSV import/export.
-   Local event data.
-   Synchronization.
