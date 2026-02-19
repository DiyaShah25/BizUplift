import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SEED_SELLERS = [
    { id: 's1', name: 'Priya Sharma', business: 'KalaKraft', category: 'Handicrafts', city: 'Jaipur', state: 'Rajasthan', story: 'Started making diyas in my kitchen during lockdown in 2020. What began as a hobby to keep myself busy turned into a passion project. Each diya I make carries a piece of my heart — hand-painted with natural colors, inspired by Rajasthani folk art. Today, KalaKraft ships to 200+ cities across India.', rating: 4.8, totalOrders: 1240, verified: true, festivals: ['Diwali', 'Navratri'], avatar: 'https://i.pravatar.cc/150?img=47', cover: null, tagline: 'Handcrafted with love from Jaipur', joinedAt: '2021-01-15', products: 24, milestones: [{ year: '2020', event: 'Started making diyas at home' }, { year: '2021', event: 'First 100 orders on BizUplift' }, { year: '2022', event: 'Featured in Jaipur Times' }, { year: '2023', event: 'Crossed 1000 orders milestone' }] },
    { id: 's2', name: 'Ramesh Patel', business: 'MithaiBhandar', category: 'Food & Sweets', city: 'Surat', state: 'Gujarat', story: '4th generation halwai family bringing traditional recipes online. My great-grandfather started this shop in 1952. We use the same copper vessels, the same wood-fire technique, and the same family recipes. No preservatives, no shortcuts — just pure, authentic Indian mithai made with love.', rating: 4.9, totalOrders: 3200, verified: true, festivals: ['Diwali', 'Eid', 'Holi'], avatar: 'https://i.pravatar.cc/150?img=12', cover: null, tagline: '70 years of sweet tradition', joinedAt: '2020-10-01', products: 18, milestones: [{ year: '1952', event: 'Great-grandfather opens the shop' }, { year: '2020', event: 'Joined BizUplift' }, { year: '2021', event: 'Pan-India shipping launched' }, { year: '2023', event: '3000+ happy customers' }] },
    { id: 's3', name: 'Anjali Nair', business: 'KeralaKrafts', category: 'Clothing', city: 'Kochi', state: 'Kerala', story: 'Preserving traditional Kerala weaving techniques that are centuries old. I work with a collective of 12 weavers from Balaramapuram, ensuring fair wages and sustainable practices. Every kasavu saree we sell supports a weaver family.', rating: 4.7, totalOrders: 890, verified: true, festivals: ['Onam', 'Christmas'], avatar: 'https://i.pravatar.cc/150?img=32', cover: null, tagline: 'Weaving Kerala\'s heritage, thread by thread', joinedAt: '2021-06-20', products: 15, milestones: [{ year: '2021', event: 'Started with 3 weavers' }, { year: '2022', event: 'Collective grows to 12 artisans' }, { year: '2023', event: 'Featured in Vogue India' }] },
    { id: 's4', name: 'Gurpreet Singh', business: 'PunjabDiHaat', category: 'Clothing', city: 'Amritsar', state: 'Punjab', story: 'Promoting Phulkari embroidery to the world. My mother taught me this art when I was 8 years old. Today I run a workshop with 20 women artisans from rural Punjab, creating contemporary Phulkari pieces that blend tradition with modern fashion.', rating: 4.6, totalOrders: 670, verified: true, festivals: ['Lohri', 'Baisakhi'], avatar: 'https://i.pravatar.cc/150?img=67', cover: null, tagline: 'Punjab\'s colors, world\'s canvas', joinedAt: '2021-09-10', products: 12, milestones: [{ year: '2021', event: 'Launched with 5 products' }, { year: '2022', event: 'Workshop employs 20 women' }, { year: '2023', event: 'Export to 3 countries' }] },
];

