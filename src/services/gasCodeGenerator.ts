/**
 * Google Apps Script Backend Code Generator
 * This provides the full Code.gs code for Google Sheets two-way synchronization
 * and webhooks handling. Includes getsheets, setupsheet, and setupheadr functions.
 * Fixed Google Spreadsheet ID & Direct Link configured.
 */

export const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc/edit?usp=drivesdk';
export const GOOGLE_SPREADSHEET_ID = '15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc';
export const DEFAULT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwDnrXeZYxFz-R0pAi03O32uGoAqs39q3uu90UIRBbxHYFYKiafjOV--bk71Qyp7bIAxg/exec';

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * =========================================================================
 *  লাইফসেভার ব্লাড ব্যাংক - Google Apps Script (Code.gs)
 *  Blood Bank Management System Backend API & Google Sheets Connector
 * =========================================================================
 * 
 *  🔗 ফিক্সড গুগল স্প্রেডশিট লিংক (Target Google Spreadsheet):
 *  https://docs.google.com/spreadsheets/d/15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc/edit?usp=drivesdk
 *  Spreadsheet ID: 15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc
 * 
 *  🌐 ফিক্সড ওয়েব অ্যাপ ইউআরএল (Web App URL):
 *  https://script.google.com/macros/s/AKfycbwDnrXeZYxFz-R0pAi03O32uGoAqs39q3uu90UIRBbxHYFYKiafjOV--bk71Qyp7bIAxg/exec
 * 
 *  📋 নির্দেশিকা (Instructions):
 *  ১. https://script.google.com এ যান অথবা উল্লেখিত স্প্রেডশিটের Extensions > Apps Script এ যান।
 *  ২. এই সম্পূর্ণ কোডটি Code.gs এ পেস্ট করে সংরক্ষণ করুন (Ctrl + S)।
 *  ৩. উপরের ফাংশন ড্রপডাউন থেকে 'initialSetup()' অথবা 'setupsheet()' রান করে প্রয়োজনীয় সকল শিট ও হেডার তৈরি করুন।
 *  ৪. 'Deploy' -> 'Manage Deployments' -> Edit (অথবা New Deployment) -> Web App নির্বাচন করে 'Deploy' করুন।
 */

// ফিক্সড স্প্রেডশিট আইডি (Fixed Google Spreadsheet ID)
var SPREADSHEET_ID = '15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc';
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc/edit?usp=drivesdk';
var WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwDnrXeZYxFz-R0pAi03O32uGoAqs39q3uu90UIRBbxHYFYKiafjOV--bk71Qyp7bIAxg/exec';

// শিটের নামসমূহ (Sheet Names Constant)
var SHEETS = {
  USERS: 'Users',
  REQUESTS: 'Requests',
  BLOOD_STOCK: 'BloodStock',
  DONATIONS: 'Donations',
  APPLICATIONS: 'Applications',
  MESSAGES: 'Messages',
  NOTICES: 'Notices',
  ARTICLES: 'Articles',
  SLIDERS: 'Sliders',
  SITE_CONFIG: 'SiteConfig',
  ACTIVITY_LOG: 'ActivityLog'
};

/**
 * স্প্রেডশিট অবজেক্ট পাওয়ার নিরাপদ হেল্পার
 */
function getTargetSpreadsheet() {
  try {
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '') {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    }
  } catch (e) {
    Logger.log('openById error, falling back to active sheet: ' + e.toString());
  }
  return SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById('15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc');
}

/**
 * ১. getsheets() - সকল শিটের ম্যাপ পাওয়া
 */
function getsheets() {
  var ss = getTargetSpreadsheet();
  var allSheets = ss.getSheets();
  var sheetMap = {};
  for (var i = 0; i < allSheets.length; i++) {
    sheetMap[allSheets[i].getName()] = allSheets[i];
  }
  return sheetMap;
}

function getSheets() {
  return getsheets();
}

/**
 * ২. setupheadr() - শিটের প্রথম রো (Header) প্রফেশনাল স্টাইলিং
 */
function setupheadr(sheet, headers, bgColor, fontColor) {
  if (!sheet) return;
  var bg = bgColor || '#8B0000';
  var fg = fontColor || '#FFFFFF';

  if (headers && headers.length > 0) {
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    } else {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
  }

  var lastCol = Math.max(sheet.getLastColumn(), (headers ? headers.length : 1));
  if (lastCol > 0) {
    var headerRange = sheet.getRange(1, 1, 1, lastCol);
    headerRange.setBackground(bg);
    headerRange.setFontColor(fg);
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(11);
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    try {
      sheet.setRowHeight(1, 35);
      sheet.setFrozenRows(1);
    } catch(err){}
  }
}

