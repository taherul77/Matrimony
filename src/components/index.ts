// Package-Based Business Logic Components
// All components enforce the 5-tier matrimonial package system

export { default as InterestButton } from './InterestButton';
export { default as ContactDetails } from './ContactDetails';
export { default as PhotoUpload } from './PhotoUpload';
export { default as MessagingComponent } from './MessagingComponent';
export { default as ProfileCard } from './ProfileCard';
export { default as SearchResults } from './SearchResults';
export { default as SearchFilter } from './SearchFilter';
export { default as PackageComparison } from './PackageComparison';
export { default as VipDashboard } from './VipDashboard';

// Package Tiers:
// 1. Free Package - Basic profile, 1-2 photos, 2-3 interests/day, receive messages only, no contact details, no direct messaging
// 2. Silver Package - Affordable entry-level premium, up to 5 photos, up to 20 interests/day, limited direct messaging (10/month), basic contact details (partially masked), priority in search results (lower level)
// 3. Gold Package - Mid-range premium, unlimited photos, unlimited interests, unlimited direct messaging, view full contact details, appear in "Featured Profiles" section, advanced search filters, profile highlighted for better visibility
// 4. Platinum Package - Higher premium tier, all Gold features + VIP badge on profile, appear top in search results, dedicated customer support, profile boosted weekly for extra visibility, access to horoscope/compatibility matching tools, option to hide online status/browse privately, view who visited your profile
// 5. VIP/Elite Package - Premium exclusive tier, all Platinum features + dedicated relationship manager/personal matchmaker, handpicked matches sent directly, priority support (24/7 helpline), confidential & discreet profile handling, invitations to exclusive matchmaking events/webinars, profile promoted across platform newsletters & ads, complete privacy control
