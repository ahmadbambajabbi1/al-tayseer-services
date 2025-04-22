export const APP_NAME = "Al-Tayseer";
export const APP_DESCRIPTION =
  "Premium mobile laundry services delivered to your doorstep";
export const APP_TAGLINE = "Freshness, delivered.";
export const APP_THEME_COLOR = "#0ea5e9";

// Theme colors
export const THEME_COLORS = {
  primary: "#3B82F6", // Light blue
  secondary: "#10B981", // Emerald
  accent: "#8B5CF6", // Violet
  background: "#F9FAFB",
  text: "#1F2937",
};

// Service types
export const SERVICE_TYPES = [
  "Wash & Fold",
  "Dry Cleaning",
  "Ironing",
  "Stain Removal",
  "Express Service",
  "Subscription",
];

// Testimonials
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Busy Professional",
    content:
      "Al-tayseer has completely transformed my weekly routine. No more wasting weekends doing laundry!",
    avatar: "/images/testimonials/avatar-1.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Mohammed Ali",
    role: "Family of Four",
    content:
      "The subscription service is a lifesaver for our family. Quality cleaning and always on time.",
    avatar: "/images/testimonials/avatar-2.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Fatima Hassan",
    role: "Student",
    content:
      "Affordable, convenient, and high-quality service. Perfect for students like me!",
    avatar: "/images/testimonials/avatar-3.jpg",
    rating: 4,
  },
];

// Features
export const FEATURES = [
  {
    title: "Doorstep Pickup & Delivery",
    description:
      "We collect and deliver your clothes right to your doorstep, saving you time and hassle.",
    icon: "Truck",
  },
  {
    title: "Premium Cleaning",
    description:
      "Expert cleaning using eco-friendly products that are gentle on your clothes and the environment.",
    icon: "Sparkles",
  },
  {
    title: "Flexible Scheduling",
    description:
      "Choose a time that works for you. We're available 7 days a week, early mornings to late evenings.",
    icon: "Calendar",
  },
  {
    title: "Real-time Tracking",
    description:
      "Track your laundry's status in real-time from pickup to delivery.",
    icon: "MapPin",
  },
  {
    title: "Subscription Plans",
    description:
      "Save money with our weekly or monthly subscription plans tailored to your needs.",
    icon: "Repeat",
  },
  {
    title: "Specialized Care",
    description:
      "Special handling for delicate fabrics, stain removal, and precise ironing.",
    icon: "Shield",
  },
];

// How it works steps
export const HOW_IT_WORKS_STEPS = [
  {
    title: "Schedule a Pickup",
    description:
      "Choose a convenient time for us to collect your laundry from your doorstep.",
    icon: "CalendarPlus",
  },
  {
    title: "Expert Cleaning",
    description:
      "Our professionals clean your clothes using premium, eco-friendly products.",
    icon: "Shirt",
  },
  {
    title: "Quality Check",
    description:
      "Each item undergoes a thorough quality check before packaging.",
    icon: "CheckCircle",
  },
  {
    title: "Swift Delivery",
    description:
      "Your fresh, clean clothes are delivered back to your doorstep.",
    icon: "PackageCheck",
  },
];

// FAQ items
export const FAQ_ITEMS = [
  {
    question: "How soon can I get my clothes back?",
    answer:
      "Our standard service takes 48 hours. Need it faster? Our express service delivers within 24 hours for an additional fee.",
  },
  {
    question: "What areas do you service?",
    answer:
      "We currently service all major neighborhoods in the city. Enter your address during signup to confirm availability in your area.",
  },
  {
    question: "How do I pay for the service?",
    answer:
      "We accept all major credit cards, mobile payments, and cash on delivery. Subscription customers enjoy the convenience of automatic billing.",
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer:
      "Your satisfaction is guaranteed. If you're not happy with our service, we'll re-clean your items at no additional cost.",
  },
  {
    question: "Do you handle delicate or special care items?",
    answer:
      "Yes, we provide specialized cleaning for delicate fabrics, formal wear, and items requiring special attention.",
  },
  {
    question: "How do I change or cancel my subscription?",
    answer:
      "You can easily manage your subscription through your account dashboard or contact our customer service team for assistance.",
  },
];

// Social media links
export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/Al-Tayseer",
  instagram: "https://instagram.com/Al-Tayseer",
  twitter: "https://twitter.com/Al-Tayseer",
};

// Contact information
export const CONTACT_EMAIL = "info@Al-Tayseer.com";
export const CONTACT_PHONE = "+1 (555) 123-4567";
export const CONTACT_INFO = {
  phone: "+1 (555) 123-4567",
  email: "support@altayseer.com",
  address: "123 Laundry Lane, Clean City, CC 12345",
};

// App features for marketing
export const APP_FEATURES = [
  {
    title: "Convenient Pickup & Delivery",
    description:
      "Schedule pickups and deliveries that fit your busy lifestyle.",
    icon: "Truck",
  },
  {
    title: "Premium Care",
    description:
      "Each garment receives careful attention with premium detergents.",
    icon: "Shield",
  },
  {
    title: "Eco-Friendly Options",
    description: "Environmentally conscious washing methods and products.",
    icon: "Leaf",
  },
  {
    title: "Quick Turnaround",
    description: "Get your fresh laundry back in as little as 24 hours.",
    icon: "Clock",
  },
];

// Service types
export const SERVICE_CATEGORIES = [
  "Regular Wash",
  "Delicate Care",
  "Express Service",
  "Dry Cleaning",
  "Specialty Items",
];

// Navigation links
export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Pricing", href: "/#pricing" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "Contact", href: "/#contact" },
];

// Dashboard navigation links
export const DASHBOARD_NAV_LINKS = [
  { name: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  {
    name: "My Services",
    href: "/dashboard/subscriptions",
    icon: "ShoppingBag",
  },
  { name: "Profile", href: "/dashboard/profile", icon: "User" },
];

// Admin navigation links
export const ADMIN_NAV_LINKS = [
  { name: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { name: "Services", href: "/admin/services", icon: "ShoppingBag" },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: "Repeat" },
  { name: "Users", href: "/admin/users", icon: "Users" },
];
