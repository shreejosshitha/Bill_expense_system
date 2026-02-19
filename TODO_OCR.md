# TODO - OCR Bill Extraction

## Task
Implement OCR to extract bill details from uploaded images using Tesseract.js

## Steps

### 1. Install Tesseract.js
- [x] Run pnpm install tesseract.js

### 2. Create OCR Service
- [x] Create src/app/utils/ocr.ts with:
  - OCR extraction function using Tesseract.js
  - Text parsing utilities for bill fields

### 3. Create OCR Parser
- [x] Implement parsing logic for:
  - Vendor name
  - Invoice number
  - GST number
  - Amount
  - Date

### 4. Update SubmitBill.tsx
- [x] Add OCR button with loading state
- [x] Integrate OCR service
- [x] Auto-populate form fields with extracted data
- [x] Add error handling

### 5. Test the workflow
- [ ] Verify OCR extracts text from images
- [ ] Verify form fields are populated correctly
- [ ] Handle edge cases (unreadable images, missing fields)

