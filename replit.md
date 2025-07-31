# Image Editor Application

## Overview

This is a modern web-based image editor application built with a full-stack TypeScript architecture. The application provides professional-grade image editing capabilities similar to Adobe Photoshop, featuring a comprehensive toolset, layer management, and project persistence. The frontend uses React with a custom editor interface, while the backend provides API endpoints for project management and file operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (July 31, 2025)

- Updated interface to exactly match Photopea's layout and styling
- Redesigned top menu bar with compact 32px height, gray-800 background, and proper Account/More buttons
- Added right-side elements: About, Report a bug, Learn, Blog, API links with social icons
- Updated tool options bar with Photopea-style controls: tool icons, feather settings, refine edge, W/H inputs
- Redesigned right sidebar with two-section layout: top (History/Swatches) and bottom (Layers/Channels/Paths)
- Enhanced layers panel with Normal dropdown, Opacity controls, Lock/Fill settings, and proper Background layer
- Added bottom toolbar with 7 action icons matching Photopea's interface
- Applied consistent gray color scheme (gray-800/700/600) throughout interface

### Tool Functionality Completed (July 31, 2025)
- **Move Tool & Rectangle Select**: Fixed Move tool to work with Rectangle Select selections, moves only selected content leaving proper holes
- **Rectangle Shape Tool**: Fixed to draw permanent rectangle outlines without clearing canvas
- **Artboard Tool**: Successfully implemented - creates solid white canvas areas like Photopea, with proper checkerboard background behind transparent areas
- **Canvas System**: Optimized rendering to prevent conflicts between tools and background drawing

### Comprehensive Menu System Update (July 31, 2025)
- Updated File menu to match Photopea's complete file operations and export options
- Enhanced Edit menu with comprehensive editing, transformations, and content-aware tools
- Expanded Image menu with professional color modes, adjustments, and canvas operations
- Implemented Layer menu with full layer management, styles, masks, and smart objects
- Added Select menu with advanced selection tools, modifications, and background removal
- Created Filter menu with extensive image processing categories and effects
- Updated View menu with complete viewing controls, guides, and workspace management
- Enhanced Window menu with professional panel management and workspace tools
- Created photo2.zip deployment package with all Photopea-style improvements

### Complete Left Toolbar Implementation (July 31, 2025)
- Implemented all 19 professional tools matching Photopea's exact structure:
  1. Move Tool (V) with Artboard Tool submenu
  2. Rectangle Select Tool (M) with Ellipse Select Tool submenu using outline icons
  3. Magic Wand Tool (W) with Quick Selection and Object Selection tools
  4. Crop Tool (C) with Perspective Crop, Slice, and Slice Select tools
  5. Eyedropper Tool (I) with Color Sampler and Ruler tools
  6. Spot Healing Brush Tool (J) with 5 healing variants including Magic Replace
  7. Brush Tool (B) with Pencil and Color Replacement tools
  8. Clone Tool (S) as standalone tool
  9. Eraser Tool (E) with Background Eraser and Magic Eraser variants
  10. Paint Bucket Tool (G) with Gradient Tool
  11. Blur Tool (R) with Sharpen and Smudge tools
  12. Dodge Tool (O) with Burn and Sponge tools
  13. Type Tool (T) with Vertical Type Tool
  14. Pen Tool (P) with Free Pen, Curvature Pen, and anchor point tools
  15. Path Select Tool (A) with Direct Select Tool
  16. Rectangle Tool (U) with shape variants including Parametric and Custom shapes
  17. Hand Tool (H) with Rotate View Tool
  18. Zoom Tool (Z) as standalone
  19. Quick Mask Mode (Q) for basic masking functionality
- Added color picker section at bottom with overlapping foreground/background color squares
- Implemented compact 32px tool height to fit all tools on screen
- Added dropdown functionality with submenu triangles for tools with variants
- Used Font Awesome Professional icons matching Adobe Photoshop conventions
- Excluded Virtual Keys tool (not implementable in web browsers for security reasons)
- Created photo3.zip with complete left toolbar implementation
- Refined toolbar to include only implementable tools (removed 8 complex tools that cannot be realistically built in web browsers)
- Final toolbar contains 18 professional tools with functional capabilities
- Created photo4.zip with optimized, realistic tool set

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Zustand for application state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Canvas Rendering**: HTML5 Canvas API with custom rendering utilities
- **Data Fetching**: TanStack Query (React Query) for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development Server**: Vite in middleware mode for HMR and asset serving
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints following conventional patterns

