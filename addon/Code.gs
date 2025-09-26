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
function insertText(text) {
  try {
    const doc = DocumentApp.getActiveDocument();
    
    // First, try to get the current selection (highlighted text)
    const selection = doc.getSelection();
    
    if (selection && selection.getRangeElements().length > 0) {
      // There's highlighted text - replace it with the new text
      console.log('Found selection, replacing selected text');
      
      // Get all selected elements and their ranges
      const rangeElements = selection.getRangeElements();
      let totalSelectedText = '';
      
      // Collect all selected text for logging
      for (let i = 0; i < rangeElements.length; i++) {
        const element = rangeElements[i];
        if (element.getElement().getType() === DocumentApp.ElementType.TEXT) {
          const textEl = element.getElement().asText();
          const startOffset = element.getStartOffset();
          const endOffset = element.getEndOffsetInclusive();
          totalSelectedText += textEl.getText().substring(startOffset, endOffset + 1);
        }
      }
      
      console.log('Replacing selected text:', totalSelectedText.substring(0, 100));
      
      // Replace the selected content with new text
      // We'll delete the selection and insert new text at the same position
      const firstElement = rangeElements[0];
      const lastElement = rangeElements[rangeElements.length - 1];
      
      // Start from the last element and work backwards to maintain offsets
      for (let i = rangeElements.length - 1; i >= 0; i--) {
        const element = rangeElements[i];
        
        if (element.getElement().getType() === DocumentApp.ElementType.TEXT) {
          const textElement = element.getElement().asText();
          const startOffset = element.getStartOffset();
          const endOffset = element.getEndOffsetInclusive();
          
          // Delete the selected text
          if (startOffset <= endOffset) {
            textElement.deleteText(startOffset, endOffset);
          }
          
          // Insert new text only at the first element's position
          if (i === 0) {
            textElement.insertText(startOffset, text);
          }
        }
      }
      
      return {
        success: true,
        message: `Replaced selected text with generated content`
      };
    }
    
    // If no selection, try to get cursor position
    const cursor = doc.getCursor();
    
    if (cursor) {
      // Insert at cursor position
      const element = cursor.getElement();
      const offset = cursor.getOffset();
      
      if (element.getType() === DocumentApp.ElementType.TEXT) {
        const textElement = element.asText();
        textElement.insertText(offset, text);
        return {
          success: true,
          message: 'Text inserted at cursor position'
        };
      } else {
        // If cursor is not in text, insert a new paragraph at that position
        const body = doc.getBody();
        const paragraph = body.insertParagraph(body.getChildIndex(element), text);
        return {
          success: true,
          message: 'Text inserted as new paragraph at cursor position'
        };
      }
    }
    
    // If no cursor or selection, try to find the last active position
    // Look for the last paragraph with content
    const body = doc.getBody();
    const paragraphs = body.getParagraphs();
    
    for (let i = paragraphs.length - 1; i >= 0; i--) {
      const paragraph = paragraphs[i];
      if (paragraph.getText().trim()) {
        // Found a paragraph with content, insert after it
        const newParagraph = body.insertParagraph(body.getChildIndex(paragraph) + 1, text);
        return {
          success: true,
          message: 'Text inserted after last paragraph with content'
        };
      }
    }
    
    // Last resort: insert at the very beginning
    body.insertParagraph(0, text);
    return {
      success: true,
      message: 'Text inserted at beginning of document'
    };
    
  } catch (error) {
    console.error('Error inserting text:', error);
    return {
      success: false,
      message: 'Error inserting text: ' + error.message
    };
  }
}

/**
 * Copy text to clipboard (simulated for Google Apps Script)
 */
function copyToClipboard(text) {
  try {
    // Store in Properties for access by other functions
    PropertiesService.getDocumentProperties().setProperty('clipboardText', text);
    
    return {
      success: true,
      message: 'Text copied to clipboard (stored in add-on)'
    };
    
  } catch (error) {
    console.error('Error copying text:', error);
    return {
      success: false,
      message: 'Error copying text: ' + error.message
    };
  }
}

/**
 * Get text from clipboard (stored in add-on)
 */
function getClipboardText() {
  try {
    const text = PropertiesService.getDocumentProperties().getProperty('clipboardText') || '';
    return {
      success: true,
      text: text,
      message: text ? 'Text retrieved from clipboard' : 'Clipboard is empty'
    };
    
  } catch (error) {
    console.error('Error getting clipboard text:', error);
    return {
      success: false,
      text: '',
      message: 'Error getting clipboard text: ' + error.message
    };
  }
}

