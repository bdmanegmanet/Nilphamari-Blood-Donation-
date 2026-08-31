/**
 * Google Apps Script Backend Code Generator (Clean, Single-Setup, Unified API)
 * This provides the full Code.gs for Google Sheets two-way synchronization
 * and webhooks handling.
 * 
 * Target Google Spreadsheet:
 * https://docs.google.com/spreadsheets/d/15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc/edit?usp=drivesdk
 * ID: 15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc
 */

export const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc/edit?usp=drivesdk';
export const GOOGLE_SPREADSHEET_ID = '15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc';
export const DEFAULT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwDnrXeZYxFz-R0pAi03O32uGoAqs39q3uu90UIRBbxHYFYKiafjOV--bk71Qyp7bIAxg/exec';

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * =========================================================================
 *  ব্লাড ডোনেশন সোসাইটি, নীলফামারী - Google Apps Script (Code.gs)
 *  Backend REST API & Automated Google Sheets Central Database Hub
 * =========================================================================
 * 
 *  🔗 ফিক্সড গুগল স্প্রেডশিট লিংক (Target Google Spreadsheet):
 *  https://docs.google.com/spreadsheets/d/15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc/edit?usp=drivesdk
 *  Spreadsheet ID: 15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc
 * 
 *  📋 সেটআপ নির্দেশিকা (Setup Instructions):
 *  ১. https://script.google.com এ যান অথবা উল্লেখিত স্প্রেডশিটের Extensions > Apps Script এ যান।
 *  ২. সম্পূর্ণ কোডটি Code.gs ফাইলে পেস্ট করে সংরক্ষণ করুন (Ctrl + S)।
 *  ৩. উপরের ফাংশন ড্রপডাউন থেকে 'setupSheets' (অথবা 'initialSetup') নির্বাচন করে 'Run' বাটনে ক্লিক করুন।
 *     -> এটি স্বয়ংক্রিয়ভাবে সকল শিট ও প্রফেশনাল হেডার তৈরি করবে।
 *  ৪. 'Deploy' > 'New deployment' (অথবা Manage deployments) > 'Web app' হিসেবে ডিপ্লয় করুন:
 *     - Execute as: Me (আপনার গুগল একাউন্ট)
 *     - Who has access: Anyone (যেকোনো ব্যক্তি)
 *  ৫. প্রাপ্ত Web App URL টি ওয়েবসাইটের অ্যাডমিন ড্যাশবোর্ডে সংরক্ষণ করুন।
 */

// ফিক্সড স্প্রেডশিট আইডি
var SPREADSHEET_ID = '15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc';
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc/edit?usp=drivesdk';

// শিটসমূহের নাম
var SHEETS = {
  USERS: 'Users',
  REQUESTS: 'Requests',
  BLOOD_STOCK: 'BloodStock',
  APPLICATIONS: 'Applications',
  NOTICES: 'Notices',
  ARTICLES: 'Articles',
  SLIDERS: 'Sliders',
  GALLERY: 'Gallery',
  MESSAGES: 'Messages',
  SITE_CONFIG: 'SiteConfig',
  ACTIVITY_LOG: 'ActivityLog'
};

/**
 * স্প্রেডশিট রেফারেন্স পাওয়ার নিরাপদ ফাংশন
 */
function getSpreadsheet() {
  try {
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '') {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    }
  } catch (e) {
    Logger.log('Spreadsheet openById notice: ' + e.toString());
  }
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}
  return SpreadsheetApp.openById('15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc');
}

/**
 * শিটের হেডার স্টাইলিং ও ফরম্যাটিং
 */
function formatHeader(sheet, headers, bgColor, fontColor) {
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
      sheet.setRowHeight(1, 36);
      sheet.setFrozenRows(1);
    } catch (e) {}
  }
}

/**
 * একক শিট তৈরি ও সেটআপ হেল্পার
 */
function setupSingleSheet(sheetName, headers, defaultRows, headerBg) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
    }
    if (defaultRows && Array.isArray(defaultRows) && defaultRows.length > 0) {
      for (var i = 0; i < defaultRows.length; i++) {
        sheet.appendRow(defaultRows[i]);
      }
    }
  }

  formatHeader(sheet, headers, headerBg);
  return sheet;
}

/**
 * =========================================================================
 * প্রধান সেটআপ ফাংশন (Run this function once to create all sheets & headers)
 * =========================================================================
 */
