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
function extractKeywordsWithGemini(jobDescription) {
  return requireAuth(() => {
    try {
      console.log('Starting keyword extraction with Gemini...');
      console.log('Job description length:', jobDescription.length);
    
    const prompt = `Analyze this job description and extract 12-15 relevant keywords and key phrases that would be important for ATS optimization and resume tailoring. Focus on:
- Technical skills and tools
- Industry-specific terminology  
- Action verbs and competencies
- Required qualifications
- Key responsibilities

Job Description:
${jobDescription}

Return only the keywords/phrases separated by commas, no additional commentary:`;
    
    console.log('Calling Gemini API for keyword extraction...');
    const response = callGeminiAPI(prompt, { 
      temperature: 0.1, 
      maxTokens: 300 
    });
    
    console.log('Gemini API response for keywords:', response);
    
    if (response.success) {
      // Parse the comma-separated keywords
      const keywords = response.result.split(',').map(k => k.trim()).filter(k => k.length > 0);
      console.log('Extracted keywords:', keywords);
      
      return {
        success: true,
        keywords: keywords,
      count: keywords.length
    };
  } else {
    console.error('Gemini API failed for keyword extraction:', response.error);
    throw new Error(response.error || 'Failed to extract keywords');
  }
  
} catch (error) {
  console.error('Error extracting keywords with Gemini:', error);
  return {
    success: false,
    error: error.message,
    keywords: [],
    count: 0
  };
}
});
}/**
 * Analyze resume using Gemini AI for ATS optimization
 */
