
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --------------------------------------------------
// 1. MONGODB & AI SETUP

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/traveloo')
    .then(() => console.log('✅ MongoDB Connected!'))
    .catch(err => console.log('❌ MongoDB Error:', err));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --------------------------------------------------
// 2. MASTER TRAVEL DATABASE (Static Cache) - ALL CITIES 

const travelData = {
   manali: {
        title: "Snowy Manali Adventure",
        cost: "₹12,000 - ₹15,000 (Budget Friendly)",
        weather: "Cold (-2°C to 12°C)",
        crowd: "Medium (Best for Couples)",
        hidden_spots: ["Sissu Lake", "Sajla Waterfalls"],
        days: [
            { day: 1, title: "Local Vibe", events: ["Hadimba Temple", "Old Manali Cafes"] },
            { day: 2, title: "Snow Day", events: ["Solang Valley", "Rohtang Pass"] },
            { day: 3, title: "Relax", events: ["Jogini Falls", "Mall Road"] }
        ]
    },
    goa: {
        title: "Tropical Goa Getaway",
        cost: "₹18,000 - ₹25,000 (Premium)",
        weather: "Humid (28°C to 34°C)",
        crowd: "High (Peak Season)",
        hidden_spots: ["Cola Beach", "Chorao Island"],
        days: [
            { day: 1, title: "North Goa", events: ["Baga Beach", "Aguada Fort"] },
            { day: 2, title: "Water Sports", events: ["Scuba Diving", "Parasailing"] },
            { day: 3, title: "South Goa", events: ["Palolem Beach", "Old Goa Churches"] }
        ]
    },
    amritsar: {
        title: "Spirit of Amritsar & Heritage",
        cost: "₹5,000 - ₹8,000 (Very Budget Friendly)",
        weather: "Pleasant (15°C to 25°C)",
        crowd: "High (Religious Significance)",
        hidden_spots: ["Pul Kanjari", "Gobindgarh Fort Night Show"],
        days: [
            { day: 1, title: "Divine Morning", events: ["Golden Temple", "Jallianwala Bagh", "Langar Seva"] },
            { day: 2, title: "Patriotism", events: ["Wagah Border Parade", "Partition Museum", "Kesar Da Dhaba"] },
            { day: 3, title: "Local Market", events: ["Hall Bazaar Shopping", "Durgiana Temple"] }
        ]
    },
    jaipur: {
        title: "The Royal Pink City Tour",
        cost: "₹10,000 - ₹15,000 (Mid-Range)",
        weather: "Hot/Dry (20°C to 35°C)",
        crowd: "High (Tourists Favorite)",
        hidden_spots: ["Panna Meena ka Kund", "Galta Ji Temple (Monkey Temple)"],
        days: [
            { day: 1, title: "Royal Palaces", events: ["Hawa Mahal", "City Palace", "Jantar Mantar"] },
            { day: 2, title: "Forts Exploration", events: ["Amer Fort Elephant Ride", "Nahargarh Sunset", "Jaigarh Fort"] },
            { day: 3, title: "Cultural Night", events: ["Chokhi Dhani Dinner", "Bapu Bazaar Shopping"] }
        ]
    },
    vrindavan: {
        title: "Spiritual Braj Darshan",
        cost: "₹4,000 - ₹7,000 (Budget Friendly)",
        weather: "Moderate (18°C to 30°C)",
        crowd: "Extremely High (Weekends)",
        hidden_spots: ["Nidhivan (Night entry strictly prohibited)", "Seva Kunj"],
        days: [
            { day: 1, title: "Temple Run", events: ["Banke Bihari Temple", "Prem Mandir Lighting", "ISKCON"] },
            { day: 2, title: "Braj Parikrama", events: ["Govardhan Hill", "Radha Kund", "Kusum Sarovar"] },
            { day: 3, title: "Mathura Visit", events: ["Krishna Janmabhoomi", "Dwarkadhish Temple", "Yamuna Aarti"] }
        ]
    },
    paris: {
        title: "The City of Love & Lights",
        cost: "₹1,50,000 - ₹2,50,000 (Ultra Premium)",
        weather: "Chilly (5°C to 15°C)",
        crowd: "Global Crowd (Always High)",
        hidden_spots: ["Promenade Plantée", "The Catacombs of Paris"],
        days: [
            { day: 1, title: "Iconic Landmarks", events: ["Eiffel Tower", "Seine River Cruise", "Louvre Museum"] },
            { day: 2, title: "Art & Culture", events: ["Montmartre", "Sacré-Cœur", "Notre-Dame Cathedral"] },
            { day: 3, title: "Luxury Shopping", events: ["Champs-Élysées", "Arc de Triomphe", "Disneyland Paris"] }
        ]
    },
    shimla: {
        title: "Queen of Hills - Shimla Heritage",
        cost: "₹8,000 - ₹12,000 (Budget Friendly)",
        weather: "Cold (5°C to 18°C)",
        crowd: "High (Family Favorite)",
        hidden_spots: ["Annandale Ground", "Chadwick Falls"],
        days: [
            { day: 1, title: "The Ridge & Mall Road", events: ["Christ Church", "Scandal Point", "Mall Road Walk"] },
            { day: 2, title: "Kufri Adventure", events: ["Himalayan Nature Park", "Horse Riding", "Adventure Park"] },
            { day: 3, title: "Spiritual Shimla", events: ["Jakhoo Temple", "Viceregal Lodge", "Lakkar Bazaar"] }
        ]
    },
    rishikesh: {
        title: "Yoga Capital & Adventure Hub",
        cost: "₹6,000 - ₹10,000 (Budget/Adventure)",
        weather: "Pleasant (18°C to 28°C)",
        crowd: "Medium - High (Youth Crowd)",
        hidden_spots: ["Secret Waterfall Trek", "Beatles Ashram"],
        days: [
            { day: 1, title: "Ganges & Aarti", events: ["Ram Jhula", "Laxman Jhula", "Triveni Ghat Evening Aarti"] },
            { day: 2, title: "Thrills & Spills", events: ["River Rafting", "Bungee Jumping", "Neer Garh Waterfall"] },
            { day: 3, title: "Peace & Meditation", events: ["Yoga Session", "Cafe Hopping", "Vashishta Gufa"] }
        ]
    },
    mumbai: {
        title: "The City of Dreams - Mumbai",
        cost: "₹15,000 - ₹25,000 (Mid-Range)",
        weather: "Humid (25°C to 33°C)",
        crowd: "Extremely High (Fast Life)",
        hidden_spots: ["Kanheri Caves", "Banganga Tank"],
        days: [
            { day: 1, title: "Heritage Walk", events: ["Gateway of India", "Marine Drive Sunset", "Colaba Causeway"] },
            { day: 2, title: "Bollywood & Caves", events: ["Elephanta Caves", "Bandra Bandstand", "Juhu Beach"] },
            { day: 3, title: "Spiritual & Modern", events: ["Siddhivinayak Temple", "Haji Ali Dargah", "Shopping at Hill Road"] }
        ]
    },
    dubai: {
        title: "Luxury & Desert Safari",
        cost: "₹70,000 - ₹1,20,000 (Premium)",
        weather: "Hot (25°C to 40°C)",
        crowd: "High (Global Tourists)",
        hidden_spots: ["Al Qudra Lakes", "The Farm at Al Barari"],
        days: [
            { day: 1, title: "Skyscrapers", events: ["Burj Khalifa", "Dubai Mall Aquarium", "Fountain Show"] },
            { day: 2, title: "Desert Life", events: ["Desert Safari", "Dune Bashing", "Arabic Dinner"] },
            { day: 3, title: "Modern Marina", events: ["Dubai Marina Walk", "Palm Jumeirah", "Global Village"] }
        ]
    },
    tokyo: {
        title: "Neon Lights & Tradition",
        cost: "₹1,80,000 - ₹2,50,000 (Ultra Premium)",
        weather: "Cool (10°C to 20°C)",
        crowd: "Very High (Techno-Hub)",
        hidden_spots: ["Shimokitazawa Neighborhood", "Gotokuji Cat Temple"],
        days: [
            { day: 1, title: "Tech & Anime", events: ["Shibuya Crossing", "Akihabara Tech City", "Harajuku Street"] },
            { day: 2, title: "Temples & Parks", events: ["Senso-ji Temple", "Ueno Park", "Tokyo Skytree"] },
            { day: 3, title: "Food Journey", events: ["Tsukiji Outer Market", "Shinjuku Golden Gai", "TeamLab Borderless"] }
        ]
    },
};



