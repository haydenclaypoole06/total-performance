/**
 * TOTAL PERFORMANCE — central editable content.
 *
 * Everything the owner may need to change lives here: business details, services,
 * vehicle focus, featured project, approach copy and contact methods.
 *
 * Rules:
 * - Leave a contact field as null until the real value is confirmed; the site hides it.
 * - `confirmed: false` marks copy that still needs owner sign-off. Unconfirmed items show a
 *   small "Needs owner confirmation" tag in the preview only, never on the published site.
 * - Never add invented reviews, stats, results, certifications or locations.
 */

import sampleEngineBay from "@/assets/sample-engine-bay.jpg";
import sampleCompressor from "@/assets/sample-compressor-detail.jpg";
import sampleBrake from "@/assets/sample-brake-detail.jpg";
import workshop from "@/assets/illustrative-workshop.jpg";

export type ServiceGraphic =
  | "tach"
  | "camshaft"
  | "compressor"
  | "waveform"
  | "suspension"
  | "torque"
  | "wiring";

export interface Service {
  number: string;
  title: string;
  description: string;
  graphic: ServiceGraphic;
  confirmed: boolean;
}

export interface ContactMethods {
  phone: string | null; // e.g. "(555) 555-0100"
  email: string | null; // e.g. "shop@example.com"
  address: string | null; // full street address; enables the map and local SEO later
  hours: { days: string; time: string }[] | null;
  socials: { label: string; url: string }[];
}

