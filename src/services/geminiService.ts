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
  rapido: 'Rapido',
  shell: 'Shell',
  dmart: 'DMart',
  kfc: 'KFC',
  dominos: "Domino's",
  dominoz: "Domino's",
  pizzahut: 'Pizza Hut',
  subway: 'Subway',
  apple: 'Apple',
  google: 'Google',
  netflix: 'Netflix',
  spotify: 'Spotify',
  croma: 'Croma',
  reliance: 'Reliance Digital',
  vijaysales: 'Vijay Sales',
};

/**
 * Exhaustive keyword mapping dictionary for all 20 categories
 */
const CATEGORY_KEYWORDS: { category: string; keywords: string[] }[] = [
  {
    category: 'Transportation',
    keywords: [
      'autorickshaw',
      'rickshaw',
      'auto',
      'cab',
      'taxi',
      'uber',
      'ola',
      'rapido',
      'petrol',
      'diesel',
      'fuel',
      'gasoline',
      'bus',
      'metro',
      'train',
      'flight',
      'ticket',
      'toll',
      'parking',
      'scooter',
      'bike',
      'fare',
      'mechanic',
      'car wash',
    ],
  },
  {
    category: 'Food & Beverages',
    keywords: [
      'coffee',
      'tea',
      'chai',
      'burger',
      'pizza',
      'sandwich',
      'momos',
      'biryani',
      'dosa',
      'idli',
      'thali',
      'noodle',
      'pasta',
      'food',
      'lunch',
      'dinner',
      'breakfast',
      'snack',
      'restaurant',
      'swiggy',
      'zomato',
      'starbucks',
      'mcdonalds',
      'macdonalds',
      'kfc',
      'dominos',
      'dominoz',
      'subway',
      'bakery',
      'cake',
      'ice cream',
      'juice',
      'beverage',
      'cafe',
      'bar',
      'pub',
      'beer',
      'wine',
      'drinks',
    ],
  },
  {
    category: 'Shopping',
    keywords: [
      'keyboard',
      'keyboards',
      'mouse',
      'monitor',
      'headphones',
      'earphones',
      'headset',
      'charger',
      'cable',
      'adapter',
      'gadget',
      'gadgets',
      'shoes',
      'clothes',
      'shirt',
      'pants',
      'jeans',
      'dress',
      't-shirt',
      'jacket',
      'apparel',
      'shopping',
      'amazon',
      'flipkart',
      'myntra',
      'dmart',
      'groceries',
      'supermarket',
      'laptop',
      'phone',
      'mobile',
      'electronics',
      'bag',
      'watch',
      'sunglasses',
    ],
  },
  {
    category: 'Housing & Rent',
    keywords: [
      'rent',
      'apartment',
      'flat',
      'house',
      'maintenance',
      'lease',
      'housing',
      'mortgage',
      'brokerage',
      'security deposit',
    ],
  },
  {
    category: 'Utilities',
    keywords: [
      'electricity',
      'water',
      'gas cylinder',
      'cylinder',
      'wifi',
      'broadband',
      'internet',
      'recharge',
      'mobile bill',
      'utility',
    ],
  },
  {
    category: 'Healthcare',
    keywords: [
      'doctor',
      'medicine',
      'hospital',
      'clinic',
      'pharmacy',
      'medical',
      'pharmeasy',
      'apollo',
      'lab test',
      'blood test',
      'dental',
      'dentist',
      'eye checkup',
      'physiotherapist',
      'health insurance',
      'consultation',
    ],
  },
  {
    category: 'Education',
    keywords: [
      'tuition',
      'school',
      'college',
      'coaching',
      'course',
      'udemy',
      'coursera',
      'books',
      'notebook',
      'stationery',
      'exam fee',
      'university',
    ],
  },
  {
    category: 'Entertainment',
    keywords: [
      'movie',
      'cinema',
      'theatre',
      'bookmyshow',
      'netflix',
      'spotify',
      'prime',
      'hotstar',
      'game',
      'gaming',
      'concert',
      'event',
      'show',
    ],
  },
  {
    category: 'Travel',
    keywords: [
      'hotel',
      'resort',
      'airbnb',
      'stay',
      'vacation',
      'trip',
      'tour',
      'sightseeing',
      'makemytrip',
      'booking.com',
      'flight booking',
      'lodge',
    ],
  },
  {
    category: 'Work & Business',
    keywords: [
      'office',
      'co-working',
      'client dinner',
      'business',
      'printing',
      'domain',
      'hosting',
      'aws',
      'software license',
      'vendor',
      'freelance',
    ],
  },
  {
    category: 'Fitness & Sports',
    keywords: [
      'gym',
      'fitness',
      'cult',
      'workout',
      'protein',
      'supplements',
      'sports',
      'badminton',
      'swimming',
      'yoga',
      'trainer',
    ],
  },
  {
    category: 'Bills & Subscriptions',
    keywords: [
      'subscription',
      'membership',
      'annual fee',
      'recurring bill',
      'newspaper',
      'magazine',
      'icloud',
      'google one',
    ],
  },
  {
    category: 'Gifts & Donations',
    keywords: [
      'gift',
      'present',
      'donation',
      'charity',
      'birthday',
      'wedding gift',
      'temple',
      'tip',
    ],
  },
  {
    category: 'Pets',
    keywords: ['dog', 'cat', 'pet', 'vet', 'veterinary', 'pet food', 'pedigree', 'grooming'],
  },
  {
    category: 'Family & Kids',
    keywords: ['kids', 'baby', 'diapers', 'toys', 'childcare', 'pocket money', 'family'],
  },
  {
    category: 'Personal Care',
    keywords: [
      'salon',
      'haircut',
      'barber',
      'spa',
      'massage',
      'skincare',
      'cosmetics',
      'makeup',
      'beauty',
      'shampoo',
    ],
  },
  {
    category: 'Investments & Savings',
    keywords: [
      'mutual fund',
      'sip',
      'stocks',
      'shares',
      'crypto',
      'bitcoin',
      'fixed deposit',
      'fd',
      'ppf',
      'gold',
      'zerodha',
      'groww',
    ],
  },
  {
    category: 'Taxes & Fees',
    keywords: ['tax', 'gst', 'income tax', 'property tax', 'bank charges', 'penalty', 'late fee', 'interest'],
  },
  {
    category: 'Income / Refund',
    keywords: ['salary', 'stipend', 'bonus', 'refund', 'cashback', 'dividend', 'freelance income', 'reimbursement'],
  },
];

