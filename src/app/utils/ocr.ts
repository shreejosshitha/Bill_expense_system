
import Tesseract from 'tesseract.js/dist/tesseract.esm.min.js';

export interface OCRResult {
  text: string;
  confidence: number;
  parsedData: ParsedBillData;
}

export interface ParsedBillData {
  vendorName: string;
  invoiceNumber: string;
  gstNumber: string;
  date: string;
  amount: string;
  rawText: string;
}

export interface OCRProgress {
  status: string;
  progress: number;
}

/**
 * Preprocess image to improve OCR accuracy
 * Returns a canvas with the preprocessed image
 */
function preprocessImage(imageSource: string | File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageSource as string);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Convert to grayscale and increase contrast
      for (let i = 0; i < data.length; i += 4) {
        // Grayscale (weighted average)
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        
        // Increase contrast (simple threshold-based approach)
        const contrast = 1.3;
        const factor = (259 * (contrast * 128 + 255)) / (255 * (259 - contrast * 128));
        let adjusted = factor * (gray - 128) + 128;
        
        // Threshold for better black/white separation
        adjusted = adjusted > 140 ? 255 : adjusted < 100 ? 0 : adjusted;

        data[i] = adjusted;     // R
        data[i + 1] = adjusted; // G
        data[i + 2] = adjusted; // B
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };

    img.onerror = () => {
      // If preprocessing fails, return original
      resolve(imageSource as string);
    };

    if (imageSource instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(imageSource);
    } else {
      img.src = imageSource;
    }
  });
}

/**
 * Clean and normalize OCR text
 */