function setupSheets() {
  var ss = getSpreadsheet();
  Logger.log('🚀 গুগল স্প্রেডশিট সেটআপ শুরু হচ্ছে: ' + ss.getName());

  // ১. Users Sheet
  setupSingleSheet(
    SHEETS.USERS,
    ['ID', 'Name', 'Email', 'PasswordHash', 'Phone', 'BloodGroup', 'DOB', 'District', 'Address', 'AvatarUrl', 'LastDonation', 'Role', 'Status', 'IsAvailable', 'TotalDonations', 'CreatedAt'],
    [],
    '#8B0000'
  );

  // ২. Requests Sheet
  setupSingleSheet(
    SHEETS.REQUESTS,
    ['ID', 'RequesterName', 'Contact', 'AlternateContact', 'BloodGroup', 'Hospital', 'District', 'Urgency', 'UnitsNeeded', 'Status', 'PatientProblem', 'DateNeeded', 'AdminNote', 'CreatedAt'],
    [],
    '#B71C1C'
  );

  // ৩. BloodStock Sheet
  var defaultStock = [
    ['A+', 12, 4, new Date().toLocaleString('bn-BD')],
    ['A-', 6, 2, new Date().toLocaleString('bn-BD')],
    ['B+', 18, 5, new Date().toLocaleString('bn-BD')],
    ['B-', 5, 2, new Date().toLocaleString('bn-BD')],
    ['AB+', 8, 3, new Date().toLocaleString('bn-BD')],
    ['AB-', 4, 2, new Date().toLocaleString('bn-BD')],
    ['O+', 22, 5, new Date().toLocaleString('bn-BD')],
    ['O-', 6, 3, new Date().toLocaleString('bn-BD')]
  ];
  setupSingleSheet(
    SHEETS.BLOOD_STOCK,
    ['BloodGroup', 'UnitCount', 'MinimumThreshold', 'LastUpdated'],
    defaultStock,
    '#1E3A8A'
  );

  // ৪. Applications Sheet
  setupSingleSheet(
    SHEETS.APPLICATIONS,
    ['ID', 'Type', 'ApplicantName', 'Email', 'Phone', 'District', 'Address', 'BloodGroup', 'Status', 'Details', 'CreatedAt'],
    [],
    '#4C1D95'
  );

  // ৫. Notices Sheet
  setupSingleSheet(
    SHEETS.NOTICES,
    ['ID', 'Title', 'Category', 'CategoryLabel', 'Content', 'Date', 'PublishedBy', 'IsPinned', 'ExternalUrl', 'ExternalUrlText', 'CreatedAt'],
    [],
    '#D97706'
  );

  // ৬. Articles Sheet
  setupSingleSheet(
    SHEETS.ARTICLES,
    ['ID', 'Title', 'Category', 'Excerpt', 'Content', 'Author', 'AuthorRole', 'ImageUrl', 'YoutubeUrl', 'Date', 'ReadTime', 'Tags', 'ViewsCount', 'CreatedAt'],
    [],
    '#059669'
  );

  // ৭. Sliders Sheet
  setupSingleSheet(
    SHEETS.SLIDERS,
    ['ID', 'Title', 'Subtitle', 'Badge', 'ImageUrl', 'LinkPage', 'LinkText', 'Order', 'IsActive'],
    [],
    '#2563EB'
  );

  // ৮. Gallery Sheet
  setupSingleSheet(
    SHEETS.GALLERY,
    ['ID', 'Title', 'Category', 'ImageUrl', 'Date', 'Upazila', 'Description', 'CreatedAt'],
    [],
    '#7C3AED'
  );

  // ৯. Messages Sheet
  setupSingleSheet(
    SHEETS.MESSAGES,
    ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'CreatedAt'],
    [],
    '#047857'
  );

  // ১০. SiteConfig Sheet
  setupSingleSheet(
    SHEETS.SITE_CONFIG,
    ['Key', 'Value', 'LastUpdated'],
    [
      ['siteName', 'ব্লাড ডোনেশন সোসাইটি, নীলফামারী', new Date().toISOString()],
      ['siteSlogan', 'এক ফোঁটা রক্ত, একটি জীবন • মানবতার সেবায় নিবেদিত', new Date().toISOString()],
      ['emergencyPhone', '+8801711000001', new Date().toISOString()],
      ['spreadsheetUrl', SPREADSHEET_URL, new Date().toISOString()]
    ],
    '#0F172A'
  );

  // ১১. ActivityLog Sheet
  setupSingleSheet(
    SHEETS.ACTIVITY_LOG,
    ['ID', 'UserID', 'UserName', 'Action', 'Details', 'Timestamp', 'IP'],
    [],
    '#374151'
  );

  Logger.log('🎉 সকল শিট ও হেডার সফলভাবে প্রস্তুত হয়েছে!');
  return {
    success: true,
    spreadsheetUrl: SPREADSHEET_URL,
    message: 'ব্লাড ডোনেশন সোসাইটি - গুগল স্প্রেডশিট ডাটাবেজ সফলভাবে সেটআপ হয়েছে।'
  };
}

