# Utils

This directory contains utility functions and helpers for the application.

## Files

### `api.js`
Centralized API request functions with authentication and error handling.

### `toast.js`
Toast notification utilities for showing success, error, and loading messages.

### `dateUtils.js`
Date formatting utilities that use Indonesian timezone (Asia/Jakarta) consistently across the application.

#### Functions:
- `formatDateForInput(dateString)` - Format date for input fields (YYYY-MM-DD format)
- `formatDateForDisplay(dateString, options)` - Format date for display in Indonesian locale
- `getCurrentDate()` - Get current date in YYYY-MM-DD format
- `formatDateForTable(dateString)` - Format date for table display (short format)
- `formatDateForPrint(dateString)` - Format date for print display (long format)

All functions use `Asia/Jakarta` timezone to ensure consistent date handling regardless of the user's local timezone. 