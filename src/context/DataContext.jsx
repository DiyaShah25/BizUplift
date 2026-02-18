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
    // Diwali
    { id: 'p1', name: 'Hand-Painted Lakshmi Diya Set (6 pcs)', description: 'Beautiful hand-painted terracotta diyas featuring Goddess Lakshmi motifs. Each diya is individually crafted and painted with natural, eco-friendly colors. Perfect for Diwali puja and home decoration. Set of 6 in a gift box.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Diwali', category: 'Candles & Diyas', images: ['https://picsum.photos/seed/diya1/400/400', 'https://picsum.photos/seed/diya2/400/400', 'https://picsum.photos/seed/diya3/400/400'], mrp: 599, price: 449, minPrice: 380, maxDiscount: 20, stock: 45, rating: 4.8, reviews: 234, negotiable: true, tags: ['diwali', 'diya', 'handmade', 'eco-friendly'], featured: true, createdAt: '2024-09-01' },
    { id: 'p2', name: 'Premium Kaju Katli Box (500g)', description: 'Authentic Kaju Katli made from premium cashews and pure silver vark. Our 4th-generation recipe ensures the perfect texture — melt-in-mouth softness with rich cashew flavor. Packed in a premium gift box with festive ribbon.', sellerId: 's2', sellerName: 'MithaiBhandar', festival: 'Diwali', category: 'Food & Sweets', images: ['https://picsum.photos/seed/katli1/400/400', 'https://picsum.photos/seed/katli2/400/400'], mrp: 750, price: 650, minPrice: 580, maxDiscount: 15, stock: 80, rating: 4.9, reviews: 512, negotiable: true, tags: ['diwali', 'sweets', 'kaju katli', 'gift'], featured: true, createdAt: '2024-09-05' },
    { id: 'p3', name: 'Benarasi Silk Saree — Gold Zari', description: 'Exquisite Benarasi silk saree with intricate gold zari work. Handwoven by master weavers of Varanasi. The rich silk fabric with traditional motifs makes it perfect for Diwali celebrations and weddings. Comes with matching blouse piece.', sellerId: 's3', sellerName: 'KeralaKrafts', festival: 'Diwali', category: 'Clothing', images: ['https://picsum.photos/seed/saree1/400/400', 'https://picsum.photos/seed/saree2/400/400'], mrp: 8500, price: 6999, minPrice: 6200, maxDiscount: 12, stock: 8, rating: 4.7, reviews: 89, negotiable: true, tags: ['diwali', 'saree', 'silk', 'benarasi'], featured: false, createdAt: '2024-08-20' },
    { id: 'p4', name: 'Decorative Rangoli Stencil Kit (12 designs)', description: 'Professional rangoli stencil kit with 12 unique designs including floral, geometric, and traditional patterns. Made from durable, reusable plastic. Includes color guide and instructions. Perfect for beginners and experts alike.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Diwali', category: 'Decoration', images: ['https://picsum.photos/seed/rangoli1/400/400', 'https://picsum.photos/seed/rangoli2/400/400'], mrp: 399, price: 299, minPrice: 249, maxDiscount: 25, stock: 120, rating: 4.5, reviews: 167, negotiable: true, tags: ['diwali', 'rangoli', 'decoration', 'craft'], featured: false, createdAt: '2024-09-10' },
    { id: 'p5', name: 'Brass Puja Thali Set — 7 Piece', description: 'Traditional brass puja thali set with 7 pieces: main thali, diya holder, incense stick holder, bell, kumkum box, flower plate, and water pot. Handcrafted by artisans in Moradabad. Comes in a velvet-lined gift box.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Diwali', category: 'Decoration', images: ['https://picsum.photos/seed/thali1/400/400', 'https://picsum.photos/seed/thali2/400/400'], mrp: 1299, price: 999, minPrice: 850, maxDiscount: 20, stock: 30, rating: 4.6, reviews: 78, negotiable: true, tags: ['diwali', 'puja', 'brass', 'thali'], featured: true, createdAt: '2024-08-15' },
    { id: 'p6', name: 'Scented Oil Diyas — Jasmine & Rose (6pc)', description: 'Premium scented oil diyas infused with jasmine and rose essential oils. These clay diyas burn for 8+ hours and fill your home with a beautiful fragrance. Handmade in Jaipur. Set of 6 with 100ml oil bottle.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Diwali', category: 'Candles & Diyas', images: ['https://picsum.photos/seed/oildiya1/400/400'], mrp: 449, price: 349, minPrice: 299, maxDiscount: 20, stock: 60, rating: 4.7, reviews: 143, negotiable: true, tags: ['diwali', 'diya', 'scented', 'aromatic'], featured: false, createdAt: '2024-09-12' },
    { id: 'p7', name: 'Traditional Mithai Hamper — Assorted (1kg)', description: 'A curated assortment of traditional Indian sweets: Kaju Katli, Motichoor Ladoo, Besan Barfi, Gulab Jamun, and Rasgulla. All made fresh with no preservatives. Packed in a premium wooden box with festive wrapping.', sellerId: 's2', sellerName: 'MithaiBhandar', festival: 'Diwali', category: 'Food & Sweets', images: ['https://picsum.photos/seed/hamper1/400/400', 'https://picsum.photos/seed/hamper2/400/400'], mrp: 1200, price: 999, minPrice: 899, maxDiscount: 15, stock: 50, rating: 4.9, reviews: 289, negotiable: false, tags: ['diwali', 'hamper', 'sweets', 'gift'], featured: true, createdAt: '2024-09-08' },
    { id: 'p8', name: 'Decorative LED String Lights — Diya Shape (5m)', description: 'Beautiful LED string lights shaped like traditional diyas. 5 meters with 50 LED bulbs in warm golden light. USB powered with 8 lighting modes. Perfect for home decoration, balconies, and festive displays. Energy efficient.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Diwali', category: 'Decoration', images: ['https://picsum.photos/seed/lights1/400/400'], mrp: 599, price: 449, minPrice: 380, maxDiscount: 20, stock: 75, rating: 4.4, reviews: 201, negotiable: true, tags: ['diwali', 'lights', 'LED', 'decoration'], featured: false, createdAt: '2024-09-15' },
    // Holi
    { id: 'p9', name: 'Organic Gulal Set — 5 Vibrant Colors', description: 'Premium organic gulal made from flower petals and natural herbs. 100% skin-safe, non-toxic, and eco-friendly. Colors: Rose Pink, Sky Blue, Sunshine Yellow, Leaf Green, and Sunset Orange. Each color in a 100g pouch. Perfect for a safe and joyful Holi.', sellerId: 's2', sellerName: 'MithaiBhandar', festival: 'Holi', category: 'Decoration', images: ['https://picsum.photos/seed/gulal1/400/400', 'https://picsum.photos/seed/gulal2/400/400'], mrp: 499, price: 399, minPrice: 329, maxDiscount: 20, stock: 200, rating: 4.8, reviews: 445, negotiable: true, tags: ['holi', 'gulal', 'organic', 'colors'], featured: true, createdAt: '2024-01-15' },
    { id: 'p10', name: 'Premium Pichkari Water Gun — Elephant Design', description: 'Fun and durable pichkari in a beautiful elephant design. Made from BPA-free plastic. Holds 1.5 liters of water. Ergonomic grip for kids and adults. Range: up to 8 meters. Available in 3 colors. Perfect for Holi celebrations.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Holi', category: 'Decoration', images: ['https://picsum.photos/seed/pichkari1/400/400'], mrp: 349, price: 249, minPrice: 199, maxDiscount: 25, stock: 150, rating: 4.5, reviews: 312, negotiable: true, tags: ['holi', 'pichkari', 'water gun', 'kids'], featured: false, createdAt: '2024-01-20' },
    { id: 'p11', name: 'Holi T-Shirt Bundle — Pack of 3', description: 'Comfortable white cotton t-shirts perfect for Holi. Pre-washed and ready to be splashed with colors. 100% pure cotton, breathable fabric. Available in S, M, L, XL, XXL. Pack of 3 — one for you and two for friends!', sellerId: 's4', sellerName: 'PunjabDiHaat', festival: 'Holi', category: 'Clothing', images: ['https://picsum.photos/seed/tshirt1/400/400'], mrp: 599, price: 449, minPrice: 380, maxDiscount: 20, stock: 100, rating: 4.3, reviews: 189, negotiable: true, tags: ['holi', 't-shirt', 'clothing', 'cotton'], featured: false, createdAt: '2024-01-25' },
    { id: 'p12', name: 'Herbal Thandai Mix — Premium (500g)', description: 'Traditional Thandai mix made from almonds, fennel seeds, cardamom, rose petals, and saffron. No artificial flavors or colors. Just mix with chilled milk for an authentic Holi drink. Serves 20 glasses. Recipe card included.', sellerId: 's2', sellerName: 'MithaiBhandar', festival: 'Holi', category: 'Food & Sweets', images: ['https://picsum.photos/seed/thandai1/400/400'], mrp: 399, price: 299, minPrice: 249, maxDiscount: 20, stock: 80, rating: 4.7, reviews: 234, negotiable: false, tags: ['holi', 'thandai', 'drink', 'traditional'], featured: true, createdAt: '2024-02-01' },
    // Navratri
    { id: 'p13', name: 'Decorated Dandiya Stick Set (2 pairs)', description: 'Beautifully decorated dandiya sticks with mirror work, beads, and colorful ribbons. Each stick is 45cm long, made from premium wood. Comes in a set of 2 pairs (4 sticks). Perfect for Garba and Dandiya Raas performances.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Navratri', category: 'Decoration', images: ['https://picsum.photos/seed/dandiya1/400/400', 'https://picsum.photos/seed/dandiya2/400/400'], mrp: 599, price: 449, minPrice: 380, maxDiscount: 20, stock: 60, rating: 4.6, reviews: 178, negotiable: true, tags: ['navratri', 'dandiya', 'garba', 'dance'], featured: true, createdAt: '2024-09-20' },
    { id: 'p14', name: 'Chaniya Choli — Embroidered Lehenga Set', description: 'Stunning Chaniya Choli with intricate mirror work and embroidery. Includes lehenga, choli, and dupatta. Fabric: georgette with cotton lining. Available in Red, Blue, Green, and Pink. Perfect for Navratri Garba nights.', sellerId: 's3', sellerName: 'KeralaKrafts', festival: 'Navratri', category: 'Clothing', images: ['https://picsum.photos/seed/lehenga1/400/400', 'https://picsum.photos/seed/lehenga2/400/400'], mrp: 3500, price: 2799, minPrice: 2400, maxDiscount: 15, stock: 20, rating: 4.8, reviews: 95, negotiable: true, tags: ['navratri', 'chaniya choli', 'lehenga', 'garba'], featured: true, createdAt: '2024-09-18' },
    { id: 'p15', name: 'Navratri Garland Set — Marigold & Rose', description: 'Fresh-look artificial garland set made from premium silk flowers. Includes 3 garlands: marigold (2m), rose (1.5m), and mixed (2m). Reusable, easy to hang. Perfect for home decoration during Navratri and other festivals.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Navratri', category: 'Decoration', images: ['https://picsum.photos/seed/garland1/400/400'], mrp: 349, price: 249, minPrice: 199, maxDiscount: 25, stock: 90, rating: 4.4, reviews: 123, negotiable: true, tags: ['navratri', 'garland', 'decoration', 'flowers'], featured: false, createdAt: '2024-09-22' },
    // Eid
    { id: 'p16', name: 'Sheer Khurma Mix Pack — Premium (1kg)', description: 'Authentic Sheer Khurma mix with premium vermicelli, dry fruits (almonds, cashews, pistachios, raisins), and aromatic spices. Just add milk and sugar. Traditional recipe from Hyderabad. Makes 8-10 servings. Perfect for Eid celebrations.', sellerId: 's2', sellerName: 'MithaiBhandar', festival: 'Eid', category: 'Food & Sweets', images: ['https://picsum.photos/seed/sheerkhurma1/400/400'], mrp: 599, price: 499, minPrice: 429, maxDiscount: 15, stock: 70, rating: 4.8, reviews: 167, negotiable: false, tags: ['eid', 'sheer khurma', 'sweets', 'traditional'], featured: true, createdAt: '2024-03-01' },
    { id: 'p17', name: 'Embroidered Kurta Pajama Set — Eid Special', description: 'Elegant kurta pajama set with intricate chikankari embroidery. Fabric: premium cotton silk. Comes with matching pajama and dupatta. Available in White, Cream, and Light Blue. Perfect for Eid prayers and celebrations.', sellerId: 's4', sellerName: 'PunjabDiHaat', festival: 'Eid', category: 'Clothing', images: ['https://picsum.photos/seed/kurta1/400/400', 'https://picsum.photos/seed/kurta2/400/400'], mrp: 2999, price: 2299, minPrice: 1999, maxDiscount: 20, stock: 25, rating: 4.7, reviews: 88, negotiable: true, tags: ['eid', 'kurta', 'clothing', 'embroidery'], featured: false, createdAt: '2024-03-05' },
    { id: 'p18', name: 'Attar Perfume Set — 5 Fragrances', description: 'Premium attar (concentrated perfume oil) set with 5 fragrances: Rose, Oud, Jasmine, Sandalwood, and Musk. Each in a 6ml crystal bottle. Long-lasting, alcohol-free. Traditional Indian perfumery at its finest. Perfect Eid gift.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Eid', category: 'Decoration', images: ['https://picsum.photos/seed/attar1/400/400'], mrp: 1499, price: 1199, minPrice: 999, maxDiscount: 20, stock: 40, rating: 4.9, reviews: 201, negotiable: true, tags: ['eid', 'attar', 'perfume', 'gift'], featured: true, createdAt: '2024-03-08' },
    // Christmas
    { id: 'p19', name: 'Handmade Christmas Wreath — Pine & Holly', description: 'Beautiful handmade Christmas wreath made from real dried pine branches, holly berries, and pine cones. Decorated with a red velvet ribbon and gold ornaments. 40cm diameter. Comes with a hanging hook. Made by artisans in Shillong.', sellerId: 's3', sellerName: 'KeralaKrafts', festival: 'Christmas', category: 'Decoration', images: ['https://picsum.photos/seed/wreath1/400/400'], mrp: 899, price: 699, minPrice: 599, maxDiscount: 20, stock: 35, rating: 4.7, reviews: 112, negotiable: true, tags: ['christmas', 'wreath', 'decoration', 'handmade'], featured: true, createdAt: '2024-11-01' },
    { id: 'p20', name: 'Homemade Plum Cake — Traditional Kerala Recipe', description: 'Rich, moist plum cake made with premium dry fruits soaked in grape juice for 30 days. Traditional Kerala Christmas recipe passed down through generations. No artificial colors or flavors. 500g. Ships in a premium tin box.', sellerId: 's3', sellerName: 'KeralaKrafts', festival: 'Christmas', category: 'Food & Sweets', images: ['https://picsum.photos/seed/plumcake1/400/400'], mrp: 799, price: 649, minPrice: 579, maxDiscount: 15, stock: 50, rating: 4.9, reviews: 287, negotiable: false, tags: ['christmas', 'plum cake', 'kerala', 'baked'], featured: true, createdAt: '2024-11-05' },
    // Pongal / Lohri
    { id: 'p21', name: 'Organic Sugarcane Jaggery — Pure (1kg)', description: 'Pure organic jaggery made from fresh sugarcane juice using traditional methods. No chemicals, no additives. Rich in iron and minerals. Perfect for Pongal, Lohri sweets, and daily use. Sourced directly from farmers in Kolhapur.', sellerId: 's2', sellerName: 'MithaiBhandar', festival: 'Pongal', category: 'Food & Sweets', images: ['https://picsum.photos/seed/jaggery1/400/400'], mrp: 299, price: 229, minPrice: 189, maxDiscount: 20, stock: 150, rating: 4.6, reviews: 334, negotiable: false, tags: ['pongal', 'lohri', 'jaggery', 'organic'], featured: false, createdAt: '2024-01-01' },
    { id: 'p22', name: 'Sesame Til Ladoo Pack (500g)', description: 'Traditional til ladoo made from roasted sesame seeds and jaggery. Crispy outside, soft inside. No preservatives. Made fresh in small batches. Perfect for Lohri, Makar Sankranti, and Pongal celebrations. Pack of 20 ladoos.', sellerId: 's2', sellerName: 'MithaiBhandar', festival: 'Lohri', category: 'Food & Sweets', images: ['https://picsum.photos/seed/ladoo1/400/400'], mrp: 349, price: 279, minPrice: 239, maxDiscount: 15, stock: 100, rating: 4.7, reviews: 198, negotiable: false, tags: ['lohri', 'til ladoo', 'sweets', 'traditional'], featured: false, createdAt: '2024-01-05' },
    { id: 'p23', name: 'Handwoven Phulkari Dupatta — Vibrant Colors', description: 'Authentic Phulkari dupatta handwoven by women artisans in rural Punjab. Traditional floral embroidery on pure cotton fabric. Available in Red, Blue, and Green. 2.5 meters length. Each piece is unique and takes 3 days to make.', sellerId: 's4', sellerName: 'PunjabDiHaat', festival: 'Lohri', category: 'Clothing', images: ['https://picsum.photos/seed/phulkari1/400/400', 'https://picsum.photos/seed/phulkari2/400/400'], mrp: 1299, price: 999, minPrice: 849, maxDiscount: 20, stock: 30, rating: 4.8, reviews: 145, negotiable: true, tags: ['lohri', 'phulkari', 'dupatta', 'punjab'], featured: true, createdAt: '2024-01-08' },
    // General / All-Year
    { id: 'p24', name: 'Artisan Handmade Soy Candle Set (3 pcs)', description: 'Premium soy wax candles handmade with essential oils. Set of 3: Sandalwood & Rose, Jasmine & Mint, Lavender & Vanilla. Each candle burns for 40+ hours. Cotton wick, no paraffin. Comes in beautiful ceramic jars. Perfect gift for any occasion.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'All', category: 'Candles & Diyas', images: ['https://picsum.photos/seed/candle1/400/400', 'https://picsum.photos/seed/candle2/400/400'], mrp: 899, price: 699, minPrice: 599, maxDiscount: 20, stock: 55, rating: 4.8, reviews: 267, negotiable: true, tags: ['candles', 'soy', 'handmade', 'gift'], featured: false, createdAt: '2024-06-01' },
    { id: 'p25', name: 'Terracotta Jewelry Box — Hand-Painted', description: 'Elegant terracotta jewelry box hand-painted with traditional Madhubani art. Features 3 compartments and a mirror inside the lid. Dimensions: 20x15x8 cm. Each box is unique — no two are exactly alike. Perfect for storing jewelry and small accessories.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'All', category: 'Handicrafts', images: ['https://picsum.photos/seed/terracotta1/400/400'], mrp: 799, price: 599, minPrice: 499, maxDiscount: 25, stock: 40, rating: 4.7, reviews: 156, negotiable: true, tags: ['jewelry box', 'terracotta', 'madhubani', 'handmade'], featured: false, createdAt: '2024-05-15' },
    { id: 'p26', name: 'Embroidered Cushion Covers — Set of 4', description: 'Luxurious cushion covers with hand-embroidered floral patterns. 100% cotton fabric with hidden zipper. Size: 16x16 inches. Set of 4 in complementary colors. Machine washable. Adds an ethnic touch to any living space.', sellerId: 's4', sellerName: 'PunjabDiHaat', festival: 'All', category: 'Handicrafts', images: ['https://picsum.photos/seed/cushion1/400/400'], mrp: 1199, price: 899, minPrice: 749, maxDiscount: 20, stock: 65, rating: 4.5, reviews: 189, negotiable: true, tags: ['cushion covers', 'embroidery', 'home decor', 'cotton'], featured: false, createdAt: '2024-04-20' },
    { id: 'p27', name: 'Handpainted Ceramic Mug Set (4 pcs)', description: 'Charming ceramic mugs hand-painted with Indian folk art motifs. Each mug holds 300ml. Dishwasher safe. Set of 4 with different designs: Warli, Madhubani, Pattachitra, and Gond art. Microwave safe. Perfect for chai lovers.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'All', category: 'Handicrafts', images: ['https://picsum.photos/seed/mug1/400/400', 'https://picsum.photos/seed/mug2/400/400'], mrp: 1099, price: 849, minPrice: 699, maxDiscount: 20, stock: 50, rating: 4.6, reviews: 213, negotiable: true, tags: ['mug', 'ceramic', 'folk art', 'handpainted'], featured: false, createdAt: '2024-05-01' },
    { id: 'p28', name: 'Mehndi Cone Pack — Premium (12 cones)', description: 'Premium natural mehndi cones made from fresh henna leaves. Rich dark color, long-lasting stain. No chemicals or PPD. Each cone is 25g. Comes with 5 design stencils and aftercare guide. Perfect for Eid, weddings, and festivals.', sellerId: 's2', sellerName: 'MithaiBhandar', festival: 'Eid', category: 'Decoration', images: ['https://picsum.photos/seed/mehndi1/400/400'], mrp: 449, price: 349, minPrice: 289, maxDiscount: 20, stock: 120, rating: 4.7, reviews: 378, negotiable: true, tags: ['mehndi', 'henna', 'eid', 'bridal'], featured: false, createdAt: '2024-03-10' },
    { id: 'p29', name: 'Traditional Pot Decoration Kit — Pongal Special', description: 'Complete kit for decorating the traditional Pongal pot. Includes: turmeric powder, kumkum, white rice flour for kolam, sugarcane pieces (artificial), mango leaves garland, and step-by-step guide. Everything you need for an authentic Pongal celebration.', sellerId: 's1', sellerName: 'KalaKraft', festival: 'Pongal', category: 'Decoration', images: ['https://picsum.photos/seed/pongal1/400/400'], mrp: 499, price: 379, minPrice: 319, maxDiscount: 20, stock: 45, rating: 4.5, reviews: 89, negotiable: true, tags: ['pongal', 'decoration', 'traditional', 'kit'], featured: false, createdAt: '2024-01-02' },
    { id: 'p30', name: 'Kasavu Saree — Kerala Traditional (Onam Special)', description: 'Authentic Kerala Kasavu saree with traditional gold border. Handwoven by Balaramapuram weavers using pure cotton and real gold thread. The classic off-white and gold combination is perfect for Onam Sadya and celebrations. Comes with matching blouse piece.', sellerId: 's3', sellerName: 'KeralaKrafts', festival: 'Onam', category: 'Clothing', images: ['https://picsum.photos/seed/kasavu1/400/400', 'https://picsum.photos/seed/kasavu2/400/400'], mrp: 4500, price: 3799, minPrice: 3299, maxDiscount: 15, stock: 12, rating: 4.9, reviews: 134, negotiable: true, tags: ['onam', 'kasavu', 'saree', 'kerala'], featured: true, createdAt: '2024-08-01' },
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
    { id: 'post1', authorId: 'c1', authorName: 'Arjun Mehta', authorAvatar: 'https://i.pravatar.cc/150?img=11', type: 'review', festival: 'Diwali', content: 'Just got this amazing Diwali hamper from @KalaKraft 🪔 The diyas are hand-painted and so beautiful! The packaging was premium and delivery was super fast. Highly recommend!', image: 'https://picsum.photos/seed/post1/600/400', likes: 47, comments: 8, createdAt: '2024-10-28T10:30:00Z', likedBy: [] },
    { id: 'post2', authorId: 'c2', authorName: 'Sneha Reddy', authorAvatar: 'https://i.pravatar.cc/150?img=25', type: 'tip', festival: 'Holi', content: 'Holi tip: Always use herbal colors — much safer for skin! Found great organic ones on BizUplift 🎨 Also, apply coconut oil before playing to protect your skin. Happy Holi everyone!', image: null, likes: 89, comments: 15, createdAt: '2024-03-24T09:15:00Z', likedBy: [] },
    { id: 'post3', authorId: 'c3', authorName: 'Vikram Joshi', authorAvatar: 'https://i.pravatar.cc/150?img=33', type: 'review', festival: 'All', content: 'My order arrived 2 days early! Seller communication was amazing ⭐⭐⭐⭐⭐ The Phulkari dupatta from PunjabDiHaat is even more beautiful in person. The embroidery is so intricate!', image: 'https://picsum.photos/seed/post3/600/400', likes: 34, comments: 5, createdAt: '2024-09-15T14:20:00Z', likedBy: [] },
    { id: 'post4', authorId: 's1_user', authorName: 'Priya Sharma (KalaKraft)', authorAvatar: 'https://i.pravatar.cc/150?img=47', type: 'seller_story', festival: 'Diwali', content: 'Excited to share that KalaKraft just crossed 1000 orders! 🎉 Thank you to every customer who supported a small seller. This Diwali, we have 20 new diya designs. Each one painted with love 🪔', image: 'https://picsum.photos/seed/post4/600/400', likes: 156, comments: 23, createdAt: '2024-10-15T11:00:00Z', likedBy: [] },
    { id: 'post5', authorId: 'c4', authorName: 'Meera Pillai', authorAvatar: 'https://i.pravatar.cc/150?img=44', type: 'tip', festival: 'Onam', content: 'Onam Sadya tip: Order your Kasavu saree at least 2 weeks before Onam! The handwoven ones from KeralaKrafts are worth the wait 🌸 The quality is unmatched. Onam Ashamsakal!', image: null, likes: 67, comments: 11, createdAt: '2024-09-10T08:30:00Z', likedBy: [] },
    { id: 'post6', authorId: 'c5', authorName: 'Rohan Das', authorAvatar: 'https://i.pravatar.cc/150?img=55', type: 'review', festival: 'Navratri', content: 'The Chaniya Choli from KeralaKrafts is absolutely stunning! 💃 Wore it for all 9 nights of Navratri and got so many compliments. The mirror work is so detailed. Worth every rupee!', image: 'https://picsum.photos/seed/post6/600/400', likes: 92, comments: 18, createdAt: '2024-10-05T20:00:00Z', likedBy: [] },
    { id: 'post7', authorId: 'c1', authorName: 'Arjun Mehta', authorAvatar: 'https://i.pravatar.cc/150?img=11', type: 'tip', festival: 'Diwali', content: 'Pro tip for Diwali shopping: Use the AI negotiation feature on BizUplift! I saved ₹200 on a brass thali set 🤝 The AI seller agent is so friendly and speaks Hinglish — feels like talking to a real seller!', image: null, likes: 123, comments: 31, createdAt: '2024-10-20T16:45:00Z', likedBy: [] },
    { id: 'post8', authorId: 's2_user', authorName: 'Ramesh Patel (MithaiBhandar)', authorAvatar: 'https://i.pravatar.cc/150?img=12', type: 'seller_story', festival: 'Eid', content: 'Our Sheer Khurma mix is now available for Eid! 🌙 Made with the same recipe my great-grandmother used. No preservatives, just pure love and tradition. Order early — we sell out every year!', image: 'https://picsum.photos/seed/post8/600/400', likes: 78, comments: 14, createdAt: '2024-04-05T10:00:00Z', likedBy: [] },
    { id: 'post9', authorId: 'c2', authorName: 'Sneha Reddy', authorAvatar: 'https://i.pravatar.cc/150?img=25', type: 'review', festival: 'Christmas', content: 'The Kerala Plum Cake from KeralaKrafts is DIVINE 🎄 Rich, moist, and full of dry fruits. You can taste the love in every bite. Already ordered 3 more for gifts!', image: 'https://picsum.photos/seed/post9/600/400', likes: 55, comments: 9, createdAt: '2024-12-20T12:00:00Z', likedBy: [] },
    { id: 'post10', authorId: 'c3', authorName: 'Vikram Joshi', authorAvatar: 'https://i.pravatar.cc/150?img=33', type: 'tip', festival: 'Holi', content: 'Building a custom Holi hamper on BizUplift is so fun! 🎨 I added organic gulal, a premium pichkari, and thandai mix. Total came to ₹850 — much cheaper than buying separately. Try the hamper builder!', image: null, likes: 44, comments: 7, createdAt: '2024-03-20T15:30:00Z', likedBy: [] },
    { id: 'post11', authorId: 's4_user', authorName: 'Gurpreet Singh (PunjabDiHaat)', authorAvatar: 'https://i.pravatar.cc/150?img=67', type: 'seller_story', festival: 'Lohri', content: 'Lohri is coming! 🔥 Our Phulkari dupattas are ready. Each one is handwoven by women artisans from my village. When you buy from us, you\'re supporting 20 families. Bohot shukriya to all our customers!', image: 'https://picsum.photos/seed/post11/600/400', likes: 201, comments: 38, createdAt: '2024-01-10T09:00:00Z', likedBy: [] },
    { id: 'post12', authorId: 'c4', authorName: 'Meera Pillai', authorAvatar: 'https://i.pravatar.cc/150?img=44', type: 'review', festival: 'Eid', content: 'The Attar perfume set from KalaKraft is absolutely gorgeous! 🌹 The Oud fragrance is especially divine. Gifted it to my husband for Eid and he loves it. The crystal bottles are so elegant!', image: 'https://picsum.photos/seed/post12/600/400', likes: 38, comments: 6, createdAt: '2024-04-10T18:00:00Z', likedBy: [] },
    { id: 'post13', authorId: 'c5', authorName: 'Rohan Das', authorAvatar: 'https://i.pravatar.cc/150?img=55', type: 'tip', festival: 'Navratri', content: 'Navratri Garba tip: Wear comfortable footwear and practice dandiya moves before the event! 💃 Also, the decorated dandiya sticks from KalaKraft are so beautiful — they make great photos too!', image: null, likes: 71, comments: 13, createdAt: '2024-10-02T21:00:00Z', likedBy: [] },
    { id: 'post14', authorId: 's3_user', authorName: 'Anjali Nair (KeralaKrafts)', authorAvatar: 'https://i.pravatar.cc/150?img=32', type: 'seller_story', festival: 'Onam', content: 'Onam is our biggest festival! 🌸 This year we have 5 new Kasavu saree designs. Each saree takes 3 days to weave. We\'re working with 12 weavers to fulfill all orders. Onam Ashamsakal from KeralaKrafts!', image: 'https://picsum.photos/seed/post14/600/400', likes: 167, comments: 29, createdAt: '2024-09-05T10:00:00Z', likedBy: [] },
    { id: 'post15', authorId: 'c1', authorName: 'Arjun Mehta', authorAvatar: 'https://i.pravatar.cc/150?img=11', type: 'review', festival: 'All', content: 'BizUplift credit points are amazing! 💰 I\'ve earned 1250 points from my purchases = ₹125 off my next order. Plus the referral bonus is great. Referred 3 friends and got 600 bonus points!', image: null, likes: 88, comments: 20, createdAt: '2024-11-01T14:00:00Z', likedBy: [] },
];

const SEED_ORDERS = [
    { id: 'ORD001', customerId: 'c1', items: [{ productId: 'p1', name: 'Hand-Painted Lakshmi Diya Set', quantity: 2, price: 449, image: 'https://picsum.photos/seed/diya1/400/400' }], total: 948, status: 'Delivered', paymentMethod: 'UPI', address: { name: 'Arjun Mehta', line1: '42, Shanti Nagar', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '9876543210' }, createdAt: '2024-10-20T10:00:00Z', deliveredAt: '2024-10-25T15:00:00Z', creditsEarned: 94 },
    { id: 'ORD002', customerId: 'c1', items: [{ productId: 'p2', name: 'Premium Kaju Katli Box', quantity: 1, price: 650, image: 'https://picsum.photos/seed/katli1/400/400' }, { productId: 'p5', name: 'Brass Puja Thali Set', quantity: 1, price: 999, image: 'https://picsum.photos/seed/thali1/400/400' }], total: 1699, status: 'Shipped', paymentMethod: 'Card', address: { name: 'Arjun Mehta', line1: '42, Shanti Nagar', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '9876543210' }, createdAt: '2024-10-28T14:00:00Z', creditsEarned: 169 },
    { id: 'ORD003', customerId: 'c1', items: [{ productId: 'p9', name: 'Organic Gulal Set', quantity: 1, price: 399, image: 'https://picsum.photos/seed/gulal1/400/400' }], total: 449, status: 'Processing', paymentMethod: 'COD', address: { name: 'Arjun Mehta', line1: '42, Shanti Nagar', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '9876543210' }, createdAt: '2024-11-01T09:00:00Z', creditsEarned: 44 },
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
