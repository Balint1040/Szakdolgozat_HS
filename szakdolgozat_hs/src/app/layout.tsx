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
import SearchButton from "@/components/SearchButton";
import Link from "next/link";
import LoggedInButtons from "@/components/LoggedInButtons";
import LoggedValidation from "@/components/LoggedValidation";
import { NextRequest } from "next/server";
import { BrowserRouter } from "react-router";

const anta = Anta({
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
            <Link className="navbar-brand logo" href="/"><span className="text-Orange">H</span><span className="text-Blue">S</span><span>market</span></Link>
            <div className="d-block d-lg-none">
              <LoggedValidation loggedIn={<LoggedInButtons />} notLoggedIn={<OrangeButton name="Bejelentkezés" href="/bejelentkezes"/>} />
            </div>
            <SearchButton />
            { /*
              <OrangeButton name="Bejelentkezés" href="/bejelentkezes" />
              <LoggedInButtons />
            */ }
            <div className="d-none d-lg-block">
              <LoggedValidation loggedIn={<LoggedInButtons />} notLoggedIn={<OrangeButton name="Bejelentkezés" href="/bejelentkezes"/>} />
            </div>
          </div>
        </nav>


        <div style={{
          minHeight: "calc(100vh - 100px)",
          position: "relative"
        }}>
          {children}
        </div>


        {
          // Consider `Link` tag instead of `a` 
        }
        <footer>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-4 d-flex flex-column align-items-center align-items-lg-start order-1">
                <h1>Kapcsolat</h1>
                <div className="d-flex flex-column h-100 justify-content-center justify-content-lg-start">
                  <a href="mailto:info@hsmarket.hu" className="contactButton"><FontAwesomeIcon icon={faEnvelope as IconProp} /> info@hsmarket.hu</a>
                  <a href="tel:+36209658523" className="contactButton"><FontAwesomeIcon icon={faPhone as IconProp} /> +36 20 965 8523</a>
                </div>
              </div>
              <div className="col-12 col-lg-4 d-flex flex-column align-items-center text-center order-3 order-lg-2 mt-5 mt-lg-0">
                <Link href={"/"}>
                <h1 className="text-center logo"><span className="text-Orange">H</span><span className="text-Blue">S</span><span>market</span></h1>
                </Link>
                <OrangeButton name="Impresszum" href="#" />
                <BlueButton name="Adatvédelem" href="#" />

                <span className="footerCr">{new Date().getFullYear()} © Minden jog fenntartva</span>
              </div>
              <div className="col-12 col-md-6 col-lg-4 d-flex flex-column align-items-center align-items-lg-end text-end order-2 order-lg-3 mt-5 mt-md-0">
                <h1 className="text-end">Navigáció</h1>
                <a href="#" className="navigButton">Profilom</a>
                <a href="/termekek" className="navigButton">Termékek</a>
                <a href="#" className="navigButton">Kosaram</a>
              </div>
            </div>
            <div className="d-flex flex-row justify-content-center flex-wrap">
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
