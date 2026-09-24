MONIEPAL
Offline-first, multi-branch point-of-sale for Kenyan retail
================================================================

MoniePal is built around two facts of Kenyan retail: the
internet drops, and customers pay with M-Pesa.

Every till keeps trading when the connection is gone, writing
each sale as an event to a local SQLite database. When the
network returns, the tills sync to the cloud on their own.
Owners see every branch, till and report from one dashboard, on
a laptop or a phone.


TRY IT
------
Live demo : REPLACE_WITH_MONIEPAL_LIVE_URL
Demo video: open the MoniePal folder in Projects

This is a shared demo workspace. Anything you change is visible
to the next visitor, so please stick to the sample data below
and don't enter real phone numbers or payment details.


DEMO LOGIN: WEB DASHBOARD AND WEB POS
-------------------------------------
Workspace code: moniepal-retail

ROLE     EMAIL                 PASSWORD       CODE  PIN
Admin    admin@moniepal.com    Admin@2026!    1001  1234
Manager  manager@moniepal.com  Manager@2026!  1002  2345

Admin   : all branches, settings and accounting
Manager : reports, inventory, approvals, void overrides

Cashiers (POS keypad: staff code + PIN)

NAME           BRANCH                            CODE  PIN
Faith Mwangi   Nairobi Flagship - CBD (NRB-CBD)  2001  1111
Brian Kiprono  Westlands Mall (WST-MALL)         2002  2222


TWO-MINUTE TOUR
---------------
1. Open the live demo. Enter workspace code moniepal-retail,
   email admin@moniepal.com, password Admin@2026!
2. You land on the Overview dashboard: live sales, stock and
   reports.
3. Click Launch POS and pick Nairobi Flagship - CBD.
4. Clock in with staff code 2001 and PIN 1111 (or 1001 / 1234
   as admin).
5. Enter an opening cash float (for example 2000.00) and start
   selling. Scan or type the barcodes below.


DESKTOP TERMINAL PAIRING (AVALONIA APP)
---------------------------------------
Device name   : Till-01
Device type   : desktop
Branch        : Nairobi Flagship - CBD
Device API key: moniepal-terminal-key-01

On first launch, enter your backend URL and the device key. The
terminal verifies the key, downloads the offline catalog cache
and shows the lock screen. Unlock with staff code 2001 and
PIN 1111.


SAMPLE CUSTOMERS (M-PESA AND LOYALTY TESTING)
---------------------------------------------
John Kamau     254711000111
Mary Wanjiku   254722000222
Peter Ochieng  254733000333


SAMPLE BARCODES
---------------
BARCODE        PRODUCT                            KES
616110001001   Tusker Lager 500ml              280.00
5449000000996  Coca-Cola 500ml Plastic          70.00
616110001002   Dasani Mineral Water 500ml       50.00
616110002002   Brookside Whole Milk 500ml       65.00
616110003003   Broadways White Bread 400g       65.00
616110004004   Jogoo Maize Flour 2kg           160.00
616110005005   Daawat Basmati Rice 2kg         520.00
616110006006   Menengai Cream Bar Soap 800g    180.00


WHAT'S IN IT
------------
* Web dashboard: live sales, stock, multi-branch analytics and
  reports.
* Web POS: a full register in the browser, with shifts and an
  opening cash float.
* Desktop terminal: a native till that keeps working offline,
  backed by a local SQLite catalog cache.
* Roles: admin, manager and cashier, with manager approvals and
  void overrides.
* M-Pesa: STK Push and C2B through the Daraja API. Callbacks
  reach the till over WebSockets, not polling, so confirmation
  and receipt come almost immediately after the customer pays.
* Bulk promotional messaging to batches of customers.
* KRA eTIMS integration for tax compliance.


HOW OFFLINE WORKS
-----------------
Each till treats every sale as an immutable event and appends it
to a local SQLite database first. The network is never in the
sale's critical path. A sync worker replays those events to the
FastAPI backend when connectivity returns, and the backend
applies them to PostgreSQL in order. A dead router costs you a
delay in head-office reporting, not a lost sale.

  Desktop till (Avalonia)    Web POS / dashboard (Next.js)
   local SQLite event log               |
           |  sync when online          |
           +-----> FastAPI sync API <---+
                      |        ^
                      v        |  Daraja callbacks
              Neon PostgreSQL  +-- M-Pesa --> WebSocket --> till


TECH STACK
----------
Desktop terminal : C#, Avalonia UI, SQLite
Backend / sync   : Python, FastAPI, WebSockets
Web dashboard/POS: Next.js, TypeScript
Database         : Neon serverless PostgreSQL
Payments         : M-Pesa Daraja (STK Push, C2B)
Tax              : KRA eTIMS


RUN IT LOCALLY
--------------
Needs Python 3.11+, Node.js 20+, a PostgreSQL database (a free
Neon project works) and the .NET 8 SDK for the desktop app.

1. Backend (FastAPI)

   cd backend
   python -m venv venv
   source venv/bin/activate   (Windows: venv\Scripts\activate)
   pip install -r requirements.txt
   cp .env.example .env

   Fill in .env:
     DATABASE_URL=postgresql://user:password@host/dbname
     SECRET_KEY=change-me
     DARAJA_CONSUMER_KEY=
     DARAJA_CONSUMER_SECRET=
     DARAJA_SHORTCODE=
     DARAJA_PASSKEY=
     DARAJA_CALLBACK_URL=

   Then migrate, seed the demo workspace and start the API:
     alembic upgrade head
     python -m scripts.seed
     uvicorn app.main:app --reload --port 8000

2. Web dashboard and Web POS (Next.js)

   cd web
   npm install
   cp .env.example .env.local
   (set NEXT_PUBLIC_API_URL=http://localhost:8000)
   npm run dev

   Open http://localhost:3000 and sign in with the credentials
   above.

3. Desktop terminal (optional)

   cd desktop
   dotnet run

   Pair it with the device key above.

M-Pesa needs Daraja sandbox credentials and a public callback
URL (an ngrok tunnel is fine locally). Everything else runs
without them.


CONTACT
-------
Built by Roy Matheri Waweru
weruroy347@gmail.com