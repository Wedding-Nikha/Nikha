# RSVP → Google Sheets setup

Each RSVP a guest submits on the invitation is added as a new row in a Google Sheet,
the moment they press **Submit**. It takes about 5 minutes to set up, once.

## 1. Create the sheet
1. Go to <https://sheets.new> (signed in with the Google account that should own the RSVPs).
2. Name it, e.g. **Karishma & Saif — RSVPs**.

## 2. Add the script
1. In the sheet: **Extensions → Apps Script**.
2. Delete the sample code, paste everything from [`google-apps-script/Code.gs`](google-apps-script/Code.gs), and press **Save** (💾).

## 3. Publish it as a web app
1. Click **Deploy → New deployment**.
2. Click the gear ⚙ next to "Select type" → **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**, then **Authorize access** and allow it with your Google account.
   (Google may show "Google hasn't verified this app" — click **Advanced → Go to … (unsafe)**; it is your own script.)
5. Copy the **Web app URL** (it ends in `/exec`).

## 4. Connect the invitation
In `index.html`, find this line and paste the URL between the quotes:

```js
const RSVP_ENDPOINT='https://script.google.com/macros/s/XXXXXXXX/exec';
```

Save, refresh the invitation, and send a test RSVP. A tab called **RSVPs** appears in your
sheet with the columns *Submitted at · Full name · Attending · Guests*.

## Good to know
- **Total guests coming:** in any empty cell, `=SUMIF(RSVPs!C:C,"Yes",RSVPs!D:D)`
- If a guest submits twice, both rows are kept — the latest one is their current answer.
- If you edit the script later, use **Deploy → Manage deployments → Edit → New version**
  so the same URL keeps working.
