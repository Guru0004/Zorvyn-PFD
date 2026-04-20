# 📊 PFD - Modern Personal Finance Dashboard

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

Personal Finance Dashboard is a premium, high-performance personal finance dashboard designed for clarity and efficiency. Built with React 19 and styled with a sleek glassmorphism aesthetic, it provides real-time insights into your spending habits, income trends, and overall financial health.

![Dashboard Preview](https://via.placeholder.com/1200x600?text=Personal+Finance+Dashboard+Preview)

## 📋 Overview of Approach

Personal Finance Dashboard is architected as a high-fidelity **Single Page Application (SPA)** that prioritizes user experience and data portability. Key design philosophies include:
- **Zero-Setup Persistence**: Uses `localStorage` to provide an instant, "out-of-the-box" experience without requiring a complex backend setup.
- **Glassmorphism UI**: A consistent design language using blurred layers, subtle borders, and smooth Framer Motion transitions for a premium feel.
- **Efficient State Management**: Utilizes a centralized **Context API + useReducer** architecture to manage global state (transactions, filtering, and theme) with high performance and low overhead.
- **Granular Loading**: Implements a custom **Manual Chunking Strategy** to ensure the initial load is lightweight, deferring heavy visualization and animation libraries.

## ✨ Key Features

### 💰 Financial Intelligence
- **Real-time Summaries**: Interactive cards for Total Balance, Monthly Income, and Expenses with dynamic trend indicators.
- **Financial Insights**: Automated analysis providing Savings Rate metrics, Top Spending Categories, and daily averages.
- **Advanced Visualizations**:
  - **Balance Trend Chart**: Area chart showing net worth progression.
  - **Cash Flow Chart**: Line chart comparing Income vs. Expenses.
  - **Spending Breakdown**: Filterable Pie Chart for categorical analysis.

### 📑 Transaction Management
- **Full CRUD Support**: Effortlessly add, edit, or delete transactions with instant dashboard synchronization.
- **Smart Searching**: Search transactions by **Title**, **Category**, or even specific **Dollar Amounts**.
- **Context-Aware Inputs**: Transaction forms automatically filter categories based on the selected type (Income/Expense).
- **Infinite Discovery**: "Show More" pagination keeps the Recent Transactions list clean and performant.

### 🛡️ Data & Accessibility
- **Portability**: Full support for **Import & Export (JSON)**. Backup your data as a file or restore it to move between devices.
- **Role-Based Access**: Toggle between **Admin** (full control) and **Viewer** (read-only) modes via the integrated Profile Menu.
- **Dark Mode**: Premium theme support with automatic system preference detection.
- **Empty States**: Helpful "Not enough data" placeholders guide users through new account setups or strict filtering.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 20.0.0)
- npm (>= 10.0.0)

### Installation & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Guru0004/Zorvyn-PFD.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

### Build & Production

To create an optimized production bundle:
```bash
npm run build
```

This project is configured with an explicit **`vercel.json`** and standardized dependencies to ensure seamless deployment on the Vercel platform.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by [Guru0004](https://github.com/Guru0004)
