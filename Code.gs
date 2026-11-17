/**
 * ==============================================================================
 * AERON & NAYA - SMART BUDGET TRACKER & 9:00 PM DAILY EMAIL REMINDER
 * ==============================================================================
 * Connects directly to Google Sheet:
 * https://docs.google.com/spreadsheets/d/1QcDE7dwEMgHNl_81iNp8yl2RTQSpSDXbWMxcQx5_79E/edit#gid=1627781760
 *
 * FEATURES:
 * 1. Daily 9:00 PM PHT automated email reminder to log purchases.
 * 2. Web App endpoint (doPost) to receive new expenses directly from the mobile HTML app.
 * 3. Monthly limiter calculation minus set bills (Water, Power, Rent).
 * 4. Automatic calculation of Aeron & Naya split shares and live settlement balance.
 */

// ------------------------------------------------------------------------------
// CONFIGURATION: Set your recipient emails and budget limits here
// ------------------------------------------------------------------------------
const CONFIG = {
  // Comma-separated emails to receive the 9:00 PM daily reminder:
  RECIPIENT_EMAILS: "aeron@example.com, naya@example.com", // <-- Replace with your real emails!
  
  // Sheet tab name (or leave empty to use active/first sheet):
  SHEET_NAME: "Expenses", // or whatever the tab is named
  
  // Monthly Budget Target & Set Bills (Water, Power, Rent)
  MONTHLY_BUDGET_LIMIT: 60000,
  ESTIMATED_RENT: 16000,
  ESTIMATED_ELECTRIC: 5500,
  ESTIMATED_WATER: 1200,
  
  // Mobile Web App URL (hosted URL or GitHub Pages / Vercel link)
  WEB_APP_URL: "https://docs.google.com/spreadsheets/d/1QcDE7dwEMgHNl_81iNp8yl2RTQSpSDXbWMxcQx5_79E/edit#gid=1627781760"
};

/**
 * 1. ONE-TIME SETUP TRIGGER: Run this function ONCE in the Apps Script editor.
 * It schedules the daily email reminder to fire every night at 9:00 PM Philippine Time.
 */
function setupDailyReminderTrigger() {
  // Remove existing triggers for this function to prevent duplicate emails
  const existingTriggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < existingTriggers.length; i++) {
    if (existingTriggers[i].getHandlerFunction() === "sendDailyExpenseReminder") {
      ScriptApp.deleteTrigger(existingTriggers[i]);
    }
  }

  // Create a time-driven trigger for 9:00 PM (21:00) Asia/Manila timezone
  ScriptApp.newTrigger("sendDailyExpenseReminder")
    .timeBased()
    .everyDays(1)
    .atHour(21) // 9:00 PM - 10:00 PM window
    .inTimezone("Asia/Manila")
    .create();

  Logger.log("✅ Successfully scheduled 9:00 PM PHT daily reminder trigger!");
}

/**
 * 2. DAILY 9:00 PM EMAIL REMINDER
 * Triggered automatically by Google's cloud servers every night.
 */
