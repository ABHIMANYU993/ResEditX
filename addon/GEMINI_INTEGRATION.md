# ResumeGenie Gemini AI Integration

This document explains how to use the new Gemini AI integration in the ResumeGenie Google Apps Script addon.

## 🚀 Overview

The ResumeGenie addon now includes direct integration with Google's Gemini 1.5 Flash AI model for intelligent resume analysis, keyword extraction, and content generation. All AI processing is handled directly through Google Apps Script, ensuring secure and efficient operation.

## 🔑 API Configuration

The addon is pre-configured with a Gemini API key:
- **Model**: `gemini-1.5-flash-latest`
- **Base URL**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`
- **API Key**: Already configured in the code

## ✨ Features

### 1. **Keyword Extraction with AI**
- Automatically extracts relevant keywords from job descriptions
- Focuses on technical skills, industry terminology, and competencies
- Returns 12-15 optimized keywords for ATS optimization

**Usage**: Paste a job description and click "Extract Keywords with Gemini AI"

### 2. **Resume Analysis with ATS Scoring**
- Comprehensive ATS compatibility analysis
- Provides detailed scoring across multiple dimensions:
  - Overall ATS Score (0-100)
  - Keyword Match Percentage
  - Skills Alignment
  - Experience Relevance
- Offers specific optimization recommendations
- Identifies missing keywords and strengths

**Usage**: Extract resume text and job description, then click "Analyze Resume with Gemini AI"

### 3. **AI-Powered Bullet Point Generation**
- **Short Bullet**: 15-20 word optimized bullet points
- **Long Bullet**: 25-35 word comprehensive statements
- **New Bullet**: Create bullet points from keywords
- Incorporates selected keywords naturally
- Focuses on achievements and quantifiable results

**Usage**: Select text and keywords, then choose your preferred generation method

### 4. **Text Optimization**
- Enhances existing resume content for better ATS compatibility
- Improves keyword density naturally
- Maintains authenticity while optimizing for impact

**Usage**: Select text and target keywords, then click "Optimize (AI)"

## 🛠️ How to Use

### Getting Started
1. Open a Google Doc
2. Go to **Extensions > ResumeGenie Add-on**
3. Choose from the menu options:
   - **Open ResumeGenie (Sidebar)**: Main interface
   - **Open ResumeGenie (Dialog)**: Modal interface
   - **Test Gemini API Interface**: Test all AI functions

### Main Interface Workflow
1. **Keywords Tab**:
   - Paste job description
   - Extract keywords using Gemini AI
   - Select relevant keywords
   - Run ATS analysis on your resume

2. **Bullet Optimizer Tab**:
   - Extract text from document or input manually
   - Select target keywords
   - Generate optimized bullet points
   - Copy or insert results back to document

### Testing the Integration
Use the **Test Gemini API Interface** to:
- Test all AI functions independently
- Verify API connectivity
- Debug any issues
- See raw API responses

## 🔧 Technical Details

### Google Apps Script Functions
All Gemini AI calls are handled through these functions in `Code.gs`:

- `callGeminiAPI(prompt, options)` - Core API communication
- `extractKeywordsWithGemini(jobDescription)` - Keyword extraction
- `analyzeResumeWithGemini(resumeText, jobDescription)` - ATS analysis
- `generateBulletWithGemini(contextText, selectedKeywords, length, addHeader)` - Bullet generation
- `generateNewBulletFromKeyword(keyword, length, addHeader)` - New bullet creation
- `optimizeResumeSectionWithGemini(sectionText, keywords)` - Text optimization

### API Parameters
- **Temperature**: Controls creativity (0.1-0.4 for professional content)
- **Max Tokens**: Limits response length (300-800 depending on function)
- **Safety Settings**: Ensures appropriate content generation

### Error Handling
- Comprehensive error handling for API failures
- User-friendly error messages
- Fallback options when parsing fails

## 📱 Interface Updates

### Visual Indicators
- AI status section showing Gemini connection
- Updated button labels with "(AI)" indicators
- Loading states with "Generating with Gemini AI..." messages
- Success notifications mentioning Gemini AI

### New Features
- **Get Full Document** button for complete resume analysis
- Enhanced keyword selection interface
- Real-time ATS scoring display
- Detailed optimization recommendations

## 🚨 Troubleshooting

### Common Issues
1. **API Key Errors**: Check if the API key is valid and has proper permissions
2. **Rate Limiting**: Gemini API has rate limits; wait between requests
3. **Parsing Failures**: Some AI responses may not parse correctly; check console for raw results
4. **Timeout Issues**: Long documents may take time to process

### Debug Steps
1. Use the Test Interface to isolate issues
2. Check browser console for error messages
3. Verify document text extraction is working
4. Test with shorter, simpler content first

## 🔒 Security & Privacy

- All API calls go through Google Apps Script
- No data is stored externally
- API key is embedded in the script (consider moving to environment variables for production)
- All processing happens within Google's secure infrastructure

## 📈 Performance Tips

- Use shorter text inputs for faster processing
- Batch multiple operations together
- Cache results when possible
- Monitor API usage to stay within limits

## 🔮 Future Enhancements

Potential improvements for future versions:
- Custom prompt templates
- Industry-specific optimization
- Multi-language support
- Advanced ATS scoring algorithms
- Integration with other AI models

## 📞 Support

For issues or questions:
1. Check the Test Interface for API connectivity
2. Review error messages in the console
3. Verify Google Apps Script permissions
4. Test with the provided sample content

---

**Note**: This integration requires an active internet connection and valid Gemini API access. The addon will gracefully handle API failures and provide appropriate user feedback.