const SEED_PRODUCTS = [
    // Diwali (Festival of Lights)
    { id: 'p1', name: 'Hand-Painted Mitti Diya Set (12 pcs)', description: 'Traditional clay diyas hand-painted with vibrant colors and mirror work. Perfect for Diwali lighting. Eco-friendly and reusable.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Diwali', category: 'Candles & Diyas', images: ['https://images.unsplash.com/photo-1603902342981-6782db867202?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1542499641-f0920df3866c?auto=format&fit=crop&q=80&w=800'], mrp: 599, price: 349, minPrice: 299, maxDiscount: 25, stock: 150, rating: 4.8, reviews: 342, negotiable: true, tags: ['diwali', 'diya', 'oil lamp', 'decoration'], featured: true, createdAt: '2025-10-01' },
    { id: 'p2', name: 'Premium Kaju Katli Box (500g)', description: 'Authentic cashew fudge made with premium cashews and pure silver vark. Melt-in-mouth texture. No artificial preservatives.', sellerId: 's2', sellerName: 'MithaiBhandar', festival: 'Diwali', category: 'Food & Sweets', images: ['https://images.unsplash.com/photo-1596558450255-7c0bbf60d843?auto=format&fit=crop&q=80&w=800'], mrp: 750, price: 650, minPrice: 580, maxDiscount: 10, stock: 80, rating: 4.9, reviews: 512, negotiable: true, tags: ['diwali', 'sweets', 'kaju katli', 'mithai'], featured: true, createdAt: '2025-10-05' },
    { id: 'p3', name: 'Brass Puja Thali Set', description: 'Handcrafted brass puja thali with engraved traditional patterns. Includes kiya, bell, incense holder, and kumkum katori.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Diwali', category: 'Decoration', images: ['https://images.unsplash.com/photo-1620807664364-77acecd33d96?auto=format&fit=crop&q=80&w=800'], mrp: 1499, price: 999, minPrice: 850, maxDiscount: 20, stock: 45, rating: 4.7, reviews: 89, negotiable: true, tags: ['diwali', 'puja', 'thali', 'brass'], featured: true, createdAt: '2025-09-20' },
    { id: 'p4', name: 'Marigold Flower Garland (5ft)', description: 'Fresh-looking artificial marigold flower garlands for door hanging and home decoration. Washable and durable.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Diwali', category: 'Decoration', images: ['https://images.unsplash.com/photo-1605629124403-516d7249a463?auto=format&fit=crop&q=80&w=800'], mrp: 399, price: 199, minPrice: 150, maxDiscount: 30, stock: 200, rating: 4.5, reviews: 120, negotiable: true, tags: ['decoration', 'flowers', 'toran'], featured: false, createdAt: '2025-10-10' },

    // Holi (Festival of Colors)
    { id: 'p5', name: 'Organic Herbal Gulal (Pack of 5)', description: 'Skin-friendly, non-toxic organic colors made from flower extracts and herbs. 5 vibrant colors: Pink, Green, Yellow, Orange, Blue.', sellerId: 's2', sellerName: 'MithaiBhandar', festival: 'Holi', category: 'Decoration', images: ['https://images.unsplash.com/photo-1615967008748-0382d556391d?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1583094179374-60c042302384?auto=format&fit=crop&q=80&w=800'], mrp: 499, price: 399, minPrice: 350, maxDiscount: 15, stock: 300, rating: 4.8, reviews: 445, negotiable: true, tags: ['holi', 'colors', 'gulal', 'organic'], featured: true, createdAt: '2025-02-15' },
    { id: 'p6', name: 'Traditional Thandai Mix (200g)', description: 'Aromatic mix of almonds, fennel seeds, watermelon kernels, rose petals, pepper, cardamom, saffron. Just add milk.', sellerId: 's2', sellerName: 'MithaiBhandar', festival: 'Holi', category: 'Food & Sweets', images: ['https://images.unsplash.com/photo-1709420601321-ea5064e650ab?auto=format&fit=crop&q=80&w=800'], mrp: 350, price: 299, minPrice: 250, maxDiscount: 10, stock: 100, rating: 4.7, reviews: 234, negotiable: false, tags: ['holi', 'drink', 'thandai'], featured: true, createdAt: '2025-02-20' },
    { id: 'p7', name: 'White Cotton Kurta for Holi', description: 'Comfortable pure cotton white kurta, perfect for playing Holi. Breathable fabric that gets softer with wash.', sellerId: 's4', sellerName: 'PunjabDiHaat', festival: 'Holi', category: 'Clothing', images: ['https://plus.unsplash.com/premium_photo-1682096349312-d81b8359288e?auto=format&fit=crop&q=80&w=800'], mrp: 999, price: 699, minPrice: 599, maxDiscount: 20, stock: 150, rating: 4.4, reviews: 189, negotiable: true, tags: ['holi', 'clothing', 'kurta', 'white'], featured: false, createdAt: '2025-02-10' },

    // Navratri (Festival of Dance)
    { id: 'p8', name: 'Embroidered Chaniya Choli Set', description: 'Heavy mirror-work Gujrati style lehenga choli with dupatta. Perfect for Garba nights. Cotton fabric with rich embroidery.', sellerId: 's3', sellerName: 'KeralaKrafts', festival: 'Navratri', category: 'Clothing', images: ['https://images.unsplash.com/photo-1596001407335-512a80479717?auto=format&fit=crop&q=80&w=800'], mrp: 4500, price: 3200, minPrice: 2800, maxDiscount: 20, stock: 25, rating: 4.9, reviews: 95, negotiable: true, tags: ['navratri', 'garba', 'lehenga', 'clothing'], featured: true, createdAt: '2025-09-01' },
    { id: 'p9', name: 'Decorative Dandiya Sticks (Pair)', description: 'Wooden dandiya sticks wrapped in colorful satin and bandhani cloth with bells. Lightweight and durable.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Navratri', category: 'Decoration', images: ['https://images.unsplash.com/photo-1614713781216-b51e06fe9266?auto=format&fit=crop&q=80&w=800'], mrp: 299, price: 199, minPrice: 150, maxDiscount: 15, stock: 200, rating: 4.6, reviews: 178, negotiable: true, tags: ['navratri', 'dandiya', 'dance', 'prop'], featured: false, createdAt: '2025-09-10' },

    // Eid (Festival of Joy)
    { id: 'p10', name: 'Authentic Sheer Khurma Mix (1kg)', description: 'Rich vermicelli pudding mix with dates, nuts, and ghee. Traditional recipe for a perfect Eid dessert.', sellerId: 's2', sellerName: 'MithaiBhandar', festival: 'Eid', category: 'Food & Sweets', images: ['https://plus.unsplash.com/premium_photo-1695123927643-989278bd44aa?auto=format&fit=crop&q=80&w=800'], mrp: 599, price: 499, minPrice: 450, maxDiscount: 10, stock: 60, rating: 4.8, reviews: 167, negotiable: false, tags: ['eid', 'sweets', 'dessert', 'seviyan'], featured: true, createdAt: '2025-03-25' },
    { id: 'p11', name: 'Crystal Attar Perfume Bottle', description: 'Intricately designed crystal bottle with applicator for Ittar/Attar. A beautiful gift for Eid.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Eid', category: 'Decoration', images: ['https://images.unsplash.com/photo-1585250462024-6f5df5802a8b?auto=format&fit=crop&q=80&w=800'], mrp: 999, price: 799, minPrice: 700, maxDiscount: 15, stock: 40, rating: 4.7, reviews: 88, negotiable: true, tags: ['eid', 'attar', 'perfume', 'gift'], featured: false, createdAt: '2025-03-28' },

    // Raksha Bandhan (Bond of Love)
    { id: 'p12', name: 'Handcrafted Zardosi Rakhi', description: 'Elegant rakhi with Zardosi work and semi-precious stones. Comes with Roli Chawal pack.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Rakhi', category: 'Gifts', images: ['https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?auto=format&fit=crop&q=80&w=800'], mrp: 299, price: 199, minPrice: 150, maxDiscount: 20, stock: 500, rating: 4.8, reviews: 654, negotiable: true, tags: ['rakhi', 'raksha bandhan', 'brother', 'gift'], featured: true, createdAt: '2025-07-20' },
    { id: 'p13', name: 'Assorted Mithai Gift Box', description: 'A mix of Besan Ladoo, Barfi, and Peda. Perfect sweet gesture for your sibling.', sellerId: 's2', sellerName: 'MithaiBhandar', festival: 'Rakhi', category: 'Food & Sweets', images: ['https://images.unsplash.com/photo-1601303516668-52467d36d390?auto=format&fit=crop&q=80&w=800'], mrp: 699, price: 599, minPrice: 500, maxDiscount: 10, stock: 100, rating: 4.6, reviews: 210, negotiable: true, tags: ['rakhi', 'sweets', 'gift'], featured: false, createdAt: '2025-07-25' },

    // Onam (Harvest Festival of Kerala)
    { id: 'p14', name: 'Traditional Kasavu Saree', description: 'Authentic Kerala cotton saree with golden Zari border. Handwoven by weavers in Balaramapuram.', sellerId: 's3', sellerName: 'KeralaKrafts', festival: 'Onam', category: 'Clothing', images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'], mrp: 2499, price: 1899, minPrice: 1600, maxDiscount: 25, stock: 50, rating: 4.9, reviews: 134, negotiable: true, tags: ['onam', 'saree', 'kerala', 'clothing'], featured: true, createdAt: '2025-08-15' },
    { id: 'p15', name: 'Kerala Banana Chips (Freshly Fried)', description: 'Crispy, thin banana chips fried in pure coconut oil. The authentic taste of Kerala.', sellerId: 's3', sellerName: 'KeralaKrafts', festival: 'Onam', category: 'Food & Sweets', images: ['https://images.unsplash.com/photo-1606449629199-72c0c73229b1?auto=format&fit=crop&q=80&w=800'], mrp: 399, price: 299, minPrice: 250, maxDiscount: 15, stock: 200, rating: 4.7, reviews: 320, negotiable: false, tags: ['onam', 'chips', 'snacks'], featured: false, createdAt: '2025-08-18' },

    // Christmas
    { id: 'p16', name: 'Handmade Pine Cone Wreath', description: 'Rustic Christmas wreath made with real pine cones, dried berries, and cinnamon sticks.', sellerId: 's3', sellerName: 'KeralaKrafts', festival: 'Christmas', category: 'Decoration', images: ['https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&q=80&w=800'], mrp: 1299, price: 999, minPrice: 800, maxDiscount: 20, stock: 30, rating: 4.8, reviews: 112, negotiable: true, tags: ['christmas', 'wreath', 'decoration'], featured: true, createdAt: '2025-12-01' },
    { id: 'p17', name: 'Rich Plum Cake (Traditional)', description: 'Dense, moist fruit cake soaked in grape juice and spices for months. Kerala style Christian traditional recipe.', sellerId: 's3', sellerName: 'KeralaKrafts', festival: 'Christmas', category: 'Food & Sweets', images: ['https://images.unsplash.com/photo-1639587400508-32386992d9d0?auto=format&fit=crop&q=80&w=800'], mrp: 899, price: 699, minPrice: 600, maxDiscount: 15, stock: 100, rating: 4.9, reviews: 287, negotiable: false, tags: ['christmas', 'cake', 'sweets'], featured: true, createdAt: '2025-12-05' },

    // Lohri / Pongal (Harvest Festivals)
    { id: 'p18', name: 'Til-Gud Ladoo (Sesame Jaggery Balls)', description: 'Warm and nutty ladoos made of roasted sesame seeds and jaggery. Essential for Lohri and Makar Sankranti.', sellerId: 's2', sellerName: 'MithaiBhandar', festival: 'Lohri', category: 'Food & Sweets', images: ['https://images.unsplash.com/photo-1547849208-e87f54c99731?auto=format&fit=crop&q=80&w=800'], mrp: 349, price: 279, minPrice: 240, maxDiscount: 10, stock: 120, rating: 4.6, reviews: 198, negotiable: false, tags: ['lohri', 'pongal', 'sweets', 'til'], featured: false, createdAt: '2025-01-05' },
    { id: 'p19', name: 'Phulkari Dupatta (Hand-Embroidered)', description: 'Vibrant Phulkari embroidery on chiffon fabric. Traditional craft of Punjab, perfect for festive wear.', sellerId: 's4', sellerName: 'PunjabDiHaat', festival: 'Lohri', category: 'Clothing', images: ['https://images.unsplash.com/photo-1601633534571-066345dc3ce2?auto=format&fit=crop&q=80&w=800'], mrp: 1599, price: 1199, minPrice: 1000, maxDiscount: 20, stock: 40, rating: 4.8, reviews: 145, negotiable: true, tags: ['lohri', 'clothing', 'dupatta', 'phulkari'], featured: true, createdAt: '2025-01-08' },
    { id: 'p20', name: 'Earthen Pongal Pot Set', description: 'Traditionally decorated clay pots for cooking Sweet Pongal outdoors. Painted with ritualistic patterns.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Pongal', category: 'Decoration', images: ['https://images.unsplash.com/photo-1543167120-d7d8e8745c11?auto=format&fit=crop&q=80&w=800'], mrp: 699, price: 499, minPrice: 400, maxDiscount: 25, stock: 60, rating: 4.5, reviews: 89, negotiable: true, tags: ['pongal', 'pot', 'decoration'], featured: false, createdAt: '2025-01-05' },

    // Dussehra
    { id: 'p21', name: 'Hand-Painted Ravana Mask', description: 'Decorative mask used for Ramlila performances and home decor during Dussehra. Papier-mache craft.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Dussehra', category: 'Decoration', images: ['https://images.unsplash.com/photo-1634560756779-11ba2182df56?auto=format&fit=crop&q=80&w=800'], mrp: 499, price: 349, minPrice: 300, maxDiscount: 20, stock: 50, rating: 4.4, reviews: 45, negotiable: true, tags: ['dussehra', 'mask', 'craft'], featured: false, createdAt: '2025-10-05' },

    // General / All Year
    { id: 'p22', name: 'Blue Pottery Vase (Jaipur)', description: 'Exquisite blue pottery vase from Jaipur. Floral motifs hand-painted on quartz stone clay.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'All', category: 'Handicrafts', images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800'], mrp: 1299, price: 899, minPrice: 800, maxDiscount: 25, stock: 30, rating: 4.7, reviews: 156, negotiable: true, tags: ['decor', 'handicraft', 'pottery'], featured: false, createdAt: '2025-06-15' },
    { id: 'p23', name: 'Assorted Scented Candles (Set of 3)', description: 'Aromatherapy soy wax candles in lavender, vanilla, and rose scents. Long burn time.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'All', category: 'Candles & Diyas', images: ['https://images.unsplash.com/photo-1602826646961-00aa6ae9c946?auto=format&fit=crop&q=80&w=800'], mrp: 799, price: 599, minPrice: 500, maxDiscount: 20, stock: 100, rating: 4.8, reviews: 267, negotiable: true, tags: ['candles', 'gift', 'decor'], featured: false, createdAt: '2025-06-01' },
    { id: 'p24', name: 'Hand-Woven Area Rug', description: 'Cotton dhurrie rug woven by artisans. Geometric patterns in earthy tones. Size 4x6 ft.', sellerId: 's4', sellerName: 'PunjabDiHaat', festival: 'All', category: 'Handicrafts', images: ['https://images.unsplash.com/photo-1596288647047-97d54b834458?auto=format&fit=crop&q=80&w=800'], mrp: 2500, price: 1799, minPrice: 1500, maxDiscount: 25, stock: 20, rating: 4.5, reviews: 89, negotiable: true, tags: ['rug', 'decor', 'home'], featured: false, createdAt: '2025-05-20' },
];

const SEED_USERS = [
    { id: 'admin1', name: 'Admin User', email: 'admin@bizuplift.com', password: 'admin123', mobile: '9999999999', role: 'admin', avatar: 'https://i.pravatar.cc/150?img=1', createdAt: '2020-01-01' },
    { id: 'c1', name: 'Arjun Mehta', email: 'arjun@example.com', password: 'password123', mobile: '9876543210', role: 'customer', avatar: 'https://i.pravatar.cc/150?img=11', createdAt: '2023-06-15', credits: 1250 },
    { id: 'c2', name: 'Sneha Reddy', email: 'sneha@example.com', password: 'password123', mobile: '9876543211', role: 'customer', avatar: 'https://i.pravatar.cc/150?img=25', createdAt: '2023-08-20', credits: 450 },
    { id: 'c3', name: 'Vikram Joshi', email: 'vikram@example.com', password: 'password123', mobile: '9876543212', role: 'customer', avatar: 'https://i.pravatar.cc/150?img=33', createdAt: '2023-10-01', credits: 800 },
    { id: 'c4', name: 'Meera Pillai', email: 'meera@example.com', password: 'password123', mobile: '9876543213', role: 'customer', avatar: 'https://i.pravatar.cc/150?img=44', createdAt: '2024-01-10', credits: 200 },
    { id: 'c5', name: 'Rohan Das', email: 'rohan@example.com', password: 'password123', mobile: '9876543214', role: 'customer', avatar: 'https://i.pravatar.cc/150?img=55', createdAt: '2024-03-05', credits: 600 },
    { id: 's1_user', name: 'Priya Sharma', email: 'priya@kalakraft.com', password: 'seller123', mobile: '9876543220', role: 'seller', sellerId: 's1', avatar: 'https://i.pravatar.cc/150?img=47', createdAt: '2021-01-15', credits: 3200 },
    { id: 's2_user', name: 'Ramesh Patel', email: 'ramesh@mithaibandar.com', password: 'seller123', mobile: '9876543221', role: 'seller', sellerId: 's2', avatar: 'https://i.pravatar.cc/150?img=12', createdAt: '2020-10-01', credits: 8900 },
    { id: 's3_user', name: 'Anjali Nair', email: 'anjali@keralakrafts.com', password: 'seller123', mobile: '9876543222', role: 'seller', sellerId: 's3', avatar: 'https://i.pravatar.cc/150?img=32', createdAt: '2021-06-20', credits: 2100 },
    { id: 's4_user', name: 'Gurpreet Singh', email: 'gurpreet@punjabdihaat.com', password: 'seller123', mobile: '9876543223', role: 'seller', sellerId: 's4', avatar: 'https://i.pravatar.cc/150?img=67', createdAt: '2021-09-10', credits: 1800 },
];

const SEED_POSTS = [
    { id: 'post1', authorId: 'c1', authorName: 'Arjun Mehta', authorAvatar: 'https://i.pravatar.cc/150?img=11', type: 'review', festival: 'Diwali', content: 'Just got this amazing Diwali hamper from @KalaKraft 🪔 The diyas are hand-painted and so beautiful! The packaging was premium and delivery was super fast. Highly recommend!', image: 'https://images.unsplash.com/photo-1620807664364-77acecd33d96?auto=format&fit=crop&q=80&w=800', likes: 47, comments: 8, createdAt: '2024-10-28T10:30:00Z', likedBy: [] },
    { id: 'post2', authorId: 'c2', authorName: 'Sneha Reddy', authorAvatar: 'https://i.pravatar.cc/150?img=25', type: 'tip', festival: 'Holi', content: 'Holi tip: Always use herbal colors — much safer for skin! Found great organic ones on BizUplift 🎨 Also, apply coconut oil before playing to protect your skin. Happy Holi everyone!', image: 'https://images.unsplash.com/photo-1615967008748-0382d556391d?auto=format&fit=crop&q=80&w=800', likes: 89, comments: 15, createdAt: '2024-03-24T09:15:00Z', likedBy: [] },
    { id: 'post3', authorId: 'c3', authorName: 'Vikram Joshi', authorAvatar: 'https://i.pravatar.cc/150?img=33', type: 'review', festival: 'Lohri', content: 'My order arrived 2 days early! Seller communication was amazing ⭐⭐⭐⭐⭐ The Phulkari dupatta from PunjabDiHaat is even more beautiful in person. The embroidery is so intricate!', image: 'https://images.unsplash.com/photo-1601633534571-066345dc3ce2?auto=format&fit=crop&q=80&w=800', likes: 34, comments: 5, createdAt: '2024-01-15T14:20:00Z', likedBy: [] },
    { id: 'post4', authorId: 's1_user', authorName: 'Priya Sharma (KalaKraft)', authorAvatar: 'https://i.pravatar.cc/150?img=47', type: 'seller_story', festival: 'Diwali', content: 'Excited to share that KalaKraft just crossed 1000 orders! 🎉 Thank you to every customer who supported a small seller. This Diwali, we have 20 new diya designs. Each one painted with love 🪔', image: 'https://images.unsplash.com/photo-1603902342981-6782db867202?auto=format&fit=crop&q=80&w=800', likes: 156, comments: 23, createdAt: '2024-10-15T11:00:00Z', likedBy: [] },
    { id: 'post5', authorId: 'c4', authorName: 'Meera Pillai', authorAvatar: 'https://i.pravatar.cc/150?img=44', type: 'tip', festival: 'Onam', content: 'Onam Sadya tip: Order your Kasavu saree at least 2 weeks before Onam! The handwoven ones from KeralaKrafts are worth the wait 🌸 The quality is unmatched. Onam Ashamsakal!', image: null, likes: 67, comments: 11, createdAt: '2024-09-10T08:30:00Z', likedBy: [] },
    { id: 'post6', authorId: 'c5', authorName: 'Rohan Das', authorAvatar: 'https://i.pravatar.cc/150?img=55', type: 'review', festival: 'Navratri', content: 'The Chaniya Choli from KeralaKrafts is absolutely stunning! 💃 Wore it for all 9 nights of Navratri and got so many compliments. The mirror work is so detailed. Worth every rupee!', image: 'https://images.unsplash.com/photo-1596001407335-512a80479717?auto=format&fit=crop&q=80&w=800', likes: 92, comments: 18, createdAt: '2024-10-05T20:00:00Z', likedBy: [] },
    { id: 'post7', authorId: 'c1', authorName: 'Arjun Mehta', authorAvatar: 'https://i.pravatar.cc/150?img=11', type: 'tip', festival: 'Diwali', content: 'Pro tip for Diwali shopping: Use the AI negotiation feature on BizUplift! I saved ₹200 on a brass thali set 🤝 The AI seller agent is so friendly and speaks Hinglish — feels like talking to a real seller!', image: null, likes: 123, comments: 31, createdAt: '2024-10-20T16:45:00Z', likedBy: [] },
    { id: 'post8', authorId: 's2_user', authorName: 'Ramesh Patel (MithaiBhandar)', authorAvatar: 'https://i.pravatar.cc/150?img=12', type: 'seller_story', festival: 'Eid', content: 'Our Sheer Khurma mix is now available for Eid! 🌙 Made with the same recipe my great-grandmother used. No preservatives, just pure love and tradition. Order early — we sell out every year!', image: 'https://plus.unsplash.com/premium_photo-1695123927643-989278bd44aa?auto=format&fit=crop&q=80&w=800', likes: 78, comments: 14, createdAt: '2024-04-05T10:00:00Z', likedBy: [] },
    { id: 'post9', authorId: 'c2', authorName: 'Sneha Reddy', authorAvatar: 'https://i.pravatar.cc/150?img=25', type: 'review', festival: 'Christmas', content: 'The Kerala Plum Cake from KeralaKrafts is DIVINE 🎄 Rich, moist, and full of dry fruits. You can taste the love in every bite. Already ordered 3 more for gifts!', image: 'https://images.unsplash.com/photo-1639587400508-32386992d9d0?auto=format&fit=crop&q=80&w=800', likes: 55, comments: 9, createdAt: '2024-12-20T12:00:00Z', likedBy: [] },
    { id: 'post10', authorId: 'c3', authorName: 'Vikram Joshi', authorAvatar: 'https://i.pravatar.cc/150?img=33', type: 'tip', festival: 'Holi', content: 'Building a custom Holi hamper on BizUplift is so fun! 🎨 I added organic gulal, a premium pichkari, and thandai mix. Total came to ₹850 — much cheaper than buying separately. Try the hamper builder!', image: null, likes: 44, comments: 7, createdAt: '2024-03-20T15:30:00Z', likedBy: [] },
    { id: 'post11', authorId: 's4_user', authorName: 'Gurpreet Singh (PunjabDiHaat)', authorAvatar: 'https://i.pravatar.cc/150?img=67', type: 'seller_story', festival: 'Lohri', content: 'Lohri is coming! 🔥 Our Phulkari dupattas are ready. Each one is handwoven by women artisans from my village. When you buy from us, you\'re supporting 20 families. Bohot shukriya to all our customers!', image: 'https://images.unsplash.com/photo-1601633534571-066345dc3ce2?auto=format&fit=crop&q=80&w=800', likes: 201, comments: 38, createdAt: '2024-01-10T09:00:00Z', likedBy: [] },
    { id: 'post12', authorId: 'c4', authorName: 'Meera Pillai', authorAvatar: 'https://i.pravatar.cc/150?img=44', type: 'review', festival: 'Eid', content: 'The Attar perfume set from KalaKraft is absolutely gorgeous! 🌹 The Oud fragrance is especially divine. Gifted it to my husband for Eid and he loves it. The crystal bottles are so elegant!', image: 'https://images.unsplash.com/photo-1585250462024-6f5df5802a8b?auto=format&fit=crop&q=80&w=800', likes: 38, comments: 6, createdAt: '2024-04-10T18:00:00Z', likedBy: [] },
    { id: 'post13', authorId: 'c5', authorName: 'Rohan Das', authorAvatar: 'https://i.pravatar.cc/150?img=55', type: 'tip', festival: 'Navratri', content: 'Navratri Garba tip: Wear comfortable footwear and practice dandiya moves before the event! 💃 Also, the decorated dandiya sticks from KalaKraft are so beautiful — they make great photos too!', image: null, likes: 71, comments: 13, createdAt: '2024-10-02T21:00:00Z', likedBy: [] },
    { id: 'post14', authorId: 's3_user', authorName: 'Anjali Nair (KeralaKrafts)', authorAvatar: 'https://i.pravatar.cc/150?img=32', type: 'seller_story', festival: 'Onam', content: 'Onam is our biggest festival! 🌸 This year we have 5 new Kasavu saree designs. Each saree takes 3 days to weave. We\'re working with 12 weavers to fulfill all orders. Onam Ashamsakal from KeralaKrafts!', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800', likes: 167, comments: 29, createdAt: '2024-09-05T10:00:00Z', likedBy: [] },
    { id: 'post15', authorId: 'c1', authorName: 'Arjun Mehta', authorAvatar: 'https://i.pravatar.cc/150?img=11', type: 'review', festival: 'All', content: 'BizUplift credit points are amazing! 💰 I\'ve earned 1250 points from my purchases = ₹125 off my next order. Plus the referral bonus is great. Referred 3 friends and got 600 bonus points!', image: null, likes: 88, comments: 20, createdAt: '2024-11-01T14:00:00Z', likedBy: [] },
];

const SEED_ORDERS = [
    { id: 'ORD001', customerId: 'c1', items: [{ productId: 'p1', name: 'Hand-Painted Mitti Diya Set', quantity: 2, price: 349, image: 'https://images.unsplash.com/photo-1603902342981-6782db867202?auto=format&fit=crop&q=80&w=800' }], total: 698, status: 'Delivered', paymentMethod: 'UPI', address: { name: 'Arjun Mehta', line1: '42, Shanti Nagar', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '9876543210' }, createdAt: '2024-10-20T10:00:00Z', deliveredAt: '2024-10-25T15:00:00Z', creditsEarned: 70 },
    { id: 'ORD002', customerId: 'c1', items: [{ productId: 'p2', name: 'Premium Kaju Katli Box', quantity: 1, price: 650, image: 'https://images.unsplash.com/photo-1596558450255-7c0bbf60d843?auto=format&fit=crop&q=80&w=800' }, { productId: 'p3', name: 'Brass Puja Thali Set', quantity: 1, price: 999, image: 'https://images.unsplash.com/photo-1620807664364-77acecd33d96?auto=format&fit=crop&q=80&w=800' }], total: 1649, status: 'Shipped', paymentMethod: 'Card', address: { name: 'Arjun Mehta', line1: '42, Shanti Nagar', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '9876543210' }, createdAt: '2024-10-28T14:00:00Z', creditsEarned: 164 },
    { id: 'ORD003', customerId: 'c1', items: [{ productId: 'p5', name: 'Organic Herbal Gulal', quantity: 1, price: 399, image: 'https://images.unsplash.com/photo-1615967008748-0382d556391d?auto=format&fit=crop&q=80&w=800' }], total: 399, status: 'Processing', paymentMethod: 'COD', address: { name: 'Arjun Mehta', line1: '42, Shanti Nagar', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '9876543210' }, createdAt: '2024-11-01T09:00:00Z', creditsEarned: 40 },
];

const SEED_REVIEWS = [
    { id: 'r1', productId: 'p1', userId: 'c1', userName: 'Arjun Mehta', rating: 5, title: 'Absolutely beautiful!', body: 'The diyas are hand-painted with such intricate detail. They look even better in person. The packaging was premium and delivery was fast. Will definitely order again!', createdAt: '2024-10-26T10:00:00Z', helpful: 12 },
    { id: 'r2', productId: 'p1', userId: 'c2', userName: 'Sneha Reddy', rating: 4, title: 'Great quality, slightly delayed', body: 'The diyas are beautiful and the painting is very detailed. Delivery took a day longer than expected but the seller communicated well. Overall very happy with the purchase.', createdAt: '2024-10-27T14:00:00Z', helpful: 8 },
    { id: 'r3', productId: 'p2', userId: 'c3', userName: 'Vikram Joshi', rating: 5, title: 'Best Kaju Katli ever!', body: 'I\'ve tried many brands but MithaiBhandar\'s Kaju Katli is on another level. The silver vark is real, the texture is perfect, and the taste is divine. My family loved it!', createdAt: '2024-10-29T11:00:00Z', helpful: 23 },
];

// ─── Context ─────────────────────────────────────────────────────────────────

export const DataProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [wishlists, setWishlists] = useState({});
    const [credits, setCredits] = useState({});
    const [negotiations, setNegotiations] = useState([]);

    // Initialize seed data
    useEffect(() => {
        const init = (key, seed, setter) => {
            const stored = localStorage.getItem(key);
            if (stored) {
                setter(JSON.parse(stored));
            } else {
                localStorage.setItem(key, JSON.stringify(seed));
                setter(seed);
            }
        };
        init('bizuplift_products', SEED_PRODUCTS, setProducts);
        init('bizuplift_sellers', SEED_SELLERS, setSellers);
        init('bizuplift_users', SEED_USERS, setUsers);
        init('bizuplift_posts', SEED_POSTS, setPosts);
        init('bizuplift_orders', SEED_ORDERS, setOrders);
        init('bizuplift_reviews', SEED_REVIEWS, setReviews);
        init('bizuplift_wishlists', {}, setWishlists);
        init('bizuplift_credits', { c1: { balance: 1250, transactions: [{ id: 't1', date: '2024-10-25', action: 'Purchase Reward', points: 94, type: 'earn', balance: 1250 }, { id: 't2', date: '2024-10-20', action: 'First Purchase Bonus', points: 100, type: 'earn', balance: 1156 }, { id: 't3', date: '2024-10-15', action: 'Review Written', points: 50, type: 'earn', balance: 1056 }, { id: 't4', date: '2024-09-01', action: 'Referral Bonus', points: 200, type: 'earn', balance: 1006 }, { id: 't5', date: '2024-08-15', action: 'Redeemed for discount', points: -200, type: 'redeem', balance: 806 }] } }, setCredits);
        init('bizuplift_negotiations', [], setNegotiations);
    }, []);

    const persist = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    // Products CRUD
    const addProduct = (product) => {
        const updated = [...products, { ...product, id: `p${Date.now()}`, createdAt: new Date().toISOString(), rating: 0, reviews: 0 }];
        setProducts(updated); persist('bizuplift_products', updated);
    };
    const updateProduct = (id, updates) => {
        const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
        setProducts(updated); persist('bizuplift_products', updated);
    };
    const deleteProduct = (id) => {
        const updated = products.filter(p => p.id !== id);
        setProducts(updated); persist('bizuplift_products', updated);
    };

    // Orders
    const addOrder = (order) => {
        const newOrder = { ...order, id: `ORD${Date.now()}`, createdAt: new Date().toISOString(), status: 'Processing' };
        const updated = [...orders, newOrder];
        setOrders(updated); persist('bizuplift_orders', updated);
        // Award credits
        const pts = Math.floor(newOrder.total / 10);
        addCredits(order.customerId, pts, 'Purchase Reward');
        return newOrder;
    };
    const updateOrderStatus = (id, status) => {
        const updated = orders.map(o => o.id === id ? { ...o, status } : o);
        setOrders(updated); persist('bizuplift_orders', updated);
    };

    // Posts
    const addPost = (post) => {
        const newPost = { ...post, id: `post${Date.now()}`, createdAt: new Date().toISOString(), likes: 0, comments: 0, likedBy: [] };
        const updated = [newPost, ...posts];
        setPosts(updated); persist('bizuplift_posts', updated);
        addCredits(post.authorId, 25, 'Community Post');
    };
    const toggleLike = (postId, userId) => {
        const updated = posts.map(p => {
            if (p.id !== postId) return p;
            const liked = p.likedBy.includes(userId);
            return { ...p, likes: liked ? p.likes - 1 : p.likes + 1, likedBy: liked ? p.likedBy.filter(id => id !== userId) : [...p.likedBy, userId] };
        });
        setPosts(updated); persist('bizuplift_posts', updated);
    };

    // Wishlist
    const toggleWishlist = (userId, productId) => {
        const userList = wishlists[userId] || [];
        const updated = { ...wishlists, [userId]: userList.includes(productId) ? userList.filter(id => id !== productId) : [...userList, productId] };
        setWishlists(updated); persist('bizuplift_wishlists', updated);
    };
    const isWishlisted = (userId, productId) => (wishlists[userId] || []).includes(productId);

    // Credits
    const addCredits = (userId, points, action) => {
        if (!userId) return;
        const userCredits = credits[userId] || { balance: 0, transactions: [] };
        const newBalance = userCredits.balance + points;
        const tx = { id: `t${Date.now()}`, date: new Date().toISOString().split('T')[0], action, points, type: points > 0 ? 'earn' : 'redeem', balance: newBalance };
        const updated = { ...credits, [userId]: { balance: newBalance, transactions: [tx, ...userCredits.transactions] } };
        setCredits(updated); persist('bizuplift_credits', updated);
    };
    const getUserCredits = (userId) => credits[userId] || { balance: 0, transactions: [] };

    // Reviews
    const addReview = (review) => {
        const newReview = { ...review, id: `r${Date.now()}`, createdAt: new Date().toISOString(), helpful: 0 };
        const updated = [...reviews, newReview];
        setReviews(updated); persist('bizuplift_reviews', updated);
        addCredits(review.userId, 50, 'Review Written');
    };
    const getProductReviews = (productId) => reviews.filter(r => r.productId === productId);

    // Users
    const registerUser = (userData) => {
        const newUser = { ...userData, id: `u${Date.now()}`, createdAt: new Date().toISOString(), credits: 100 };
        const updated = [...users, newUser];
        setUsers(updated); persist('bizuplift_users', updated);
        addCredits(newUser.id, 100, 'Welcome Bonus');
        return newUser;
    };
    const updateUser = (id, updates) => {
        const updated = users.map(u => u.id === id ? { ...u, ...updates } : u);
        setUsers(updated); persist('bizuplift_users', updated);
    };

    // Negotiations
    const saveNegotiation = (negotiation) => {
        const updated = [...negotiations.filter(n => n.productId !== negotiation.productId || n.userId !== negotiation.userId), negotiation];
        setNegotiations(updated); persist('bizuplift_negotiations', updated);
    };

    return (
        <DataContext.Provider value={{
            products, sellers, users, posts, orders, reviews, wishlists, credits, negotiations,
            addProduct, updateProduct, deleteProduct,
            addOrder, updateOrderStatus,
            addPost, toggleLike,
            toggleWishlist, isWishlisted,
            addCredits, getUserCredits,
            addReview, getProductReviews,
            registerUser, updateUser,
            saveNegotiation,
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
export { SEED_SELLERS, SEED_PRODUCTS };
