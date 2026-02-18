# 🛍️ BizUplift — Festival Marketplace

A production-ready Indian festival marketplace connecting local artisans with customers across India. Built with React + Vite, featuring AI-powered price negotiation, 10 dynamic festival themes, and three role-based dashboards.

---

## ✨ Features

### 🎨 10 Festival Themes
Dynamic themes with canvas particle animations — switch between Diwali, Holi, Navratri, Eid, Christmas, Onam, Lohri, Pongal, Baisakhi, and Default. Every color, font, and animation updates instantly via CSS variables.

### 🤖 AI Price Negotiation
Negotiate prices directly on product pages using Claude AI. The AI seller speaks Hinglish, responds to quick offer buttons, and detects when a deal is reached — the negotiated price carries through to your cart.

### 🛒 Full Shopping Flow
Browse → Filter → Negotiate → Cart (with coupons & credit points) → Checkout (UPI/Card/COD) → Order Tracking

### ⭐ Credit Points System
Earn points on every purchase, review, community post, and referral. Redeem at checkout for discounts.

### 🎁 Hamper Builder
Build custom festival gift hampers — pick a theme, set a budget, add products, and personalize with a message.

### 👥 Community Feed
Share reviews, tips, and seller stories. 15+ seeded posts across all festivals.

---

## 📄 Pages (17 Routes)

| Page | Route |
|------|-------|
| Home | `/` |
| Marketplace | `/marketplace` |
| Product Detail | `/product/:id` |
| Auth (Login/Register) | `/auth` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Orders | `/orders` |
| Wishlist | `/wishlist` |
| Customer Dashboard | `/dashboard/customer` |
| Seller Dashboard | `/dashboard/seller` |
| Admin Dashboard | `/dashboard/admin` |
| Community | `/community` |
| Hamper Builder | `/hamper` |
| Seller Profile | `/seller/:id` |
| Credits | `/credits` |
| Festivals | `/festivals` |
| Collaborate (Seller Onboarding) | `/collaborate` |

---

## 🔐 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Customer | `arjun@example.com` | `password123` |
| Seller | `priya@kalakraft.com` | `seller123` |
| Admin | `admin@bizuplift.com` | `admin123` |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 19 + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS + CSS Variables |
| State | React Context API |
| Charts | Recharts |
| Icons | Lucide React |
| AI | Anthropic Claude API |
| Persistence | localStorage |

---

## 📦 Data Seeded

- **30 products** across 8 festivals
- **4 sellers** with full stories & milestones
- **9 users** (admin, customers, sellers)
- **15 community posts**
- **Sample orders** with timeline data

---

## 🏗️ Project Structure

```
src/
├── context/          # DataContext, AuthContext, CartContext, NotificationContext, ThemeContext
├── components/
│   ├── Layout/       # Navbar, Footer
│   └── UI/           # ParticleLayer, ThemeSwitcher, ToastContainer, Badge, Card
└── pages/            # 17 lazy-loaded page components
```

---

## 🤝 Contributing

This project was built as a hackathon/portfolio project. PRs welcome!

---

*Made with ❤️ for Indian festivals and local artisans*
