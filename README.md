# BNB Airdrop Platform

A secure mobile-first cryptocurrency airdrop platform for BNB token distribution and wallet management.

## 🚀 Key Features

### Core Functionality
- **Secure Wallet Management** - Create and import BNB wallets securely
- **Balance Injection System** - Test your wallet with BNB injection
- **Multi-language Support** - English, Pidgin, Hausa, Yoruba, Igbo
- **Referral System** - Built-in referral tracking and rewards
- **Transaction History** - Complete transaction tracking and management
- **Theme Switching** - Purple and Dark theme options
- **Mobile-First Design** - Optimized for mobile devices
- **Anti-Scam Protection** - Built-in warnings against fake activation numbers

### Technologies Used
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom gradients
- **Storage**: Browser localStorage (no database needed)
- **Crypto**: Ethers.js for wallet operations
- **UI**: Shadcn/ui components + Framer Motion animations
- **Icons**: Lucide React

## 🛠 Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd bnb-airdrop-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

## 📦 Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 🚀 Deployment Options

### Option 1: Static Hosting (Recommended)
Deploy the `dist` folder to any static hosting service:
- **Vercel**: Connect repository and deploy automatically
- **Netlify**: Drag and drop the dist folder
- **GitHub Pages**: Enable Pages in repository settings
- **Firebase Hosting**: `firebase deploy`

### Option 2: CDN Deployment
Upload the built files to any CDN service for global distribution.

### Option 3: Self-Hosting
Serve the `dist` folder with any web server:
```bash
# Using Python
python -m http.server 8080 -d dist

# Using Node.js serve
npx serve dist
```

## 🏗 Project Structure

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Application pages
│   ├── hooks/              # React hooks
│   ├── lib/                # Utility libraries
│   └── types/              # TypeScript definitions
├── public/                 # Static assets
└── dist/                   # Production build output
```

## 🔧 Configuration

### Environment Variables
No environment variables needed - everything runs locally!

### Customization
- **Themes**: Modify `src/index.css` for theme colors
- **Languages**: Update `src/lib/i18n.ts` for translations  
- **Wallet Logic**: Customize `src/lib/wallet.ts` for wallet operations

## 📱 Features Guide

### Wallet Management
- **Create Wallet**: Generate new BNB wallet with mnemonic
- **Import Wallet**: Import existing wallet with private key
- **Balance Injection**: Add test BNB without limits
- **Transaction History**: View all wallet activities

### Multi-language Support
Supports 5 languages with easy switching:
- English (en)
- Nigerian Pidgin (pid)
- Hausa (ha)
- Yoruba (yo)
- Igbo (ig)

### Theme System
- **Purple Theme**: Default gradient theme
- **Dark Theme**: Black/dark gradient theme
- Themes persist across sessions

## 🔒 Security

- **Local Storage Only**: No data transmitted to servers
- **Private Key Security**: Keys stored locally in browser
- **No Backend**: Eliminates server-side vulnerabilities
- **Client-Side Validation**: All validation happens in browser

## 👨‍💻 Developer Information

**Made with ❤️ by GENX**

- **Developer**: GENX
- **Contact**: +234 807 130 9276
- **WhatsApp**: [Chat with Developer](https://wa.me/2348071309276)

## 🆘 Support

For support, bug reports, or feature requests:
1. Contact the developer via WhatsApp: +234 807 130 9276
2. Send a message with your issue description
3. Include screenshots if relevant

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This is a pure frontend application designed for demonstration and testing purposes. For production use with real cryptocurrency, implement proper security measures and backend validation.