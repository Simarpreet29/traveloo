# 🌍 Traveloo AI - Next-Gen Agentic Travel Planner

**Traveloo AI** is not just a booking website; it's an **Agentic AI Ecosystem** built using the MERN stack. It autonomously monitors real-time constraints like weather and safety, providing a self-healing travel experience for modern users.

---

## 🤖 What makes it "Agentic"?

Unlike traditional applications that wait for user commands, Traveloo AI features an **Autonomous Reasoning Engine**:
* **Autonomous Monitoring:** The system proactively checks weather patterns at the destination during the flight search process.
* **Self-Correction & Re-booking:** If the AI detects unsafe conditions (e.g., storms in Goa), it doesn't just show an error; it **autonomously fetches alternatives** and presents a "Re-book" action to the user.
* **Intelligent Itinerary Logic:** Uses Google Gemini AI to parse complex travel intents into structured 3-day plans with "Hidden Gems" detection.

---

## 🚀 Core Features

### ✈️ Smart Flight Management
* Multi-city search support (DEL, ATQ, BOM, JAI, BLR).
* **Agentic Weather Alerts:** Visual red-alert triggers for severe weather warnings.
* **One-Click Re-booking:** AI-driven alternative flight suggestions.

### 🎁 Curated Holiday Packages
* Real-time booking for exclusive tours (Maldives, Kerala, Paris, etc.).
* Integrated booking flow that captures passenger demographics (Gender/Age).

### 📊 Comprehensive User Dashboard
* Consolidated view of Flights and Package bookings.
* **Professional E-Ticket:** Automated PDF generation with high-fidelity formatting using `jsPDF`.
* Real-time analytics showing "Total Spent" and "Total Trips".

---

## 🛠️ Tech Stack & Architecture

  Technology Used |

- Frontend React.js (Hooks, Context API) |
- Styling Tailwind CSS & Framer Motion (for SaaS-level UI) |
- Backend Node.js & Express.js |
- Database MongoDB & Mongoose (Flexible Schema Design) |
- AI Engine Google Gemini 1.5 Flash API |
- PDF Engine jsPDF |

---

## ⚙️ Installation & Setup
 - Frontend

  cd tour-travel
  npm run dev

- Backend

  cd backend
  node server.js