function setupHeader(sheet, headers, bgColor, fontColor) {
  return setupheadr(sheet, headers, bgColor, fontColor);
}

/**
 * ৩. setupsheet() - নির্দিষ্ট শিট তৈরি ও সেটআপ
 */
function setupsheet(sheetName, headers, defaultRows, headerBg) {
  var ss = getTargetSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0 && headers && headers.length > 0) {
    sheet.appendRow(headers);
    if (defaultRows && Array.isArray(defaultRows) && defaultRows.length > 0) {
      for (var r = 0; r < defaultRows.length; r++) {
        sheet.appendRow(defaultRows[r]);
      }
    }
  }

  setupheadr(sheet, headers, headerBg);
  return sheet;
}

function setupSheet(sheetName, headers, defaultRows, headerBg) {
  return setupsheet(sheetName, headers, defaultRows, headerBg);
}

/**
 * ৪. initialSetup() - এক ক্লিকে সম্পূর্ণ ডাটাবেজ আর্কিটেকচার সেটআপ
 */
function initialSetup() {
  var ss = getTargetSpreadsheet();
  Logger.log('🚀 ইনিশিয়াল সেটআপ শুরু হয়েছে: ' + ss.getName());

  // ১. Users (with Avatar / Base64 Data)
  setupsheet(
    SHEETS.USERS,
    ['ID', 'Name', 'Email', 'PasswordHash', 'Phone', 'BloodGroup', 'DOB', 'Address', 'District', 'AvatarUrl', 'LastDonation', 'Role', 'Status', 'IsAvailable', 'TotalDonations', 'CreatedAt'],
    [],
    '#8B0000'
  );

  // ২. Requests
  setupsheet(
    SHEETS.REQUESTS,
    ['ID', 'RequesterName', 'Contact', 'AlternateContact', 'BloodGroup', 'Hospital', 'District', 'Urgency', 'UnitsNeeded', 'Status', 'PatientProblem', 'DateNeeded', 'AdminNote', 'CreatedAt'],
    [],
    '#B71C1C'
  );

  // ৩. BloodStock
  var defaultStockRows = [
    ['A+', 15, 5, new Date().toLocaleString('bn-BD')],
    ['A-', 8, 3, new Date().toLocaleString('bn-BD')],
    ['B+', 20, 5, new Date().toLocaleString('bn-BD')],
    ['B-', 6, 3, new Date().toLocaleString('bn-BD')],
    ['AB+', 10, 4, new Date().toLocaleString('bn-BD')],
    ['AB-', 4, 2, new Date().toLocaleString('bn-BD')],
    ['O+', 25, 5, new Date().toLocaleString('bn-BD')],
    ['O-', 7, 3, new Date().toLocaleString('bn-BD')]
  ];
  setupsheet(
    SHEETS.BLOOD_STOCK,
    ['BloodGroup', 'UnitCount', 'MinimumThreshold', 'LastUpdated'],
    defaultStockRows,
    '#1E3A8A'
  );

  // ৪. Applications
  setupsheet(
    SHEETS.APPLICATIONS,
    ['ID', 'Type', 'ApplicantName', 'Email', 'Phone', 'Address', 'District', 'BloodGroup', 'Status', 'Details', 'CreatedAt'],
    [],
    '#4C1D95'
  );

  // ৫. Messages
  setupsheet(
    SHEETS.MESSAGES,
    ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'CreatedAt'],
    [],
    '#047857'
  );

  // ৬. ActivityLog
  setupsheet(
    SHEETS.ACTIVITY_LOG,
    ['ID', 'UserID', 'UserName', 'Action', 'Details', 'Timestamp', 'IP'],
    [],
    '#374151'
  );

  // ৭. SiteConfig
  setupsheet(
    SHEETS.SITE_CONFIG,
    ['Key', 'Value', 'LastUpdated'],
    [
      ['siteName', 'লাইফসেভার ব্লাড ব্যাংক', new Date().toISOString()],
      ['siteSlogan', 'জীবন বাঁচান, রক্ত দিন • নীলফামারী জেলা শাখা', new Date().toISOString()],
      ['emergencyPhone', '+8801711000001', new Date().toISOString()],
      ['webAppUrl', WEB_APP_URL, new Date().toISOString()],
      ['spreadsheetUrl', SPREADSHEET_URL, new Date().toISOString()]
    ],
    '#0F172A'
  );

  Logger.log('🎉 সকল শিট সফলভাবে প্রস্তুত হয়েছে!');
  return {
    success: true,
    spreadsheetUrl: SPREADSHEET_URL,
    webAppUrl: WEB_APP_URL,
    message: 'Google Sheets ডাটাবেজ ও হেডার আর্কিটেকচার সফলভাবে প্রস্তুত হয়েছে!'
  };
}

