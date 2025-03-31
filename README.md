# DIRO Client Portal UI

A comprehensive client portal for managing document verification and validation services built with Next.js.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Introduction

DIRO Client Portal is a Next.js-based web application that provides document verification and validation services. It enables users to manage verification buttons, handle document requests, and monitor coverage across different regions.

### Key Features

- Document verification management
- Multi-environment support (Stage1, Stage2, Production)
- Role-based access control
- Real-time coverage monitoring
- Interactive world map integration
- Secure authentication system

## 📋 Features

### Core Functionalities

- **Validation Buttons**: Create and manage verification buttons
- **Document Management**: Handle document requests and verifications
- **Coverage Monitoring**: Interactive world map for coverage visualization
- **User Management**: Role-based access control and user administration
- **API Integration**: Comprehensive API reference and integration tools
- **Multi-Factor Authentication**: Secure access with 2FA
- **Theme Support**: Light/dark mode

### Environment Support

- Stage1 (Development)
- Stage2 (QA/Testing)
- Production (EU)

## 💻 Tech Stack

### Core Framework

- **Next.js 15.2.0** - React framework with server-side rendering and static site generation
- **React 18** - UI library for building component-based interfaces
- **TypeScript** - Type-safe JavaScript for better development experience

### UI/UX

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components library with accessibility features
- **shadcn/ui** - Component library built on top of Radix UI
- **Framer Motion** - Animation library for React
- **Sonner** - Toast notification system
- **Embla Carousel** - Carousel/slider component
- **Lucide React** - Icon library
- **Next Themes** - Theme management for Next.js

### State Management

- **Redux Toolkit** - State management library with Redux Toolkit for efficient Redux development
- **React Redux** - React bindings for Redux
- **React Hook Form** - Form state management
- **Zod** - Schema validation library

### API & Data Handling

- **Axios** - HTTP client for API requests
- **js-cookie/cookies-next** - Cookie management
- **localstorage-slim** - Enhanced localStorage utilities

### Document Handling

- **React PDF / PDF.js** - PDF rendering and manipulation
- **@react-pdf-viewer** - Enhanced PDF viewing capabilities

### Authentication

- Multi-factor authentication system
- Token-based authentication
- Cookie-based session management

## 📁 Project Structure

