# 📊 Zorvyn - Modern Personal Finance Dashboard

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

Zorvyn is a premium, high-performance personal finance dashboard designed for clarity and efficiency. Built with React 19 and styled with a sleek glassmorphism aesthetic, it provides real-time insights into your spending habits, income trends, and overall financial health.

![Dashboard Preview](https://via.placeholder.com/1200x600?text=Zorvyn+Finance+Dashboard+Preview)

## ✨ Features

- **💰 Financial Overview**: Real-time summary cards for Total Balance, Monthly Income, and Monthly Expenses with interactive growth trends.
- **📈 Advanced Visualizations**:
  - **Balance Trend**: Interactive Area Chart showing your net worth over time.
  - **Spending Breakdown**: Dynamic Pie Chart with category-specific filtering.
  - **Cash Flow**: Dual-line chart comparing Income vs. Expenses.
- **📑 Transaction Management**:
  - Full CRUD functionality (Add, Edit, Delete).
  - context-aware category selection based on transaction type.
  - Robust form validation and real-time error feedback.
  - "Show More" smart pagination for clean list management.
- **🔍 Powerful Filtering**: Filter transactions by date range (7d, 30d, 90d, All), search query, or transaction type.
- **🔐 Role-Based Access Control**:
  - **Admin**: Full control over transactions and settings.
  - **Viewer**: Read-only access to charts and history.
- **🌗 Dark Mode**: Full theme support with automatic system detection.
- **⚡ Optimized Performance**: Custom Rollup chunk splitting for lightning-fast initial loads and granular library fetching.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/) with Integrated Analytics

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 20.0.0)
- npm (>= 10.0.0)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Guru0004/Zorvyn-PFD.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Build & Optimization

To create an optimized production build:

```bash
npm run build
```

This project uses a custom **Manual Chunking Strategy** in `vite.config.js` to split large libraries (`recharts`, `framer-motion`) into separate files, ensuring the dashboard loads instantly even on slower connections.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by [Guru0004](https://github.com/Guru0004)
