# 🚀 ResumeGenie Google Drive Add-on Setup Guide

## ✨ **What You'll Get:**
- **Beautiful, professional interface** that rivals Grammarly
- **Real-time text extraction** from Google Docs
- **Native Google integration** (no more Chrome extension limitations!)
- **Reliable text selection** using Google's internal APIs

## 🎯 **Step-by-Step Setup:**

### **Step 1: Open Google Apps Script**
1. Go to [script.google.com](https://script.google.com)
2. Sign in with your Google account
3. Click **"New Project"**

### **Step 2: Copy the Code**
1. **Delete** the default `Code.gs` content
2. **Copy and paste** the entire content from `Code.gs` in your addon folder
3. **Save** the project (Ctrl+S or Cmd+S)

### **Step 3: Copy the Interface**
1. Click **"HTML"** in the left sidebar
2. Click **"New HTML file"**
3. Name it: `Interface`
4. **Copy and paste** the entire content from `Interface.html`
5. **Save** the project

### **Step 4: Copy the Manifest**
1. Click **"Project Settings"** (gear icon)
2. **Copy and paste** the content from `appsscript.json`
3. **Save** the project

### **Step 5: Test the Functions**
1. **Select** any function in the editor (e.g., `extractAllText`)
2. Click the **"Run"** button (▶️)
3. **Authorize** the script when prompted
4. **Check the execution logs** for any errors

### **Step 6: Deploy as Add-on**
1. Click **"Deploy"** → **"New deployment"**
2. Choose **"Add-on"** as the type
3. Fill in the details:
   - **Description**: ResumeGenie AI Resume Assistant
   - **Version**: 1.0
4. Click **"Deploy"**

## 🧪 **Testing Your Add-on:**

### **Method 1: Direct Function Testing**
1. Open a **Google Doc** in another tab
2. **Select some text** in the document
3. Go back to **Apps Script**
4. Run `extractSelectedText()` function
5. Check the **execution logs** for results

### **Method 2: Interface Testing**
1. **Deploy** the add-on first
2. Open a **Google Doc**
3. Look for **"Add-ons"** in the menu
4. Click **"ResumeGenie"** → **"Extract Selected Text"**

## 🔧 **Troubleshooting:**

### **"Change project type" Error:**
- This is **normal** for add-ons
- Click **"Change project type"**
- Choose **"User-managed"** GCP project
- **Continue** with the setup

### **"Sign-in required" for URLs:**
- This is **normal** for Apps Script
- **Sign in** with your Google account
- These are **deployment URLs**, not errors

### **Functions not working:**
1. **Check execution logs** for errors
2. **Ensure** you're in a Google Doc (not regular text)
3. **Verify** the function names match exactly
4. **Try** running `extractAllText()` first

## 🎨 **Interface Features:**

### **Beautiful Design:**
- **Gradient header** with magic icon
- **Modern buttons** with hover effects
- **Professional color scheme**
- **Responsive layout**

### **Functionality:**
- **Extract Selected Text** - Gets highlighted text
- **Extract All Text** - Gets entire document
- **Show Selection Info** - Detailed selection data
- **Copy/Clear/Export** - Text management
- **Real-time statistics** - Character/word counts

### **User Experience:**
- **Loading states** with spinners
- **Status messages** for feedback
- **Error handling** with clear messages
- **Smooth animations** and transitions

## 📱 **How It Works:**

1. **User selects text** in Google Doc
2. **Clicks "Extract Selected Text"** in add-on
3. **Add-on calls** Google's native APIs
4. **Text is extracted** using `DocumentApp.getSelection()`
5. **Results displayed** in beautiful interface
6. **User can copy/export** the extracted text

## 🚀 **Next Steps After Setup:**

1. **Test basic functions** in Apps Script editor
2. **Deploy as add-on** when ready
3. **Install in Google Docs** for real use
4. **Customize interface** if needed
5. **Add more features** like AI analysis

## 💡 **Pro Tips:**

- **Always test functions** in Apps Script editor first
- **Check execution logs** for debugging
- **Use real Google Docs** for testing (not text files)
- **Authorize scripts** when prompted
- **Save frequently** during development

## 🎉 **You're Ready!**

Your ResumeGenie add-on now has:
- ✅ **Professional backend** with Google APIs
- ✅ **Beautiful interface** for users
- ✅ **Reliable text extraction** 
- ✅ **Native Google integration**

**Go ahead and test it!** 🚀
