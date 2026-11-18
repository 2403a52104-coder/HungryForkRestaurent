import React, { useMemo, useState } from "react";
import { ArrowRight, ShoppingBag, Menu as MenuIcon, X, Plus, Minus, Clock, MapPin, Phone, Instagram, Utensils, CalendarDays, CheckCircle2 } from "lucide-react";
import { isSupabaseConfigured, supabase } from "./supabase";

const menuItems = [
  { id: 1, name: "Fork Special Burger", category: "Burgers", price: 229, tag: "Bestseller", desc: "Smoky grilled patty, cheddar, house sauce and crisp lettuce.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900" },
  { id: 2, name: "Classic Margherita", category: "Pizza", price: 299, tag: "Veg", desc: "Fresh mozzarella, basil and our slow-simmered tomato sauce.", image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900" },
  { id: 3, name: "Creamy Alfredo Pasta", category: "Pasta", price: 279, tag: "Popular", desc: "Silky parmesan cream, herbs and perfectly cooked penne.", image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=900" },
  { id: 4, name: "Peri Peri Fries", category: "Sides", price: 139, tag: "Spicy", desc: "Golden fries tossed in our signature peri peri seasoning.", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900" },
  { id: 5, name: "Crispy Paneer Wrap", category: "Wraps", price: 199, tag: "Veg", desc: "Crispy paneer, crunchy slaw and mint yoghurt dressing.", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=900" },
  { id: 6, name: "Chocolate Brownie", category: "Desserts", price: 159, tag: "Sweet pick", desc: "Warm chocolate brownie served with a rich chocolate drizzle.", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900" }
];
const categories = ["All", "Burgers", "Pizza", "Pasta", "Sides", "Wraps", "Desserts"];
const money = n => "₹" + Number(n).toLocaleString("en-IN");

export default function App() {
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState("");
  const [notice, setNotice] = useState("");
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "" });
  const [booking, setBooking] = useState({ name: "", email: "", phone: "", date: "", time: "19:00", guests: "2", notes: "" });
  const [busy, setBusy] = useState(false);

  const visibleItems = useMemo(() => category === "All" ? menuItems : menuItems.filter(x => x.category === category), [category]);
  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const updateQty = (item, delta) => setCart(old => {
    const found = old.find(x => x.id === item.id);
    if (!found && delta > 0) return [...old, { ...item, qty: 1 }];
    return old.map(x => x.id === item.id ? { ...x, qty: x.qty + delta } : x).filter(x => x.qty > 0);
  });
  const showNotice = message => { setNotice(message); window.setTimeout(() => setNotice(""), 4500); };
  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileOpen(false); };

  async function placeOrder(e) {
    e.preventDefault();
    if (!cart.length) return;
    setBusy(true);
    const payload = {
      customer_name: orderForm.name.trim(),
      phone: orderForm.phone.trim(),
      delivery_address: orderForm.address.trim(),
      items: cart.map(({ id, name, price, qty }) => ({ id, name, price, quantity: qty })),
      total_amount: total,
      status: "new"
    };
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("orders").insert(payload);
        if (error) throw error;
        showNotice("Order received! The restaurant will contact you shortly.");
      } else {
        showNotice("Demo order placed! Connect Supabase to save orders permanently.");
      }
      setCart([]); setCartOpen(false); setModal("");
      setOrderForm({ name: "", phone: "", address: "" });
    } catch (err) {
      showNotice("Could not place order: " + err.message);
    } finally { setBusy(false); }
  }

  async function reserveTable(e) {
    e.preventDefault();
    setBusy(true);
    const payload = { ...booking, guests: Number(booking.guests), status: "pending" };
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("reservations").insert(payload);
        if (error) throw error;
        showNotice("Reservation request sent! We'll confirm with you soon.");
      } else {
        showNotice("Demo reservation submitted! Connect Supabase to save bookings.");
      }
      setBooking({ name: "", email: "", phone: "", date: "", time: "19:00", guests: "2", notes: "" });
      setModal("");
    } catch (err) {
      showNotice("Could not submit reservation: " + err.message);
    } finally { setBusy(false); }
  }

  return (
    <div className="app">
      <header className="header">
        <a className="brand" href="#home" onClick={e => { e.preventDefault(); scrollTo("home"); }}>
          <span className="brand-mark"><Utensils size={20}/></span><span>The Hungry <b>Fork.</b></span>
        </a>
        <nav className={mobileOpen ? "nav open" : "nav"}>
          <button onClick={() => scrollTo("home")}>Home</button>
          <button onClick={() => scrollTo("menu")}>Our Menu</button>
          <button onClick={() => scrollTo("story")}>Our Story</button>
          <button onClick={() => scrollTo("contact")}>Contact</button>
          <button className="mobile-book" onClick={() => { setModal("booking"); setMobileOpen(false); }}>Book a Table</button>
        </nav>
        <div className="header-actions">
          <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="Open cart"><ShoppingBag size={18}/><span>Cart</span><i>{cartCount}</i></button>
          <button className="book-button" onClick={() => setModal("booking")}>Book a Table <ArrowRight size={16}/></button>
          <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X/> : <MenuIcon/>}</button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span/> GOOD FOOD. GOOD MOOD.</div>
            <h1>Come hungry.<br/><em>Leave happy.</em></h1>
            <p>Fresh flavours, honest ingredients and the kind of food that brings everyone to the table.</p>
            <div className="hero-buttons"><button className="primary" onClick={() => scrollTo("menu")}>Explore Menu <ArrowRight size={17}/></button><button className="text-button" onClick={() => setModal("booking")}>Reserve your table</button></div>
            <div className="hero-note"><span>✦</span> Made fresh. Served with love.</div>
          </div>
          <div className="hero-visual">
            <img className="hero-img" src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1400" alt="A table full of delicious restaurant food"/>
            <div className="hero-sticker"><b>100%</b><span>GOOD<br/>VIBES</span></div>
            <div className="hero-caption"><span>THE HUNGRY FORK</span><b>Food worth sharing.</b></div>
          </div>
        </section>

        <section className="info-strip">
          <div><Clock/><span><b>Opening hours</b><small>12:00 PM – 11:00 PM</small></span></div>
          <div><MapPin/><span><b>Find us</b><small>City Centre, Your City</small></span></div>
          <div><Phone/><span><b>Call for enquiries</b><small>+91 98765 43210</small></span></div>
        </section>

        <section className="menu-section section" id="menu">
          <div className="section-heading"><div><div className="eyebrow">MADE TO MAKE YOU SMILE</div><h2>Our crowd <em>favourites.</em></h2></div><p>Big flavours, fresh ingredients and a little bit of magic in every bite.</p></div>
          <div className="filters">{categories.map(c => <button key={c} className={category === c ? "filter active" : "filter"} onClick={() => setCategory(c)}>{c}</button>)}</div>
          <div className="food-grid">{visibleItems.map(item => <article className="food-card" key={item.id}><div className="food-image"><img src={item.image} alt={item.name}/><span>{item.tag}</span><button aria-label={`Add ${item.name}`} onClick={() => updateQty(item, 1)}><Plus size={18}/></button></div><div className="food-info"><div className="food-meta">{item.category} <b>{money(item.price)}</b></div><h3>{item.name}</h3><p>{item.desc}</p><button className="add-link" onClick={() => updateQty(item, 1)}>Add to order <ArrowRight size={15}/></button></div></article>)}</div>
        </section>

        <section className="story-section section" id="story">
          <div className="story-image"><img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200" alt="Warm and welcoming restaurant interior"/></div>
          <div className="story-copy"><div className="eyebrow">A LITTLE ABOUT US</div><h2>More than a meal.<br/><em>It's a feeling.</em></h2><p>At The Hungry Fork, we believe great food makes ordinary moments unforgettable. We bring together fresh ingredients, comforting classics and bold new flavours in a space made for good conversations.</p><p>Come with friends, bring your family, or make it a date. There's always a seat waiting for you.</p><button className="primary" onClick={() => setModal("booking")}>Come dine with us <ArrowRight size={17}/></button></div>
        </section>

        <section className="reservation-banner">
          <div><div className="eyebrow light">YOUR TABLE IS WAITING</div><h2>Make tonight <em>delicious.</em></h2><p>Good food tastes even better together. Save your seat.</p></div>
          <button className="light-button" onClick={() => setModal("booking")}>Book a Table <CalendarDays size={17}/></button>
        </section>

        <section className="contact-section section" id="contact">
          <div><div className="eyebrow">COME SAY HELLO</div><h2>Find your way <em>to us.</em></h2><p>We'd love to host you. Drop by for a meal or get in touch for enquiries.</p></div>
          <div className="contact-cards"><div><MapPin/><b>Visit us</b><span>City Centre, Your City, India</span></div><div><Clock/><b>Opening hours</b><span>Every day · 12 PM – 11 PM</span></div><div><Phone/><b>Call us</b><span>+91 98765 43210</span></div></div>
        </section>
      </main>

      <footer className="footer"><a className="brand footer-brand" href="#home"><span className="brand-mark"><Utensils size={19}/></span><span>The Hungry <b>Fork.</b></span></a><span>© {new Date().getFullYear()} The Hungry Fork. Made for food lovers.</span><a href="#contact"><Instagram size={17}/> Follow our food journey</a></footer>

      {cartOpen && <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) setCartOpen(false); }}><aside className="drawer"><div className="drawer-head"><div><span className="eyebrow">YOUR SELECTION</span><h2>Your order</h2></div><button className="icon-button" onClick={() => setCartOpen(false)}><X/></button></div>{cart.length === 0 ? <div className="empty-cart"><ShoppingBag size={34}/><h3>Your cart is hungry.</h3><p>Add a few favourites from our menu.</p><button className="primary" onClick={() => { setCartOpen(false); scrollTo("menu"); }}>Explore menu</button></div> : <><div className="cart-lines">{cart.map(item => <div className="cart-line" key={item.id}><img src={item.image} alt=""/><div className="cart-line-info"><b>{item.name}</b><span>{money(item.price)}</span><div className="qty"><button onClick={() => updateQty(item, -1)}><Minus size={13}/></button><span>{item.qty}</span><button onClick={() => updateQty(item, 1)}><Plus size={13}/></button></div></div></div>)}</div><div className="cart-bottom"><div className="total-line"><span>Subtotal</span><b>{money(total)}</b></div><small>Delivery charges, if applicable, will be confirmed by the restaurant.</small><button className="primary full" onClick={() => { setCartOpen(false); setModal("checkout"); }}>Continue to checkout <ArrowRight size={17}/></button></div></>}</aside></div>}

      {modal && <div className="overlay modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) setModal(""); }}><div className="modal"><button className="modal-close" onClick={() => setModal("")}><X/></button>{modal === "booking" ? <><div className="eyebrow">A TABLE FOR GOOD TIMES</div><h2>Reserve your <em>table.</em></h2><p className="modal-intro">Tell us a little about your visit and we'll get back to confirm.</p><form onSubmit={reserveTable} className="form-grid"><label>Full name<input required value={booking.name} onChange={e => setBooking({...booking,name:e.target.value})} placeholder="Your name"/></label><label>Email address<input required type="email" value={booking.email} onChange={e => setBooking({...booking,email:e.target.value})} placeholder="you@example.com"/></label><label>Phone number<input required value={booking.phone} onChange={e => setBooking({...booking,phone:e.target.value})} placeholder="+91"/></label><label>Guests<select value={booking.guests} onChange={e => setBooking({...booking,guests:e.target.value})}>{[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n} {n===1?"guest":"guests"}</option>)}</select></label><label>Date<input required type="date" min={new Date().toISOString().slice(0,10)} value={booking.date} onChange={e => setBooking({...booking,date:e.target.value})}/></label><label>Time<input required type="time" value={booking.time} onChange={e => setBooking({...booking,time:e.target.value})}/></label><label className="wide">Special requests (optional)<textarea value={booking.notes} onChange={e => setBooking({...booking,notes:e.target.value})} placeholder="Any dietary needs or special occasion?"/></label><button className="primary full wide" disabled={busy}>{busy ? "Sending..." : "Request reservation"} <ArrowRight size={17}/></button></form></> : <><div className="eyebrow">ALMOST THERE</div><h2>Complete your <em>order.</em></h2><p className="modal-intro">We'll contact you to confirm your order details.</p><form onSubmit={placeOrder} className="form-grid"><label className="wide">Full name<input required value={orderForm.name} onChange={e => setOrderForm({...orderForm,name:e.target.value})} placeholder="Your name"/></label><label>Phone number<input required value={orderForm.phone} onChange={e => setOrderForm({...orderForm,phone:e.target.value})} placeholder="+91"/></label><label className="wide">Delivery address<input required value={orderForm.address} onChange={e => setOrderForm({...orderForm,address:e.target.value})} placeholder="House / street / area"/></label><div className="checkout-total wide"><span>Order total</span><b>{money(total)}</b></div><button className="primary full wide" disabled={busy}>{busy ? "Placing order..." : "Place order"} <ArrowRight size={17}/></button></form></>}</div></div>}

      {notice && <div className="toast"><CheckCircle2 size={18}/>{notice}</div>}
      <a className="floating-cart" onClick={() => setCartOpen(true)}><ShoppingBag size={17}/> {cartCount} items · {money(total)}</a>
    </div>
  );
}