/**
 * শিট থেকে অবজেক্ট অ্যারে রিড করা
 */
function getRowsAsObjects(sheetName) {
  try {
    var ss = getTargetSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return [];

    var data = sheet.getDataRange().getValues();
    if (!data || data.length <= 1) return [];

    var headers = data[0];
    var rows = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var obj = {};
      var hasData = false;
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = row[j];
        if (row[j] !== '' && row[j] !== null && row[j] !== undefined) {
          hasData = true;
        }
      }
      if (hasData) {
        rows.push(obj);
      }
    }
    return rows;
  } catch (e) {
    Logger.log('getRowsAsObjects error in ' + sheetName + ': ' + e.toString());
    return [];
  }
}

/**
 * শিট সম্পূর্ণ ওভাররাইট করার হেল্পার
 */
function overwriteSheet(sheetName, headers, rows, headerBg) {
  try {
    var ss = getTargetSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    } else {
      sheet.clearContents();
    }

    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
    }
    if (rows && rows.length > 0) {
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }

    setupheadr(sheet, headers, headerBg);
  } catch(e) {
    Logger.log('overwriteSheet error in ' + sheetName + ': ' + e.toString());
  }
}

/**
 * GET রিকোয়েস্ট হ্যান্ডলার
 */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || 'getAllData';

    if (action === 'ping') {
      return jsonResponse({
        status: 'success',
        message: '🩸 লাইফসেভার ব্লাড ব্যাংক Google Apps Script API সচল ও প্রস্তুত!',
        spreadsheetId: SPREADSHEET_ID,
        spreadsheetUrl: SPREADSHEET_URL,
        webAppUrl: WEB_APP_URL,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'getAllData') {
      return jsonResponse({
        status: 'success',
        spreadsheetId: SPREADSHEET_ID,
        data: {
          users: getRowsAsObjects(SHEETS.USERS),
          requests: getRowsAsObjects(SHEETS.REQUESTS),
          stock: getRowsAsObjects(SHEETS.BLOOD_STOCK),
          applications: getRowsAsObjects(SHEETS.APPLICATIONS),
          messages: getRowsAsObjects(SHEETS.MESSAGES),
          notices: getRowsAsObjects(SHEETS.NOTICES),
          articles: getRowsAsObjects(SHEETS.ARTICLES),
          sliders: getRowsAsObjects(SHEETS.SLIDERS),
          config: getRowsAsObjects(SHEETS.SITE_CONFIG),
          logs: getRowsAsObjects(SHEETS.ACTIVITY_LOG)
        }
      });
    }

    return jsonResponse({ status: 'error', message: 'Unknown action: ' + action });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * POST রিকোয়েস্ট হ্যান্ডলার
 */
function doPost(e) {
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var action = payload.action;

    if (action === 'syncAllData') {
      if (payload.users && Array.isArray(payload.users)) {
        overwriteSheet(SHEETS.USERS, [
          'ID', 'Name', 'Email', 'PasswordHash', 'Phone', 'BloodGroup', 
          'DOB', 'Address', 'District', 'AvatarUrl', 'LastDonation', 'Role', 'Status', 
          'IsAvailable', 'TotalDonations', 'CreatedAt'
        ], payload.users.map(function(u) {
          return [
            u.id || '', u.name || '', u.email || '', u.passwordHash || '', u.phone || '', u.bloodGroup || '',
            u.dob || '', u.address || '', u.district || '', u.avatarUrl || '', u.lastDonation || '', u.role || 'user', u.status || 'active',
            u.isAvailableForDonation ? 'true' : 'false', u.totalDonationsCount || 0, u.createdAt || new Date().toISOString()
          ];
        }), '#8B0000');
      }

      if (payload.requests && Array.isArray(payload.requests)) {
        overwriteSheet(SHEETS.REQUESTS, [
          'ID', 'RequesterName', 'Contact', 'AlternateContact', 'BloodGroup', 
          'Hospital', 'District', 'Urgency', 'UnitsNeeded', 'Status', 
          'PatientProblem', 'DateNeeded', 'AdminNote', 'CreatedAt'
        ], payload.requests.map(function(r) {
          return [
            r.id || '', r.requesterName || '', r.contact || '', r.alternateContact || '', r.bloodGroup || '',
            r.hospital || '', r.district || '', r.urgency || '', r.unitsNeeded || 1, r.status || '',
            r.patientProblem || '', r.donationDateNeeded || '', r.adminNote || '', r.createdAt || new Date().toISOString()
          ];
        }), '#B71C1C');
      }

      if (payload.stock && Array.isArray(payload.stock)) {
        overwriteSheet(SHEETS.BLOOD_STOCK, [
          'BloodGroup', 'UnitCount', 'MinimumThreshold', 'LastUpdated'
        ], payload.stock.map(function(s) {
          return [
            s.bloodGroup || '', s.unitCount || 0, s.minimumThreshold || 3, s.lastUpdated || new Date().toISOString()
          ];
        }), '#1E3A8A');
      }

      logActivity('SYSTEM', 'SyncEngine', 'ওয়েবসাইট থেকে Google Sheets এ সম্পূর্ণ ডাটাবেজ সিঙ্ক হয়েছে');

      return jsonResponse({
        status: 'success',
        message: 'গুগল স্প্রেডশিটে সফলভাবে সমস্ত তথ্য সংরক্ষিত হয়েছে!',
        spreadsheetUrl: SPREADSHEET_URL,
        timestamp: new Date().toISOString()
      });
    }

    return jsonResponse({ status: 'error', message: 'Action not handled: ' + action });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * অ্যাক্টিভিটি লগ সংরক্ষণ
 */
function logActivity(userId, userName, action, details) {
  try {
    var ss = getTargetSpreadsheet();
    var sheet = ss.getSheetByName(SHEETS.ACTIVITY_LOG) || setupsheet(SHEETS.ACTIVITY_LOG, ['ID', 'UserID', 'UserName', 'Action', 'Details', 'Timestamp', 'IP'], [], '#374151');
    var logId = 'LOG-' + Math.floor(Math.random() * 90000 + 10000);
    sheet.appendRow([
      logId, userId || '', userName || '', action || '', details || '', new Date().toLocaleString('bn-BD'), 'GAS-Cloud'
    ]);
  } catch(e) {}
}

/**
 * JSON রেসপন্স
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export const GOOGLE_SHEETS_SETUP_STEPS = [
  {
    step: 1,
    title: 'সংযুক্ত Google Sheets স্প্রেডশিট খুলুন',
    description: 'ফিক্সড স্প্রেডশিট লিংকটি ওপেন করুন (ID: 15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc)।'
  },
  {
    step: 2,
    title: 'Apps Script এডিটর ওপেন করুন',
    description: 'স্প্রেডশিটের মেনুবার থেকে Extensions > Apps Script এ ক্লিক করুন।'
  },
  {
    step: 3,
    title: 'Code.gs পেস্ট করুন',
    description: 'এডিটরের ডিফল্ট কোড মুছে দিয়ে অ্যাডমিন ড্যাশবোর্ডে দেওয়া সম্পূর্ণ Code.gs কপি করে পেস্ট করুন।'
  },
  {
    step: 4,
    title: 'initialSetup() রান করুন',
    description: 'উপরে ড্রপডাউন থেকে "initialSetup" অথবা "setupsheet" ফাংশন নির্বাচন করে "Run" এ ক্লিক করে একবার পারমিশন অনুমতি দিন।'
  },
  {
    step: 5,
    title: 'Web App হিসেবে ডিপ্লয় করুন',
    description: 'Deploy > Manage deployments > Edit > New version দিয়ে Deploy করুন।'
  },
  {
    step: 6,
    title: 'ফিক্সড Web App URL প্রস্তুত',
    description: 'আপনার নির্ধারিত Web App URL ইতিমধ্যে সিস্টেমে স্বয়ংক্রিয়ভাবে কানেক্টেড রয়েছে।'
  }
];
