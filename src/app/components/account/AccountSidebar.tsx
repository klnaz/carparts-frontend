"use client";
import React from "react";

interface AccountSidebarProps {
  selectedItem: string;
  onMenuItemClick: (item: string) => void;
}

const AccountSidebar = ({
  selectedItem,
  onMenuItemClick,
}: AccountSidebarProps) => {
  const menuItems = [
    { id: "profile", label: "Profil Bilgilerim" },
    { id: "address", label: "Adres Bilgilerim" },
    { id: "payment", label: "Ödeme Bilgilerim" },
  ];

  return (
    <nav>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id} className="mb-2">
            <button
              onClick={() => onMenuItemClick(item.id)}
              className={`w-full text-left text-xs py-3 px-10 rounded-md transition-colors duration-200 
                ${
                  selectedItem === item.id
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AccountSidebar;