export const site = {
  name: "TOTAL PERFORMANCE",
  tagline: "Precision engineered. Performance driven.",
  description:
    "TOTAL PERFORMANCE is an automotive performance shop for engine, camshaft, forced induction, suspension and drivability work. Tell us about your car and start planning your build.",

  nav: [
    { label: "Services", href: "#services" },
    { label: "Our Work", href: "#work" },
    { label: "Our Approach", href: "#approach" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    eyebrow: "TOTAL PERFORMANCE",
    headline: ["YOUR VISION.", "OUR STANDARDS."],
    copy: "Your goals shape the build. Our standards guide every detail—from the right combination of parts to the care behind the installation.",
    primaryCta: "LET’S TALK ABOUT YOUR BUILD",
    secondaryCta: "Explore Services",
  },

  services: {
        heading: "YOUR NEXT UPGRADE STARTS HERE.",
    intro:
      "Whether you know exactly what you want or need help deciding where to start, we’ll help you choose upgrades that fit your car, your goals, and the way you drive.",
    items: [
      {
        number: "01",
        title: "Performance Upgrades",
        description: "Bolt-ons and supporting modifications planned around your goals.",
        graphic: "tach",
        confirmed: false,
      },
      {
        number: "02",
        title: "Engine & Camshaft Upgrades",
        description: "Talk with us about the next stage of your engine combination.",
        graphic: "camshaft",
        confirmed: false,
      },
      {
        number: "03",
        title: "Forced Induction",
        description:
          "Discuss supercharger or turbocharger installation and the supporting work your build requires.",
        graphic: "compressor",
        confirmed: false,
      },
      {
        number: "04",
        title: "Diagnostics & Drivability",
        description: "Start with understanding the issue and planning the next step.",
        graphic: "waveform",
        confirmed: false,
      },
      {
        number: "05",
        title: "Suspension & Brakes",
        description: "Explore upgrades that support handling, control, and confidence.",
        graphic: "suspension",
        confirmed: false,
      },
      {
        number: "06",
        title: "Maintenance & Supporting Work",
        description: "Address the foundation that your next upgrade depends on.",
        graphic: "torque",
        confirmed: false,
      },
      {
        number: "07",
        title: "Custom Wiring",
        description:
          "Engine-swap wiring, custom harnesses, gauges, and accessories—with clean routing, secure connections, and attention to serviceability.",
        graphic: "wiring",
        confirmed: true,
      },
    ] as Service[],
  },

  vehicleFocus: {
    items: [
  "CORVETTE",
  "GM LS & LT",
  "HEMI",
  "MODERN MUSCLE",
  "EURO PERFORMANCE",
  "IMPORTS",
  "CLASSICS & RESTOMODS",
  "CUSTOM BUILDS",
],
    confirmed: false,
    disclaimer: "Vehicle names are used descriptively. No manufacturer affiliation is implied.",
  },

  featuredWork: {
    heading: "THE DETAILS MAKE THE BUILD.",
    /**
     * Set `isReal: true` only once real project info and real shop photos are added.
     * Until then the section shows labeled sample placeholders in the preview and is
     * hidden from the published site.
     */
    isReal: false,
    project: {
      vehicle: "Vehicle — year / make / model",
      goal: "Owner’s goal — what the owner wanted the car to do differently.",
      workPerformed: ["Work performed — item", "Work performed — item"],
      supportingMods: ["Supporting modification — item"],
      /** Only fill with results that were actually measured and supplied. */
      verifiedResults: [] as string[],
    },
    images: {
      main: { src: sampleEngineBay, alt: "Sample placeholder: performance engine bay", width: 1600, height: 1008 },
      details: [
        { src: sampleCompressor, alt: "Sample placeholder: compressor wheel detail", width: 1008, height: 1008 },
        { src: sampleBrake, alt: "Sample placeholder: brake and wheel detail", width: 1008, height: 1008 },
      ],
    },
  },

  approach: {
    heading: "YOUR CAR. A CLEAR PLAN.",
    copy: "Every project starts with a conversation about your car, your goals, and how you use it. From an individual upgrade to a larger build, the details deserve attention.",
    themes: [
      { title: "Goals before parts", text: "We start with how you drive and what you want to feel, then choose the parts." },
      { title: "A combination that works together", text: "Each change is considered against the rest of the car, not in isolation." },
      { title: "Attention to installation details", text: "Routing, fitment and finish matter as much as the part itself." },
      { title: "Clear communication", text: "You know what’s planned, what it involves, and what comes next." },
    ],
    confirmed: false,
    image: {
      src: workshop,
      alt: "Illustrative image of a performance workshop at night",
      width: 1600,
      height: 1008,
      /** Set true once replaced with a real photo of the shop. */
      isRealShopPhoto: false,
    },
  },

  process: {
    heading: "FROM IDEA TO NEXT STEP.",
    steps: [
      {
        number: "01",
        title: "Tell Us About Your Car",
        text: "Share the vehicle, current modifications, and what you want to change.",
      },
      {
        number: "02",
        title: "Discuss the Plan",
        text: "Talk through the scope, priorities, and proposed work.",
      },
      {
        number: "03",
        title: "Schedule Your Project",
        text: "Confirm the next step with our team.",
      },
    ],
  },

  inquiry: {
    headline: ["WHAT’S NEXT", "FOR YOUR CAR?"],
    copy: "Tell us what you drive and what you have in mind.",
    submit: "Send Project Inquiry",
    note: "Submitting an inquiry does not confirm an appointment.",
    /** Prompts shown beside the form to help people send a complete first message. */
    helpfulToInclude: [
      "Year, make, model and transmission",
      "What’s already been done to the car",
      "How you use it: daily, weekends, track or show",
      "What you want it to feel like when it’s done",
    ],
    /** Choices for the optional budget / timeframe fields. These are the visitor's own ranges, not shop pricing. */
    budgetOptions: ["Not sure yet", "Under $2,500", "$2,500 – $5,000", "$5,000 – $10,000", "$10,000 – $25,000", "$25,000+"],
    timeframeOptions: ["As soon as possible", "Within 1–3 months", "3–6 months", "Just exploring options"],
  },

  contact: {
    phone: null,
    email: null,
    address: null,
    hours: null,
    socials: [],
  } as ContactMethods,
};

export type Site = typeof site;
