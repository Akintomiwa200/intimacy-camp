import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const APP_NAME = "Intimacy Camp";

    return (
        <footer className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 text-gray-300 overflow-hidden">
            {/* Large Background Text */}
            <div className="absolute mt-30 inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[6rem] md:text-[8rem] lg:text-[10rem] xl:text-[14rem] font-bold text-white/5 whitespace-nowrap select-none tracking-wider">
                    INTIMACY CAMP
                </span>
            </div>

            <div className="relative container mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Heart className="w-7 h-7 text-purple-500 fill-purple-500" />
                            <span className="text-2xl font-bold text-white">
                                {APP_NAME}
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                            Intimacy Camp is dedicated to raising a burning generation of passionate leaders, empowering them to impact the world for God.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <a
                                    href="mailto:info@intimacycamp.com"
                                    className="text-sm text-gray-300 hover:text-purple-400 transition-colors"
                                >
                                    info@intimacycamp.com
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <a
                                    href="tel:+2347048782063"
                                    className="text-sm text-gray-300 hover:text-purple-400 transition-colors"
                                >
                                    +234 704 878 2063
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="/"
                                    className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                                >
                                    Homepage
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/about"
                                    className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/meetings"
                                    className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                                >
                                    Meetings
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/accommodation"
                                    className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                                >
                                    Accommodation
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/initiatives"
                                    className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                                >
                                    Initiatives
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/partner"
                                    className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                                >
                                    Partner
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Community</h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="/login"
                                    className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                                >
                                    Log In
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/register"
                                    className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                                >
                                    Register
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/profile"
                                    className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                                >
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/activity"
                                    className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                                >
                                    Activity
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/groups"
                                    className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                                >
                                    Groups
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/logout"
                                    className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                                >
                                    Log Out
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Subscribe Our Newsletter</h3>
                        <p className="text-sm text-gray-400 mb-6">
                            Get Our Latest Update & News
                        </p>
                        <div className="flex gap-3 mb-6">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-purple-600 transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-purple-600 transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-purple-600 transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-purple-600 transition-colors"
                            >
                                <Youtube className="w-5 h-5" />
                            </a>
                            
                        </div>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Email"
                                className="flex-1 px-6 py-4 rounded-l-full bg-white text-gray-900 text-sm md:text-xl focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-r-full transition-colors flex items-center justify-center"
                            >
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-12 pt-8 text-center">
                    <p className="text-sm text-gray-400">
                        ALLRIGHT RESERVED - INTIMACY CAMP INC
                    </p>
                </div>
            </div>
        </footer>
    );
}