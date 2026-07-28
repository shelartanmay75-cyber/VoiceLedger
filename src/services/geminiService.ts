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
      'gadget',
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
 * Sanitizes extracted titles and merchants by trimming leftover prepositions (e.g. "on", "at", "for", "from")
 */
function cleanExtractedString(str: string): string {
  if (!str) return '';
  let cleaned = str.trim();

  // Strip trailing noise words and prepositions repeatedly
  const trailingNoiseRegex = /\s+(?:on|at|for|from|to|in|with|via|using|of|by|and|rs|rupees|inr|₹|\d+)$/i;
  while (trailingNoiseRegex.test(cleaned)) {
    cleaned = cleaned.replace(trailingNoiseRegex, '').trim();
  }

  // Strip leading prepositions if any e.g. "on burger" -> "burger"
  cleaned = cleaned.replace(/^(?:on|at|for|from|to|in|with|via|using|paid|spent)\s+/i, '').trim();

  if (!cleaned) return '';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/**
 * Fallback parser using regex rules when API key is missing or offline
 */
function parseTranscriptHeuristically(transcript: string): ExtractedExpense {
  const lower = transcript.toLowerCase();
  const currentYear = new Date().getFullYear();

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
  let merchant = 'Unknown';
  for (const [key, canonicalName] of Object.entries(KNOWN_MERCHANTS)) {
    if (lower.includes(key)) {
      merchant = canonicalName;
      break;
    }
  }

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

  // 5. Categorize dynamically using 20-category classifier engine
  const category = classifyCategory(transcript);

  // 6. Extract Title (Item Name)
  let title = 'Expense';
  if (lower.includes('autorickshaw') || lower.includes('rickshaw') || lower.includes('auto ') || lower.endsWith(' auto')) {
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
  } else if (lower.includes('tea')) {
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

  if (title === 'Expense') {
    const itemMatch = transcript.match(/on\s+([a-zA-Z0-9\s]+?)(?=\s+(?:at|from|on|at|for|using|with|rs|rupees|₹|\d|$))/i) ||
                      transcript.match(/for\s+([a-zA-Z0-9\s]+?)(?=\s+(?:at|from|on|at|for|using|with|rs|rupees|₹|\d|$))/i);
    if (itemMatch && itemMatch[1] && itemMatch[1].trim().length > 1) {
      const candidate = itemMatch[1].trim();
      if (!KNOWN_MERCHANTS[candidate.toLowerCase()]) {
        title = candidate;
      }
    }
  }

  const cleanTitle = cleanExtractedString(title) || 'Expense';
  const cleanMerchant = cleanExtractedString(merchant) || 'Unknown';

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

  const prompt = `You are an AI financial expense parsing engine. Your task is to extract structured JSON data from a spoken expense transcript.

Voice Transcript: "${transcript}"

Current Ongoing Year: ${currentYear}

Categories available:
${EXPENSE_CATEGORIES.map((c) => `- ${c}`).join('\n')}

Instructions:
1. Extract "title": The specific product, service, or transport item purchased (e.g. "Burger", "Autorickshaw", "Coffee", "Shoes", "Fuel", "Rent"). Do NOT include trailing prepositions like "on", "at", "for". E.g., for "paid 50 rs for autorickshaw on 25 july", title MUST be "Autorickshaw" (NOT "autorickshaw on").
2. Extract "merchant": The store, restaurant, app, or vendor name (e.g. "Domino's", "McDonald's", "Starbucks", "Nike", "Amazon", "Uber"). Do NOT include trailing prepositions like "on", "at", "for". E.g., for "spent 250 rs at dominoz on 25 july", merchant MUST be "Domino's" (NOT "dominoz on"). If unknown, use "Unknown".
3. Extract "amount": Numeric value only (e.g., 250, 4200). Convert currency words (rupees, rs, inr, $) to numbers.
4. Extract "category": MUST be EXACTLY ONE of the 20 categories listed above.
   Category Classification Rules:
   - "Transportation": rickshaw, autorickshaw, auto, cab, taxi, uber, ola, rapido, petrol, fuel, diesel, bus, metro, train, flight, parking, toll.
   - "Food & Beverages": burger, pizza, coffee, tea, chai, food, lunch, dinner, breakfast, restaurant, swiggy, zomato, starbucks, mcdonalds, dominos, kfc, bakery, cafe.
   - "Shopping": shoes, clothes, shirt, pants, apparel, shopping, amazon, flipkart, dmart, groceries, laptop, phone, electronics.
   - "Housing & Rent": rent, apartment, flat, house, maintenance, lease.
   - "Utilities": electricity, water, gas cylinder, wifi, broadband, internet, recharge, mobile bill.
   - "Healthcare": doctor, medicine, hospital, clinic, pharmacy, medical, lab test, dentist.
   - "Education": tuition, school, college, coaching, course, books, stationery.
   - "Entertainment": movie, cinema, netflix, spotify, hotstar, game, concert, event.
   - "Travel": hotel, resort, airbnb, stay, vacation, trip, tour, sightseeing.
   - "Work & Business": office, client dinner, business, hosting, software.
   - "Fitness & Sports": gym, fitness, workout, protein, sports, swimming, yoga.
   - "Bills & Subscriptions": subscription, membership, recurring bill, icloud.
   - "Gifts & Donations": gift, donation, charity, birthday gift, temple.
   - "Pets": dog, cat, pet, vet, pet food, grooming.
   - "Family & Kids": kids, baby, diapers, toys, childcare.
   - "Personal Care": salon, haircut, barber, spa, cosmetics, makeup, beauty.
   - "Investments & Savings": mutual fund, sip, stocks, crypto, fd, zerodha, groww.
   - "Taxes & Fees": tax, gst, income tax, bank charges, penalty, interest.
   - "Income / Refund": salary, stipend, bonus, refund, cashback, reimbursement.
   - "Miscellaneous": Default ONLY if none of the above match.
5. Extract "date":
   - If the user explicitly mentions a date without a year (e.g., "25 July" or "25th July"), ALWAYS append the ongoing year ${currentYear} (e.g., "25 July ${currentYear}").
   - If the user DOES NOT specifically mention any date at all in the transcript, ALWAYS default to the current date of that time (i.e. "Today").
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

    // Sanitize title and merchant strings to strip trailing prepositions e.g. "autorickshaw on" -> "Autorickshaw"
    const rawTitle = parsedJson.title || 'Spoken Expense';
    const rawMerchant = parsedJson.merchant || 'Unknown';

    const cleanTitleVal = cleanExtractedString(rawTitle);
    const cleanMerchantVal = cleanExtractedString(rawMerchant);

    // Fallback category classification if AI returned Miscellaneous
    let finalCategory = EXPENSE_CATEGORIES.includes(parsedJson.category) ? parsedJson.category : 'Miscellaneous';
    if (finalCategory === 'Miscellaneous') {
      finalCategory = classifyCategory(transcript);
    }

    return {
      title: cleanTitleVal || 'Spoken Expense',
      amount: typeof parsedJson.amount === 'number' ? parsedJson.amount : parseFloat(parsedJson.amount) || 0,
      merchant: cleanMerchantVal || 'Unknown',
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
