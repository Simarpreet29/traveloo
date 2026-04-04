import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 1. MONGODB & AI SETUP
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/traveloo')
    .then(() => console.log('✅ MongoDB Connected!'))
    .catch(err => console.log('❌ MongoDB Error:', err));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. MANUAL DATABASE (Static Cache)
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

// 3. API ROUTE (Hybrid Logic)
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ text: "Bhai, kuch toh likho!" });

    const query = message.toLowerCase();

    // STEP 1: Check if city is in Manual Data
    const matchedCityKey = Object.keys(travelData).find(city => query.includes(city));

    if (matchedCityKey) {
        console.log("📍 Serving from Manual Data");
        return res.json({ type: 'itinerary', data: travelData[matchedCityKey] });
    }

    // STEP 2: If NOT in manual, call Gemini AI
    console.log("🤖 Calling Gemini AI for dynamic response...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `
            Plan a detailed 3-day trip for: "${message}". 
            Respond strictly in valid JSON format only. 
            Include title, cost (budget vs premium range), weather, crowd status, hidden_spots (at least 2), and a 3-day itinerary.
            Format: { "title": "", "cost": "", "weather": "", "crowd": "", "hidden_spots": [], "days": [{ "day": 1, "title": "", "events": [] }] }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, "").trim();
        
        const aiData = JSON.parse(text);
        res.json({ type: 'itinerary', data: aiData });

    } catch (error) {
        console.error("❌ Gemini Error:", error);
        res.json({ 
            type: 'text', 
            text: "wait a min!" 
        });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Hybrid Server running on port ${PORT}`));