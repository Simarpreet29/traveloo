
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from "jspdf"; //  PDF Library import ki

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
  Ticket: ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
};
const pageVariants = { initial: { opacity: 0, y: 15 }, in: { opacity: 1, y: 0, transition: { duration: 0.5 } }, out: { opacity: 0, y: -15 } };

// ==========================================
// DATA 

const toursData = [
  { title: 'Bali Tropical Escape', price: '45,000', days: 6, desc: 'Experience serene beaches and rich culture.', image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: false },
  { title: 'Swiss Alps Wonderland', price: '1,25,000', days: 7, desc: 'Breathtaking mountain views and ski resorts.', image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: true },
  { title: 'Dubai Desert Safari', price: '55,000', days: 5, desc: 'Luxury shopping and thrilling adventures.', image: 'https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: false }
];
const packagesData = [
  { title: 'Kerala Backwaters', price: '28,000', days: 4, desc: 'Tranquil houseboats and lush landscapes.', image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: false },
  { title: 'Maldives Honeymoon', price: '1,50,000', days: 5, desc: 'Private overwater villas with clear waters.', image: 'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: true },
  { title: 'Paris Romance', price: '95,000', days: 6, desc: 'Eiffel tower views and sunset river cruises.', image: 'https://images.pexels.com/photos/161814/paris-eiffel-tower-architecture-night-161814.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: false }
];
const ShowcaseGrid = ({ items }) => (
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
            <button className={`mt-8 w-full py-4 rounded-xl font-bold text-sm shadow-lg transition-all ${pkg.isFeatured ? 'bg-[#F6BE1C] text-[#008080] hover:bg-white' : 'bg-gradient-to-r from-[#008080] to-[#006666] text-white'}`}>View Details</button>
          </div>
        </motion.div>
    ))}
  </div>
);

// ==========================================
// PAGES 
// ==========================================
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

const ToursPage = () => ( <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="pt-32 px-5 lg:px-10 pb-24 bg-[#f8fafc] min-h-screen"><div className="max-w-7xl mx-auto"><div className="text-center mb-16"><h2 className="text-4xl lg:text-5xl font-extrabold text-[#008080] mb-4">Curated <span className="text-[#F6BE1C]">Global Tours</span></h2></div><ShowcaseGrid items={toursData} /></div></motion.div> );
const PackagesPage = () => ( <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="pt-32 px-5 lg:px-10 pb-24 bg-[#f8fafc] min-h-screen"><div className="max-w-7xl mx-auto"><h2 className="text-4xl lg:text-5xl font-extrabold text-[#008080] text-center mb-12">Special <span className="text-[#F6BE1C]">Packages</span></h2><ShowcaseGrid items={packagesData} /></div></motion.div> );

// ==========================================
// FLIGHTS PAGE

