# Academic Course Planning Dashboard

## Overview

This is a full-stack web application designed for Management Engineering students at the University of Waterloo to plan their academic courses, particularly focusing on the AI Option requirements. The application provides personalized course recommendations, academic progress tracking, and graduation timeline planning.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend concerns:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for development and production builds
- **Component Library**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: PostgreSQL-based sessions (connect-pg-simple)
- **Development**: Hot reload with Vite middleware integration

## Key Components

### Database Schema
The application uses a PostgreSQL database with the following main entities:
- **Students**: User profiles with academic information, interests, and preferences
- **Courses**: Course catalog with metadata, prerequisites, and AI option classifications
- **StudentCourses**: Junction table tracking student course enrollment and grades
- **CourseRecommendations**: AI-powered course suggestions with match scores

### Core Features
1. **Academic Progress Tracking**: Visual progress indicators for degree completion
2. **AI Option Tracker**: Specialized tracking for AI option requirements with three lists
3. **Course Recommendations**: Personalized suggestions based on student profile and academic history
4. **Course Catalog**: Searchable and filterable course database
5. **Graduation Timeline**: Multi-term planning with course sequencing
6. **Interest Survey**: Student preference collection for recommendation enhancement

### UI Components
- Responsive dashboard layout with University of Waterloo branding
- Real-time data updates using React Query
- Form handling with React Hook Form and Zod validation
- Toast notifications for user feedback
- Loading states and error handling

## Data Flow

1. **User Authentication**: Currently using a demo student profile (ID: 20123456)
2. **Data Fetching**: React Query manages API calls with caching and synchronization
3. **State Updates**: Optimistic updates with automatic cache invalidation
4. **Recommendation Engine**: Server-side logic generates course suggestions based on:
   - Student academic history and grades
   - Interest preferences and career path
   - AI option requirements and progress
   - Course prerequisites and availability

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL with Drizzle ORM
- **UI Framework**: React with Radix UI components
- **Styling**: Tailwind CSS with custom University of Waterloo theme
- **Query Management**: TanStack Query for server state
- **Validation**: Zod for schema validation
- **Forms**: React Hook Form with Zod resolvers

### Development Tools
- **Build System**: Vite with TypeScript support
- **Development Server**: Express with Vite middleware in development
- **Database Migrations**: Drizzle Kit for schema management
- **Type Safety**: Full TypeScript coverage across frontend and backend

## Deployment Strategy

### Development Setup
- Single command development with `npm run dev`
- Vite handles frontend hot reload and asset serving
- Express serves API routes with TypeScript compilation via tsx
- Database schema changes managed through `npm run db:push`

### Production Build
- Frontend: Vite builds optimized React bundle to `dist/public`
- Backend: esbuild compiles TypeScript server to `dist/index.js`
- Static assets served by Express in production
- Environment-based configuration for database connections

### Database Strategy
- PostgreSQL hosted on Neon with connection pooling
- Schema definitions in shared TypeScript files
- Migrations handled through Drizzle Kit
- Sample data seeding for development and demo purposes

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 30, 2025. Initial setup