const bookingSchema = new mongoose.Schema({
    flightId: String,       // Flight ke liye (e.g., FL101)
    airline: String,        // Flight ke liye (e.g., IndiGo)
    flightNumber: String,
    from: String,
    to: String,
    departureTime: String,
    arrivalTime: String,
    travelDate: String,
    cabinClass: String,
    seatPreference: String,
    mealRequired: Boolean,
    mealType: String,
    passengerCount: Number,
    maleCount: Number,
    femaleCount: Number,
    specialRequest: String,
    title: String,          // Package ke liye (e.g., Maldives Honeymoon)
    userEmail: String,
    price: Number,
    passengerName: String,
    type: { type: String, default: 'flight' }, // 'flight' ya 'package' pehchanne ke liye
    date: { type: Date, default: Date.now }
});
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

const flightTemplates = [
    //delhi to amritsar
    { from: "DEL", to: "ATQ", airline: "SpiceJet", flightNumber: "SG 2951", basePrice: 3400, duration: "1h 05m" },
    { from: "DEL", to: "ATQ", airline: "Air India Express", flightNumber: "SG 2953", basePrice: 3600, duration: "1h 05m" },
    { from: "DEL", to: "ATQ", airline: "IndiGo", flightNumber: "SG 2954", basePrice: 3400, duration: "1h 05m" },
    //asr to  delhi
    { from: "ATQ", to: "DEL", airline: "Air India", flightNumber: "9I 612", basePrice: 3600, duration: "1h 20m" },
    { from: "ATQ", to: "DEL", airline: "IndiGo", flightNumber: "9I 622", basePrice: 3600, duration: "1h 30m" },
    { from: "ATQ", to: "DEL", airline: "Air India Express", flightNumber: "9I 630", basePrice: 3600, duration: "1h 10m" },
     // del to bombay
    { from: "DEL", to: "BOM", airline: "Air India Express", flightNumber: "AI 866", basePrice: 5400, duration: "2h 15m" },
    { from: "DEL", to: "BOM", airline: "Indigo", flightNumber: "AI 867", basePrice: 6700, duration: "2h 15m" },
    { from: "DEL", to: "BOM", airline: "SpiceJet", flightNumber: "AI 878", basePrice: 6928, duration: "2h 15m" },
    //bom to delhi
    { from: "BOM", to: "DEL", airline: "IndiGo", flightNumber: "AI 899", basePrice: 6928, duration: "2h 15m" },
    { from: "DEL", to: "BOM", airline: "Air India", flightNumber: "AI 900", basePrice: 6928, duration: "2h 15m" },
    //delhi to goa
    { from: "DEL", to: "GOI", airline: "IndiGo", flightNumber: "6E 6273", basePrice: 6200, duration: "2h 35m" },
    //delhi to bengaluru
    { from: "DEL", to: "BLR", airline: "Akasa Air", flightNumber: "UK 819", basePrice: 8738, duration: "3h 10m" },
    { from: "DEL", to: "BLR", airline: "SpiceJet", flightNumber: "6E 6278", basePrice: 8800, duration: "2h 35m" },
    { from: "DEL", to: "BLR", airline: "Air India Express", flightNumber: "6E 6178", basePrice: 8900, duration: "2h 55m" },
    //bengaluru to delhi
    { from: "BLR", to: "DEL", airline: "Air India", flightNumber: "AI 504", basePrice: 13000, duration: "2h 45m" },
    { from: "BLR", to: "DEL", airline: "IndiGo", flightNumber: "AI 509", basePrice: 14056, duration: "3h" },
    //Bombay to goi (goa)
    { from: "BOM", to: "GOI", airline: "IndiGo", flightNumber: "6E 5129", basePrice: 3100, duration: "1h 10m" },
    { from: "BOM", to: "GOI", airline: "IndiGo", flightNumber: "6E 5179", basePrice: 3600, duration: "1h 15m" },
    { from: "BOM", to: "GOI", airline: "Air India Express", flightNumber: "6E 5029", basePrice: 3100, duration: "1h 20m" },
    //bombay to benglauru
    { from: "BOM", to: "BLR", airline: "Air India Express", flightNumber: "IX 2375", basePrice: 5400, duration: "1h 45m" },
    { from: "BOM", to: "BLR", airline: "Akasa Air", flightNumber: "IX 2475", basePrice: 3900, duration: "1h 50m" },
    { from: "BOM", to: "BLR", airline: "SpiceJet", flightNumber: "IX 2775", basePrice: 4970, duration: "1h 55m" },
    //bengaluru to goa
    { from: "BLR", to: "GOI", airline: "Air India Express", flightNumber: "S5 124", basePrice: 3300, duration: "1h 20m" },
    { from: "BLR", to: "GOI", airline: "IndiGo", flightNumber: "S5 164", basePrice: 3800, duration: "1h 15m" },
    //
    { from: "GOI", to: "DEL", airline: "Air India Express", flightNumber: "UK 848", basePrice: 8900, duration: "2h 45m" },
    { from: "GOI", to: "DEL", airline: "IndiGo", flightNumber: "UK 800", basePrice: 6400, duration: "2h 25m" },
    //jaipur to del
    { from: "JAI", to: "DEL", airline: "IndiGo", flightNumber: "6E 7467", basePrice: 2966, duration: "1h 00m" },
    { from: "JAI", to: "DEL", airline: "Air India", flightNumber: "6E 7067", basePrice: 2800, duration: "50m" },
    { from: "JAI", to: "DEL", airline: "IndiGo", flightNumber: "6E 7447", basePrice: 2800, duration: "1h 05m" },
    //del to jai
    { from: "DEL", to: "JAI", airline: "Air India", flightNumber: "IX 1953", basePrice: 3400, duration: "1h 05m" },
    { from: "DEL", to: "JAI", airline: "IndiGo", flightNumber: "IX 1943", basePrice: 4500, duration: "50m" }
];

