import type { Metadata } from "next";
//import localFont from "next/font/local";
import "./globals.css";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Anta } from "next/font/google";

import BootstrapClient from "@/components/BootstrapClient";
import OrangeButton from "@/components/OrangeButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMagnifyingGlass, faPhone } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import BlueButton from "@/components/BlueButton";

const anta = Anta( {
  weight: "400",
  display: "swap",
  subsets: ["latin-ext"]
})


export const metadata: Metadata = {
  title: "HS Market",
  description: "Generated by create next app",
};

const seo = ["pc alkatrész", "processzor", "videó kártya", "ram", "megbízható", "olcsó", "alaplap"]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body className={`${anta.className}`}>

        <nav className="navbar navbar-expand-lg">
          <div className="container justify-content-between">
            <a className="navbar-brand" href="#"><span className="text-Orange">H</span><span className="text-Blue">S</span>market</a>
            <form className="d-flex navbarSearch position-relative" role="search">
              <input className="form-control" type="search" placeholder="Keresés" aria-label="Search"/>
              <FontAwesomeIcon className="navbarSearchIcon" icon={faMagnifyingGlass as IconProp} />
            </form>
            <OrangeButton name="Bejelentkezés" href="#" />
          </div>
        </nav>

        {children}


        <footer>
          <div className="container">
            <div className="row">
              <div className="col-12 col-sm-4 d-flex flex-column align-items-start">
                <h1>Kapcsolat</h1>
                <a href="mailto:info@hsmarket.hu" className="contactButton"><FontAwesomeIcon icon={faEnvelope as IconProp} /> info@hsmarket.hu</a>
                <a href="tel:+36209658523" className="contactButton"><FontAwesomeIcon icon={faPhone as IconProp} /> +36 20 965 8523</a>
              </div>
              <div className="col-12 col-sm-4 d-flex flex-column align-items-center text-center">
                <h1 className="text-center"><span className="text-Orange">H</span><span className="text-Blue">S</span>market</h1>
                <OrangeButton name="Impresszum" href="#" />
                <BlueButton name="Adatvédelem" href="#" />
                <span className="footerCr">{new Date().getFullYear()} © Minden jog fenntartva</span>
              </div>
              <div className="col-12 col-sm-4 d-flex flex-column align-items-end text-end">
                <h1 className="text-end">Navigáció</h1>
                <a href="#" className="navigButton">Profilom</a>
                <a href="#" className="navigButton">Termékek</a>
                <a href="#" className="navigButton">Kosaram</a>
              </div>  
            </div>
            <div className="d-flex flex-row justify-content-center">
              {[...seo].map((w) => (
                <span className="seo" key={w}>{w}</span>
              ))}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
