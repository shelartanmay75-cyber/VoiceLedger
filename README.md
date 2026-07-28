# 🎙️ VoiceLedger

> **Talk. Track. Understand.**
>
> VoiceLedger is an AI-powered, voice-first expense tracking application that lets users record expenses naturally through speech, automatically categorizes transactions, provides intelligent financial insights, and simplifies personal finance management with conversational AI.

---

## 📖 Overview

Traditional expense trackers require users to manually enter every detail of a transaction, making the process slow and repetitive.

**VoiceLedger** eliminates this friction by allowing users to simply speak naturally.

Example:

> "I spent ₹250 on coffee this morning."

VoiceLedger automatically extracts:

* 💰 Amount
* 🛒 Expense Title
* 🏷️ Category
* 📅 Date & Time
* 💳 Payment Method (when mentioned)
* 📝 Additional Notes

The user can review and edit the extracted information before saving.

---

# ✨ Features

### 🎤 Voice-First Expense Tracking

* Natural language expense entry
* Speech-to-text conversion
* AI-powered expense extraction
* Multi-expense conversation support


### 🔍 Natural Language Search

Search expenses naturally.

Examples

* Show coffee expenses
* Expenses from last week
* Petrol expenses
* Expenses above ₹1000
* Expenses with Rahul


# 🛠️ Tech Stack

```text
                         VoiceLedger Tech Stack

                        +----------------------+
                        |      Frontend        |
                        |----------------------|
                        | • React              |
                        | • TypeScript         |
                        | • Vite               |
                        | • Tailwind CSS       |
                        | • Framer Motion      |
                        | • React Router       |
                        +----------+-----------+
                                   |
                                   |
                +------------------+------------------+
                |                                     |
                v                                     v
      +----------------------+             +----------------------+
      |      Backend         |             |      Database        |
      |----------------------|             |----------------------|
      | • Node.js            |             | • Firebase Firestore |
      | • Express.js         |             +----------------------+
      | • REST API           |
      +----------+-----------+
                 |
                 |
     +-----------+------------+---------------------------+
     |                        |                           |
     v                        v                           v
+----------------+    +------------------+       +------------------+
| Authentication |    | AI & Voice       |       |Data Visualization|
|----------------|    |------------------|       |------------------|
| Firebase Auth  |    | OpenAI / Gemini  |       |    Recharts      |
| Google Sign-In |    | Speech-to-Text   |       |  Charts & Graphs |
| Guest Mode     |    | NLP              |       +------------------+
+-------------+--+    | Entity Extraction|
              |       +------------------+
              |
              v
      +----------------------+
      |      Deployment      |
      |----------------------|
      | • Vercel             |
      | • Render / Railway   |
      +----------------------+
```

# 🧱 Project Architecture

```
                     +----------------------+
                     |      Frontend        |
                     |  React + TypeScript  |
                     +----------+-----------+
                                |
                                |
                                v
                     REST API / HTTPS
                                |
                                v
                   +----------------------+
                   |      Express API     |
                   +----------+-----------+
                              |
        +---------------------+--------------------+
        |                     |                    |
        v                     v                    v
Firebase Auth        Firestore Database      AI Service
(Google Login)       Expenses & Users     OpenAI / Gemini
        |                                        |
        +------------------+---------------------+
                           |
                           v
                Speech-to-Text Processing
                           |
                           v
              Expense Extraction Engine
                           |
                           v
                Categorization & Insights
```