### Build System
- **Frontend Bundling**: Vite for development and production builds
- **Backend Bundling**: esbuild for server-side code bundling
- **TypeScript**: Shared configuration across client, server, and shared modules
- **Development**: Hot module replacement and runtime error overlay

## Key Components

### Image Editor Core
- **Canvas Management**: Custom CanvasRenderer class handling drawing operations, layer rendering, and checkerboard backgrounds
- **Tool System**: Comprehensive toolset including selection, painting, retouching, drawing, and navigation tools with keyboard shortcuts
- **Layer System**: Full layer management with visibility, opacity, blend modes, and layer reordering
- **Document Management**: Multi-document interface with tabs, zoom controls, and project persistence

### State Management
- **Editor Store**: Centralized Zustand store managing documents, layers, tools, history, and canvas state
- **History System**: Undo/redo functionality with step-based history tracking
- **Tool Options**: Dynamic tool option panels that adapt based on selected tool

### UI Components
- **Modern Interface**: Dark theme editor interface matching professional image editing standards
- **Responsive Layout**: Multi-panel layout with resizable sidebars and toolbars
- **Component Library**: shadcn/ui components for consistent UI patterns
- **Keyboard Shortcuts**: Comprehensive keyboard shortcut system for efficient workflow

## Data Flow

### Editor Workflow
1. User creates or opens a document through the top menu bar
2. Document state is managed in the Zustand store and synced with backend
3. Tool selection updates the active tool and renders appropriate options
4. Canvas interactions trigger drawing operations through the CanvasRenderer
5. Layer modifications update the document state and trigger re-renders
6. History steps are recorded for undo/redo functionality

### Project Persistence
1. Projects are created and managed through REST API endpoints
2. Project data includes dimensions, layers, settings, and metadata
3. File operations handle image import/export and project saving
4. Session management maintains user context across requests

### Real-time Updates
1. Canvas renders in real-time as users interact with tools
2. Layer changes immediately reflect in the layer panel
3. Tool option changes instantly update the active tool behavior
4. Zoom and pan operations provide smooth viewport navigation

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Router alternative (Wouter)
- **State Management**: Zustand for global state, TanStack Query for server state
- **UI Framework**: Radix UI primitives with Tailwind CSS styling
- **Canvas Utilities**: Custom canvas rendering with HTML5 Canvas API
- **Date Handling**: date-fns for timestamp formatting
- **Form Handling**: React Hook Form with Zod validation

### Backend Dependencies
- **Web Framework**: Express.js with TypeScript support
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Storage**: connect-pg-simple for PostgreSQL session storage
- **Development Tools**: tsx for TypeScript execution, Vite plugins for development experience

### Database Schema
- **Users Table**: User authentication and profile management
- **Projects Table**: Project metadata, dimensions, layers, and settings storage
- **Project History Table**: Action history for undo/redo functionality across sessions

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite middleware provides instant feedback during development
- **TypeScript Compilation**: Real-time type checking across all modules
- **Error Handling**: Runtime error overlay for immediate debugging
- **Database Migrations**: Drizzle Kit for schema management and migrations

### Production Build
- **Frontend Build**: Vite builds optimized static assets with code splitting
- **Backend Build**: esbuild creates efficient server bundle with external dependencies
- **Asset Serving**: Express serves static files in production mode
- **Environment Configuration**: Environment-based configuration for database and features

### Database Configuration
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Connection Management**: Database URL configuration with connection pooling
- **Schema Management**: Drizzle ORM with TypeScript-first schema definitions
- **Migration Strategy**: Version-controlled migrations for schema updates

The application architecture prioritizes developer experience with modern tooling while maintaining professional image editing capabilities. The modular structure allows for easy feature additions and maintenance, while the TypeScript-first approach ensures type safety across the entire stack.