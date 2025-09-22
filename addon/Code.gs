/**
 * ResEditX-AI Resume Assistant Google Drive Add-on
 * Provides real-time text selection and extraction capabilities
 */

// Global variables to track document state
let currentDocument = null;
let documentContent = '';
let lastSelection = '';

/**
 * Called when the add-on is installed or updated
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Initialize API key for continuous operation
 */
function initializeApiKey() {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (apiKey) {
      console.log('✅ ResEditX API key is configured and ready');
    } else {
      console.log('⚠️ API key not found in Script Properties');
    }
  } catch (error) {
    console.error('Error during API key check:', error);
  }
}

/**
 * Called when the add-on is opened
 */
function onOpen(e) {
  // Auto-initialize API key to ensure continuous operation
  initializeApiKey();
  
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem('Open ResEditX', 'showSidebar')
    .addToUi();
}

/**
 * Called when the add-on is opened in a document
 * Note: onFileScopeGranted is not supported in current Apps Script version
 * We'll initialize the document when functions are called instead
 */
function onFileScopeGranted(e) {
  console.log('File scope granted:', e);
  initializeDocument();
}

/**
 * Initialize document tracking
 */
