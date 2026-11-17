# 💰 Aeron & Naya • Smart Budget Tracker & 9:00 PM Daily Reminder

A mobile-first, interactive budget tracking web application specifically designed to match and sync with your **[Google Sheets Budget Tracker](https://docs.google.com/spreadsheets/d/1QcDE7dwEMgHNl_81iNp8yl2RTQSpSDXbWMxcQx5_79E/edit#gid=1627781760)**.

---

## 🌟 Key Features

1. **📱 Phone-Optimized Mobile Experience**
   - Designed like a native iOS/Android finance app.
   - Large touch targets, quick amount chips (`+₱50`, `+₱100`, `+₱500`, `+₱1000`), and quick tags (`FoodPanda`, `Grab`, `Water Bill`, `Rent`, `Electric Bill`, etc.).
   - Can be added directly to your phone's Home Screen for 1-tap logging.

2. **🛡️ Monthly Spending Limiter & Fixed Bills Protection**
   - **The Problem:** People often overspend early in the month because they forget about impending bills.
   - **The Solution:** You set a Total Monthly Budget (e.g. ₱60,000). The app automatically subtracts your **Set Bills** (Rent ₱16,000, Electricity ~₱5,500, Water ~₱1,200).
   - The remaining amount is your true **Safe-to-Spend Pool** for groceries, dining out, and shopping.
   - Shows a real-time **Daily Allowance Gauge** (e.g., *"₱1,240 / day left for the remaining 14 days"*) and triggers **amber/red overspending alerts** if spending pace is too high.

3. **⚖️ Exact Split Code & Who-Owes-Whom Balance**
   - Fully matches your spreadsheet logic:
     - **Code C (50/50 Split):** Automatically splits 50% Aeron / 50% Naya.
     - **Code A (Aeron 100%):** Aeron pays for himself (Naya share = ₱0).
     - **Code B (Naya 100%):** Naya personal expense (Aeron share = ₱0).
   - Live settlement card: Shows cumulative Aeron spent vs. True Share, Naya spent vs. True Share, and who owes whom.
   - **"Record Settle" Button:** Balances the ledger with a single click.

4. **⏰ Daily 9:00 PM PHT Automated Email Reminder**
   - Automated via Google Apps Script (running 100% free 24/7 in Google's cloud).
   - Every night at 9:00 PM Manila Time, both Aeron and Naya receive an email prompt with a one-click button to log today's purchases before going to bed.

5. **🔄 Dual Storage (Offline-First + Live Google Sheets Sync)**
   - Works immediately offline using your browser's local storage with your existing 59 transactions preloaded!
   - Can sync live submissions straight into your Google Sheet via Google Apps Script Web App API.

---

## 🚀 Setup Guide

### Option 1: Instant Local Use on Phone / Laptop
1. Open [`index.html`](file:///C:/Users/Shania%20Grezula/.gemini/antigravity/scratch/budget-tracker/index.html) in any browser (Chrome, Safari, Edge).
2. To use on your phone:
   - You can host it free in 2 minutes on **GitHub Pages**, **Vercel**, or **Netlify Drop**.
   - Or, serve it directly from your Google Sheet using Google Apps Script (see below)!

---

### Option 2: Set Up the 9:00 PM Daily Email Reminder (Takes 2 Minutes)

1. Open your Google Sheet: [Open Sheet](https://docs.google.com/spreadsheets/d/1QcDE7dwEMgHNl_81iNp8yl2RTQSpSDXbWMxcQx5_79E/edit#gid=1627781760)
2. In the top menu, click **Extensions** &rarr; **Apps Script**.
3. Delete any default code in `Code.gs`, and paste the entire contents of [`Code.gs`](file:///C:/Users/Shania%20Grezula/.gemini/antigravity/scratch/budget-tracker/Code.gs).
4. Near line 18 in `Code.gs`, update your actual emails:
   ```javascript
   RECIPIENT_EMAILS: "aeron@gmail.com, naya@gmail.com",
   ```
5. In the toolbar function dropdown, select **`setupDailyReminderTrigger`** and click **Run** ▶️.
6. Grant Google the standard one-time script authorization.
7. **Done!** Every night at 9:00 PM Philippine Time, Google will automatically email you both.

---

### Option 3: Connect Mobile Web App Directly to Google Sheet

To make every purchase logged on your phone automatically appear as a new row in your Google Sheet:

1. Inside the Google Apps Script editor (from step 2 above), click the blue **Deploy** button (top right) &rarr; **New deployment**.
2. Select type: **Web app**.
3. Set:
   - **Execute as:** `Me (your account)`
   - **Who has access:** `Anyone`
4. Click **Deploy** and copy the **Web app URL** (looks like `https://script.google.com/macros/s/.../exec`).
5. Open your mobile web tracker &rarr; Tap the **Settings icon (⚙️)** &rarr; Paste your Web app URL into the **Google Sheets Web App URL** field &rarr; Save!
6. Now, whenever you tap **"Save Purchase"** on your phone, it immediately records it locally AND appends it to your live Google Sheet!

---

## 📱 How to Add to Your Phone's Home Screen (App Icon)

- **iPhone (Safari):**
  1. Open the tracker link in Safari.
  2. Tap the **Share** button (box with an arrow pointing up at the bottom).
  3. Scroll down and tap **"Add to Home Screen"**.
  4. Tap **Add**. An icon will appear on your iPhone home screen!

- **Android (Chrome):**
  1. Open the tracker link in Google Chrome.
  2. Tap the **Three Dots (⋮)** in the top right.
  3. Tap **"Add to Home screen"** or **"Install app"**.

---

## 💡 Recommended Budgeting Rules for Shared Living

1. **The Fixed-Bills First Rule (Implemented in this Tracker):**
   - In the Philippines, utility bills (especially electricity during hot months) and rent can consume 40-50% of monthly household income.
   - By locking your fixed bills first (Rent ₱16,000 + Electricity ~₱5,500 + Water ~₱1,200 = ~₱22,700), you never risk spending rent money on FoodPanda or Shopee.
2. **Daily Burn Rate Awareness:**
   - Check the **Recommended Daily Allowance** in the app. If you see you have ₱1,200/day left and order ₱800 for lunch, you know dinner must be around ₱400 to remain on target.
3. **Mid-Month Check-in (15th of the Month):**
   - Use the **Record Settle** button around the 15th and 30th (payday) so balances don't balloon beyond manageable amounts.
4. **9:00 PM Ritual:**
   - Take 30 seconds after dinner when the 9:00 PM reminder email arrives to record the day's expenses together.
