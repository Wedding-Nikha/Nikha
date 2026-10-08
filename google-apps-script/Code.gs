/**
 * Karishma & Saif — RSVP receiver
 *
 * Paste this into Extensions → Apps Script of your RSVP Google Sheet,
 * then Deploy → New deployment → Web app (Execute as: Me, Access: Anyone).
 * Every RSVP submitted from the invitation is appended as a new row.
 */

const SHEET_NAME = 'RSVPs';
const HEADERS = ['Submitted at', 'Full name', 'Attending', 'Guests'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // keep rows in order when guests reply at the same moment
  try {
    const p = (e && e.parameter) || {};
    const name = clean_(p.name).slice(0, 120);
    const attending = p.attending === 'yes' ? 'Yes' : p.attending === 'no' ? 'No' : '';
    let guests = parseInt(p.guests, 10);
    if (attending !== 'Yes') guests = 0;
    else if (!(guests >= 1 && guests <= 20)) guests = 1;

    if (name.length < 2 || !attending) return json_({ ok: false, error: 'Missing name or answer' });

    getSheet_().appendRow([new Date(), name, attending, guests]);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the web-app URL in a browser to check it is live.
function doGet() {
  return json_({ ok: true, message: 'RSVP endpoint is running' });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#f3ead9');
    sheet.setColumnWidth(1, 170);
    sheet.setColumnWidth(2, 240);
  }
  return sheet;
}

// Text that starts with = + - @ would run as a formula in Sheets; store it as plain text instead.
function clean_(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
