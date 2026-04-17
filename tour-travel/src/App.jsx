


import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from "jspdf"; 

// ==========================================
// ICONS--
const Icons = {
  Menu: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>,
  Close: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>,
  Sparkles: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2.286 6.857L22 12l-6.714 2.143L13 21l-2.286-6.857L4 12l6.714-2.143L13 3z"></path></svg>,
  Send: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>,
  MapPin: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
  Wallet: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>,
  Plane: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>,
  Check: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>,
  User: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>,
  Ticket: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>,
  Alert: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
};

const pageVariants = { initial: { opacity: 0, y: 15 }, in: { opacity: 1, y: 0, transition: { duration: 0.5 } }, out: { opacity: 0, y: -15 } };

// ==========================================
// DATA 
const toursData = [
  { title: 'Bali Tropical Escape', price: '45,000', days: 6, desc: 'Experience serene beaches and rich culture.', image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: false },
  { title: 'Swiss Alps Wonderland', price: '1,25,000', days: 7, desc: 'Breathtaking mountain views and ski resorts.', image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: true },
  { title: 'Dubai Desert Safari', price: '55,000', days: 5, desc: 'Luxury shopping and thrilling adventures.', image: 'https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: false },
  { title: 'Japan Sakura Trail', price: '1,35,000', days: 8, desc: 'Cherry blossom routes, temples, and Tokyo nightlife.', image: 'https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: false },
  { title: 'Iceland Northern Lights', price: '1,60,000', days: 7, desc: 'Glaciers, black sand beaches, and aurora nights.', image: 'https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: true },
  { title: 'Thailand Island Hopper', price: '62,000', days: 6, desc: 'Phi Phi islands, beaches, and vibrant local markets.', image: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: false }
];

const packagesData = [
  { title: 'Kerala Backwaters', price: '28,000', days: 4, desc: 'Tranquil houseboats and lush landscapes.', image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: false },
  { title: 'Maldives Honeymoon', price: '1,50,000', days: 5, desc: 'Private overwater villas with clear waters.', image: 'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: true },
  { title: 'Paris Romance', price: '95,000', days: 6, desc: 'Eiffel tower views and sunset river cruises.', image: 'https://images.pexels.com/photos/161814/paris-eiffel-tower-architecture-night-161814.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: false },
  { title: 'Andaman Beach Bliss', price: '48,000', days: 5, desc: 'Crystal-clear water, scuba dives, and island sunsets.', image: 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: false },
  { title: 'Ladakh Adventure Circuit', price: '58,000', days: 7, desc: 'High-altitude lakes, monasteries, and rugged roads.', image: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: true },
  { title: 'Udaipur Royal Retreat', price: '36,000', days: 4, desc: 'Lake views, palace stays, and heritage experiences.', image: 'https://images.pexels.com/photos/1531660/pexels-photo-1531660.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: false }
];

const ShowcaseGrid = ({ items, onBook }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {items.map((pkg, idx) => (
        <motion.div whileHover={{ y: -5 }} key={idx} className={`relative overflow-hidden rounded-[2rem] flex flex-col border ${pkg.isFeatured ? 'bg-gradient-to-br from-[#008080] to-[#004d4d] text-white shadow-2xl border-none' : 'bg-white text-[#333] border-gray-100 shadow-md'}`}>
          <div className="h-48 w-full relative overflow-hidden"><img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />{pkg.isFeatured && <div className="absolute top-4 right-4 bg-[#F6BE1C] text-[#008080] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">BESTSELLER</div>}</div>
          <div className="p-8 flex-1 flex flex-col justify-between">
            <div>
              <p className={`font-extrabold text-xl ${pkg.isFeatured ? 'text-white' : 'text-gray-800'}`}>{pkg.title}</p>
              <p className="text-4xl font-extrabold mt-2 tracking-tight">₹{pkg.price}</p>
              <p className={`text-sm mt-3 leading-relaxed ${pkg.isFeatured ? 'text-green-100' : 'text-gray-500'}`}>{pkg.desc}</p>
              <div className="w-full h-px bg-current opacity-10 my-6"></div>
              <ul className='space-y-3 text-sm font-medium'>
                <li className="flex items-center gap-3"><div className={`p-1 rounded-full ${pkg.isFeatured ? 'bg-white/20' : 'bg-[#008080]/10 text-[#008080]'}`}><Icons.Check className="w-3 h-3"/></div> {pkg.days} Days / {pkg.days - 1} Nights</li>
              </ul>
            </div>
            <button onClick={() => onBook(pkg)} className={`mt-8 w-full py-4 rounded-xl font-bold text-sm shadow-lg transition-all ${pkg.isFeatured ? 'bg-[#F6BE1C] text-[#008080] hover:bg-white' : 'bg-gradient-to-r from-[#008080] to-[#006666] text-white'}`}>Book Now</button>
          </div>
        </motion.div>
    ))}
  </div>
);

// ==========================================
// PAGES 
const HomePage = () => {
  const navigate = useNavigate();
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants}>
      <section className="relative pt-32 lg:pt-40 px-5 lg:px-10 pb-20 bg-[#f8fafc]">
        <div className='max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center'>
          <div className='w-full lg:w-1/2 text-center lg:text-left z-10'>
              <h2 className="text-5xl lg:text-7xl font-extrabold text-[#008080] leading-[1.1] tracking-tight"><span className='block text-3xl lg:text-4xl font-medium tracking-wide font-[cursive] text-[#F6BE1C] mb-2'>Discover</span> The World <br/> With AI.</h2>
              <p className='text-gray-500 mt-6 text-base lg:text-lg max-w-md mx-auto lg:mx-0'>Experience the future of travel. Our Agentic AI plans, personalizes, and books your dream vacations instantly.</p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-10">
                <button onClick={() => navigate('/flights')} className="bg-[#008080] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:-translate-y-1 transition-all">Book Flights</button>
                <button onClick={() => navigate('/packages')} className="bg-white text-[#008080] px-8 py-4 rounded-full font-bold shadow-sm border border-gray-100 hover:shadow-md transition-all">View Packages</button>
              </div>
          </div>
          <div className="w-full lg:w-1/2 relative z-10">
              <div className="relative h-[400px] lg:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl"><img src="https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Traveler" className='w-full h-full object-cover hover:scale-105 transition-transform duration-700' /></div>
          </div>
        </div>
      </section>
      <section className="relative px-5 lg:px-10 py-24 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl lg:text-4xl font-extrabold text-center text-[#008080] mb-16">How AI <span className='text-[#F6BE1C] border-b-4 border-[#F6BE1C] pb-1'>Works</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[ 
                  {title: 'Chat with AI', desc: 'Tell us your dream trip.', icon: Icons.Sparkles}, 
                  {title: 'Instant Plan', desc: 'AI creates a custom itinerary.', icon: Icons.MapPin}, 
                  {title: 'Smart Booking', desc: 'Auto-books flights & hotels.', icon: Icons.Wallet}, 
                  {title: 'Enjoy Trip', desc: 'Travel stress-free.', icon: Icons.Plane} 
                ].map((item, idx) => (
                    <div key={idx} className='bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100'>
                        <div className="w-16 h-16 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080]"><item.icon className="w-8 h-8"/></div>
                        <p className="font-extrabold text-lg text-[#008080] mt-6">{item.title}</p>
                        <p className="text-sm text-gray-500 mt-2 font-medium">{item.desc}</p>
                    </div>
                ))}
            </div>
          </div>
      </section>
    </motion.div>
  );
};

// ==========================================
// FLIGHTS PAGE
const FlightsPage = ({ authUser, setIsAuthModalOpen }) => {
  const [flights, setFlights] = useState([]);
  const [search, setSearch] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: authUser?.name || '',
    email: authUser?.email || '',
    passengers: 1,
    maleCount: 1,
    femaleCount: 0,
    seatPreference: 'Window',
    mealRequired: 'yes',
    mealType: 'Veg',
    cabinClass: 'Economy',
    specialRequest: ''
  });
  const [bookingStatus, setBookingStatus] = useState('idle');
  const [weatherAlert, setWeatherAlert] = useState(null);
  const [paymentPopup, setPaymentPopup] = useState(null);

  const searchFlights = async (e) => {
    e.preventDefault(); setLoading(true); setHasSearched(true); setWeatherAlert(null);
    try {
      const response = await fetch(`http://localhost:5000/api/flights?from=${search.from}&to=${search.to}`);
      const result = await response.json(); 
      setFlights(result);
      const aiResponse = await fetch('http://localhost:5000/api/ai-rebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: search.to })
      });
      const aiData = await aiResponse.json();
      if (aiData.status && aiData.status.includes("ALERT")) {
        setWeatherAlert(aiData);
      }
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) { alert("Please Sign In first."); setIsAuthModalOpen(true); return; }

    const passengers = Number(bookingForm.passengers);
    const maleCount = Number(bookingForm.maleCount);
    const femaleCount = Number(bookingForm.femaleCount);

    if (passengers < 1 || passengers > 9) {
      alert("Passengers must be between 1 and 9.");
      return;
    }

    if ((maleCount + femaleCount) !== passengers) {
      alert("Male + Female count should match total passengers.");
      return;
    }

    setBookingStatus('processing');
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          flightId: selectedFlight.id, 
          airline: selectedFlight.airline, 
          flightNumber: selectedFlight.flightNumber,
          from: selectedFlight.from,
          to: selectedFlight.to,
          departureTime: selectedFlight.departureTime,
          arrivalTime: selectedFlight.arrivalTime,
          travelDate: selectedFlight.date,
          cabinClass: bookingForm.cabinClass,
          seatPreference: bookingForm.seatPreference,
          mealRequired: bookingForm.mealRequired === 'yes',
          mealType: bookingForm.mealRequired === 'yes' ? bookingForm.mealType : 'No meal',
          passengerCount: passengers,
          maleCount,
          femaleCount,
          specialRequest: bookingForm.specialRequest,
          passengerName: bookingForm.name, 
          userEmail: bookingForm.email, 
          price: selectedFlight.price * passengers,
          type: 'flight' 
        })
      });
      const data = await response.json();
      if(data.success || data.message.includes("Successful")) {
        setBookingStatus('success');
        setPaymentPopup({
          airline: selectedFlight.airline,
          route: `${selectedFlight.from} → ${selectedFlight.to}`,
          amount: selectedFlight.price * passengers
        });
        setTimeout(() => { setSelectedFlight(null); setBookingStatus('idle'); }, 1800);
        setTimeout(() => { setPaymentPopup(null); }, 3600);
      }
    } catch (error) { alert("Booking failed."); setBookingStatus('idle'); }
  };

  const openBookingModal = (flight) => {
    if (!authUser) { setIsAuthModalOpen(true); return; }
    setSelectedFlight(flight);
    setBookingForm({
      name: authUser.name,
      email: authUser.email,
      passengers: 1,
      maleCount: 1,
      femaleCount: 0,
      seatPreference: 'Window',
      mealRequired: 'yes',
      mealType: 'Veg',
      cabinClass: 'Economy',
      specialRequest: ''
    });
  };

  const handleRebook = (altFlight) => {
    setSelectedFlight({
        id: "RE-"+Math.floor(Math.random()*1000),
        airline: altFlight.airline,
        flightNumber: altFlight.airline.split(' ')[0] + " 9" + Math.floor(Math.random()*90),
        price: parseInt(altFlight.price.replace(/[^\d]/g, '')),
        from: search.from,
        to: search.to,
        date: new Date().toISOString().split('T')[0],
        departureTime: "18:30",
        arrivalTime: "+2h",
        seatsLeft: 7
    });
    setBookingForm({
      name: authUser?.name || '',
      email: authUser?.email || '',
      passengers: 1,
      maleCount: 1,
      femaleCount: 0,
      seatPreference: 'Window',
      mealRequired: 'yes',
      mealType: 'Veg',
      cabinClass: 'Economy',
      specialRequest: ''
    });
    setWeatherAlert(null);
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="pt-32 px-5 lg:px-10 pb-24 bg-[#f8fafc] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-extrabold text-[#008080] text-center mb-12">Book Your <span className="text-[#F6BE1C]">Flight</span></h2>
        
        {weatherAlert && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-red-500/10 border-2 border-red-500 p-6 rounded-[2rem] mb-8 shadow-xl">
             <div className="flex items-center gap-4 text-red-600 font-black uppercase tracking-widest text-sm mb-2">
                <Icons.Alert className="w-6 h-6 animate-pulse" /> {weatherAlert.status}
             </div>
             <p className="text-gray-700 font-bold mb-4">{weatherAlert.reason}</p>
             <div className="bg-white/50 p-4 rounded-xl border border-red-200">
                <p className="text-xs font-black text-[#008080] uppercase mb-3 italic">🤖 AI Agent Re-booking Action:</p>
                <div className="space-y-3">
                   {weatherAlert.alternatives?.map((alt, i) => (
                     <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                        <span className="text-sm font-bold text-gray-800">{alt.airline} • {alt.price}</span>
                        <button onClick={() => handleRebook(alt)} className="bg-[#F6BE1C] text-[#008080] px-4 py-1.5 rounded-lg text-[10px] font-black uppercase">Re-book Now</button>
                     </div>
                   ))}
                </div>
             </div>
          </motion.div>
        )}

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-12">
          <form onSubmit={searchFlights} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1"><label className="text-xs font-bold text-gray-500 uppercase ml-2">Leaving From</label><input type="text" required placeholder="DEL" value={search.from} onChange={(e) => setSearch({...search, from: e.target.value})} className="w-full mt-1 p-4 bg-[#f8fafc] border border-gray-200 rounded-xl outline-none focus:ring-2 ring-[#008080] font-bold uppercase" /></div>
            <div className="flex-1"><label className="text-xs font-bold text-gray-500 uppercase ml-2">Going To</label><input type="text" required placeholder="GOI" value={search.to} onChange={(e) => setSearch({...search, to: e.target.value})} className="w-full mt-1 p-4 bg-[#f8fafc] border border-gray-200 rounded-xl outline-none focus:ring-2 ring-[#008080] font-bold uppercase" /></div>
            <div className="flex items-end"><button type="submit" disabled={loading} className="w-full md:w-auto bg-[#F6BE1C] text-[#008080] px-10 py-4 rounded-xl font-extrabold shadow-md hover:-translate-y-1 transition-all disabled:opacity-50">{loading ? 'Searching...' : 'Search'}</button></div>
          </form>
        </div>
        <div className="space-y-6">
            {flights.map((flight) => (
              <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key={flight.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-6 w-full md:w-1/3">
                  <div className="w-14 h-14 bg-[#008080]/10 rounded-2xl flex items-center justify-center text-[#008080]"><Icons.Plane className="w-7 h-7" /></div>
                  <div>
                    <h4 className="font-extrabold text-xl text-gray-800">{flight.airline}</h4>
                    <p className="text-sm text-gray-500 font-medium">{flight.flightNumber} • Ref {flight.id}</p>
                    <p className="text-xs text-gray-400">{flight.date} • Seats left: {flight.seatsLeft}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full md:w-1/3 text-center px-4">
                  <div><p className="font-extrabold text-2xl text-[#008080]">{flight.from}</p></div>
                  <div className="flex-1 px-4 flex flex-col items-center"><p className="text-xs font-bold text-[#F6BE1C] mb-1">{flight.departureTime} → {flight.arrivalTime}</p><div className="w-full h-px bg-gray-300 relative"></div></div>
                  <div><p className="font-extrabold text-2xl text-[#008080]">{flight.to}</p></div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col md:items-end gap-3">
                  <p className="text-3xl font-extrabold text-gray-800">₹{flight.price}</p>
                  <button onClick={() => openBookingModal(flight)} className="bg-[#008080] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg w-full md:w-auto">Select Flight</button>
                </div>
              </motion.div>
            ))}
            {hasSearched && flights.length === 0 && !loading && <div className="text-center text-gray-500 font-bold p-10">No flights found. Try DEL to GOI.</div>}
        </div>
      </div>

      <AnimatePresence>
        {paymentPopup && (
          <motion.div
            initial={{ opacity: 0, y: -70, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[70]"
          >
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-2xl shadow-2xl border border-white/20 min-w-[320px]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mt-0.5"><Icons.Check className="w-5 h-5" /></div>
                <div>
                  <p className="font-black text-sm tracking-wider uppercase">Payment Successful</p>
                  <p className="text-sm text-emerald-50">{paymentPopup.airline} • {paymentPopup.route}</p>
                  <p className="text-xs text-emerald-100 mt-1">Total paid: ₹{paymentPopup.amount}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedFlight && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#004d4d]/60 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto">
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="bg-white rounded-[2.5rem] p-6 md:p-8 w-full max-w-md max-h-[90vh] shadow-2xl relative overflow-y-auto">
              <button onClick={() => setSelectedFlight(null)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500"><Icons.Close className="w-6 h-6"/></button>
              {bookingStatus === 'success' ? (
                <div className="text-center py-10"><div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><Icons.Check className="w-10 h-10"/></div><h3 className="text-2xl font-extrabold text-[#008080] mb-2">Booking Confirmed!</h3><p className="text-gray-500 font-medium">Ticket sent to {bookingForm.email}</p></div>
              ) : (
                <form onSubmit={handleBookSubmit} className="space-y-4 pb-2">
                  <h3 className="text-2xl font-extrabold text-[#008080] mb-6">Complete Booking</h3>
                  <div className="bg-[#f8fafc] p-4 rounded-xl mb-6 border border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{selectedFlight.from} → {selectedFlight.to}</p>
                      <p className="text-xs text-gray-500">{selectedFlight.airline} • {selectedFlight.flightNumber}</p>
                      <p className="text-xs text-gray-400">{selectedFlight.date} • {selectedFlight.departureTime}</p>
                    </div>
                    <p className="text-lg font-extrabold text-[#008080]">₹{selectedFlight.price}</p>
                  </div>
                  <div><label className="text-xs font-bold text-gray-500 ml-1">Primary Passenger</label><input type="text" required value={bookingForm.name} onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })} className="w-full mt-1 p-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium"/></div>
                  <div><label className="text-xs font-bold text-gray-500 ml-1">Email</label><input type="email" required value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} className="w-full mt-1 p-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium"/></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><label className="text-xs font-bold text-gray-500 ml-1">Passengers</label><input min="1" max="9" type="number" required value={bookingForm.passengers} onChange={(e) => setBookingForm({ ...bookingForm, passengers: e.target.value })} className="w-full mt-1 p-3 bg-white border border-gray-200 rounded-xl"/></div>
                    <div><label className="text-xs font-bold text-gray-500 ml-1">Male</label><input min="0" type="number" required value={bookingForm.maleCount} onChange={(e) => setBookingForm({ ...bookingForm, maleCount: e.target.value })} className="w-full mt-1 p-3 bg-white border border-gray-200 rounded-xl"/></div>
                    <div><label className="text-xs font-bold text-gray-500 ml-1">Female</label><input min="0" type="number" required value={bookingForm.femaleCount} onChange={(e) => setBookingForm({ ...bookingForm, femaleCount: e.target.value })} className="w-full mt-1 p-3 bg-white border border-gray-200 rounded-xl"/></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-bold text-gray-500 ml-1">Cabin</label><select value={bookingForm.cabinClass} onChange={(e) => setBookingForm({ ...bookingForm, cabinClass: e.target.value })} className="w-full mt-1 p-3 bg-white border border-gray-200 rounded-xl"><option>Economy</option><option>Premium Economy</option><option>Business</option></select></div>
                    <div><label className="text-xs font-bold text-gray-500 ml-1">Seat Preference</label><select value={bookingForm.seatPreference} onChange={(e) => setBookingForm({ ...bookingForm, seatPreference: e.target.value })} className="w-full mt-1 p-3 bg-white border border-gray-200 rounded-xl"><option>Window</option><option>Aisle</option><option>Middle</option><option>Any</option></select></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-bold text-gray-500 ml-1">Meal Required?</label><select value={bookingForm.mealRequired} onChange={(e) => setBookingForm({ ...bookingForm, mealRequired: e.target.value })} className="w-full mt-1 p-3 bg-white border border-gray-200 rounded-xl"><option value="yes">Yes</option><option value="no">No</option></select></div>
                    <div><label className="text-xs font-bold text-gray-500 ml-1">Meal Type</label><select disabled={bookingForm.mealRequired === 'no'} value={bookingForm.mealType} onChange={(e) => setBookingForm({ ...bookingForm, mealType: e.target.value })} className="w-full mt-1 p-3 bg-white border border-gray-200 rounded-xl disabled:bg-gray-100"><option>Veg</option><option>Non-Veg</option><option>Jain</option><option>Vegan</option></select></div>
                  </div>
                  <div><label className="text-xs font-bold text-gray-500 ml-1">Special Request (optional)</label><textarea value={bookingForm.specialRequest} onChange={(e) => setBookingForm({ ...bookingForm, specialRequest: e.target.value })} rows={2} placeholder="Wheelchair, infant, medical support etc." className="w-full mt-1 p-3 bg-white border border-gray-200 rounded-xl resize-none" /></div>
                  <div className="bg-[#008080]/5 border border-[#008080]/20 rounded-xl px-4 py-3 text-sm font-bold text-[#006666]">
                    Estimated total: ₹{selectedFlight.price * Number(bookingForm.passengers || 1)}
                  </div>
                  <button type="submit" disabled={bookingStatus === 'processing'} className="w-full mt-4 bg-[#F6BE1C] text-[#008080] py-4 rounded-xl font-extrabold shadow-md hover:-translate-y-1 transition-all disabled:opacity-50">{bookingStatus === 'processing' ? 'Processing Payment...' : 'Pay & Confirm'}</button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ==========================================
//   DASHBOARD 
const MyBookingsPage = () => {
  const [email, setEmail] = useState('');
  const [data, setData] = useState({ bookings: [], totalSpent: 0, count: 0 });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${email}`);
      const result = await res.json();
      if (Array.isArray(result)) {
        const total = result.reduce((acc, curr) => acc + curr.price, 0);
        setData({ bookings: result, totalSpent: total, count: result.length });
      } else {
        setData({ bookings: [], totalSpent: 0, count: 0 });
        alert("No bookings found.");
      }
    } catch (err) { alert("Server error!"); }
    setLoading(false);
  };

  const generatePDF = (b) => {
    const doc = new jsPDF();
    const bookingRef = b._id.substring(0, 8).toUpperCase();
    
    // Header with airline branding
    doc.setFillColor(0, 128, 128);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("✈ TRAVELOO", 15, 15);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("E-TICKET | Official Air Travel Document", 15, 22);
    
    // Ticket
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(`REF: ${bookingRef}`, 195, 15, { align: "right" });
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("TICKET VALIDITY: 1 YEAR", 195, 22, { align: "right" });
    
    // Main content area
    let yPos = 45;
    
    // Passenger name - prominent
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 128);
    doc.text(`PASSENGER: ${b.passengerName || 'Traveler'}`, 15, yPos);
    yPos += 8;
    
    // Booking status badge
    doc.setFillColor(76, 175, 80);
    doc.rect(15, yPos - 5, 30, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("✓ CONFIRMED", 30, yPos - 1, { align: "center" });
    
    yPos += 10;
    
    // Flight information - Big bold section
    doc.setDrawColor(0, 128, 128);
    doc.setLineWidth(1);
    doc.rect(15, yPos, 180, 45, 'S');
    
    // Departure city
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 128);
    doc.text(`${b.from || 'DEP'}`, 25, yPos + 12);
    
    // Arrow and flight info in middle
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text(`✈ ${b.airline || 'AIRLINE'}`, 95, yPos + 8);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`Flight: ${b.flightNumber || 'N/A'}`, 95, yPos + 15);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Duration: ~${Math.round((new Date(`2024-01-01 ${b.arrivalTime || '00:00'}`) - new Date(`2024-01-01 ${b.departureTime || '00:00'}`)) / (1000 * 60))}min`, 95, yPos + 21);
    
    // Arrival city
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 128);
    doc.text(`${b.to || 'ARR'}`, 165, yPos + 12);
    
    // Times below
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`${b.departureTime || '--:--'}`, 25, yPos + 26);
    doc.text(`${b.arrivalTime || '--:--'}`, 165, yPos + 26);
    
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("DEPARTURE", 25, yPos + 32);
    doc.text("ARRIVAL", 165, yPos + 32);
    
    // Travel date
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(`DATE: ${b.travelDate || 'TBD'}`, 25, yPos + 40);
    
    yPos += 52;
    
    // Passenger details grid
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos, 180, 30, 'F');
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text("PASSENGER COUNT", 20, yPos + 6);
    doc.text("CABIN CLASS", 70, yPos + 6);
    doc.text("SEAT PREFERENCE", 130, yPos + 6);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 128);
    doc.text(`${b.passengerCount || 1}`, 20, yPos + 16);
    doc.text(`${b.cabinClass || 'Economy'}`, 70, yPos + 16);
    doc.text(`${b.seatPreference || 'Window'}`, 130, yPos + 16);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("PERSONS", 20, yPos + 22);
    doc.text("CLASS", 70, yPos + 22);
    doc.text("PREFERENCE", 130, yPos + 22);
    
    yPos += 35;
    
    // Meal and special requests
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text("MEAL SERVICE", 20, yPos + 3);
    doc.text("SPECIAL REQUESTS", 100, yPos + 3);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`${b.mealRequired ? b.mealType : 'No Meal'}`, 20, yPos + 10);
    doc.text(b.specialRequest ? b.specialRequest.substring(0, 40) : 'None', 100, yPos + 10);
    
    yPos += 18;
    
    // Pricing section - HIGHLIGHTED
    doc.setFillColor(255, 235, 59);
    doc.rect(15, yPos, 180, 35, 'F');
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("BASE FARE", 20, yPos + 8);
    doc.text("NO. OF PASSENGERS", 95, yPos + 8);
    doc.text("TOTAL AMOUNT", 160, yPos + 8);
    
    const pricePerPax = Math.round(b.price / (b.passengerCount || 1));
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 128);
    doc.text(`₹${pricePerPax}`, 20, yPos + 20);
    doc.text(`${b.passengerCount || 1}`, 105, yPos + 20);
    doc.text(`₹${b.price}`, 165, yPos + 20);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("PER PERSON", 20, yPos + 26);
    doc.text("TRAVELERS", 105, yPos + 26);
    
    yPos += 40;
    
    // Dashed line separator (like real tickets)
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(15, yPos, 195, yPos);
    
    yPos += 8;
    
    // Important information
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 0, 0);
    doc.text("⚠ IMPORTANT:", 15, yPos);
    yPos += 4;
    
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("• Present this e-ticket along with valid ID at check-in", 15, yPos);
    yPos += 3.5;
    doc.text("• Check-in opens 24 hours before departure", 15, yPos);
    yPos += 3.5;
    doc.text("• Baggage policy: 1 checked bag (20kg) + 1 carry-on (7kg)", 15, yPos);
    yPos += 3.5;
    doc.text("• For modifications/cancellations, visit traveloo.com or contact support", 15, yPos);
    
    yPos += 8;
    
    // Footer
    doc.setDrawColor(0, 128, 128);
    doc.setLineWidth(0.5);
    doc.line(15, yPos, 195, yPos);
    
    yPos += 5;
    
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 128);
    doc.text("CONFIRMATION EMAIL: " + (b.userEmail || 'email@traveloo.com'), 15, yPos);
    
    yPos += 4;
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("Traveloo AI - Your Personal Travel Companion | www.traveloo.com", 105, yPos, { align: "center" });
    
    doc.save(`TRAVELOO_${b.airline}_${bookingRef}.pdf`);
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="pt-32 px-10 min-h-screen bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-black text-[#008080] text-center mb-10">My <span className="text-[#F6BE1C]">Dashboard</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center font-bold">₹</div>
              <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Spent</p><h3 className="text-3xl font-black text-[#008080]">₹{data.totalSpent}</h3></div>
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center font-bold">✈</div>
              <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Trips</p><h3 className="text-3xl font-black text-[#008080]">{data.count}</h3></div>
           </div>
        </div>
        <form onSubmit={handleSearch} className="flex gap-4 mb-16 max-w-xl mx-auto bg-white p-2 rounded-3xl shadow-sm border border-gray-100">
          <input type="email" placeholder="Enter email" className="flex-1 p-4 bg-transparent outline-none font-bold text-[#008080]" required onChange={e => setEmail(e.target.value)} />
          <button className="bg-[#008080] text-white px-10 rounded-2xl font-black uppercase text-xs">{loading ? '...' : 'Fetch'}</button>
        </form>
        <div className="space-y-6 pb-20">
          {data.bookings.map((b) => (
            <motion.div key={b._id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row overflow-hidden">
               <div className={`${b.type === 'package' ? 'bg-[#F6BE1C] text-[#008080]' : 'bg-[#008080] text-white'} p-10 flex flex-col justify-center items-center md:w-48 text-center font-black uppercase tracking-widest`}>
                {b.type === 'package' ? 'PACKAGE' : (b.flightId || 'FLIGHT')}
               </div>
               <div className="p-10 flex-1 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                 <div>
                    <h4 className="text-2xl font-black text-[#008080]">{b.airline || b.title}</h4>
                    <p className="text-gray-400 font-bold">{b.userEmail}</p>
                    <span className="text-[10px] bg-gray-100 px-3 py-1 rounded-full font-bold uppercase mt-2 inline-block">
                       {b.type === 'package' ? '🎁 Holiday Deal' : '✈️ Air Ticket'}
                    </span>
                 </div>
                 <div className="text-center md:text-right flex flex-col items-center md:items-end gap-3">
                    <p className="text-2xl font-black text-gray-800">₹{b.price}</p>
                    <button onClick={() => generatePDF(b)} className="text-[10px] bg-[#F6BE1C] text-[#008080] px-4 py-2 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform">Download Ticket</button>
                 </div>
               </div>
            </motion.div>
          ))}
          {data.bookings.length === 0 && !loading && <div className="text-center text-gray-400 font-bold">No bookings found for this email.</div>}
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// MAIN APP--
export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hi! I am the Traveloo Agent. Ask me to plan a trip to Goa.' }]);
  const [input, setInput] = useState('');
  const [currentItinerary, setCurrentItinerary] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [authUser, setAuthUser] = useState(null); 
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });

  const handlePackageBooking = async (pkg) => {
    if (!authUser) { setIsAuthModalOpen(true); return; }
    try {
        const response = await fetch('http://localhost:5000/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: pkg.title,
                price: parseInt(pkg.price.replace(/,/g, '')),
                userEmail: authUser.email,
                passengerName: authUser.name,
                type: 'package'
            })
        });
        const data = await response.json();
        if (data.success || data.message.includes("Successful")) {
            alert(`🎉 ${pkg.title} Booked Successfully!`);
        }
    } catch (error) { alert("Booking failed."); }
  };

  const handleSend = async (e) => {
    e.preventDefault(); if (!input.trim() || isThinking) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const userQuery = input; setInput(''); setIsThinking(true); setCurrentItinerary(null);
    try {
      const response = await fetch('http://localhost:5000/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userQuery }) });
      const data = await response.json();
      if (data.type === 'itinerary') { setMessages(prev => [...prev, { role: 'ai', text: `Perfect! Check out your itinerary.` }]); setCurrentItinerary(data.data); } 
      else { setMessages(prev => [...prev, { role: 'ai', text: data.text }]); }
    } catch (error) { setMessages(prev => [...prev, { role: 'ai', text: "Sorry, servers are down." }]); } finally { setIsThinking(false); }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    let displayName = authMode === 'signup' && authForm.name ? authForm.name : authForm.email.split('@')[0];
    displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    setAuthUser({ name: displayName, email: authForm.email });
    setIsAuthModalOpen(false); setAuthForm({ name: '', email: '', password: '' });
  };

  return (
    <Router>
      <div className="flex min-h-screen w-full bg-[#f8fafc] font-sans text-[#333] overflow-x-hidden relative">
        <div className="w-full lg:w-2/3 h-screen overflow-y-auto relative z-0 flex flex-col scroll-smooth">
          <nav className="fixed top-0 left-0 w-full lg:w-2/3 bg-white/70 backdrop-blur-xl z-40 px-6 lg:px-12 py-5 flex justify-between items-center border-b border-white/40 shadow-sm">
            <Link to="/" className="text-2xl lg:text-3xl font-extrabold text-[#008080] tracking-tight">Travel<span className='text-[#F6BE1C]'>oo</span></Link>
            <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-600">
              <Link to="/" className='hover:text-[#008080] transition-colors'>Home</Link>
              <Link to="/tours" className='hover:text-[#008080] transition-colors'>Tours</Link>
              <Link to="/packages" className='hover:text-[#008080] transition-colors'>Packages</Link>
              <Link to="/flights" className='hover:text-[#008080] transition-colors'>Flights</Link>
              {authUser && <Link to="/my-bookings" className='hover:text-[#008080] transition-colors text-[#F6BE1C]'>My Bookings</Link>}
            </div>
            {authUser ? (<div className="hidden lg:flex items-center gap-2 font-extrabold text-[#008080] bg-[#008080]/10 px-4 py-2 rounded-full"><Icons.User className="w-5 h-5" /> Hi, {authUser.name}</div>) : (<button onClick={() => setIsAuthModalOpen(true)} className="hidden lg:block bg-[#111] text-white px-6 py-2.5 rounded-full font-bold text-sm">Sign In</button>)}
            <button className="lg:hidden text-[#008080]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <Icons.Close className="w-7 h-7"/> : <Icons.Menu className="w-7 h-7"/>}</button>
          </nav>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden fixed top-[72px] left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-gray-200 shadow-2xl z-40 overflow-hidden">
                <div className="flex flex-col px-8 py-6 gap-6 text-lg font-bold text-[#008080]">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                  <Link to="/tours" onClick={() => setIsMobileMenuOpen(false)}>Tours</Link>
                  <Link to="/flights" onClick={() => setIsMobileMenuOpen(false)}>Flights</Link>
                  {authUser && <Link to="/my-bookings" onClick={() => setIsMobileMenuOpen(false)}>My Bookings</Link>}
                  {authUser ? (<div className="flex items-center gap-2 mt-2"><Icons.User className="w-6 h-6"/> Hi, {authUser.name}</div>) : (<button onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }} className="bg-[#008080] text-white px-6 py-3.5 rounded-xl font-bold mt-2">Sign In</button>)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-grow relative">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tours" element={<div className="pt-32 px-10 pb-20 bg-[#f8fafc] min-h-screen"><ShowcaseGrid items={toursData} onBook={handlePackageBooking} /></div>} />
                <Route path="/packages" element={<div className="pt-32 px-10 pb-20 bg-[#f8fafc] min-h-screen"><ShowcaseGrid items={packagesData} onBook={handlePackageBooking} /></div>} />
                <Route path="/flights" element={<FlightsPage authUser={authUser} setIsAuthModalOpen={setIsAuthModalOpen} />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
              </Routes>
            </AnimatePresence>
          </div>

          <footer className="bg-[#004d4d] text-white py-12 px-6 lg:px-20 mt-auto rounded-t-[3rem] shadow-2xl relative z-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
              <div><h2 className="text-3xl font-extrabold mb-4">Travel<span className="text-[#F6BE1C]">oo</span></h2><p className="text-green-100/70 text-sm">Smarter travel with Agentic AI.</p></div>
              <div><h4 className="font-bold text-lg mb-6">Quick Links</h4><div className="flex flex-col gap-3 text-sm text-green-100/60"><Link to="/tours">Tours</Link><Link to="/packages">Packages</Link><Link to="/flights">Flights</Link></div></div>
              <div><h4 className="font-bold text-lg mb-6">Contact</h4><p className="text-sm text-green-100/60">Email: hello@traveloo.ai</p><p className="text-sm text-green-100/60 mt-1">Phone: +91 98765 43210</p></div>
            </div>
          </footer>
        </div>

        <button onClick={() => setIsAgentOpen(true)} className="fixed bottom-6 right-6 w-16 h-16 bg-[#F6BE1C] text-[#008080] rounded-full shadow-2xl flex items-center justify-center z-[55] hover:scale-110 transition-transform"><Icons.Sparkles className="w-7 h-7"/></button>
        <div className={`fixed inset-y-0 right-0 z-[60] bg-[#008080] p-6 lg:p-8 flex flex-col text-white shadow-[-20px_0_50px_rgba(0,0,0,0.15)] transition-transform duration-500 w-full sm:w-[450px] lg:w-1/3 ${isAgentOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <button onClick={() => setIsAgentOpen(false)} className="absolute top-6 right-6 text-white bg-white/10 p-2.5 rounded-full"><Icons.Close className="w-5 h-5"/></button>
          <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6"><div className="w-12 h-12 rounded-2xl bg-[#F6BE1C] flex items-center justify-center text-[#008080] shadow-lg"><Icons.Sparkles className="w-7 h-7" /></div><div><h1 className="text-2xl font-extrabold">AI Assistant</h1></div></div>
          <div className="flex-1 overflow-y-auto space-y-6 mb-4 custom-scrollbar">
            {!currentItinerary ? ( <div className='space-y-5'>{messages.map((msg, idx) => ( <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`p-4 rounded-3xl text-sm ${msg.role === 'user' ? 'bg-[#F6BE1C] text-[#008080] rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm'}`}>{msg.text}</div></div> ))}{isThinking && <div className="text-xs font-bold text-green-200 animate-pulse">Reasoning...</div>}</div> ) : (
              <div className='space-y-6'><div className="bg-white/10 p-6 rounded-[2rem] border border-white/10 shadow-xl"><h2 className="text-2xl font-extrabold mb-1">{currentItinerary.title}</h2>
              <p className="text-md font-medium text-green-100 mb-1">💰 {currentItinerary.cost}</p>
              <p className="text-xs text-white/70 mb-1">🌤️ Weather: {currentItinerary.weather}</p>
              <p className="text-xs text-white/70 mb-1">👨‍👩‍👧‍👦 Crowd: {currentItinerary.crowd}</p>
              <div className="mb-4">
                  <span className="text-[10px] font-bold text-[#F6BE1C] uppercase">Hidden Gems:</span>
                  <p className="text-xs italic text-white/80">{currentItinerary.hidden_spots?.join(", ")}</p>
              </div>
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">{currentItinerary.days?.map((dayObj, index) => ( <div key={index} className="bg-[#004d4d]/50 p-4 rounded-2xl border border-white/5 shadow-inner"><h3 className="font-extrabold text-[#F6BE1C] mb-2 text-md">Day {dayObj.day}: <span className="text-white font-medium">{dayObj.title}</span></h3><ul className="space-y-2">{dayObj.events?.map((event, eIdx) => (<li key={eIdx} className="text-xs text-green-50 flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#F6BE1C] mt-1.5 shrink-0"></div>{event}</li>))}</ul></div> ))}</div></div>
                <button onClick={() => setCurrentItinerary(null)} className="w-full bg-[#F6BE1C] text-[#008080] font-extrabold py-4 rounded-2xl shadow-xl hover:bg-white transition-all uppercase tracking-widest text-xs">Start a new plan?</button>
              </div>
            )}
          </div>
          <form onSubmit={handleSend} className="relative mt-auto pt-4"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={isThinking || currentItinerary} placeholder="Plan my trip..." className="w-full p-6 rounded-2xl bg-white outline-none text-[#008080] shadow-xl" /><button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 mt-2 w-10 h-10 bg-[#008080] text-white rounded-xl flex items-center justify-center"><Icons.Send className="w-5 h-5"/></button></form>
        </div>

        <AnimatePresence>{isAuthModalOpen && ( <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#004d4d]/60 backdrop-blur-sm p-5"><motion.div initial={{scale:0.9}} animate={{scale:1}} className="bg-white rounded-[2.5rem] p-10 w-full max-sm shadow-2xl relative"><button onClick={() => setIsAuthModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500"><Icons.Close className="w-6 h-6"/></button><h3 className="text-3xl font-extrabold text-[#008080] text-center italic">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h3><form onSubmit={handleAuthSubmit} className="space-y-4">{authMode === 'signup' && ( <input type="text" required placeholder="Full Name" value={authForm.name} onChange={(e) => setAuthForm({...authForm, name: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" /> )}<input type="email" required placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" /><input type="password" required placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" /><button type="submit" className="w-full mt-6 bg-[#008080] text-white py-4 rounded-xl font-extrabold">{authMode === 'login' ? 'Sign In' : 'Sign Up'}</button></form><button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthForm({name:'', email:'', password:''}); }} className="w-full mt-6 text-[#F6BE1C] font-bold text-sm">Switch to {authMode === 'login' ? 'Sign Up' : 'Login'}</button></motion.div></div> )}</AnimatePresence>
      </div>
    </Router>
  );
}