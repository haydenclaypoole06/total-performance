import { createFileRoute } from "@tanstack/react-router";

import { Approach } from "@/components/site/Approach";
import { FeaturedWork, featuredWorkVisible } from "@/components/site/FeaturedWork";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Inquiry } from "@/components/site/Inquiry";
import { MobileContactBar } from "@/components/site/MobileContactBar";
import { Process } from "@/components/site/Process";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { Services } from "@/components/site/Services";
import { VehicleStrip } from "@/components/site/VehicleStrip";
import { site } from "@/config/site";

const title = "Total Racing & Performance — Performance Upgrades & Custom Builds";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: site.description },
      { property: "og:title", content: title },
      { property: "og:description", content: site.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: site.description },
    ],
  }),
  component: Index,
});

function Index() {
  const showWork = featuredWorkVisible();
  const n = (i: number) => String(i).padStart(2, "0");
  // Services is 01 and Our Work 02 (when shown); later sections number on from there.
  const approachIdx = showWork ? 3 : 2;
  const processIdx = approachIdx + 1;
  const contactIdx = approachIdx + 2;

  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <VehicleStrip />
        <FeaturedWork />
        <Approach index={n(approachIdx)} />
        <Process index={n(processIdx)} />
        <Inquiry index={n(contactIdx)} />
      </main>
      <Footer />
      <MobileContactBar />
    </>
  );
}