function cleanText(text: string): string {
  return text
    // Replace common OCR errors
    .replace(/[|]/g, 'I')
    .replace(/0(?=[A-Z])/g, 'O')
    .replace(/\n{3,}/g, '\n\n')
    // Remove excessive whitespace
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Extract text from an image using Tesseract.js with improved accuracy
 */
export async function extractTextFromImage(
  imageSource: string | File | Blob,
  onProgress?: (progress: OCRProgress) => void
): Promise<OCRResult> {
  try {
    // Preprocess image for better accuracy
    const processedImage = await preprocessImage(imageSource);

    const result = await Tesseract.recognize(processedImage, 'eng', {
      logger: (m) => {
        if (onProgress && m.status) {
          onProgress({
            status: m.status,
            progress: m.progress * 100,
          });
        }
      },
      tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-/.%:₹$, ',
    });

    // Clean the extracted text
    const rawText = result.data.text;
    const text = cleanText(rawText);
    const confidence = result.data.confidence;

    // Parse the extracted text
    const parsedData = parseBillData(text, rawText);

    return {
      text,
      confidence,
      parsedData,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
}

/**
 * Parse bill data from extracted text with improved accuracy
 */
function parseBillData(text: string, rawText: string): ParsedBillData {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const rawLines = rawText.split('\n').map((line) => line.trim()).filter(Boolean);

  return {
    vendorName: extractVendorName(lines, rawLines),
    invoiceNumber: extractInvoiceNumber(text),
    gstNumber: extractGSTNumber(text),
    date: extractDate(text),
    amount: extractAmount(text),
    rawText: text,
  };
}

/**
 * Extract vendor name with improved patterns
 */
function extractVendorName(lines: string[], rawLines: string[]): string {
  // Try both cleaned and raw lines
  const allLines = [...lines, ...rawLines];
  
  // Enhanced vendor patterns
  const vendorPatterns = [
    // Company prefixes
    /^(?:M\/S|Ms|m\/s|M\.S\.|M\/S\.)\s*(.+)/i,
    /^(?:M\/S\.?)\s*(.+)/i,
    // Address patterns (vendor often comes before address)
    /^(?:To:|From:|Vendor:|Company:|Supplier:|Seller:)\s*(.+)/i,
    // Common Indian bill patterns
    /^(?:Name\s*[:\-]?\s*)?(.+)/im,
    // Look for company suffixes
    /(.*(?:Pvt|Ltd|Inc|Corporation|Co\.|LLP|Private|Public|Hospital|Hotel|Restaurant|Services|Enterprises|Traders|Stores|Workshops|Agencies).*)/i,
  ];

  for (const line of allLines) {
    if (isLikelyNotVendor(line)) continue;

    for (const pattern of vendorPatterns) {
      const match = line.match(pattern);
      if (match && match[1]) {
        const vendor = match[1].trim();
        if (vendor.length >= 3 && vendor.length <= 80) {
          return vendor;
        }
      }
    }
  }

  // Fallback: Find first substantial line that's not a keyword
  for (const line of allLines) {
    const cleaned = line.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    if (cleaned.length >= 3 && cleaned.length <= 60 && !isLikelyNotVendor(line)) {
      // Skip if it's mostly numbers
      if (/^\d+$/.test(cleaned)) continue;
      return cleaned;
    }
  }

  return '';
}

/**
 * Check if a line is likely not a vendor name
 */
function isLikelyNotVendor(line: string): boolean {
  const lowerLine = line.toLowerCase();
  
  const skipKeywords = [
    'invoice', 'bill', 'tax', 'gst', 'amount', 'total', 'date', 'subtotal',
    'grand total', 'balance', 'payment', 'receipt', '序', '税', '发票',
    'tel', 'phone', 'email', 'address', 'www', 'http', 'mobile', 'fax',
    'tax invoice', 'bill no', 'invoice no', 'inv no', 'bill number',
    'billing', 'ship to', 'bill to', 'customer', 'terms', 'due date',
    'description', 'quantity', 'rate', 'unit', 'sub total', 'net amount',
    'cgst', 'sgst', 'igst', 'tax amount', 'discount', 'packing', 'transport',
    'hsn code', 'sac code', 'gstin', 'pan', 'tin', 'vat', 'cst'
  ];

  for (const keyword of skipKeywords) {
    if (lowerLine.includes(keyword)) {
      return true;
    }
  }

  if (line.length < 3 || /^\d+[\d,\.\s]*$/.test(line)) {
    return true;
  }

  return false;
}

/**
 * Extract invoice number with improved patterns
 */
function extractInvoiceNumber(text: string): string {
  // More comprehensive patterns
  const patterns = [
    // Invoice with label
    /(?:invoice|inv|bill|receipt|tax invoice|tax bill| voucher)[\s#.:-]*(?:no\.?|number|num|#)?\s*([A-Z0-9][A-Z0-9\-\/]{3,20})/i,
    // Number with label
    /(?:no\.?|number|num|no\.)\s*[:\-]?\s*([A-Z0-9][A-Z0-9\-\/]{3,20})/i,
    // Abbreviated formats
    /(?:INV|BILL|REC|TAX|VOUCHER|CHalan)[\s#.:-]*([A-Z0-9\-]+)/i,
    // Standalone patterns
    /\b(INV[_\-]?\d+)\b/i,
    /\b(BILL[_\-]?\d+)\b/i,
    /\b(REC[_\-]?\d+)\b/i,
    // Fallback: 6+ digit numbers not near date patterns
    /\b(\d{6,})\b/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const result = match[1].trim();
      // Filter out dates that might match
      if (!result.match(/^\d{2,4}[\/\-]\d{2}[\/\-]\d{2,4}$/)) {
        return result;
      }
    }
  }

  return '';
}

/**
 * Extract GST number with improved patterns
 */
function extractGSTNumber(text: string): string {
  // Enhanced GST patterns
  const gstPatterns = [
    // With label
    /(?:gst|gstin|gst\s*in|gin|gstn)[\s#.:-]*(?:no\.?|number|num)?\s*([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[A-Z]{1})/i,
    // Standalone GST format (15 characters)
    /\b([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[A-Z]{1})\b/,
    // Alternative format with spaces
    /\b([0-9]{2}\s*[A-Z]{5}\s*[0-9]{4}\s*[A-Z]{1}\s*[1-9A-Z]{1}\s*[A-Z]{1})\b/i,
  ];

  for (const pattern of gstPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Clean up the GST number (remove spaces)
      const gst = match[1].replace(/\s+/g, '').toUpperCase();
      // Validate GST format
      if (/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[A-Z]{1}$/.test(gst)) {
        return gst;
      }
    }
  }

  return '';
}

/**
 * Extract date with improved patterns
 */
function extractDate(text: string): string {
  const datePatterns = [
    // DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
    /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b/,
    // YYYY/MM/DD or YYYY-MM-DD
    /\b(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\b/,
    // Month DD, YYYY
    /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{2,4})\b/i,
    // DD Month YYYY
    /\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{2,4})\b/i,
    // Month DD YYYY (reverse)
    /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}\s+\d{4})\b/i,
    // Date with keywords
    /(?:date|dated|dated on|dated:|bill date|inv date|invoice date)[\s#.:-]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    // ISO format
    /\b(\d{4}-\d{2}-\d{2})\b/,
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const normalized = normalizeDate(match[1]);
      if (normalized) {
        return normalized;
      }
    }
  }

  return '';
}

/**
 * Normalize date to YYYY-MM-DD format
 */
function normalizeDate(dateStr: string): string | null {
  try {
    // Clean up the date string
    const cleaned = dateStr.trim().replace(/\s+/g, '');
    
    const date = new Date(cleaned);
    if (!isNaN(date.getTime()) && date.getFullYear() > 2000 && date.getFullYear() < 2100) {
      return date.toISOString().split('T')[0];
    }

    const parts = dateStr.split(/[\/\-\.]/);
    if (parts.length === 3) {
      let day: number, month: number, year: number;

      if (parts[0].length === 4) {
        // YYYY/MM/DD
        year = parseInt(parts[0]);
        month = parseInt(parts[1]);
        day = parseInt(parts[2]);
      } else if (parts[2].length === 4) {
        // DD/MM/YYYY
        day = parseInt(parts[0]);
        month = parseInt(parts[1]);
        year = parseInt(parts[2]);
      } else {
        // YY/MM/DD
        day = parseInt(parts[0]);
        month = parseInt(parts[1]);
        year = 2000 + parseInt(parts[2]);
      }

      // Validate
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 2000 && year <= 2100) {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }
  } catch {
    // Ignore
  }
  return null;
}

/**
 * Extract amount with improved patterns
 */
function extractAmount(text: string): string {
  const amountPatterns = [
    // Total with various labels
    /(?:grand\s*total|total\s*amount|net\s*amount|final\s*amount|bill\s*total|invoice\s*total|total\s*due|payable\s*amount|amount\s*payable)[\s#.:-]*₹?\s*([\d,]+\.?\d*)/i,
    // Total at end
    /(?:total)[\s#.:-]*₹?\s*([\d,]+\.?\d*)\s*$/im,
    // Amount with Rs
    /(?:rs\.?|inr|rupees?)[\s#.:-]*([\d,]+\.?\d*)/i,
    // Amount with currency symbol
    /(?:₹|USD|EUR)[\s]*([\d,]+\.?\d*)/i,
    // Standalone amounts (large numbers with 2 decimal places)
    /\b(₹?\s*[\d,]{2,}\.\d{2})\b/,
  ];

  let largestAmount = 0;
  let bestMatch = '';

  for (const pattern of amountPatterns) {
    const matches = text.matchAll(new RegExp(pattern.source, 'gi'));
    for (const match of matches) {
      if (match[1]) {
        const amountStr = match[1].replace(/[₹,\s]/g, '');
        const amount = parseFloat(amountStr);
        if (!isNaN(amount) && amount > largestAmount && amount < 10000000) {
          largestAmount = amount;
          bestMatch = amount.toFixed(2);
        }
      }
    }
  }

  if (largestAmount > 0) {
    return bestMatch;
  }

  return '';
}