/**
 * Get current cursor/selection position info
 */
function getCurrentPosition() {
  try {
    const doc = DocumentApp.getActiveDocument();
    const selection = doc.getSelection();
    const cursor = doc.getCursor();
    
    if (selection && selection.getRangeElements().length > 0) {
      const firstElement = selection.getRangeElements()[0];
      const element = firstElement.getElement();
      const startOffset = firstElement.getStartOffset();
      const endOffset = firstElement.getEndOffsetInclusive();
      
      return {
        success: true,
        type: 'selection',
        message: `Text selected from position ${startOffset} to ${endOffset}`,
        startOffset: startOffset,
        endOffset: endOffset,
        elementType: element.getType().toString()
      };
    } else if (cursor) {
      const element = cursor.getElement();
      const offset = cursor.getOffset();
      
      return {
        success: true,
        type: 'cursor',
        message: `Cursor at position ${offset}`,
        offset: offset,
        elementType: element.getType().toString()
      };
    } else {
      return {
        success: false,
        type: 'none',
        message: 'No cursor or selection found. Click somewhere in the document first.',
        offset: -1
      };
    }
    
  } catch (error) {
    console.error('Error getting current position:', error);
    return {
      success: false,
      type: 'error',
      message: 'Error getting position: ' + error.message,
      offset: -1
    };
  }
}

/**
 * Force cursor to a specific position (for testing)
 */
function setCursorToPosition(paragraphIndex, offset) {
  try {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    const paragraphs = body.getParagraphs();
    
    if (paragraphIndex >= 0 && paragraphIndex < paragraphs.length) {
      const paragraph = paragraphs[paragraphIndex];
      const text = paragraph.getText();
      
      if (offset >= 0 && offset <= text.length) {
        // Set cursor to this position
        const range = paragraph.getRange();
        const element = range.getElement(0);
        const textElement = element.asText();
        
        // This is a workaround since we can't directly set cursor
        // We'll select the text at that position briefly
        textElement.setSelection(offset, offset);
        
        return {
          success: true,
          message: `Cursor positioned at paragraph ${paragraphIndex}, offset ${offset}`,
          paragraphIndex: paragraphIndex,
          offset: offset
        };
      } else {
        return {
          success: false,
          message: `Invalid offset ${offset}. Text length is ${text.length}`
        };
      }
    } else {
      return {
        success: false,
        message: `Invalid paragraph index ${paragraphIndex}. Document has ${paragraphs.length} paragraphs`
      };
    }
    
  } catch (error) {
    console.error('Error setting cursor position:', error);
    return {
      success: false,
      message: 'Error setting cursor position: ' + error.message
    };
  }
}

/**
 * Test function to demonstrate insert at cursor
 */
function testInsertAtCursor() {
  try {
    const doc = DocumentApp.getActiveDocument();
    const cursor = doc.getCursor();
    
    if (!cursor) {
      showMessage('No cursor found! Click somewhere in the document first, then try again.');
      return;
    }
    
    const element = cursor.getElement();
    const offset = cursor.getOffset();
    
    // Insert test text at cursor position
    const testText = '\n[TEST INSERT AT CURSOR - ' + new Date().toLocaleTimeString() + ']\n';
    
    if (element.getType() === DocumentApp.ElementType.TEXT) {
      const textElement = element.asText();
      textElement.insertText(offset, testText);
      showMessage(`Test text inserted at cursor position (offset: ${offset})`);
    } else {
      // Insert as new paragraph at cursor position
      const body = doc.getBody();
      const paragraph = body.insertParagraph(body.getChildIndex(element), testText);
      showMessage(`Test text inserted as new paragraph at cursor position`);
    }
    
  } catch (error) {
    console.error('Error in test insert:', error);
    showMessage('Error in test insert: ' + error.message);
  }
}

/**
 * Show a message to the user
 */
function showMessage(message) {
  DocumentApp.getUi().alert('ResEditX', message, DocumentApp.getUi().ButtonSet.OK);
}

/**
 * Show the ResEditX sidebar interface
 */
function showSidebar() {
  // Ensure API key is initialized for continuous operation
  initializeApiKey();
  
  const html = HtmlService.createHtmlOutputFromFile('Interface')
    .setTitle('ResEditX - AI Resume Assistant')
    .setWidth(400);
  
  DocumentApp.getUi().showSidebar(html);
}