const departureWindows = [
    { departure: "06:20", arrivalOffset: "+2h" },
    { departure: "09:10", arrivalOffset: "+2h" },
    { departure: "13:40", arrivalOffset: "+3h" },
    { departure: "17:55", arrivalOffset: "+2h" },
    { departure: "21:05", arrivalOffset: "+2h" }
];

const buildLiveLikeFlights = () => {
    const today = new Date();
    const flights = [];
    let counter = 101;

    for (let dayOffset = 0; dayOffset < 12; dayOffset++) {
        const d = new Date(today);
        d.setDate(today.getDate() + dayOffset);
        const travelDate = d.toISOString().split('T')[0];

        flightTemplates.forEach((template, idx) => {
            const window = departureWindows[(dayOffset + idx) % departureWindows.length];
            flights.push({
                id: `FL${counter++}`,
                ...template,
                departureTime: window.departure,
                arrivalTime: window.arrivalOffset,
                date: travelDate,
                seatsLeft: Math.max(4, 28 - ((dayOffset * 3 + idx) % 22)),
                price: template.basePrice + ((dayOffset + idx) % 4) * 350
            });
        });
    }

    return flights;
};


// 4. API ROUTES
// --------------------------------------------------

// A. Chat Route (AI + Manual Logic) --------
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ text: "Kuch likho bhai!" });

    const query = message.toLowerCase();
    const matchedCityKey = Object.keys(travelData).find(city => query.includes(city));

    if (matchedCityKey) {
        return res.json({ type: 'itinerary', data: travelData[matchedCityKey] });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Plan a trip for: "${message}". Respond strictly in JSON format with title, cost, weather, crowd, hidden_spots, and a 3-day itinerary. Format: { "title": "", "cost": "", "weather": "", "crowd": "", "hidden_spots": [], "days": [{ "day": 1, "title": "", "events": [] }] }`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, "").trim();
        res.json({ type: 'itinerary', data: JSON.parse(text) });
    } catch (e) {
        res.json({ type: 'text', text: "AI is busy, please try Manali, Goa or Amritsar!" });
    }
});

// B. Flight Search Route ----------------------
app.get('/api/flights', (req, res) => {
    const flights = buildLiveLikeFlights();
    const { from, to } = req.query;
    if (!from || !to) return res.json(flights);
    const filtered = flights.filter(f => f.from.toUpperCase() === from.toUpperCase() && f.to.toUpperCase() === to.toUpperCase());
    res.json(filtered);
});

// C. Final Booking POST Route - 
// app.post('/api/bookings', async (req, res) => {
//     try {
//         const newBooking = new Booking({
//             flightId: req.body.flightId || "N/A",
//             airline: req.body.airline || "N/A",
//             userEmail: req.body.userEmail || req.body.email,
//             price: req.body.price || 0,
//             passengerName: req.body.passengerName || "Simarp208"
//         });
//         await newBooking.save();
//         return res.status(201).json({ success: true, message: "Booking Successful!", booking: newBooking });
//     } catch (error) {
//         return res.status(200).json({ success: true, message: "Demo Booking Successful (Local)!" });
//     }
// });
app.post('/api/bookings', async (req, res) => {
    try {
        const passengerCount = Number(req.body.passengerCount || 1);
        const maleCount = Number(req.body.maleCount || 0);
        const femaleCount = Number(req.body.femaleCount || 0);

        if (passengerCount > 0 && maleCount + femaleCount > 0 && maleCount + femaleCount !== passengerCount) {
            return res.status(400).json({
                success: false,
                message: "Male + Female passenger count must match total passengers."
            });
        }

        const newBooking = new Booking({
            flightId: req.body.flightId || "PKG", // Agar package hai toh PKG likha aayega
            airline: req.body.airline || "",
            flightNumber: req.body.flightNumber || "",
            from: req.body.from || "",
            to: req.body.to || "",
            departureTime: req.body.departureTime || "",
            arrivalTime: req.body.arrivalTime || "",
            travelDate: req.body.travelDate || "",
            cabinClass: req.body.cabinClass || "Economy",
            seatPreference: req.body.seatPreference || "Any",
            mealRequired: Boolean(req.body.mealRequired),
            mealType: req.body.mealType || "",
            passengerCount,
            maleCount,
            femaleCount,
            specialRequest: req.body.specialRequest || "",
            title: req.body.title || "",          // Package ka naam
            userEmail: req.body.userEmail,
            price: req.body.price,
            passengerName: req.body.passengerName,
            type: req.body.type || 'flight'      // Flight ya Package save hoga
        });

        await newBooking.save();
        res.status(201).json({ success: true, message: "Booking Successful!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Booking failed." });
    }
});

//D. Rebook logic ------
app.post('/api/ai-rebook', async (req, res) => {
    const { city } = req.body;
    const targetCity = city ? city.toUpperCase() : "";

    try {
        // AGENTIC LOGIC: Agar Goa hai toh hum zabardasti Alert dikhayenge Demo ke liye
        if (targetCity === "GOA" || targetCity === "GOI") {
            return res.json({
                status: "⚠️ FLIGHT CANCELLATION ALERT",
                reason: `Heavy monsoon and storm detected in ${city}. Safety protocols initiated.`,
                agentAction: "I have autonomously fetched the best alternative flights for you.",
                alternatives: [
                    { airline: "Air India (Next Day)", price: "₹4,200", status: "Available" },
                    { airline: "Vistara (Evening)", price: "₹5,800", status: "Available" }
                ]
            });
        }

        // Baki cities ke liye normal AI decision
        res.json({ status: "Clear", message: "Weather is fine." });
    } catch (e) {
        res.json({ status: "Error", message: "AI Agent currently offline." });
    }
});

// E. Dashboard Route
app.get('/api/bookings/:email', async (req, res) => {
    try {
        const bookings = await Booking.find({ userEmail: req.params.email });
        res.json(bookings);
    } catch (error) {
        res.json([]);
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));