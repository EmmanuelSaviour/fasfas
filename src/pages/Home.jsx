import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import RankJourney from "../components/sections/RankJourney";
import HowItWorks from "../components/sections/HowItWorks";
import CommunityForest from "../components/sections/CommunityForest";
function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <RankJourney />
      <HowItWorks />
      <CommunityForest />
    </>
  );
}

export default Home;