function sendDailyExpenseReminder() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  
  const todayStr = Utilities.formatDate(new Date(), "Asia/Manila", "MM/dd/yy");
  const fullDateDisplay = Utilities.formatDate(new Date(), "Asia/Manila", "EEEE, MMMM d, yyyy");
  
  // Calculate today's logged count and current month metrics
  const data = sheet.getDataRange().getValues();
  let todayCount = 0;
  let todayTotal = 0;
  let aeronSpentTotal = 0;
  let aeronShareTotal = 0;
  let nayaSpentTotal = 0;
  let nayaShareTotal = 0;

  // Scan rows (assuming header is around row 4)
  for (let r = 4; r < data.length; r++) {
    const row = data[r];
    const rawDate = row[0];
    if (!rawDate) continue;

    let formattedDate = "";
    if (rawDate instanceof Date) {
      formattedDate = Utilities.formatDate(rawDate, "Asia/Manila", "MM/dd/yy");
    } else {
      formattedDate = String(rawDate).trim();
    }

    const amt = parseFloat(row[3]) || 0;
    const paidBy = String(row[4] || "").trim();
    const aShare = parseFloat(row[7]) || 0;
    const nShare = parseFloat(row[8]) || 0;

    if (formattedDate === todayStr) {
      todayCount++;
      todayTotal += amt;
    }

    if (paidBy.toLowerCase().includes("aeron")) {
      aeronSpentTotal += amt;
    } else if (paidBy.toLowerCase().includes("naya")) {
      nayaSpentTotal += amt;
    }

    aeronShareTotal += aShare;
    nayaShareTotal += nShare;
  }

  // Calculate Settlement
  const netAeron = aeronSpentTotal - aeronShareTotal;
  let settlementMessage = "";
  if (Math.abs(netAeron) < 1) {
    settlementMessage = "✅ All balances are squared up! Nobody owes anything.";
  } else if (netAeron > 0) {
    settlementMessage = `💡 <strong>Naya owes Aeron James ₱${netAeron.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>`;
  } else {
    settlementMessage = `💡 <strong>Aeron James owes Naya ₱${Math.abs(netAeron).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>`;
  }

  // Subject line
  const subject = `🔔 9:00 PM Daily Budget Reminder: Log Today's Expenses (${todayStr})`;

  // HTML Email Body
  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 28px 24px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">⏰ 9:00 PM Daily Cost Reminder</h1>
        <p style="margin: 6px 0 0 0; color: #d1fae5; font-size: 13px;">${fullDateDisplay}</p>
      </div>

      <div style="padding: 24px;">
        <p style="font-size: 15px; line-height: 1.5; color: #e2e8f0; margin-top: 0;">
          Hey <strong>Aeron</strong> & <strong>Naya</strong>! 👋
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
          It's 9:00 PM — time for your quick daily financial check-in! Did you make any purchases today?
          (<em>Grab, FoodPanda, Groceries, Dining, Coffee, or Bills</em>).
        </p>

        <!-- Status Card -->
        <div style="background-color: #1e293b; border-radius: 14px; padding: 16px; margin: 20px 0; border: 1px solid #334155;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #38bdf8; font-weight: 700; margin-bottom: 8px;">
            TODAY'S LOGGED STATUS
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; color: #f1f5f9; margin-bottom: 6px;">
            <span>Transactions logged today:</span>
            <strong style="color: #10b981;">${todayCount} logged (₱${todayTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})})</strong>
          </div>
          <div style="padding-top: 10px; margin-top: 10px; border-top: 1px solid #334155; font-size: 13px; color: #cbd5e1;">
            ${settlementMessage}
          </div>
        </div>

        <!-- Call to Action Button -->
        <div style="text-align: center; margin: 26px 0 16px 0;">
          <a href="${CONFIG.WEB_APP_URL}" style="display: inline-block; background-color: #10b981; color: #022c22; text-decoration: none; font-weight: 800; font-size: 15px; padding: 14px 28px; border-radius: 14px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
            ⚡ Open Mobile Budget Tracker
          </a>
        </div>

        <p style="text-align: center; font-size: 12px; color: #64748b; margin-bottom: 0;">
          Logging each cost takes less than 15 seconds and keeps your monthly limiter on track!
        </p>
      </div>

      <div style="background-color: #090d16; padding: 14px; text-align: center; font-size: 11px; color: #475569; border-top: 1px solid #1e293b;">
        Aeron & Naya Budget System • Automated Google Apps Script
      </div>
    </div>
  `;

  // Send Email
  MailApp.sendEmail({
    to: CONFIG.RECIPIENT_EMAILS,
    subject: subject,
    htmlBody: htmlBody
  });

  Logger.log("✅ 9:00 PM reminder email sent successfully to " + CONFIG.RECIPIENT_EMAILS);
}

/**
 * 3. POST ENDPOINT: Receives new purchases from your mobile web app and appends to Google Sheet
 */
function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    
    // Parse JSON payload
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    const dateVal = data.date || Utilities.formatDate(new Date(), "Asia/Manila", "MM/dd/yy");
    const desc = data.description || "Expense";
    const category = data.category || "General";
    const totalAmount = parseFloat(data.amount) || 0;
    const paidBy = data.paidBy || "Aeron James";
    const splitCode = data.splitCode || "C";
    const ratio = data.ratio || "";
    const remarks = data.remarks || "";

    // Compute shares based on Split Code
    let aeronShare = 0;
    let nayaShare = 0;

    if (splitCode === "A") {
      aeronShare = totalAmount;
      nayaShare = 0;
    } else if (splitCode === "B") {
      aeronShare = 0;
      nayaShare = totalAmount;
    } else {
      // Code C: 50 / 50 split
      aeronShare = totalAmount / 2;
      nayaShare = totalAmount / 2;
    }

    // Append to sheet in the exact matching column format
    sheet.appendRow([
      dateVal,
      desc,
      category,
      totalAmount,
      paidBy,
      splitCode,
      ratio,
      aeronShare,
      nayaShare,
      remarks
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Row appended successfully",
      item: desc,
      amount: totalAmount
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 4. GET ENDPOINT: Can serve the HTML app directly from Google Apps Script Web App!
 */
function doGet(e) {
  // Option A: If an 'index.html' file is placed inside the Apps Script project:
  try {
    return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Aeron & Naya Budget Tracker')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "online",
      message: "Aeron & Naya Budget API is running! Use POST to log expenses."
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