// ফাংশন এলিয়াস (যাতে যেকোনো নামে রান করলেও একই সেটআপ কাজ করে)
function initialSetup() {
  return setupSheets();
}
function setupsheet() {
  return setupSheets();
}

/**
 * শিট থেকে সব ডাটা অবজেক্ট অ্যারে হিসেবে পড়া (Self-Healing)
 */
function readSheetRows(sheetName) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      setupSheets();
      sheet = ss.getSheetByName(sheetName);
      if (!sheet) return [];
    }

    var data = sheet.getDataRange().getValues();
    if (!data || data.length <= 1) return [];

    var headers = data[0];
    var results = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var item = {};
      var hasValue = false;
      for (var j = 0; j < headers.length; j++) {
        var key = headers[j];
        item[key] = row[j];
        if (row[j] !== '' && row[j] !== null && row[j] !== undefined) {
          hasValue = true;
        }
      }
      if (hasValue) {
        results.push(item);
      }
    }
    return results;
  } catch (err) {
    Logger.log('readSheetRows error in ' + sheetName + ': ' + err.toString());
    return [];
  }
}

/**
 * শিটের সম্পূর্ণ ডাটা ওভাররাইট করা (Web to Sheet Sync)
 */
function overwriteSheetData(sheetName, headers, rows, headerBg) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    } else {
      sheet.clearContents();
    }

    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
    }
    if (rows && Array.isArray(rows) && rows.length > 0) {
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }

    formatHeader(sheet, headers, headerBg);
  } catch (err) {
    Logger.log('overwriteSheetData error in ' + sheetName + ': ' + err.toString());
  }
}

/**
 * =========================================================================
 * ১. GET রিকোয়েস্ট হ্যান্ডলার (One API Call to Fetch All Website Data)
 * =========================================================================
 */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || 'getAllData';

    if (action === 'ping') {
      return respondJson({
        status: 'success',
        message: '🩸 ব্লাড ডোনেশন সোসাইটি Google Apps Script API সচল রয়েছে!',
        spreadsheetId: SPREADSHEET_ID,
        spreadsheetUrl: SPREADSHEET_URL,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'setup' || action === 'setupSheets') {
      var setupResult = setupSheets();
      return respondJson({
        status: 'success',
        message: 'গুগল স্প্রেডশিট শিট ও হেডার সফলভাবে সেটআপ করা হয়েছে!',
        result: setupResult,
        timestamp: new Date().toISOString()
      });
    }

    // ডিফল্ট: এক কলেই সমস্ত ডাটা পাঠানো
    return respondJson({
      status: 'success',
      timestamp: new Date().toISOString(),
      spreadsheetId: SPREADSHEET_ID,
      data: {
        users: readSheetRows(SHEETS.USERS),
        requests: readSheetRows(SHEETS.REQUESTS),
        stock: readSheetRows(SHEETS.BLOOD_STOCK),
        applications: readSheetRows(SHEETS.APPLICATIONS),
        notices: readSheetRows(SHEETS.NOTICES),
        articles: readSheetRows(SHEETS.ARTICLES),
        sliders: readSheetRows(SHEETS.SLIDERS),
        gallery: readSheetRows(SHEETS.GALLERY),
        messages: readSheetRows(SHEETS.MESSAGES),
        config: readSheetRows(SHEETS.SITE_CONFIG),
        logs: readSheetRows(SHEETS.ACTIVITY_LOG)
      }
    });
  } catch (err) {
    return respondJson({ status: 'error', message: err.toString() });
  }
}

/**
 * =========================================================================
 * ২. POST রিকোয়েস্ট হ্যান্ডলার (One API Call to Sync All Data to Sheets)
 * =========================================================================
 */