/**
 * Show the ResEditX interface as a dialog (alternative to sidebar)
 */
function showDialog() {
  const html = HtmlService.createHtmlOutputFromFile('Interface')
    .setTitle('ResEditX - AI Resume Assistant')
    .setWidth(500)
    .setHeight(600);
  
  DocumentApp.getUi().showModalDialog(html, 'ResEditX');
}

/**
 * Show the ResEditX test interface for testing Gemini API functions
 */
function showTestInterface() {
  const html = HtmlService.createHtmlOutputFromFile('test-interface')
    .setTitle('ResEditX - Gemini API Test Interface')
    .setWidth(800)
    .setHeight(800);
  
  DocumentApp.getUi().showModalDialog(html, 'ResEditX Test Interface');
}

/**
 * Homepage trigger function
 */
function onHomepage(e) {
  return HtmlService.createHtmlOutput(`
    <h2>ResEditX Add-on</h2>
    <p>This add-on provides real-time text extraction from Google Docs.</p>
    <p>Open a Google Doc and use the add-on menu to extract text.</p>
    <h3>Features:</h3>
    <ul>
      <li>Extract selected text in real-time</li>
      <li>Extract all document text</li>
      <li>Track selection changes</li>
      <li>Access text programmatically</li>
    </ul>
  `);
}

/**
 * Gemini API Integration for ResEditX
 * Direct integration with Gemini 1.5 Flash for AI-powered resume analysis
 */

// Gemini API Configuration
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

/**
 * Get Gemini API key from secure storage
 * For published add-ons, the API key should be set once by the developer
 */
function getGeminiApiKey() {
  // Get from Script Properties (secure storage)
  let apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  
  if (!apiKey) {
    console.error('❌ Gemini API key not configured in Script Properties');
    throw new Error('AI service temporarily unavailable. Please contact support.');
  }
  
  return apiKey;
}

/**
 * Set the Gemini API key securely in Script Properties
 * This should be run once by the developer before publishing
 * Call this function with: setGeminiApiKey("your-actual-api-key")
 */
function setGeminiApiKey(apiKey) {
  if (!apiKey) {
    console.log('❌ No API key provided.');
    return 'No API key provided';
  }
  
  PropertiesService.getScriptProperties().setProperty('GEMINI_API_KEY', apiKey);
  console.log('✅ Gemini API key set securely in Script Properties');
  console.log('🔐 API key is now stored securely and ready for production use');
  return 'API key stored securely - ready for publishing';
}

/**
 * Remove the API key from secure storage (for key rotation)
 */
function removeGeminiApiKey() {
  PropertiesService.getScriptProperties().deleteProperty('GEMINI_API_KEY');
  console.log('🗑️ Gemini API key removed from Script Properties');
  return 'API key removed';
}

/**
 * Call Gemini API with the specified prompt
 */
function callGeminiAPI(prompt, options = {}) {
  try {
    console.log('Making Gemini API call...');
    console.log('Prompt length:', prompt.length);
    console.log('Options:', options);
    
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key not configured. Please set it using setGeminiApiKey()');
    }
    
    const url = `${GEMINI_BASE_URL}?key=${apiKey}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: options.temperature || 0.2,
        topK: options.topK || 32,
        topP: options.topP || 1,
        maxOutputTokens: options.maxTokens || 500,
        stopSequences: options.stopSequences || []
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const options_http = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(requestBody)
    };

    console.log('Making HTTP request to Gemini API...');
    const response = UrlFetchApp.fetch(url, options_http);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    console.log('Response code:', responseCode);
    console.log('Response text:', responseText);
    
    if (responseCode !== 200) {
      console.error(`API request failed: ${responseCode} - ${responseText}`);
      throw new Error(`API request failed: ${responseCode} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log('Parsed response data:', data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const result = data.candidates[0].content.parts[0].text;
      console.log("✅ Gemini API call successful, result length:", result.length);
      console.log("Result preview:", result.substring(0, 200));
      return {
        success: true,
        result: result
      };
    } else {
      console.error(`Unexpected API response structure:`, data);
      throw new Error(`Unexpected API response structure: ${JSON.stringify(data)}`);
    }
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}

/**
 * Extract keywords from job description using Gemini AI
 */