const FlightsPage = ({ authUser, setIsAuthModalOpen }) => {
  const [flights, setFlights] = useState([]);
  const [search, setSearch] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingForm, setBookingForm] = useState({ name: authUser?.name || '', email: authUser?.email || '' });
  const [bookingStatus, setBookingStatus] = useState('idle');

  const searchFlights = async (e) => {
    e.preventDefault(); setLoading(true); setHasSearched(true);
    try {
      const response = await fetch(`http://localhost:5000/api/flights?from=${search.from}&to=${search.to}`);
      const result = await response.json(); setFlights(result.data);
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) { alert("Please Sign In first."); setIsAuthModalOpen(true); return; }
    setBookingStatus('processing');
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flightId: selectedFlight.id, airline: selectedFlight.airline, userName: bookingForm.name, userEmail: bookingForm.email, price: selectedFlight.price })
      });
      const data = await response.json();
      if(data.success) {
        setBookingStatus('success');
        setTimeout(() => { setSelectedFlight(null); setBookingStatus('idle'); }, 3000);
      }
    } catch (error) { alert("Booking failed."); setBookingStatus('idle'); }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="pt-32 px-5 lg:px-10 pb-24 bg-[#f8fafc] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-extrabold text-[#008080] text-center mb-12">Book Your <span className="text-[#F6BE1C]">Flight</span></h2>
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
                  <div><h4 className="font-extrabold text-xl text-gray-800">{flight.airline}</h4><p className="text-sm text-gray-500 font-medium">Flight {flight.id}</p></div>
                </div>
                <div className="flex items-center justify-between w-full md:w-1/3 text-center px-4">
                  <div><p className="font-extrabold text-2xl text-[#008080]">{flight.depart}</p><p className="text-xs font-bold text-gray-400 mt-1">{flight.from}</p></div>
                  <div className="flex-1 px-4 flex flex-col items-center"><p className="text-xs font-bold text-[#F6BE1C] mb-1">{flight.duration}</p><div className="w-full h-px bg-gray-300 relative"></div></div>
                  <div><p className="font-extrabold text-2xl text-[#008080]">{flight.arrive}</p><p className="text-xs font-bold text-gray-400 mt-1">{flight.to}</p></div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col md:items-end gap-3">
                  <p className="text-3xl font-extrabold text-gray-800">₹{flight.price}</p>
                  <button onClick={() => { if(!authUser) { setIsAuthModalOpen(true); return; } setSelectedFlight(flight); setBookingForm({ name: authUser.name, email: authUser.email }); }} className="bg-[#008080] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg w-full md:w-auto">Select Flight</button>
                </div>
              </motion.div>
            ))}
            {hasSearched && flights.length === 0 && !loading && <div className="text-center text-gray-500 font-bold p-10">No flights found. Try DEL to GOI.</div>}
        </div>
      </div>

      <AnimatePresence>
        {selectedFlight && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center bg-[#004d4d]/60 backdrop-blur-sm p-5">
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setSelectedFlight(null)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500"><Icons.Close className="w-6 h-6"/></button>
              {bookingStatus === 'success' ? (
                <div className="text-center py-10"><div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><Icons.Check className="w-10 h-10"/></div><h3 className="text-2xl font-extrabold text-[#008080] mb-2">Booking Confirmed!</h3><p className="text-gray-500 font-medium">Ticket sent to {bookingForm.email}</p></div>
              ) : (
                <form onSubmit={handleBookSubmit} className="space-y-4">
                  <h3 className="text-2xl font-extrabold text-[#008080] mb-6">Complete Booking</h3>
                  <div className="bg-[#f8fafc] p-4 rounded-xl mb-6 border border-gray-100 flex justify-between items-center">
                    <div><p className="text-sm font-bold text-gray-800">{selectedFlight.from} → {selectedFlight.to}</p><p className="text-xs text-gray-500">{selectedFlight.airline}</p></div>
                    <p className="text-lg font-extrabold text-[#008080]">₹{selectedFlight.price}</p>
                  </div>
                  <div><label className="text-xs font-bold text-gray-500 ml-1">Passenger</label><input type="text" required value={bookingForm.name} readOnly className="w-full mt-1 p-3.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed"/></div>
                  <div><label className="text-xs font-bold text-gray-500 ml-1">Email</label><input type="email" required value={bookingForm.email} readOnly className="w-full mt-1 p-3.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed"/></div>
                  <button type="submit" disabled={bookingStatus === 'processing'} className="w-full mt-4 bg-[#F6BE1C] text-[#008080] py-4 rounded-xl font-extrabold shadow-md hover:-translate-y-1 transition-all disabled:opacity-50">{bookingStatus === 'processing' ? 'Processing...' : 'Pay & Confirm'}</button>
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
//   DASHBOARD  (WITH PDF)

const MyBookingsPage = () => {
  const [email, setEmail] = useState('');
  const [data, setData] = useState({ bookings: [], totalSpent: 0, count: 0 });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/my-bookings/${email}`);
      const result = await res.json();
      if (result.success) {
        setData({ bookings: result.data, totalSpent: result.totalSpent, count: result.count });
      } else {
        setData({ bookings: [], totalSpent: 0, count: 0 });
        alert("No bookings found.");
      }
    } catch (err) { alert("Server error!"); }
    setLoading(false);
  };

  //  PDF Generate karne ka function
  const generatePDF = (booking) => {
    const doc = new jsPDF();
    doc.setFillColor(0, 128, 128); // Teal header
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("TRAVELOO E-TICKET", 105, 25, { align: "center" });
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Passenger: ${booking.userName}`, 20, 60);
    doc.text(`Email: ${booking.userEmail}`, 20, 70);
    doc.line(20, 80, 190, 80);
    doc.setTextColor(0, 128, 128);
    doc.text("FLIGHT INFO", 20, 95);
    doc.setTextColor(0, 0, 0);
    doc.text(`Airline: ${booking.airline}`, 20, 110);
    doc.text(`Flight ID: ${booking.flightId}`, 20, 120);
    doc.text(`Price: INR ${booking.price}`, 20, 130);
    doc.text(`Booking Date: ${new Date(booking.bookingDate).toLocaleDateString()}`, 20, 140);
    doc.setFontSize(10);
    doc.text("Thank you for booking with Traveloo AI!", 105, 280, { align: "center" });
    doc.save(`Ticket_${booking.flightId}.pdf`);
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
          {data.bookings.map(b => (
            <motion.div key={b._id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row overflow-hidden">
               <div className="bg-[#008080] p-10 text-white flex flex-col justify-center items-center md:w-48 text-center font-black uppercase tracking-widest">{b.flightId}</div>
               <div className="p-10 flex-1 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                 <div><h4 className="text-3xl font-black text-[#008080]">{b.userName}</h4><p className="text-gray-400 font-bold">{b.userEmail}</p></div>
                 <div className="text-center md:text-right flex flex-col items-center md:items-end gap-3">
                    <p className="text-2xl font-black text-gray-800">₹{b.price}</p>
                    <button onClick={() => generatePDF(b)} className="text-[10px] bg-[#F6BE1C] text-[#008080] px-4 py-2 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform">Download Ticket</button>
                 </div>
               </div>
            </motion.div>
          ))}
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
            {authUser ? (<div className="hidden lg:flex items-center gap-2 font-extrabold text-[#008080] bg-[#008080]/10 px-4 py-2 rounded-full"><Icons.User className="w-5 h-5" /> Hi, {authUser.name}</div>) : (<button onClick={() => setIsAuthModalOpen(true)} className="hidden  lg:block bg-[#111] text-white px-6 py-2.5 rounded-full font-bold text-sm">Sign In</button>)}
            <button className="lg:hidden text-[#008080]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <Icons.Close className="w-7 h-7"/> : <Icons.Menu className="w-7 h-7"/>}</button>
          </nav>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden fixed top-[72px] left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-gray-200 shadow-2xl z-40 overflow-hidden">
                <div className="flex flex-col px-8 py-6 gap-6 text-lg font-bold text-[#008080]">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link><Link to="/tours" onClick={() => setIsMobileMenuOpen(false)}>Tours</Link><Link to="/flights" onClick={() => setIsMobileMenuOpen(false)}>Flights</Link>
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
                <Route path="/tours" element={<ToursPage />} />
                <Route path="/packages" element={<PackagesPage />} />
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

        {/* AI Sidebar */}
        <button onClick={() => setIsAgentOpen(true)} className="fixed bottom-6 right-6 w-16 h-16 bg-[#F6BE1C] text-[#008080] rounded-full shadow-2xl flex items-center justify-center z-[55] hover:scale-110 transition-transform"><Icons.Sparkles className="w-7 h-7"/></button>
        <div className={`fixed inset-y-0 right-0 z-[60] bg-[#008080] p-6 lg:p-8 flex flex-col text-white shadow-[-20px_0_50px_rgba(0,0,0,0.15)] transition-transform duration-500 w-full sm:w-[450px] lg:w-1/3 ${isAgentOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <button onClick={() => setIsAgentOpen(false)} className="absolute top-6 right-6 text-white bg-white/10 p-2.5 rounded-full"><Icons.Close className="w-5 h-5"/></button>
          <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6"><div className="w-12 h-12 rounded-2xl bg-[#F6BE1C] flex items-center justify-center text-[#008080] shadow-lg"><Icons.Sparkles className="w-7 h-7" /></div><div><h1 className="text-2xl font-extrabold">AI Assistant</h1></div></div>
          <div className="flex-1 overflow-y-auto space-y-6 mb-4 custom-scrollbar">
            {!currentItinerary ? ( <div className='space-y-5'>{messages.map((msg, idx) => ( <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`p-4 rounded-3xl text-sm ${msg.role === 'user' ? 'bg-[#F6BE1C] text-[#008080] rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm'}`}>{msg.text}</div></div> ))}{isThinking && <div className="text-xs font-bold text-green-200 animate-pulse">Reasoning...</div>}</div> ) : (
              <div className='space-y-6'><div className="bg-white/10 p-6 rounded-[2rem] border border-white/10 shadow-xl"><h2 className="text-2xl font-extrabold mb-1">{currentItinerary.title}</h2><p className='text-md font-medium text-green-100 mb-6'>{currentItinerary.cost}
              <p className="text-md font-medium text-green-100 mb-1">💰 {currentItinerary.cost}</p>
<p className="text-xs text-white/70 mb-1">🌤️ Weather: {currentItinerary.weather}</p>
<p className="text-xs text-white/70 mb-1">👨‍👩‍👧‍👦 Crowd: {currentItinerary.crowd}</p>
<div className="mb-4">
    <span className="text-[10px] font-bold text-[#F6BE1C] uppercase">Hidden Gems:</span>
    <p className="text-xs italic text-white/80">{currentItinerary.hidden_spots?.join(", ")}</p>
</div>
              </p>
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">{currentItinerary.days?.map((dayObj, index) => ( <div key={index} className="bg-[#004d4d]/50 p-4 rounded-2xl border border-white/5 shadow-inner"><h3 className="font-extrabold text-[#F6BE1C] mb-2 text-md">Day {dayObj.day}: <span className="text-white font-medium">{dayObj.title}</span></h3><ul className="space-y-2">{dayObj.events?.map((event, eIdx) => (<li key={eIdx} className="text-xs text-green-50 flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#F6BE1C] mt-1.5 shrink-0"></div>{event}</li>))}</ul></div> ))}</div></div>
                <button onClick={() => setCurrentItinerary(null)} className="w-full bg-[#F6BE1C] text-[#008080] font-extrabold py-4 rounded-2xl shadow-xl hover:bg-white transition-all uppercase tracking-widest text-xs">Start a new plan?</button>
              </div>
            )}
          </div>
          <form onSubmit={handleSend} className="relative mt-auto pt-4"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={isThinking || currentItinerary} placeholder="Plan my trip..." className="w-full p-6 rounded-2xl bg-white outline-none text-[#008080] shadow-xl" /><button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 mt-2 w-10 h-10 bg-[#008080] text-white rounded-xl flex items-center justify-center"><Icons.Send className="w-5 h-5"/></button></form>
        </div>

        <AnimatePresence>{isAuthModalOpen && ( <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#004d4d]/60 backdrop-blur-sm p-5"><motion.div initial={{scale:0.9}} animate={{scale:1}} className="bg-white rounded-[2.5rem] p-10 w-full max-sm shadow-2xl relative"><button onClick={() => setIsAuthModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500"><Icons.Close className="w-6 h-6"/></button><h3 className="text-3xl font-extrabold text-[#008080]  max-width-[450px] max-auto text-center italic">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h3><form onSubmit={handleAuthSubmit} className="space-y-4">{authMode === 'signup' && ( <input type="text" required placeholder="Full Name" value={authForm.name} onChange={(e) => setAuthForm({...authForm, name: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" /> )}<input type="email" required placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" /><input type="password" required placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" /><button type="submit" className="w-full mt-6 bg-[#008080] text-white py-4 rounded-xl font-extrabold">{authMode === 'login' ? 'Sign In' : 'Sign Up'}</button></form><button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthForm({name:'', email:'', password:''}); }} className="w-full mt-6 text-[#F6BE1C] font-bold text-sm">Switch to {authMode === 'login' ? 'Sign Up' : 'Login'}</button></motion.div></div> )}</AnimatePresence>
        

      </div>
    </Router>
  );
}