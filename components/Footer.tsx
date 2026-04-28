import { FaInstagram, FaEnvelope, FaYoutube } from "react-icons/fa";
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-[#cae8e8]/70 py-12 px-8">
      <div className="flex justify-between items-center w-full flex-wrap gap-4 flex-col md:flex-row text-center">
        
        {/* Kolom Kiri */}
        <div className="flex-1 md:text-left">
          <div className="font-display font-extrabold text-base text-primary-fixed">
            Binary<span className="text-secondary-container"> Network</span>
          </div>
          <p className="font-body text-[0.8rem] mt-1.5 text-[#cae8e8]/50">
            Binet dimari!!
          </p>
        </div>

        {/* Kolom Tengah (ul) */}
        <ul className="flex gap-8 list-none font-display text-[0.8rem] flex-wrap justify-center shrink-0">
          <li>
            <a href="https://www.instagram.com/binet_23?igsh=MWpiZGJlOWtnbzVtYg==" className="text-[#cae8e8]/60 transition-colors duration-200 hover:text-secondary-container flex justify-center items-center gap-1">
            <FaInstagram/>
              Instagram
            </a>
          </li>
          <li>
            <a href="mailto:teknikmultimediadanjaringan1b@gmail.com" className="text-[#cae8e8]/60 transition-colors duration-200 hover:text-secondary-container flex justify-center items-center gap-1">
              <FaEnvelope/>
              Email
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/@binet" className="text-[#cae8e8]/60 transition-colors duration-200 hover:text-secondary-container flex justify-center items-center gap-1">
              <FaYoutube/>
              Youtube
            </a>
          </li>
        </ul>

        {/* Kolom Kanan */}
        <div className="font-display text-[0.75rem] text-[#cae8e8]/40 flex-1 md:text-right">
          © {year} Kelas Binet. All rights reserved.
        </div>
        
      </div>
    </footer>
  );
}
