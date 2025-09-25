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
function initializeDocument() {
  try {
    currentDocument = DocumentApp.getActiveDocument();
    documentContent = currentDocument.getBody().getText();
    
    // Set up selection change listener
    setupSelectionListener();
    
    console.log('Document initialized successfully');
    console.log('Document title:', currentDocument.getName());
    console.log('Content length:', documentContent.length);
    
  } catch (error) {
    console.error('Error initializing document:', error);
  }
}

/**
 * Set up listener for selection changes
 */
function setupSelectionListener() {
  try {
    // This is a simplified approach - in real implementation,
    // you'd use more sophisticated event handling
    console.log('Selection listener set up');
  } catch (error) {
    console.error('Error setting up selection listener:', error);
  }
}

/**
 * Extract currently selected text
 */
function extractSelectedText() {
  try {
    // Initialize document if not already done
    if (!currentDocument) {
      initializeDocument();
    }
    
    const selection = DocumentApp.getActiveDocument().getSelection();
    
    if (!selection) {
      console.log('No text selected, returning failure response');
      return {
        success: false,
        text: '',
        message: 'No text selected. Please select some text first.'
      };
    }
    
    let selectedText = '';
    const rangeElements = selection.getRangeElements();
    
    for (let i = 0; i < rangeElements.length; i++) {
      const element = rangeElements[i];
      
      if (element.getElement().getType() === DocumentApp.ElementType.TEXT) {
        const text = element.getElement().asText();
        const startOffset = element.getStartOffset();
        const endOffset = element.getEndOffsetInclusive();
        
        if (startOffset <= endOffset) {
          selectedText += text.getText().substring(startOffset, endOffset + 1);
        }
      }
    }
    
    if (selectedText.trim()) {
      lastSelection = selectedText.trim();
      console.log('Selected text extracted successfully:', selectedText.substring(0, 100));
      
      // Store in Properties for access by other functions
      PropertiesService.getDocumentProperties().setProperty('lastSelection', lastSelection);
      
      // Return success response for the interface
      return {
        success: true,
        text: lastSelection,
        message: 'Text extracted successfully'
      };
      
    } else {
      console.log('No text found in selection');
      return {
        success: false,
        text: '',
        message: 'No text found in selection'
      };
    }
    
  } catch (error) {
    console.error('Error extracting selected text:', error);
    return {
      success: false,
      text: '',
      message: 'Error extracting text: ' + error.message
    };
  }
}

/**
 * Extract all text from the document
 */
function extractAllText() {
  try {
    // Initialize document if not already done
    if (!currentDocument) {
      initializeDocument();
    }
    
    const body = DocumentApp.getActiveDocument().getBody();
    const allText = body.getText();
    
    if (allText && allText.trim()) {
      documentContent = allText.trim();
      
      // Store in Properties
      PropertiesService.getDocumentProperties().setProperty('documentContent', documentContent);
      
      console.log('All text extracted successfully. Length:', documentContent.length);
      
      // Return success response for the interface
      return {
        success: true,
        text: documentContent,
        message: 'All text extracted successfully'
      };
      
    } else {
      console.log('No text found in document');
      return {
        success: false,
        text: '',
        message: 'No text found in document'
      };
    }
    
  } catch (error) {
    console.error('Error extracting all text:', error);
    return {
      success: false,
      text: '',
      message: 'Error extracting all text: ' + error.message
    };
  }
}

/**
 * Show information about current selection
 */
function showSelectionInfo() {
  try {
    // Initialize document if not already done
    if (!currentDocument) {
      initializeDocument();
    }
    
    const selection = DocumentApp.getActiveDocument().getSelection();
    
    if (!selection) {
      console.log('No text currently selected');
      return {
        success: false,
        info: 'No text currently selected',
        message: 'No text currently selected'
      };
    }
    
    const rangeElements = selection.getRangeElements();
    let info = 'Selection Info:\n';
    info += 'Number of elements: ' + rangeElements.length + '\n';
    
    for (let i = 0; i < rangeElements.length; i++) {
      const element = rangeElements[i];
      const docElement = element.getElement();
      
      info += `Element ${i + 1}:\n`;
      info += '  Type: ' + docElement.getType() + '\n';
      info += '  Start offset: ' + element.getStartOffset() + '\n';
      info += '  End offset: ' + element.getEndOffsetInclusive() + '\n';
      
      if (docElement.getType() === DocumentApp.ElementType.TEXT) {
        const text = docElement.asText();
        const selectedText = text.getText().substring(
          element.getStartOffset(), 
          element.getEndOffsetInclusive() + 1
        );
        info += '  Selected text: "' + selectedText + '"\n';
      }
    }
    
    console.log('Selection info retrieved successfully');
    
    // Return success response for the interface
    return {
      success: true,
      info: info,
      message: 'Selection info retrieved successfully'
    };
    
  } catch (error) {
    console.error('Error showing selection info:', error);
    
    return {
      success: false,
      info: '',
      message: 'Error showing selection info: ' + error.message
    };
  }
}

/**
 * Get the last extracted selection
 */
function getLastSelection() {
  return PropertiesService.getDocumentProperties().getProperty('lastSelection') || '';
}

/**
 * Get the full document content
 */
function getDocumentContent() {
  return PropertiesService.getDocumentProperties().getProperty('documentContent') || '';
}

/**
 * Insert text at cursor position or replace selected text in the document
 */
