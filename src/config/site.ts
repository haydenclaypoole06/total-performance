/**
 * TOTAL RACING & PERFORMANCE — central editable content.
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
  name: "TOTAL RACING & PERFORMANCE",
  tagline: "Precision engineered. Performance driven.",
  description:
    "TOTAL RACING & PERFORMANCE is an automotive performance shop for engine, camshaft, forced induction, suspension and drivability work. Tell us about your car and start planning your build.",

  nav: [
    { label: "Services", href: "#services" },
    { label: "Our Work", href: "#work" },
    { label: "Our Approach", href: "#approach" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    eyebrow: "TOTAL RACING & PERFORMANCE",
    headline: ["YOUR VISION.", "OUR STANDARDS."],
    copy: "Your goals shape the build. Our standards guide every detail—from the right combination of parts to the care behind the installation.",
    primaryCta: "primaryCta: LET’S TALK HORSEPOWER & PERFORMANCE",
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
        description:
  "Intake, exhaust, and supporting upgrades selected to bring more out of your car and work together as a complete combination.",
        graphic: "tach",
        confirmed: false,
      },
      {
        number: "02",
        title: "Engine & Camshaft Upgrades",
        description:
  "Camshaft packages, cylinder head upgrades, and engine combinations built around your power goals and how you drive.",
        graphic: "camshaft",
        confirmed: false,
      },
      {
        number: "03",
        title: "Forced Induction",
        description:
  "Supercharger and turbocharger installations with the fuel, cooling, and supporting upgrades your combination needs.",
        graphic: "compressor",
        confirmed: false,
      },
      {
        number: "04",
        title: "Diagnostics & Drivability",
        description:
  "From warning lights to problems you can feel behind the wheel, we test to find the cause and explain what it takes to fix it.",
        graphic: "waveform",
        confirmed: false,
      },
      {
        number: "05",
        title: "Suspension & Brakes",
        description:
  "Suspension and brake upgrades matched to your car’s power, tire setup, and use—for better control through every turn and stop.",
        graphic: "suspension",
        confirmed: false,
      },
      {
        number: "06",
        title: "Maintenance & Supporting Work",
        description:
  "Fluid services, leak repairs, and worn-component replacement to keep your car dependable and ready for what comes next.",
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

  items: [
  "CORVETTE",
  "VIPER"
  "GM LS & LT",
  "COYOTE / FORD",
  "MOPAR",
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
       heading: "EVERY BUILD DESERVES A PLAN OF ITS OWN.",
    copy:
      "Good work starts with a clear understanding of what you want. We help you sort through the options, explain our recommendations, and plan the work around your car, your priorities, and your budget.",
    themes: [
      {
        title: "Understand the goal",
        text: "More power, better handling, or a problem you need solved—we start with what matters to you and how you use your car.",
      },
      {
        title: "Plan the complete job",
        text: "We look beyond the main upgrade to the supporting parts, compatibility, and installation details that make the combination work.",
      },
      {
        title: "Follow through on the details",
        text: "The job isn’t finished when the parts are installed. We check how everything fits, functions, and works together before calling it complete.",
      },
      {
        title: "Keep things clear",
        text: "Know what’s included, why we recommend it, and what to expect. If something changes, we discuss it with you before moving ahead.",
      },
    ],
    confirmed: true,
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
    heading: "LET’S GET YOUR BUILD STARTED.",
    steps: [
      {
        number: "01",
        title: "Tell Us About Your Car",
        text: "Share the vehicle, current modifications, and what you want to change.",
      },
      {
       number: "02",
       title: "Discuss the Plan",
       text: "We’ll walk you through our recommendations, answer your questions, and agree on the work and budget before scheduling.",
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
    note: "We’ll review your request and contact you about the next step. Submitting does not book an appointment.",
    /** Prompts shown beside the form to help people send a complete first message. */
    helpfulToInclude: [
  "Your vehicle and any relevant modifications",
  "What you’d like to improve—or what isn’t working right",
  "How you use the car and what matters most to you",
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