```
root/
├── app/
│   ├── authentication/
│   ├── client/
│   ├── components/
│   ├── config/
│   ├── lib/
│   ├── pdf/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
│
├── components/
│   ├── ui/
│   ├── ValidationButtons/
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
│
├── hooks/
├── lib/
├── public/
├── styles/
│
├── middleware.ts
├── next.config.js/mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🧩 Component Architecture

The application follows a modular component architecture designed for reusability, maintainability, and performance:

### Component Hierarchy

- **Layout Components**: Define the overall structure of pages
- **Page Components**: Represent route endpoints with their specific layouts
- **Feature Components**: Implement specific business functionalities
- **UI Components**: Reusable, presentational components used across the application

### Component Working

1. **UI Component Library** (`components/ui/`)

   - Built on shadcn/ui and Radix UI primitives
   - Provides accessible, themeable, and customizable base components
   - Implemented using Tailwind CSS for styling
   - Used as building blocks for more complex components

2. **Shared Components** (`components/`)

   - Theme-related components for application-wide dark/light mode
   - ValidationButtons components for document validation features
   - Reused across multiple pages and features

3. **App-specific Components** (`app/components/`)

   - Components tied to specific application features
   - Generally not designed for reuse outside their context
   - May consume shared UI components

4. **Composition Pattern**

   - Components are composed from smaller, focused components
   - Props are used for configuration and data passing
   - Context providers wrap component trees where appropriate

5. **State Management**

   - Local component state using React's useState and useReducer hooks
   - Global state managed through Redux for cross-component communication
   - Form state handled with React Hook Form

6. **Component Performance**

   - Memoization with React.memo for expensive renders
   - Code splitting through dynamic imports for larger components
   - Strategic use of suspense and lazy loading

7. **Testing Strategy**
   - Unit tests for isolated component behavior
   - Integration tests for component interactions
   - Snapshot tests for UI regression prevention

## 🔒 Authentication Flow

The application implements a secure authentication system with:

1. **Standard Login** - Username/password authentication
2. **Multi-Factor Authentication** - Optional two-factor authentication
3. **Token-based Sessions** - JWT tokens stored in cookies
4. **Password Recovery** - Forgot password and reset functionality

The authentication flow is enforced through middleware that protects routes based on authentication status.

## 🔀 Routing Implementation

### Core URLs

```
/client/validation-buttons            # Main dashboard
/client/documents-received            # Documents received
/client/requests-sent                 # Requests sent
/client/coverage                      # Coverage visualization
/client/integrations                  # API integrations
/client/account                       # Account settings
/client/report-issue                  # Report issues
/authentication/two-factor            # Two-factor authentication
/authentication/two-factor-configure  # Configure 2FA
```

### Environment URLs

```
Stage1: https://stage1.client.diro.live
Stage2: https://stage2.client.diro.live
Production: https://client.diro.live
```

## 🔌 API Integration

### Authentication Headers

```javascript
headers: {
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
```

### Core Endpoints

1. **Get Verification Link**

```javascript
POST /v2/get-verification-link
{
  "buttonid": "e1daa563-2ae2-47f7",
  "apikey": "your-api-key",
  "user_info": {
    "email": "user@example.com"
    // other optional user info
  }
}
```

2. **Download Documents**

```javascript
POST /v2/download-native-originals
{
  "apikey": "your-api-key",
  "sessionid": "session-id"
}
```

3. **Delete Documents**

```javascript
POST /v2/delete-document
{
  "docid": "XX-A1b2c3",
  "session": false
}
```

### Response Format

```javascript
// Success
{
  "error": false,
  "msg": "Successful",
  "data": { ... }
}

// Error
{
  "error": true,
  "message": "Error description"
}
```

## 🔄 State Management

### Redux Store Structure

```javascript
{
  auth: {
    user: null,
    isAuthenticated: false,
    loading: false,
    multiFactorEnabled: false
  },
  button: {
    buttonList: [],
    countryList: [],
    loading: false,
    error: null
  },
  document: {
    documents: [],
    loading: false,
    error: null
  }
}
```

### Redux Toolkit Slices

The application uses Redux Toolkit's createSlice for managing state:

```javascript
// Example auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    // Handle async actions
  },
});
```

## 📝 Prerequisites

- Node.js 18+
- npm/yarn
- Modern browser support (Chrome, Firefox, Safari, Edge)

## ⚙️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## 🛠️ Development

### Code Quality

#### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "endOfLine": "auto"
}
```

### Commit Convention

- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

## 🧪 Testing

### Testing Framework

- Unit Testing: Jest and React Testing Library
- E2E Testing: Cypress or Playwright

### E2E Testing Tools

1. **Testsigma**: Low-code cloud-based test automation platform
2. **Astra Pentest**: Comprehensive security testing platform
3. **Module Unit Testing**: Testing individual components and functions

### Testing Best Practices

1. **Component Testing**

   - Test user interactions
   - Verify rendered output
   - Check state changes
   - Test error scenarios

2. **Redux Testing**

   - Test action creators
   - Test reducers
   - Test selectors
   - Mock API calls

3. **Integration Testing**

   - Test component interactions
   - Verify data flow
   - Test routing behavior
   - Check error boundaries

4. **E2E Testing**
   - Test critical user paths
   - Verify form submissions
   - Check navigation flows
   - Test file uploads

## 📈 Performance Optimization

````

## 🚀 Building and Deployment

### Deployment Platforms

1. **Azure**
2. **GitHub Actions**
3. **AWS**

### Deployment Flow

1. Build static assets with `npm run build`
2. Deploy to chosen platform
3. Set up environment variables
4. Configure custom domains and SSL

## 🤝 Contributing

1. Create feature branch:

```bash
git checkout -b feature/your-feature-name
````

2. Make changes and commit:

```bash
git add .
git commit -m "feat: add new feature"
```

3. Push changes:

```bash
git push origin feature/your-feature-name
```

4. Create Pull Request:
   - Use descriptive title
   - Add detailed description
   - Reference related issues
   - Add screenshots if UI changes

## 📄 License

Copyright © 2025 DIRO Labs. All rights reserved.

## 🆘 Support

For support:

- Email: support@diro.io
- Documentation: https://diro.io
- Issue Tracker: https://github.com/issues
