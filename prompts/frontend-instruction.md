Use this guide for frontend work in the project.

 It uses React 18, Redux Toolkit (RTK Query), TypeScript 5, and Tailwind CSS.

 Write the complete code for every step. Do not get lazy.

 Write everything that is needed. 

Your goal is to completely finish whatever the user asks for.

Project Structure



src/
├── components/
│   ├── common/         # Reusable UI components
│   ├── features/       # Feature-specific components
│   └── layouts/        # Layout components
├── store/
│   ├── api/           # RTK Query API slices
│   ├── slices/        # Redux state slices
│   └── index.ts       # Store configuration
├── types/             # TypeScript types/interfaces
├── hooks/             # Custom hooks
├── utils/             # Utility functions
└── pages/             # Page components
Requirements

Use TypeScript strict mode with proper type definitions

Implement RTK Query for all API calls

Implement proper error handling and loading states

Use React.Suspense and Error Boundaries

Follow React 18 best practices

Use code splitting with React.lazy

Implement form handling with React Hook Form

Write unit tests using React Testing Library

Reminders

Use proper TypeScript types for all features

Implement proper cache invalidation in RTK Query

Follow component composition patterns

Maintain proper separation of concerns

Keep components focused and reusable