"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookHeart, Quote, Wind, Clock, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function BottomNav({ darkMode }) {
  const pathname = usePathname();
  const { profile } = useAuth();

  const navItems = [
    { href: "/",          icon: Home,      label: "Home"    },
    { href: "/dashboard", icon: BookHeart, label: "Journal" },
    { href: "/quotes",    icon: Quote,     label: "Quotes"  },
    { href: "/breathe",   icon: Wind,      label: "Breathe" },
    { href: "/history",   icon: Clock,     label: "History" },
  ];

  return (
    <nav className={`
      fixed bottom-0 left-0 w-full z-50
      flex justify-around items-center
      px-2 py-1.5 backdrop-blur-2xl
      ${darkMode
        ? "bg-black/60 border-t border-white/8"
        : "bg-white/70 border-t border-rose-100/60"
      }
    `}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all duration-200
              ${isActive ? darkMode ? "bg-rose-500/20" : "bg-rose-500/12" : "hover:bg-white/10"}`}>
            <Icon size={20} className={`transition-all duration-200 ${isActive ? "text-rose-500 scale-110" : darkMode ? "text-gray-400" : "text-gray-400"}`} />
            <span className={`text-[9px] font-semibold ${isActive ? "text-rose-500" : darkMode ? "text-gray-500" : "text-gray-400"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}

      {/* Profile */}
      <Link href="/profile"
        className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all duration-200
          ${pathname === "/profile" ? darkMode ? "bg-rose-500/20" : "bg-rose-500/12" : "hover:bg-white/10"}`}>
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="avatar"
            className={`w-5 h-5 rounded-full object-cover border ${pathname === "/profile" ? "border-rose-500" : "border-transparent"}`} />
        ) : (
          <UserCircle size={20} className={`transition-all duration-200 ${pathname === "/profile" ? "text-rose-500 scale-110" : darkMode ? "text-gray-400" : "text-gray-400"}`} />
        )}
        <span className={`text-[9px] font-semibold ${pathname === "/profile" ? "text-rose-500" : darkMode ? "text-gray-500" : "text-gray-400"}`}>
          Profile
        </span>
      </Link>
    </nav>
  );
}
