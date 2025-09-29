# ResEditX Google Drive Add-on

A powerful Google Drive Add-on that provides **real-time text selection and extraction** from Google Docs documents.

## 🎯 **What This Add-on Does (That Chrome Extensions Can't):**

- ✅ **Real-time text selection** - Get selected text as user highlights it
- ✅ **Direct document access** - No DOM manipulation needed
- ✅ **Selection tracking** - Know exactly what text is selected
- ✅ **Cursor position** - Track where the user is typing
- ✅ **Native integration** - Works inside Google Docs, not as external script

## 🚀 **Installation Steps:**

### **Step 1: Go to Google Apps Script**
1. Visit [script.google.com](https://script.google.com)
2. Sign in with your Google account
3. Click **"New Project"**

### **Step 2: Set Up the Project**
1. **Delete the default code** in the editor
2. **Copy and paste** the contents of `Code.gs` into the editor
3. **Save the project** (Ctrl+S or Cmd+S)
4. **Name it** "ResumeGenie" or whatever you prefer

### **Step 3: Configure the Add-on**
1. Click on **"Project Settings"** (gear icon)
2. **Copy the Project ID** (you'll need this later)
3. Go back to the **"Code"** tab

### **Step 4: Deploy as Add-on**
1. Click **"Deploy"** → **"New deployment"**
2. Choose **"Add-on"** as the type
3. **Fill in the details:**
   - **Description**: "ResumeGenie - Text extraction for Google Docs"
   - **Version**: "1.0"
4. Click **"Deploy"**

### **Step 5: Install in Google Docs**
1. **Open a Google Doc**
2. Go to **"Extensions"** → **"Add-ons"** → **"Manage add-ons"**
3. Click **"Install"** next to ResEditX
4. **Grant permissions** when prompted

## 🎮 **How to Use:**

### **After Installation:**
1. **Open any Google Doc**
2. **Select some text** (highlight it)
3. Go to **"Extensions"** → **"ResEditX"**
4. Click **"Extract Selected Text"**
5. **Your selected text will be extracted!**

### **Available Commands:**
- **Extract Selected Text** - Gets currently highlighted text
- **Extract All Text** - Gets entire document content
- **Show Selection Info** - Shows details about current selection

## 🔧 **Technical Details:**

### **Key Functions:**
- `extractSelectedText()` - Gets user's current text selection
- `extractAllText()` - Gets entire document content
- `getLastSelection()` - Retrieves last extracted selection
- `getDocumentContent()` - Retrieves full document content

### **How It Works:**
1. **Native Integration** - Runs inside Google Docs environment
2. **Selection API** - Uses Google Docs' built-in selection methods
3. **Real-time Access** - Can see what user selects immediately
4. **No DOM Hacking** - Works with Google Docs' internal structure

## 🆚 **Add-on vs Chrome Extension:**

| Feature | Chrome Extension | Google Drive Add-on |
|---------|------------------|---------------------|
| **Text Selection** | ❌ Unreliable | ✅ Reliable |
| **Integration** | ❌ External | ✅ Native |
| **API Access** | ❌ Limited | ✅ Full |
| **Selection Events** | ❌ No access | ✅ Real-time |
| **Document Model** | ❌ DOM only | ✅ Internal |

## 🐛 **Troubleshooting:**

### **Common Issues:**
1. **"Add-on not showing"** - Make sure you're in a Google Doc, not Google Drive
2. **"No permissions"** - Grant all requested permissions during installation
3. **"Selection not working"** - Make sure you have text actually selected

### **Debug Mode:**
- Open **Google Apps Script** console to see logs
- Check **"View"** → **"Execution log"** for errors

## 📚 **Advanced Usage:**

### **Programmatic Access:**
```javascript
// Get last selected text
const selectedText = getLastSelection();

// Get full document content
const documentContent = getDocumentContent();
```

### **Custom Integration:**
- Use the functions in other Apps Script projects
- Integrate with Google Sheets or other Google services
- Build automated workflows

## 🎉 **Why This Works (Unlike Chrome Extensions):**

1. **Native Access** - Runs inside Google Docs, not as external script
2. **Selection Events** - Can hook into Google Docs' selection system
3. **Document API** - Direct access to document content and structure
4. **No Security Restrictions** - Google trusts its own add-ons
5. **Real-time Updates** - Can see changes as they happen

## 🔮 **Future Enhancements:**

- **Auto-extraction** - Extract text automatically as user types
- **Selection history** - Track multiple selections
- **Export options** - Send text to other services
- **AI integration** - Process extracted text with AI services

---

**This add-on approach is exactly how Grammarly and other professional tools work!** 🎯
