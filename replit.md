# Portfolio Application

## Overview

This is a full-stack portfolio application built with React, TypeScript, and Express.js. The application features a modern portfolio website with sections for projects, blog posts, testimonials, and contact information. It includes both a public-facing portfolio site and an admin panel for content management. The application is designed to showcase a developer's work and provide an easy way to manage portfolio content through a web interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API endpoints with proper HTTP status codes and error handling
- **Session Management**: Express sessions with configurable storage for user authentication
- **Database Access**: Drizzle ORM for type-safe database operations
- **Middleware**: Custom logging, JSON parsing, and authentication middleware

### Database Design
- **Schema**: PostgreSQL with tables for users, projects, blog posts, messages, and testimonials
- **ORM**: Drizzle ORM with TypeScript schema definitions and Zod validation
- **Migrations**: Drizzle Kit for database schema migrations and management
- **Validation**: Drizzle-Zod integration for runtime type checking and form validation

### Authentication & Authorization
- **Session-based Authentication**: Express sessions with secure cookie configuration
- **Admin Access**: Protected admin routes with authentication middleware
- **Development Credentials**: Hardcoded admin credentials for development (admin/admin123)
- **Security**: CSRF protection through session management and secure cookie settings

### Content Management
- **Projects**: Full CRUD operations with categorization, technology tags, and featured project support
- **Blog Posts**: Content management with draft/published states, tags, and estimated reading time
- **Testimonials**: Client testimonial management with featured testimonial highlighting
- **Messages**: Contact form submissions with read/unread status tracking

### Development & Deployment
- **Development Server**: Vite dev server with HMR and Express API integration
- **Build Process**: TypeScript compilation with ESBuild for production optimization
- **Environment Configuration**: Environment variables for database connection and session secrets
- **Development Tools**: TypeScript checking, Replit integration, and runtime error overlays

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL database with WebSocket connection support
- **Drizzle ORM**: Type-safe ORM with PostgreSQL dialect and schema management
- **Drizzle Kit**: CLI tool for database migrations and schema generation

### UI & Styling
- **Radix UI**: Comprehensive collection of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Modern icon library with consistent design language
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind CSS

### Development & Build Tools
- **Vite**: Fast build tool with optimized development server and production builds
- **TypeScript**: Static type checking for enhanced developer experience and code quality
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer plugins

### Third-party Services
- **Font Integration**: Google Fonts (Inter) for typography
- **Icon Library**: Font Awesome for additional icons and visual elements
- **Development Environment**: Replit-specific plugins for banner and cartographer integration