function doPost(e) {
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (ex) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var action = payload.action || 'syncAllData';

    if (action === 'syncAllData' || action === 'save_all') {
      // Users
      if (Array.isArray(payload.users)) {
        overwriteSheetData(SHEETS.USERS, [
          'ID', 'Name', 'Email', 'PasswordHash', 'Phone', 'BloodGroup', 
          'DOB', 'District', 'Address', 'AvatarUrl', 'LastDonation', 'Role', 'Status', 
          'IsAvailable', 'TotalDonations', 'CreatedAt'
        ], payload.users.map(function(u) {
          return [
            u.id || '', u.name || '', u.email || '', u.passwordHash || '180665', u.phone || '', u.bloodGroup || '',
            u.dob || '', u.district || 'নীলফামারী সদর', u.address || '', u.avatarUrl || '', u.lastDonation || '', u.role || 'user', u.status || 'active',
            u.isAvailableForDonation ? 'true' : 'false', u.totalDonationsCount || 0, u.createdAt || new Date().toISOString()
          ];
        }), '#8B0000');
      }

      // Requests
      if (Array.isArray(payload.requests)) {
        overwriteSheetData(SHEETS.REQUESTS, [
          'ID', 'RequesterName', 'Contact', 'AlternateContact', 'BloodGroup', 
          'Hospital', 'District', 'Urgency', 'UnitsNeeded', 'Status', 
          'PatientProblem', 'DateNeeded', 'AdminNote', 'CreatedAt'
        ], payload.requests.map(function(r) {
          return [
            r.id || '', r.requesterName || '', r.contact || '', r.alternateContact || '', r.bloodGroup || '',
            r.hospital || '', r.district || '', r.urgency || '', r.unitsNeeded || 1, r.status || 'pending',
            r.patientProblem || '', r.donationDateNeeded || '', r.adminNote || '', r.createdAt || new Date().toISOString()
          ];
        }), '#B71C1C');
      }

      // BloodStock
      if (Array.isArray(payload.stock)) {
        overwriteSheetData(SHEETS.BLOOD_STOCK, [
          'BloodGroup', 'UnitCount', 'MinimumThreshold', 'LastUpdated'
        ], payload.stock.map(function(s) {
          return [
            s.bloodGroup || '', s.unitCount || 0, s.minimumThreshold || 3, s.lastUpdated || new Date().toISOString()
          ];
        }), '#1E3A8A');
      }

      // Applications
      if (Array.isArray(payload.applications)) {
        overwriteSheetData(SHEETS.APPLICATIONS, [
          'ID', 'Type', 'ApplicantName', 'Email', 'Phone', 'District', 'Address', 'BloodGroup', 'Status', 'Details', 'CreatedAt'
        ], payload.applications.map(function(a) {
          return [
            a.id || '', a.type || '', a.applicantName || '', a.email || '', a.phone || '', a.district || '', a.address || '', a.bloodGroup || '', a.status || 'pending', JSON.stringify(a.customFields || {}), a.createdAt || new Date().toISOString()
          ];
        }), '#4C1D95');
      }

      // Notices
      if (Array.isArray(payload.notices)) {
        overwriteSheetData(SHEETS.NOTICES, [
          'ID', 'Title', 'Category', 'CategoryLabel', 'Content', 'Date', 'PublishedBy', 'IsPinned', 'ExternalUrl', 'ExternalUrlText', 'CreatedAt'
        ], payload.notices.map(function(n) {
          return [
            n.id || '', n.title || '', n.category || '', n.categoryLabel || '', n.content || '', n.date || '', n.publishedBy || '', n.isPinned ? 'true' : 'false', n.externalUrl || '', n.externalUrlText || '', n.createdAt || new Date().toISOString()
          ];
        }), '#D97706');
      }

      // Articles
      if (Array.isArray(payload.articles)) {
        overwriteSheetData(SHEETS.ARTICLES, [
          'ID', 'Title', 'Category', 'Excerpt', 'Content', 'Author', 'AuthorRole', 'ImageUrl', 'YoutubeUrl', 'Date', 'ReadTime', 'Tags', 'ViewsCount', 'CreatedAt'
        ], payload.articles.map(function(ar) {
          return [
            ar.id || '', ar.title || '', ar.category || '', ar.excerpt || '', ar.content || '', ar.author || '', ar.authorRole || '', ar.imageUrl || '', ar.youtubeUrl || '', ar.date || '', ar.readTime || '', (ar.tags || []).join(', '), ar.viewsCount || 0, ar.createdAt || new Date().toISOString()
          ];
        }), '#059669');
      }

      // Sliders
      if (Array.isArray(payload.sliders)) {
        overwriteSheetData(SHEETS.SLIDERS, [
          'ID', 'Title', 'Subtitle', 'Badge', 'ImageUrl', 'LinkPage', 'LinkText', 'Order', 'IsActive'
        ], payload.sliders.map(function(sl) {
          return [
            sl.id || '', sl.title || '', sl.subtitle || '', sl.badge || '', sl.imageUrl || '', sl.linkPage || '', sl.linkText || '', sl.order || 0, sl.isActive ? 'true' : 'false'
          ];
        }), '#2563EB');
      }

      // Gallery
      if (Array.isArray(payload.gallery)) {
        overwriteSheetData(SHEETS.GALLERY, [
          'ID', 'Title', 'Category', 'ImageUrl', 'Date', 'Upazila', 'Description', 'CreatedAt'
        ], payload.gallery.map(function(g) {
          return [
            g.id || '', g.title || '', g.category || '', g.imageUrl || '', g.date || '', g.upazila || '', g.description || '', g.createdAt || new Date().toISOString()
          ];
        }), '#7C3AED');
      }

      // Messages
      if (Array.isArray(payload.messages)) {
        overwriteSheetData(SHEETS.MESSAGES, [
          'ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'CreatedAt'
        ], payload.messages.map(function(m) {
          return [
            m.id || '', m.name || '', m.email || '', m.phone || '', m.subject || '', m.message || '', m.status || 'new', m.createdAt || new Date().toISOString()
          ];
        }), '#047857');
      }

      return respondJson({
        status: 'success',
        message: 'গুগল স্প্রেডশিটে সফলভাবে সমস্ত তথ্য সংরক্ষিত ও সিঙ্ক হয়েছে!',
        spreadsheetUrl: SPREADSHEET_URL,
        timestamp: new Date().toISOString()
      });
    }

    return respondJson({ status: 'error', message: 'Unknown action: ' + action });
  } catch (err) {
    return respondJson({ status: 'error', message: err.toString() });
  }
}

