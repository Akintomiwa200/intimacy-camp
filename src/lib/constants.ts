export const APP_NAME = "Intimacy Camp";
export const APP_DESCRIPTION = "Setting a generation on fire for Jesus - equipping young leaders to passionately pursue their faith";

export const ROUTES = {
    HOME: "/",
    REGISTER: "/register",
    CONFIRM: "/confirm",
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
} as const;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
        LOGOUT: "/api/auth/logout",
    },
    REGISTRATION: {
        SUBMIT: "/api/registration/submit",
        CONFIRM: "/api/registration/confirm",
    },
} as const;

export const FEATURES = [
    {
        title: "Deep Connection",
        description: "Learn to build authentic connections through guided exercises and workshops",
        icon: "Heart",
    },
    {
        title: "Expert Guidance",
        description: "Work with certified relationship coaches and intimacy experts",
        icon: "Users",
    },
    {
        title: "Safe Space",
        description: "Experience growth in a supportive, judgment-free environment",
        icon: "Shield",
    },
    {
        title: "Transformative Practices",
        description: "Discover powerful techniques for emotional and physical intimacy",
        icon: "Sparkles",
    },
    {
        title: "Community Support",
        description: "Connect with like-minded individuals on the same journey",
        icon: "MessageCircle",
    },
    {
        title: "Lasting Change",
        description: "Take home practical tools for sustained relationship growth",
        icon: "TrendingUp",
    },
] as const;

export const TESTIMONIALS = [
    {
        name: "Sarah & Michael",
        role: "Couple, 2023 Attendee",
        content: "This camp transformed our relationship. We learned to communicate on a level we never thought possible.",
        rating: 5,
    },
    {
        name: "Jessica Thompson",
        role: "Individual Participant",
        content: "The tools and insights I gained have helped me in all my relationships, not just romantic ones.",
        rating: 5,
    },
    {
        name: "David & Emma",
        role: "Married 15 Years",
        content: "After years together, we rediscovered the spark and deepened our connection beyond our expectations.",
        rating: 5,
    },
] as const;
