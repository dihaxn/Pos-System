# LLOMS Frontend

This directory contains the frontend applications for the Little Lanka Order Management System.

## Structure

- **`pos/`** - Point of Sale (POS) application for staff and management
- **`website/`** - Customer-facing website for browsing products and outlets

## Getting Started

### POS Application
```bash
cd pos
npm install
npm run dev
```
Access at: http://localhost:5174

### Website Application
```bash
cd website
npm install
npm run dev
```
Access at: http://localhost:5173

## Dependencies

Each application has its own optimized `package.json` with only the necessary dependencies:

- **POS**: React, React Router, Axios, SweetAlert2
- **Website**: React, React Router, Material-UI, Axios, Swiper, Framer Motion

## Notes

- No shared dependencies between applications
- Each app is self-contained and can run independently
- Optimized for minimal bundle size and fast loading
