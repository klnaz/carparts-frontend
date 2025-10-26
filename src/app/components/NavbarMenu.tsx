"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarMenuProps {
  mobile?: boolean;
}

const NavbarMenu = ({ mobile }: NavbarMenuProps) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Ana Sayfa", path: "/" },
    { name: "Ürünler", path: "/products" },
    { name: "Kampanyalar", path: "/offers" },
    { name: "Hakkımızda", path: "/about" },
  ];

  return (
    <ul
      className={`${
        mobile ? "flex flex-col p-4 gap-3" : "flex gap-6"
      } text-gray-700`}
    >
      {menuItems.map((item) => (
        <li key={item.path}>
          <Link
            href={item.path}
            className={`hover:text-black ${
              pathname === item.path ? "font-semibold text-black" : ""
            }`}
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavbarMenu;
