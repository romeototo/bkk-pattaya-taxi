# BKK Pattaya Taxi - Production-Ready Booking System TODO

## Phase 1: Database & Environment Setup
- [ ] Extend bookings table with all required fields (full name, phone, email, pickup, dropoff, travel date/time, passengers, luggage, contact method, notes)
- [ ] Add booking_notifications table for tracking sent notifications
- [ ] Create .env.example with all required credentials
- [ ] Add environment variables for Google Sheets, LINE, Telegram, Email

## Phase 2: Integration Services
- [ ] Google Sheets API integration (append booking data)
- [ ] LINE Bot integration (send booking confirmation)
- [ ] Telegram Bot integration (send booking notification)
- [ ] Email service integration (send confirmation email)
- [ ] Create notification service layer

## Phase 3: Booking Form & API
- [ ] Update booking form with all required fields
- [ ] Create tRPC procedure for creating bookings
- [ ] Add booking validation and error handling
- [ ] Integrate with notification services
- [ ] Add real-time status updates

## Phase 4: Admin Dashboard
- [ ] Create admin bookings table view
- [ ] Add search functionality
- [ ] Add filter by status (pending, confirmed, completed, cancelled)
- [ ] Add status update functionality
- [ ] Add export to CSV feature
- [ ] Add booking detail view/modal
- [ ] Add date range filter

## Phase 5: Testing & Documentation
- [ ] Write Vitest tests for booking API
- [ ] Write Vitest tests for notification services
- [ ] Create .env.example file
- [ ] Create SETUP.md documentation
- [ ] Create API documentation
- [ ] Test all integrations end-to-end

## Phase 6: Deployment & Polish
- [ ] Final testing in production environment
- [ ] Performance optimization
- [ ] Error handling and logging
- [ ] Delivery to user