/**
 * Classifies any transcript text into one of the 20 categories
 */
function classifyCategory(transcript: string): string {
  const lower = transcript.toLowerCase();
  for (const item of CATEGORY_KEYWORDS) {
    for (const kw of item.keywords) {
      if (lower.includes(kw)) {
        return item.category;
      }
    }
  }
  return 'Miscellaneous';
}

/**
 * Sanitizes extracted titles and merchants by trimming action phrases and prepositions
 */
function cleanExtractedString(str: string): string {
  if (!str) return '';
  let cleaned = str.trim();

  if (cleaned.toLowerCase() === 'unknown' || cleaned.toLowerCase() === 'none') {
    return '';
  }

  // Strip leading action filler e.g. "spent 6000rs to buy a keyboard" -> "keyboard"
  cleaned = cleaned.replace(/^(?:spent\s+\d+(?:,\d+)*(?:\.\d+)?\s*(?:rs|rupees|inr|₹)?\s*(?:to\s+buy|for\s+buying|on|for)\s*(?:a|an|the)?\s*)/i, '');
  cleaned = cleaned.replace(/^(?:paid\s+\d+(?:,\d+)*(?:\.\d+)?\s*(?:rs|rupees|inr|₹)?\s*(?:for|to\s+buy)\s*(?:a|an|the)?\s*)/i, '');
  cleaned = cleaned.replace(/^(?:bought\s+(?:a|an|the)?\s*)/i, '');
  cleaned = cleaned.replace(/^(?:on|at|for|from|to|in|with|via|using|paid|spent)\s+/i, '');

  // Strip trailing noise words and prepositions
  const trailingNoiseRegex = /\s+(?:on|at|for|from|to|in|with|via|using|paid\s+using|paid|spent|and|rs|rupees|inr|₹|\d+)$/i;
  while (trailingNoiseRegex.test(cleaned)) {
    cleaned = cleaned.replace(trailingNoiseRegex, '').trim();
  }

  if (!cleaned || cleaned.toLowerCase() === 'unknown') return '';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/**
 * Fallback parser using regex rules when API key is missing or offline
 */
function parseTranscriptHeuristically(transcript: string): ExtractedExpense {
  const lower = transcript.toLowerCase();
  const currentYear = new Date().getFullYear();

  // 1. Extract Amount (e.g. 6000rs, ₹250, 250 rupees, rs 250, 250 rs)
  let amount = 0;
  const amountMatch = transcript.match(/(?:₹|rs\.?|rupees|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:₹|rs\.?|rupees|inr)?/i);
  if (amountMatch && amountMatch[1]) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  // 2. Extract Spoken Date
  let date = 'Today';
  const monthRegex = /(\d{1,2}(?:st|nd|rd|th)?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)(?:\s+\d{2,4})?)/i;
  const monthRegexAlt = /((?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}(?:st|nd|rd|th)?(?:\s+\d{2,4})?)/i;
  const dateNumRegex = /(\d{1,2}[\/\.-]\d{1,2}(?:[\/\.-]\d{2,4})?)/;

  const dateMatch = transcript.match(monthRegex) || transcript.match(monthRegexAlt) || transcript.match(dateNumRegex);

  if (dateMatch && dateMatch[1]) {
    const rawDate = dateMatch[1].trim();
    const hasYear = /\b(19|20)\d{2}\b/.test(rawDate);
    date = hasYear ? rawDate : `${rawDate} ${currentYear}`;
  } else if (lower.includes('yesterday')) {
    date = 'Yesterday';
  } else if (lower.includes('today')) {
    date = 'Today';
  } else if (lower.includes('tomorrow')) {
    date = 'Tomorrow';
  } else {
    date = 'Today';
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
  let merchant = '';
  for (const [key, canonicalName] of Object.entries(KNOWN_MERCHANTS)) {
    if (lower.includes(key)) {
      merchant = canonicalName;
      break;
    }
  }

  if (!merchant) {
    const merchantPatterns = [
      /(?:at|from)\s+([A-Z][a-zA-Z0-9\s'&]+?)(?=\s+(?:today|yesterday|for|using|with|via|rupees|rs|₹|\d|$))/i,
      /(?:at|from)\s+([a-zA-Z0-9\s'&]+?)(?=\s+for|\s+today|\s+yesterday|\s+using|\s+with|$)/i,
    ];
    for (const pattern of merchantPatterns) {
      const match = transcript.match(pattern);
      if (match && match[1] && match[1].trim().length > 1) {
        const candidate = match[1].trim();
        if (!['upi', 'gpay', 'phonepe', 'cash', 'card'].includes(candidate.toLowerCase())) {
          merchant = candidate;
          break;
        }
      }
    }
  }

  // 5. Categorize dynamically using 20-category classifier engine
  const category = classifyCategory(transcript);

  // 6. Extract Clean Title (Item Name)
  let title = '';
  if (lower.includes('keyboard')) {
    title = 'Keyboard';
  } else if (lower.includes('mouse')) {
    title = 'Mouse';
  } else if (lower.includes('monitor')) {
    title = 'Monitor';
  } else if (lower.includes('autorickshaw') || lower.includes('rickshaw') || lower.includes('auto ') || lower.endsWith(' auto')) {
    title = lower.includes('autorickshaw') ? 'Autorickshaw' : lower.includes('rickshaw') ? 'Rickshaw' : 'Auto';
  } else if (lower.includes('petrol') || lower.includes('diesel') || lower.includes('fuel')) {
    title = 'Fuel';
  } else if (lower.includes('cab') || lower.includes('uber') || lower.includes('ola') || lower.includes('taxi') || lower.includes('rapido')) {
    title = lower.includes('uber') ? 'Uber' : lower.includes('ola') ? 'Ola' : lower.includes('rapido') ? 'Rapido' : 'Cab Ride';
  } else if (lower.includes('burger')) {
    title = 'Burger';
  } else if (lower.includes('coffee')) {
    title = 'Coffee';
  } else if (lower.includes('pizza')) {
    title = 'Pizza';
  } else if (lower.includes('tea') || lower.includes('chai')) {
    title = 'Tea';
  } else if (lower.includes('lunch')) {
    title = 'Lunch';
  } else if (lower.includes('dinner')) {
    title = 'Dinner';
  } else if (lower.includes('shoes')) {
    title = 'Shoes';
  } else if (lower.includes('clothes') || lower.includes('shirt') || lower.includes('pants')) {
    title = 'Apparel';
  } else if (lower.includes('rent')) {
    title = 'Rent';
  } else if (lower.includes('groceries')) {
    title = 'Groceries';
  }

  if (!title) {
    // Regex matching "to buy a [item]" or "for [item]" or "bought [item]"
    const itemMatch =
      transcript.match(/(?:to\s+buy|for\s+buying|bought|for)\s+(?:a|an|the)?\s*([a-zA-Z0-9\s]+?)(?=\s+(?:at|from|on|using|paid|via|with|rs|rupees|₹|\d|$))/i) ||
      transcript.match(/on\s+([a-zA-Z0-9\s]+?)(?=\s+(?:at|from|using|paid|via|with|rs|rupees|₹|\d|$))/i);

    if (itemMatch && itemMatch[1] && itemMatch[1].trim().length > 1) {
      title = itemMatch[1].trim();
    }
  }

  const cleanTitle = cleanExtractedString(title) || 'Expense';
  const cleanMerchant = cleanExtractedString(merchant);

  return {
    title: cleanTitle,
    amount,
    merchant: cleanMerchant,
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
  const currentYear = new Date().getFullYear();

  if (!transcript || transcript.trim().length === 0) {
    throw new Error('Transcript is empty');
  }

  // If no API key is provided, use fallback heuristic parser
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return parseTranscriptHeuristically(transcript);
  }

  const prompt = `You are a financial AI expense parser. Extract structured JSON data from a spoken expense transcript.

Voice Transcript: "${transcript}"

Current Ongoing Year: ${currentYear}

Categories available (MUST pick EXACTLY ONE from this list):
${EXPENSE_CATEGORIES.map((c) => `- ${c}`).join('\n')}

Rules for Extraction:
1. "title": Extract ONLY the core product, item, or service purchased (e.g. "Keyboard", "Burger", "Autorickshaw", "Coffee", "Shoes", "Fuel", "Rent", "Headphones").
   - MUST strip action filler phrases like "spent 6000rs to buy a", "paid for", "bought a", "paid using upi", "via upi".
   - Example: For "spent 6000rs to buy a keyboard and paid using upi", title MUST be "Keyboard".
   - Capitalize cleanly in Title Case.
2. "merchant": The brand, store, app, or vendor name if mentioned (e.g., "McDonald's", "Starbucks", "Amazon", "Nike", "Uber").
   - CRITICAL: If NO store/merchant name is explicitly mentioned (e.g. "spent 6000rs to buy a keyboard and paid using upi"), set "merchant" to "" (empty string). Do NOT use "Unknown".
3. "amount": Numeric value only (e.g. 6000, 250). Convert words to numbers.
4. "category": Pick EXACTLY ONE category from the 20 available categories based on these mappings:
   - "Shopping": keyboard, mouse, monitor, headphones, electronics, laptop, shoes, clothes, apparel, amazon, flipkart, dmart, groceries.
   - "Food & Beverages": burger, pizza, coffee, tea, chai, food, lunch, dinner, restaurant, swiggy, zomato, starbucks, mcdonalds.
   - "Transportation": autorickshaw, rickshaw, auto, cab, taxi, uber, ola, rapido, petrol, fuel, diesel, bus, metro, train.
   - "Housing & Rent": rent, apartment, flat, maintenance.
   - "Utilities": electricity, water, gas cylinder, wifi, broadband, recharge.
   - "Healthcare": doctor, medicine, hospital, pharmacy.
   - "Education": tuition, school, college, course, books.
   - "Entertainment": movie, cinema, netflix, spotify, game.
   - "Travel": hotel, resort, airbnb, vacation, trip.
   - "Work & Business": office, business, domain, hosting, aws.
   - "Fitness & Sports": gym, fitness, workout, protein.
   - "Bills & Subscriptions": subscription, membership, recurring bill.
   - "Gifts & Donations": gift, donation, charity.
   - "Pets": dog, cat, pet, vet.
   - "Family & Kids": kids, baby, toys.
   - "Personal Care": salon, haircut, spa, cosmetics.
   - "Investments & Savings": mutual fund, sip, stocks, crypto, fd.
   - "Taxes & Fees": tax, gst, bank charges.
   - "Income / Refund": salary, bonus, refund, cashback.
   - "Miscellaneous": Default ONLY if none match.
5. "date": If no date is mentioned, use "Today". If date mentioned without year (e.g. "25 July"), append "${currentYear}" (e.g. "25 July ${currentYear}").
6. "paymentMethod": Extract payment method if mentioned ("UPI", "Credit Card", "Debit Card", "Cash", "Net Banking", "Unknown").
7. "notes": Any additional details or "".

Training Examples:
Input: "spent 6000rs to buy a keyboard and paid using upi"
Output:
{
  "title": "Keyboard",
  "amount": 6000,
  "merchant": "",
  "category": "Shopping",
  "date": "Today",
  "paymentMethod": "UPI",
  "notes": ""
}

Input: "paid 250 rupees for a burger at mcdonalds using credit card"
Output:
{
  "title": "Burger",
  "amount": 250,
  "merchant": "McDonald's",
  "category": "Food & Beverages",
  "date": "Today",
  "paymentMethod": "Credit Card",
  "notes": ""
}

Input: "spent 450 rs for autorickshaw yesterday via upi"
Output:
{
  "title": "Autorickshaw",
  "amount": 450,
  "merchant": "",
  "category": "Transportation",
  "date": "Yesterday",
  "paymentMethod": "UPI",
  "notes": ""
}

Input: "bought headphones for 4500 rs from amazon on 25 july"
Output:
{
  "title": "Headphones",
  "amount": 4500,
  "merchant": "Amazon",
  "category": "Shopping",
  "date": "25 July ${currentYear}",
  "paymentMethod": "Unknown",
  "notes": ""
}

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
            temperature: 0.0,
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

    // Sanitize title and merchant strings
    const rawTitle = parsedJson.title || 'Expense';
    const rawMerchant = parsedJson.merchant || '';

    const cleanTitleVal = cleanExtractedString(rawTitle);
    const cleanMerchantVal = cleanExtractedString(rawMerchant);

    // Fallback category classification if AI returned Miscellaneous
    let finalCategory = EXPENSE_CATEGORIES.includes(parsedJson.category) ? parsedJson.category : 'Miscellaneous';
    if (finalCategory === 'Miscellaneous') {
      finalCategory = classifyCategory(transcript);
    }

    return {
      title: cleanTitleVal || 'Expense',
      amount: typeof parsedJson.amount === 'number' ? parsedJson.amount : parseFloat(parsedJson.amount) || 0,
      merchant: cleanMerchantVal,
      category: finalCategory,
      date: parsedJson.date || 'Today',
      paymentMethod: parsedJson.paymentMethod || 'Unknown',
      notes: parsedJson.notes || '',
    };
  } catch (error) {
    console.warn('Gemini extraction failed or API key error. Falling back to heuristic parser:', error);
    return parseTranscriptHeuristically(transcript);
  }
}
