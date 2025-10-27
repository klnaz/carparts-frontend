"use client";

import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaAppStore,
  FaWhatsapp,
  FaCcMastercard,
  FaCcVisa,
  FaCcAmex,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  IoLogoGooglePlaystore,
  IoMailOpenOutline,
  IoCallOutline,
} from "react-icons/io5";
import { SiAppgallery } from "react-icons/si";

const Footer = (): JSX.Element => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-6 mt-10">
      {/* Üst Kısım */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:grid grid-cols-1 md:grid-cols-5 gap-10 text-sm">
          {/* Kurumsal */}
          <div>
            <p className="text-sm font-semibold mb-5 text-white">Kurumsal</p>
            <ul className="flex flex-col gap-1 text-gray-400 text-xs">
              <li>
                <a href="/hakkimizda" className="hover:text-gray-200 transition">
                  Hakkımızda
                </a>
              </li>
              <li>
                <a href="/bize-ulasin" className="hover:text-gray-200 transition">
                  Bize Ulaşın
                </a>
              </li>
              <li>KVKK Aydınlatma Metni</li>
              <li>Mesafeli Satış Sözleşmesi</li>
            </ul>
          </div>

          {/* Yardım */}
          <div>
            <p className="text-sm font-semibold mb-5 text-white">Yardım</p>
            <ul className="flex flex-col gap-1 text-gray-400 text-xs">
              <li>Sıkça Sorulan Sorular (SSS)</li>
              <li>İade ve Değişim</li>
              <li>Kampanyalar</li>
            </ul>
          </div>

          {/* Mobil Uygulamalar */}
          <div>
            <p className="text-sm font-semibold mb-5 text-white">
              Mobil Uygulamalar
            </p>
            <ul className="flex flex-row gap-5 text-gray-300">
              <li>
                <FaAppStore size={24} className="hover:text-white transition" />
              </li>
              <li>
                <IoLogoGooglePlaystore
                  size={24}
                  className="hover:text-white transition"
                />
              </li>
              <li>
                <SiAppgallery size={24} className="hover:text-white transition" />
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <p className="text-sm font-semibold mb-5 text-white">İletişime Geçin</p>
            <ul className="flex flex-col gap-2 text-gray-400 text-xs">
              <li className="flex items-center gap-2">
                <IoCallOutline size={18} />
                <span>0000 000 00 00</span>
              </li>
              <li className="flex items-center gap-2">
                <IoMailOpenOutline size={18} />
                <span>destek@eticaret.com</span>
              </li>
              <li className="flex items-center gap-2">
                <FaWhatsapp size={18} />
                <span>WhatsApp Destek</span>
              </li>
            </ul>
          </div>

          {/* Güvenli Ödeme */}
          <div>
            <p className="text-sm font-semibold mb-5 text-white">Güvenli Ödeme</p>
            <ul className="flex flex-row gap-2 text-gray-300">
              <li>
                <FaCcMastercard size={35} />
              </li>
              <li>
                <FaCcVisa size={35} />
              </li>
              <li>
                <FaCcAmex size={35} />
              </li>
            </ul>
          </div>
        </div>

        {/* Sosyal Medya ve Alt Çizgi */}
        <div className="mt-10">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex-grow border-t border-gray-700"></div>
            <div className="flex space-x-6">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FaXTwitter size={20} />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FaLinkedinIn size={20} />
              </a>
            </div>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          {/* Telif Hakkı */}
          <div className="mt-6">
            <p className="text-xs text-center text-gray-500">
              © {new Date().getFullYear()} Hakan Oto Yedek Parça. Tüm Hakları Saklıdır.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
