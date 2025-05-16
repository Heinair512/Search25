# Search25 - Enterprise Search Management Platform

## Overview
Search25 is an enterprise search management platform that helps organizations optimize their search experience through curation, analytics, and relevance tuning.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (included with Node.js)

### Installation
1. Clone the repository
```bash
git clone <repository-url>
cd search25
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```
Update the `.env` file with your Supabase credentials.

4. Start development server
```bash
npm run dev
```

### Test Credentials
- Email: Joerg.Wehrenberg@gc-gruppe.de
- Password: 12345

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:ui` - Run end-to-end tests with UI

### Project Structure
```
src/
├── assets/         # Static assets
├── components/     # Vue components
├── data/          # Mock data and state management
├── i18n/          # Internationalization
├── screens/       # Page components
├── store/         # State management
├── tests/         # Test files
└── utils/         # Utility functions
```

### Technology Stack
- Vue 3 with Composition API
- Vite for development and building
- PrimeVue for UI components
- Vue Router for navigation
- Vue I18n for internationalization
- Chart.js for analytics visualization

## Contributing
1. Create a feature branch
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit
```bash
git add .
git commit -m "feat: add your feature"
```

3. Push to your branch
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request

## Testing
- Unit tests are in `src/tests/`
- E2E tests are in `tests/e2e/`
- Run all tests before submitting PRs

## Deployment
The project is configured for deployment on Netlify:
- Production deployments happen automatically from the main branch
- Preview deployments are created for pull requests