function analyzeResumeWithGemini(resumeText, jobDescription) {
  return requireAuth(() => {
    try {
      console.log('Starting resume analysis with Gemini...');
      console.log('Resume text length:', resumeText.length);
      console.log('Job description length:', jobDescription.length);
    
    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Evaluate how well this resume matches the job description and provide optimization recommendations.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Analyze for:
1. Keyword matching and density
2. Skills alignment
3. Experience relevance
4. Format compatibility
5. Missing crucial elements

Respond with ONLY a JSON object in this exact format:
{
  "score": <integer 0-100>,
  "keywordMatch": <integer 0-100>,
  "skillsMatch": <integer 0-100>, 
  "experienceMatch": <integer 0-100>,
  "advice": "<3-5 specific, actionable recommendations separated by semicolons>",
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "strengths": ["strength1", "strength2"]
}`;

    console.log('Calling Gemini API for resume analysis...');
    const response = callGeminiAPI(prompt, { 
      temperature: 0.1, 
      maxTokens: 600 
    });
    
    console.log('Gemini API response for analysis:', response);
    
    if (response.success) {
      // Try to extract JSON from the response
      let parsed = null;
      try {
        const jsonMatch = response.result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
          console.log('Successfully parsed analysis JSON:', parsed);
        } else {
          console.log('No JSON found in response, trying to parse entire response');
          parsed = JSON.parse(response.result);
        }
      } catch (e) {
        console.error('JSON parsing failed:', e);
        console.log('Raw response that failed to parse:', response.result);
      }
      
      return {
        success: true,
      raw: response.result,
      parsed: parsed
    };
  } else {
    console.error('Gemini API failed for resume analysis:', response.error);
    throw new Error(response.error || 'Failed to analyze resume');
  }
  
} catch (error) {
  console.error('Error analyzing resume with Gemini:', error);
  return {
    success: false,
    error: error.message
  };
}
});
}/**
 * Generate bullet point using Gemini AI
 */
function generateBulletWithGemini(contextText, selectedKeywords, length, addHeader) {
  return requireAuth(() => {
    try {
      const prompt = `Transform this resume bullet point into a high-impact, achievement-focused statement. Requirements:

TARGET KEYWORDS: ${(selectedKeywords || []).join(', ')}
LENGTH: ${length === 'long' ? '25-35 words' : '15-20 words'}
${addHeader ? 'START WITH: A bolded header using the primary keyword' : ''}

Guidelines:
- Use strong action verbs
- Include quantifiable results where possible
- Incorporate target keywords naturally
- Focus on impact and achievements
- Use professional, ATS-friendly language

Original bullet point:
${contextText}

Return only the improved bullet point:`;

    const response = callGeminiAPI(prompt, { 
      temperature: 0.3, 
      maxTokens: 400 
    });
    
    if (response.success) {
      return {
        success: true,
        result: response.result
      };
  } else {
    throw new Error(response.error || 'Failed to generate bullet point');
  }
  
} catch (error) {
  console.error('Error generating bullet point with Gemini:', error);
  return {
    success: false,
    error: error.message
  };
}
});
}/**
 * Generate new bullet point from keyword using Gemini AI
 */
function generateNewBulletFromKeyword(keyword, length, addHeader) {
  return requireAuth(() => {
    try {
      const prompt = `Create a compelling resume bullet point focused on the keyword "${keyword}". Requirements:

LENGTH: ${length === 'long' ? '25-35 words' : '15-20 words'}
${addHeader ? 'START WITH: A bolded header using the keyword' : ''}

Guidelines:
- Use strong action verbs (led, developed, implemented, optimized, etc.)
- Include quantifiable metrics where relevant (%, $, time saved, etc.)
- Focus on achievements and impact
- Make it ATS-friendly and professional
- Ensure it sounds realistic and accomplishable

Return only the bullet point:`;

    const response = callGeminiAPI(prompt, { 
      temperature: 0.4, 
      maxTokens: 400 
    });
    
    if (response.success) {
      return {
        success: true,
    result: response.result
  };
} else {
  throw new Error(response.error || 'Failed to generate new bullet point');
}

} catch (error) {
console.error('Error generating new bullet point with Gemini:', error);
return {
  success: false,
  error: error.message
};
}
});
}/**
 * Optimize resume section using Gemini AI
 */
function optimizeResumeSectionWithGemini(sectionText, keywords) {
  return requireAuth(() => {
    try {
      const prompt = `Optimize this resume section for better ATS compatibility and impact. Focus on:

SECTION CONTENT:
${sectionText}

TARGET JOB KEYWORDS: ${keywords || 'N/A'}

Guidelines:
- Improve keyword density naturally
- Enhance action verbs and impact statements
- Ensure ATS-friendly formatting
- Maintain authenticity and readability
- Focus on achievements over responsibilities

Return the optimized section:`;

    const response = callGeminiAPI(prompt, { 
      temperature: 0.3, 
      maxTokens: 800 
    });
    
    if (response.success) {
      return {
        success: true,
        result: response.result
      };
    } else {
      throw new Error(response.error || 'Failed to optimize resume section');
    }
    
 } catch (error) {
   console.error('Error optimizing resume section with Gemini:', error);
   return {
     success: false,
     error: error.message
   };
 }
 });
}/**
 * Suggest improvements using Gemini AI
 */
function suggestImprovementsWithGemini(content) {
  return requireAuth(() => {
    try {
      const prompt = `Review this resume content and suggest specific improvements:

CONTENT:
${content}

Provide 5-7 specific, actionable suggestions to:
- Strengthen impact statements
- Improve keyword optimization
- Enhance readability
- Better showcase achievements
- Improve ATS compatibility

Format as a numbered list:`;

    const response = callGeminiAPI(prompt, { 
      temperature: 0.2, 
      maxTokens: 500 
    });
    
    if (response.success) {
      return {
        success: true,
        result: response.result
      };
    } else {
      throw new Error(response.error || 'Failed to suggest improvements');
  }
  
} catch (error) {
  console.error('Error suggesting improvements with Gemini:', error);
  return {
    success: false,
    error: error.message
  };
}
});
}/**
 * Health check function to verify ResEditX is running continuously
 */
function checkServiceHealth() {
  try {
    /* Lines 1115-1152 omitted */
    
  } catch (error) {/* Lines 1154-1161 omitted */}
}

/**
 * Quick test to verify UrlFetch whitelist/permissions for Gemini endpoint.
 * Run from the Apps Script editor: testGeminiWhitelist()
 */
function testGeminiWhitelist() {
  try {
  } catch (e) {/* Lines 1186-1188 omitted */}
}

/**
 * Web app endpoint to receive authentication data from external auth page
