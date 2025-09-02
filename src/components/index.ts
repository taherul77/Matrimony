// Package-Based Business Logic Components
// All components enforce the 5-tier matrimonial package system

export { default as InterestButton } from './InterestButton';
export { default as ContactDetails } from './ContactDetails';
export { default as PhotoUpload } from './PhotoUpload';
export { default as MessagingComponent } from './MessagingComponent';
export { default as ProfileCard } from './ProfileCard';
export { default as SearchResults } from './SearchResults';
export { default as PackageComparison } from './PackageComparison';

// Package Tiers:
// 1. Free Package - Basic profile, 2 photos, 3 interests/day, receive messages only
// 2. Silver Package - 5 photos, 10 interests/day, 50 messages/month, profile highlight
// 3. Gold Package - 10 photos, 25 interests/day, 150 messages/month, advanced search, contact details (10/month)
// 4. Platinum Package - 15 photos, 50 interests/day, 300 messages/month, featured profile, contact details (50/month)
// 5. VIP Package - Unlimited photos/interests/messages, VIP badge, personal matchmaker, unlimited contact details
