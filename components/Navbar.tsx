"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["home", "jadwal", "galeri", "tentang" ];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Beranda", id: "home" },
    { href: "#jadwal", label: "Jadwal", id: "jadwal" },
    { href: "#galeri", label: "Galeri", id: "galeri" },
    { href: "#tentang", label: "Tentang", id: "tentang" }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-[#faf9f5]/85 backdrop-blur-xl border-b border-outline-variant/20 transition-all duration-300 ${
        scrolled ? "shadow-[0_4px_24px_rgba(3,33,33,0.07)]" : ""
      }`}
    >
      <div className="w-full mx-auto h-[80px] flex items-center justify-center px-8 gap-x-20">

        <Link href="#home">
        <img src="./binet.svg" className="w-15 h-15 bg-black rounded-full" alt="Logo" />
        </Link>

        {/* Desktop Links */}
        <ul
          className={`
            md:flex md:list-none md:gap-10 md:items-center
            ${menuOpen
                ? "flex flex-col absolute top-[70px] left-0 right-0 bg-[#faf9f5]/95 backdrop-blur-xl px-8 py-6 gap-5 border-b border-outline-variant/20"
                : "hidden"
            }
          `}
        >
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                className={`font-display text-[0.85rem] font-medium relative transition-colors duration-200 group ${
                  activeSection === link.id ? "text-primary" : "text-on-surface-variant hover:text-primary"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                <span 
                  className={`absolute -bottom-1 left-0 h-[3px] bg-secondary rounded-[2px] transition-all duration-300 ${
                    activeSection === link.id ? "w-full" : "w-0 group-hover:w-full"
                  }`} 
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] cursor-pointer bg-transparent border-none p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className="block w-6 h-[2px] bg-primary rounded-[2px] transition-transform duration-300"
            style={{ transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }}
          />
          <span 
            className="block w-6 h-[2px] bg-primary rounded-[2px] transition-opacity duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }} 
          />
          <span
            className="block w-6 h-[2px] bg-primary rounded-[2px] transition-transform duration-300"
            style={{ transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }}
          />
        </button>
      </div>
    </nav>
  );
}
