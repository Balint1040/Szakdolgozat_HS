import Image from "next/image";
import styles from "./page.module.css";
import Hero from "@/components/Hero";
import Strengths from "@/components/Strengths";
import Cta from "@/components/Cta";

export default function Home() {
  return (
    <span>
      <Hero />
      <Strengths />
      <Cta />
    </span>
  );
}