/**
 * JSON রেসপন্স প্রস্তুতকারক
 */
function respondJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export const GOOGLE_SHEETS_SETUP_STEPS = [
  {
    step: 1,
    title: 'সংযুক্ত Google Sheets স্প্রেডশিট খুলুন',
    description: 'নীলফামারী ব্লাড ডোনেশন সোসাইটির নির্ধারিত স্প্রেডশিট লিংকটি ওপেন করুন (ID: 15YbYI9ePTs2JtvvzhENv5ZelMIIf-OFQe3QAmuSfMJc)।'
  },
  {
    step: 2,
    title: 'Apps Script এডিটর ওপেন করুন',
    description: 'স্প্রেডশিটের মেনুবার থেকে Extensions > Apps Script এ ক্লিক করুন।'
  },
  {
    step: 3,
    title: 'Code.gs পেস্ট করুন',
    description: 'এডিটরের ডিফল্ট কোড মুছে দিয়ে অ্যাডমিন ড্যাশবোর্ডে দেওয়া আপডেট কোড Code.gs এ পেস্ট করুন ও সংরক্ষণ করুন।'
  },
  {
    step: 4,
    title: 'setupSheets() রান করুন',
    description: 'ফাংশন ড্রপডাউন থেকে "setupSheets" নির্বাচন করে "Run" এ ক্লিক করুন। এক ক্লিকেই সমস্ত শিট ও হেডার তৈরি হয়ে যাবে।'
  },
  {
    step: 5,
    title: 'Web App হিসেবে ডিপ্লয় করুন',
    description: 'Deploy > New deployment (বা Manage deployments) > Web app নির্বাচন করে Execute as: Me এবং Who has access: Anyone দিন।'
  },
  {
    step: 6,
    title: 'স্বয়ংক্রিয় সিঙ্ক সচল',
    description: 'Web App URL ড্যাশবোর্ডে সেট থাকলে ওয়েবসাইট প্রতি ১০ সেকেন্ড পরপর ব্যাকগ্রাউন্ডে স্বয়ংক্রিয়ভাবে ডাটা সিঙ্ক করবে।'
  }
];
