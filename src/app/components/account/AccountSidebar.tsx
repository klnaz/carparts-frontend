"use client";
import React from "react";
import { User, MapPin, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

interface AccountSidebarProps {
  selectedItem: string;
  onMenuItemClick: (item: string) => void;
}

const AccountSidebar = ({
  selectedItem,
  onMenuItemClick,
}: AccountSidebarProps) => {
  const menuItems = [
    { id: "profile", label: "Profil Bilgilerim", icon: User },
    { id: "address", label: "Adres Bilgilerim", icon: MapPin },
    { id: "payment", label: "Ödeme Bilgilerim", icon: CreditCard },
  ];

  return (
    <nav className="relative">
      <ul className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = selectedItem === item.id;
          return (
            <li key={item.id} className="relative">
              <button
                onClick={() => onMenuItemClick(item.id)}
                className={`w-full text-left text-xs py-3 px-4 rounded-xl transition-all duration-300 flex items-center gap-3 relative z-10 font-semibold select-none cursor-pointer
                  ${
                    isActive
                      ? "text-red-600 font-bold"
                      : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                  }`}
              >
                <Icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? "text-red-600" : "text-zinc-400"}`} />
                <span>{item.label}</span>

                {/* Sliding active background indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-red-50 border-l-2 border-red-600 rounded-xl -z-10 shadow-sm border border-red-100/50"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default AccountSidebar;
