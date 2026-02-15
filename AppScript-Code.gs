/**
 * Google Apps Script สำหรับรับคะแนนจาก quiz.html และบันทึกลง Google Sheet
 *
 * วิธีใช้:
 * 1. เปิด Google Sheet ที่ต้องการเก็บคะแนน
 * 2. ส่วนขยาย (Extensions) → Apps Script
 * 3. วางโค้ดนี้ใน Code.gs
 * 4. ตั้งชื่อ Sheet แรก (แท็บด้านล่าง) ว่า "Responses" และมีหัวคอลัมน์แถว 1: ชื่อ, อายุ, คะแนน, เต็ม, เปอร์เซ็นต์, คำตอบ, วันที่
 * 5. บันทึก แล้ว Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone (สำคัญมาก ถ้าไม่เปิด CORS จะส่งจากเว็บไม่ได้)
 * 6. Copy URL ที่ได้ไปใส่ใน quiz.html (APPS_SCRIPT_URL)
 */

const SHEET_NAME = 'Responses';

function doPost(e) {
  try {
    const raw = e.postData && e.postData.contents ? e.postData.contents : '';
    const data = JSON.parse(raw);
    const sheet = getSheet();
    sheet.appendRow([
      data.name || '',
      data.age || '',
      data.score || 0,
      data.total || 0,
      data.percent || 0,
      data.answers || '',
      new Date()
    ]);
    const leaderboard = getLeaderboard();
    return jsonOutput({ status: 'success', leaderboard: leaderboard });
  } catch (err) {
    console.error(err);
    return jsonOutput({ status: 'error', message: err.toString() }, 500);
  }
}

function doGet(e) {
  try {
    const leaderboard = getLeaderboard();
    return jsonOutput({ status: 'success', leaderboard: leaderboard });
  } catch (err) {
    console.error(err);
    return jsonOutput({ status: 'error', message: err.toString() }, 500);
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, 7).setValues([['ชื่อ', 'อายุ', 'คะแนน', 'เต็ม', 'เปอร์เซ็นต์', 'คำตอบ', 'วันที่']]);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
  }
  return sheet;
}

function getLeaderboard() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const data = sheet.getRange(2, 1, lastRow, 5).getValues();
  const rows = data.map(function (row, i) {
    return { name: row[0], age: row[1], score: row[2], total: row[3], percent: row[4] };
  });
  rows.sort(function (a, b) { return (b.percent || 0) - (a.percent || 0); });
  return rows.slice(0, 20);
}

function jsonOutput(obj, statusCode) {
  const out = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  return out;
}
