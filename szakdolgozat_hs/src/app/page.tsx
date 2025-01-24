import Hero from "@/components/Hero";
import Strengths from "@/components/Strengths";
import Cta from "@/components/Cta";
import Quote from "@/components/Quote";
import Reviews from "@/components/Reviews";
import Recommendation from "@/components/Recommendation";

export default function Home() {
  return (
    <>
      <Hero />
      <Strengths />
      <Recommendation />
      <Cta />
      <Quote />
      <Reviews />
    </>
  );
}
