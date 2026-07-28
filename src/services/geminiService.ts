import type { ExtractedExpense } from '../types/voice';
import { EXPENSE_CATEGORIES } from '../types/voice';

/**
 * Fallback parser using regex rules when API key is missing or offline
 */
function parseTranscriptHeuristically(transcript: string): ExtractedExpense {
  const lower = transcript.toLowerCase();

  // Extract Amount (e.g. ₹250, 250 rupees, rs 250, 250 rs, 4200)
  let amount = 0;
  const amountMatch = transcript.match(/(?:₹|rs\.?|rupees|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:₹|rs\.?|rupees|inr)?/i);
  if (amountMatch && amountMatch[1]) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  // Extract Merchant
  let merchant = 'Unknown';
  const merchantPatterns = [
    /(?:at|from|on|to|in)\s+([A-Z][a-zA-Z0-9\s'&]+?)(?=\s+(?:today|yesterday|for|using|with|via|rupees|rs|₹|\d|$))/i,
    /(?:at|from)\s+([a-zA-Z0-9\s'&]+?)(?=\s+for|\s+today|\s+yesterday|\s+using|\s+with|$)/i,
  ];
  for (const pattern of merchantPatterns) {
    const match = transcript.match(pattern);
    if (match && match[1] && match[1].trim().length > 1) {
      merchant = match[1].trim();
      break;
    }
  }

  // Extract Date
  let date = 'Today';
  if (lower.includes('yesterday')) {
    date = 'Yesterday';
  } else if (lower.includes('last week')) {
    date = 'Last Week';
  } else if (lower.includes('tomorrow')) {
    date = 'Tomorrow';
  }

  // Extract Payment Method
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

  // Predict Category & Title
  let category = 'Miscellaneous';
  let title = 'Expense';

  if (lower.includes('coffee') || lower.includes('starbucks') || lower.includes('tea') || lower.includes('food') || lower.includes('lunch') || lower.includes('dinner') || lower.includes('restaurant') || lower.includes('zomato') || lower.includes('swiggy') || lower.includes('pizza') || lower.includes('burger')) {
    category = 'Food & Beverages';
    title = lower.includes('coffee') ? 'Coffee' : lower.includes('tea') ? 'Tea' : lower.includes('lunch') ? 'Lunch' : lower.includes('dinner') ? 'Dinner' : 'Food & Drinks';
  } else if (lower.includes('shoes') || lower.includes('nike') || lower.includes('clothes') || lower.includes('shopping') || lower.includes('amazon') || lower.includes('flipkart') || lower.includes('shirt') || lower.includes('pants')) {
    category = 'Shopping';
    title = lower.includes('shoes') ? 'Shoes' : lower.includes('clothes') ? 'Apparel' : 'Shopping';
  } else if (lower.includes('cab') || lower.includes('uber') || lower.includes('ola') || lower.includes('petrol') || lower.includes('diesel') || lower.includes('fuel') || lower.includes('auto') || lower.includes('bus') || lower.includes('flight') || lower.includes('train')) {
    category = 'Transportation';
    title = lower.includes('petrol') || lower.includes('fuel') ? 'Fuel' : lower.includes('uber') || lower.includes('cab') || lower.includes('ola') ? 'Cab Ride' : 'Transportation';
  } else if (lower.includes('rent') || lower.includes('apartment') || lower.includes('maintenance')) {
    category = 'Housing & Rent';
    title = 'Rent';
  } else if (lower.includes('electricity') || lower.includes('water bill') || lower.includes('wifi') || lower.includes('internet')) {
    category = 'Utilities';
    title = lower.includes('wifi') || lower.includes('internet') ? 'WiFi Bill' : 'Electricity Bill';
  } else if (lower.includes('doctor') || lower.includes('medicine') || lower.includes('hospital') || lower.includes('pharmacy')) {
    category = 'Healthcare';
    title = 'Medical Expense';
  } else if (lower.includes('movie') || lower.includes('cinema') || lower.includes('netflix') || lower.includes('game') || lower.includes('spotify')) {
    category = 'Entertainment';
    title = lower.includes('netflix') ? 'Netflix' : 'Entertainment';
  } else if (lower.includes('hotel') || lower.includes('trip') || lower.includes('vacation')) {
    category = 'Travel';
    title = 'Travel Expense';
  }

  // Refine title if merchant is present and title is generic
  if (title === 'Expense' && merchant !== 'Unknown') {
    title = `${merchant} Purchase`;
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
    // Artificial slight delay for realistic loading feedback
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return parseTranscriptHeuristically(transcript);
  }

  const prompt = `You are an AI financial expense parsing engine. Your task is to extract structured JSON data from a spoken expense transcript.

Voice Transcript: "${transcript}"

Categories available:
${EXPENSE_CATEGORIES.map((c) => `- ${c}`).join('\n')}

Instructions:
1. Extract title (short name of expense e.g. "Coffee", "Shoes", "Fuel", "Rent").
2. Extract amount as a numeric value only (e.g., 250, 4200). If currency symbols are present, convert to number.
3. Extract merchant (store/service name e.g., "Starbucks", "Nike", "Amazon", "Uber"). If unknown, use "Unknown".
4. Extract category. It MUST be EXACTLY ONE of the categories listed above.
5. Extract date (e.g., "Today", "Yesterday", or date string). Default to "Today".
6. Extract paymentMethod (e.g., "UPI", "Credit Card", "Debit Card", "Cash", "Net Banking", "Unknown").
7. Extract notes if additional context is provided in transcript, otherwise empty string "".

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

    // Validate fields
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
