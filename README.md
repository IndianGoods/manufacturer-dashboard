# Dashboard - Shopify Clone

A complete dashboard application built with React, Tailwind CSS, and Redux that replicates the Shopify admin interface.

## 🚀 Features

- **Authentication System** - Login/Register with form validation
- **Dashboard Overview** - Analytics, charts, and key metrics
- **Product Management** - Products catalog with inventory management
- **Order Management** - Order tracking and fulfillment
- **RFQ System** - Request for Quotes management
- **Discount Management** - Coupon codes and promotional offers
- **Analytics** - Sales charts and performance metrics
- **Support System** - Customer support interface
- **Settings** - Account and system configuration

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Heroicons
- **UI Components**: Headless UI

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd man-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 Design System

- **Primary Color**: Blue (#0743ba)
- **Secondary Color**: Orange (#fa7414) - Used sparingly
- **Layout**: Clean white interface with subtle shadows
- **Typography**: Inter font family
- **Responsive**: Desktop-first approach

## 🔐 Demo Credentials

- **Email**: admin@dashboard.com
- **Password**: password

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Card, Input, etc.)
│   └── layout/         # Layout components (Sidebar, Header, etc.)
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   └── dashboard/      # Dashboard pages
├── store/              # Redux store configuration
│   └── slices/         # Redux slices
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── utils/              # Utility functions
├── data/               # Mock data
└── assets/             # Static assets
```

## 🎯 Key Pages

1. **Home** - Dashboard overview with analytics charts and metrics
2. **Products** - Complete Shopify-style product management
   - **Both States**: Empty state and populated state
   - **Bulk Actions**: Select all, bulk edit, bulk delete, activate/deactivate
   - **Filtering**: Status tabs (All, Active, Draft, Archived)
   - **Search**: Real-time search across product names and SKUs
   - **Sorting**: Multiple sort options (name, date, inventory)
   - **Table Actions**: Edit, duplicate, view, delete per product
   - **Import Modal**: CSV file upload functionality
   - **Demo**: Interactive toggle between empty/populated states
   - Inventory - Stock management (sub-page)
3. **Orders** - Order processing and tracking
4. **RFQs** - Request for quotes management
5. **Discounts** - Promotional codes and offers
6. **Analytics** - Sales metrics and reports
7. **Support** - Customer support interface
8. **Settings** - Account and system settings

## 📸 Products Page Features

### ✅ **Exact Shopify Replica**
- **Empty State**: Beautiful illustration with "Add your products" section
- **Populated State**: Professional data table with all functionalities
- **Status Tabs**: All (6), Active (4), Draft (1), Archived (1) with counts
- **Header Actions**: Export, Import, More actions dropdown, Add product button

### ✅ **Interactive Features**
- **Bulk Selection**: Checkbox to select all products or individual selection
- **Search Bar**: "Searching in all products" with real-time filtering
- **Sort Options**: Product title A-Z/Z-A, Created date, Updated date, Inventory levels
- **Filter Button**: Advanced filtering capabilities
- **Row Actions**: Edit, Duplicate, View, Delete per product

### ✅ **Data Display**
- **Product Info**: Image placeholder, product name, SKU
- **Status Badges**: Active (green), Draft (yellow), Archived (gray)
- **Inventory**: Stock levels with variant counts, out-of-stock highlighting
- **Categories**: Product categorization
- **Channels**: Sales channel indicators

### ✅ **Bulk Operations**
- Make products active/inactive
- Archive products
- Add/Remove tags
- Delete multiple products
- Edit multiple products

### ✅ **Import Functionality**
- **Import Modal**: Professional file upload interface
- **CSV Support**: Drag and drop or click to upload
- **Validation**: File type checking and format requirements

## 🎮 **Demo Mode**
Visit `/dashboard/products-demo` to see an interactive demo with:
- **Toggle Switch**: Switch between empty and populated states
- **All Features Working**: Real-time filtering, sorting, and bulk actions
- **Realistic Data**: 6 sample products with different statuses and categories

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Future Enhancements

- [ ] Real API integration
- [ ] Advanced filtering and search
- [ ] Bulk operations
- [ ] File upload functionality
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile responsive optimization
- [ ] Dark theme support

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
