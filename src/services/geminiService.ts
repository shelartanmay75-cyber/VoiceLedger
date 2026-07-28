import type { ExtractedExpense } from '../types/voice';
import { EXPENSE_CATEGORIES } from '../types/voice';

/**
 * Known merchant lookup dictionary for common brand names
 */
const KNOWN_MERCHANTS: { [key: string]: string } = {
  macdonalds: "McDonald's",
  mcdonalds: "McDonald's",
  mcd: "McDonald's",
  starbucks: 'Starbucks',
  nike: 'Nike',
  adidas: 'Adidas',
  amazon: 'Amazon',
  flipkart: 'Flipkart',
  zomato: 'Zomato',
  swiggy: 'Swiggy',
  uber: 'Uber',
  ola: 'Ola',
  shell: 'Shell',
  dmart: 'DMart',
  kfc: 'KFC',
  dominos: "Domino's",
  pizzahut: 'Pizza Hut',
  subway: 'Subway',
  apple: 'Apple',
  google: 'Google',
  netflix: 'Netflix',
  spotify: 'Spotify',
};

/**
 * Fallback parser using regex rules when API key is missing or offline
 */
function parseTranscriptHeuristically(transcript: string): ExtractedExpense {
  const lower = transcript.toLowerCase();

  // 1. Extract Amount (e.g. ₹250, 250 rupees, rs 250, 250 rs, 4200)
  let amount = 0;
  const amountMatch = transcript.match(/(?:₹|rs\.?|rupees|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:₹|rs\.?|rupees|inr)?/i);
  if (amountMatch && amountMatch[1]) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  // 2. Extract Spoken Date (e.g. 25 july, july 25, 25th july, 25/07, yesterday, today)
  let date = 'Today';
  const monthRegex = /(\d{1,2}(?:st|nd|rd|th)?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)(?:\s+\d{2,4})?)/i;
  const monthRegexAlt = /((?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}(?:st|nd|rd|th)?(?:\s+\d{2,4})?)/i;
  const dateNumRegex = /(\d{1,2}[\/\.-]\d{1,2}(?:[\/\.-]\d{2,4})?)/;

  const dateMatch = transcript.match(monthRegex) || transcript.match(monthRegexAlt) || transcript.match(dateNumRegex);

  if (dateMatch && dateMatch[1]) {
    date = dateMatch[1].trim();
  } else if (lower.includes('yesterday')) {
    date = 'Yesterday';
  } else if (lower.includes('today')) {
    date = 'Today';
  } else if (lower.includes('tomorrow')) {
    date = 'Tomorrow';
  }

  // 3. Extract Payment Method
  let paymentMethod = 'Unknown';
  if (lower.includes('upi') || lower.includes('gpay') || lower.includes('phonepe') || lower.includes('paytm')) {
    paymentMethod = 'UPI';
  } else if (lower.includes('credit card') || lower.includes('card')) {
    paymentMethod = 'Credit Card';
  } else if (lower.includes('debit card')) {
    paymentMethod = 'Debit Card';
  } else if (lower.includes('cash')) {
    paymentMethod = 'Cash';
  } else if (lower.includes('net banking') || lower.includes('bank transfer')) {
    paymentMethod = 'Net Banking';
  }

  // 4. Extract Merchant
  let merchant = 'Unknown';
  // Check known merchants first
  for (const [key, canonicalName] of Object.entries(KNOWN_MERCHANTS)) {
    if (lower.includes(key)) {
      merchant = canonicalName;
      break;
    }
  }

  // If merchant still unknown, try regex matching after prepositions
  if (merchant === 'Unknown') {
    const merchantPatterns = [
      /(?:at|from|to|in)\s+([A-Z][a-zA-Z0-9\s'&]+?)(?=\s+(?:today|yesterday|for|using|with|via|rupees|rs|₹|\d|$))/i,
      /(?:at|from)\s+([a-zA-Z0-9\s'&]+?)(?=\s+for|\s+today|\s+yesterday|\s+using|\s+with|$)/i,
    ];
    for (const pattern of merchantPatterns) {
      const match = transcript.match(pattern);
      if (match && match[1] && match[1].trim().length > 1) {
        merchant = match[1].trim();
        break;
      }
    }
  }

  // 5. Extract Title (Item Name) & Category
  let category = 'Miscellaneous';
  let title = 'Expense';

  // Common item keywords
  if (lower.includes('burger')) {
    title = 'Burger';
    category = 'Food & Beverages';
  } else if (lower.includes('coffee')) {
    title = 'Coffee';
    category = 'Food & Beverages';
  } else if (lower.includes('pizza')) {
    title = 'Pizza';
    category = 'Food & Beverages';
  } else if (lower.includes('tea')) {
    title = 'Tea';
    category = 'Food & Beverages';
  } else if (lower.includes('lunch')) {
    title = 'Lunch';
    category = 'Food & Beverages';
  } else if (lower.includes('dinner')) {
    title = 'Dinner';
    category = 'Food & Beverages';
  } else if (lower.includes('petrol') || lower.includes('fuel')) {
    title = 'Fuel';
    category = 'Transportation';
  } else if (lower.includes('shoes')) {
    title = 'Shoes';
    category = 'Shopping';
  } else if (lower.includes('clothes') || lower.includes('shirt') || lower.includes('pants')) {
    title = 'Apparel';
    category = 'Shopping';
  } else if (lower.includes('cab') || lower.includes('uber') || lower.includes('ola')) {
    title = 'Cab Ride';
    category = 'Transportation';
  } else if (lower.includes('rent')) {
    title = 'Rent';
    category = 'Housing & Rent';
  } else if (lower.includes('groceries')) {
    title = 'Groceries';
    category = 'Shopping';
  }

  // Fallback title logic if title not matched by explicit item keyword
  if (title === 'Expense') {
    const itemMatch = transcript.match(/on\s+([a-zA-Z0-9\s]+?)(?=\s+(?:at|from|on|at|for|using|with|rs|rupees|₹|\d|$))/i);
    if (itemMatch && itemMatch[1] && itemMatch[1].trim().length > 1) {
      const candidate = itemMatch[1].trim();
      if (!KNOWN_MERCHANTS[candidate.toLowerCase()]) {
        title = candidate.charAt(0).toUpperCase() + candidate.slice(1);
      }
    }
    if (title === 'Expense' && merchant !== 'Unknown') {
      title = `${merchant} Purchase`;
    }
  }

  return {
    title,
    amount,
    merchant,
    category,
    date,
    paymentMethod,
    notes: '',
  };
}

/**
 * Extracts structured JSON expense information from a raw transcript text using Gemini API
 */
export async function extractExpenseWithGemini(transcript: string): Promise<ExtractedExpense> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!transcript || transcript.trim().length === 0) {
    throw new Error('Transcript is empty');
  }

  // If no API key is provided, use fallback heuristic parser
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return parseTranscriptHeuristically(transcript);
  }

  const prompt = `You are an AI financial expense parsing engine. Your task is to extract structured JSON data from a spoken expense transcript.

Voice Transcript: "${transcript}"

Categories available:
${EXPENSE_CATEGORIES.map((c) => `- ${c}`).join('\n')}

Instructions:
1. Extract "title": The specific product or item purchased (e.g. "Burger", "Coffee", "Shoes", "Fuel", "Rent"). Do NOT put the store or merchant name as the title if an item is mentioned. For example: for "spent 250 rs on burger on macdonalds on 25 july", title MUST be "Burger".
2. Extract "merchant": The store, restaurant, app, or vendor name (e.g. "McDonald's", "Starbucks", "Nike", "Amazon", "Uber"). For example: for "spent 250 rs on burger on macdonalds on 25 july", merchant MUST be "McDonald's". If unknown, use "Unknown".
3. Extract "amount": Numeric value only (e.g., 250, 4200). Convert currency words (rupees, rs, inr, $) to numbers.
4. Extract "category": It MUST be EXACTLY ONE of the categories listed above.
5. Extract "date": Extract any explicit date mentioned in the spoken transcript (e.g. "25 July", "25th July", "Yesterday", "25/07/2026"). If a specific date like "25 July" is spoken, extract it accurately as spoken or formatted (e.g. "25 July 2026" or "25 July"). Default to "Today" ONLY if no date at all is mentioned in transcript.
6. Extract "paymentMethod": Payment method if mentioned (e.g., "UPI", "Credit Card", "Debit Card", "Cash", "Net Banking", "Unknown").
7. Extract "notes": Any additional details if mentioned, otherwise "".

Return ONLY valid JSON matching this schema:
{
  "title": string,
  "amount": number,
  "merchant": string,
  "category": string,
  "date": string,
  "paymentMethod": string,
  "notes": string
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('Gemini API returned an empty response');
    }

    const parsedJson = JSON.parse(candidateText);

    return {
      title: parsedJson.title || 'Spoken Expense',
      amount: typeof parsedJson.amount === 'number' ? parsedJson.amount : parseFloat(parsedJson.amount) || 0,
      merchant: parsedJson.merchant || 'Unknown',
      category: EXPENSE_CATEGORIES.includes(parsedJson.category) ? parsedJson.category : 'Miscellaneous',
      date: parsedJson.date || 'Today',
      paymentMethod: parsedJson.paymentMethod || 'Unknown',
      notes: parsedJson.notes || '',
    };
  } catch (error) {
    console.warn('Gemini extraction failed or API key error. Falling back to heuristic parser:', error);
    return parseTranscriptHeuristically(transcript);
  }
}
