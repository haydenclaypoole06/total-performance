# Total Performance

**Paste this into Lovable.** This pushes the design toward an immersive performance brand with 3D elements, while keeping the site fast and focused on bringing customers into the shop.

Build a complete, visually exceptional website for TOTAL PERFORMANCE, an automotive performance shop.

I want an immersive motorsport experience with tasteful 3D, cinematic visuals, excellent typography, and a strong identity. The entire design should feel rooted in performance cars, engine building, forced induction, and precision workmanship.

Make visitors think: “These are the people I want working on my car.”

Do not give me a generic local business template. Design and implement the actual website with responsive layouts, polished interactions, and working navigation.

CREATIVE DIRECTION

Theme: “Precision engineered. Performance driven.”

Imagine a premium performance shop with the visual presentation of a modern motorsport manufacturer. Aggressive, technical, confident, and clean.

Use:
- Near-black: #080B10
- Dark graphite: #141A23
- Electric blue: #006BFF
- Ice blue accents: #63CFFF
- White: #F5F7FA
- Muted steel gray: #9CA9B8

Blue and white are our primary brand colors. Use blue deliberately for focal points, lighting, active states, and calls to action.

Use oversized condensed typography for headlines paired with highly readable body text. Small technical labels can use a monospace font. Maintain a clear hierarchy and generous spacing.

Visual details can include subtle machined-metal surfaces, technical grid lines, tachometer markings, restrained carbon-fiber texture, and blue edge lighting. Do not layer all of these everywhere. Each section should feel intentionally designed.

Avoid rainbow gradients, excessive glass cards, cartoon cars, cheesy flames, generic wrench icons, repetitive boxed layouts, and distracting neon overload.

3D HERO — THE SIGNATURE MOMENT

Create an impressive first screen that immediately establishes the automotive performance theme.

Desktop composition:
- Large editorial headline and short supporting copy on the left.
- An interactive 3D mechanical centerpiece on the right, integrated into the background.
- Blue rim lighting, graphite materials, controlled metallic reflections, and subtle depth.
- A restrained technical grid or workshop-inspired environment behind it.

Preferred centerpiece:
A stylized turbocharger with a visible compressor wheel, a machined housing, and a subtle slow rotation. It should feel like a premium technical sculpture.

Use React Three Fiber / Three.js if supported. Build an intentional stylized model from procedural geometry if a suitable licensed asset is unavailable. Do not depend on a missing external model, and do not present the model as an exact engineering representation.

Give the compressor wheel subtle independent movement. Add gentle pointer-responsive rotation on desktop. Keep the movement elegant and controlled.

If the turbo cannot be executed convincingly, use a beautifully modeled metallic TP monogram with blue edge lighting and layered mechanical rings. A polished alternative is better than an unconvincing turbo.

Keep the headline and buttons in ordinary HTML above the canvas so they remain sharp, accessible, and usable before the 3D loads.

Headline:
“BUILT FOR
MORE.”

Brand eyebrow:
“TOTAL PERFORMANCE”

Supporting copy:
“More response. More excitement. A build that fits your vision. Let’s talk about what’s next for your car.”

Primary CTA:
“Discuss Your Build”

Secondary CTA:
“Explore Services”

Add a small scroll cue inspired by a tachometer sweep. Do not include invented horsepower statistics, reviews, or credentials.

OVERALL PAGE EXPERIENCE

Create one cohesive, premium scrolling homepage with anchored navigation. Vary the compositions: full-width images, editorial text, service lists, a featured project layout, and carefully placed technical details.

Use restrained scroll reveals and transitions. Avoid making every section look like the same grid of cards.

1. HEADER

Transparent over the hero, transitioning into a solid dark header on scroll.

Logo area:
TOTAL PERFORMANCE, with space for my uploaded TP logo.

Navigation:
Services / Our Work / Our Approach / Contact

Prominent button:
“Discuss Your Build”

Mobile:
A clean, accessible menu with a visible inquiry action.

2. SERVICES — “PERFORMANCE WITH A PURPOSE.”

Use a distinctive numbered service layout with bold titles, short descriptions, and subtle technical graphics. On desktop, hovering or focusing a service can change a related visual panel.

Draft service categories:
01 / Performance Upgrades
Bolt-ons and supporting modifications planned around your goals.

02 / Engine & Camshaft Upgrades
Talk with us about the next stage of your engine combination.

03 / Forced Induction
Discuss supercharger or turbocharger installation and the supporting work your build requires.

04 / Diagnostics & Drivability
Start with understanding the issue and planning the next step.

05 / Suspension & Brakes
Explore upgrades that support handling, control, and confidence.

06 / Maintenance & Supporting Work
Address the foundation that your next upgrade depends on.

Make this service list editable and flag it for owner confirmation before launch. Do not invent pricing, packages, tuning capabilities, fabrication services, warranties, or turnaround times.

3. VEHICLE FOCUS

Create an understated typographic strip:
“CORVETTE / LS & LT / AMERICAN MUSCLE / ENTHUSIAST BUILDS”

Use text instead of manufacturer logos. Keep vehicle coverage editable for confirmation. Do not imply official manufacturer affiliation.

4. FEATURED WORK — “THE DETAILS MAKE THE BUILD.”

Create a compelling project showcase designed for real shop photography.

Use one large featured image with smaller supporting detail images. Include editable fields for:
- Vehicle
- Owner’s goal
- Work performed
- Supporting modifications
- Verified results, only when supplied

The development preview may show clearly labeled sample placeholders. Hide this section from the public version until real project information is provided.

Never create fake customer builds, fake dyno graphs, fake horsepower numbers, or fabricated before-and-after results. Do not label stock imagery as our work.

5. OUR APPROACH — “YOUR CAR. A CLEAR PLAN.”

Create a clean editorial section with space for a real shop or technician photo.

Suggested copy:
“Every project starts with a conversation about your car, your goals, and how you use it. From an individual upgrade to a larger build, the details deserve attention.”

Support it with four concise themes:
- Goals before parts
- A combination that works together
- Attention to installation details
- Clear communication

Treat these as our intended approach, not fabricated testimonials or guarantees. Make the copy editable.

6. PROCESS — “FROM IDEA TO NEXT STEP.”

Create a three-step sequence with restrained technical styling:

01 / Tell Us About Your Car
Share the vehicle, current modifications, and what you want to change.

02 / Discuss the Plan
Talk through the scope, priorities, and proposed work.

03 / Schedule Your Project
Confirm the next step with our team.

Keep this readable on mobile. No complicated horizontal scrolling.

7. FINAL CTA AND INQUIRY FORM

Create a visually powerful closing section with a subtle 3D or illustrated mechanical detail in the background.

Headline:
“WHAT’S NEXT
FOR YOUR CAR?”

Supporting text:
“Tell us what you drive and what you have in mind.”

Form fields:
- Name, required
- Email, required
- Phone, optional
- Vehicle year / make / model, required
- Current modifications, optional
- What would you like done?, required
- Approximate budget, optional
- Preferred timeframe, optional

Submit button:
“Send Project Inquiry”

Small note:
“Submitting an inquiry does not confirm an appointment.”

Include proper labels, validation, loading states, and helpful error messages. Preserve entered information after an error.

Never simulate a successful submission. If a secure submission destination has not been configured, clearly identify that in the preview and leave submission disabled until connected. Keep secrets out of frontend code.

8. FOOTER

Include:
- TOTAL PERFORMANCE branding
- Editable phone, email, address, business hours, and social links
- Navigation links
- Privacy information appropriate to the actual form setup

Do not invent contact information or display fake links. Hide unavailable contact methods until configured. Add a map only after I provide the actual shop address.

INTERACTION DETAILS

Use a few memorable, well-executed touches:
- Subtle 3D pointer response in the hero
- Short blue underline sweeps on navigation
- Crisp button hover and focus states
- Service illustrations that respond to hover and keyboard focus
- Restrained section reveals
- A thin scroll progress indicator inspired by a tachometer

Do not use custom cursors, scroll hijacking, autoplay engine sounds, excessive shaking, flashing effects, or long loading intros.

MOBILE AND PERFORMANCE

The mobile experience must feel equally intentional.

- Scale or simplify the 3D scene for smaller screens.
- Limit rendering resolution and avoid expensive effects.
- Pause animation when the hero is offscreen or the tab is hidden.
- Respect prefers-reduced-motion.
- Provide a polished static fallback for unsupported WebGL or lower-powered devices.
- Lazy-load the 3D scene without blocking the headline or CTA.
- Optimize imagery and prevent layout shifts.
- Keep text readable and touch targets comfortable.
- No horizontal overflow.
- Maintain strong color contrast and visible keyboard focus.
- Do not rely on hover to expose essential information.
- Use a mobile contact bar without covering form controls or footer content.

CONTENT AND TRUST

Write like knowledgeable car enthusiasts who take their work seriously. Confident and direct, without empty hype or corporate filler.

Do not invent:
- Reviews or star ratings
- Certifications or awards
- Years in business
- Customer counts
- Horsepower results
- Shop equipment
- Guaranteed outcomes
- Business location

Use real shop photos when I provide them. Any temporary imagery must be licensed and treated as illustrative, not proof of our work.

IMPLEMENTATION

Use reusable React components, consistent design tokens, and a central editable configuration for business details, services, project content, and contact methods.

Use semantic HTML, a logical heading structure, descriptive page metadata, and accessible form controls. Add location-specific SEO only after the location is confirmed.

Do not add a customer portal, payments, ecommerce, or an unnecessary account system. Focus this first version on presenting the shop and generating inquiries.

Build the complete first version now. Make reasonable design decisions without stopping for minor questions.

Before finishing, check:
- Desktop and mobile layouts
- All navigation and CTA destinations
- Missing assets
- Form behavior
- Keyboard navigation
- Reduced-motion behavior
- The static 3D fallback
- Browser console errors

Then give me a short launch checklist showing which real photos, business details, service confirmations, and form setup are still needed.

The finished result should be visually memorable, unmistakably automotive, and convincing enough that a serious enthusiast wants to start a conversation about their car. Ive Attached my logos

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f3529f16-1a9d-4a47-a60f-26de1a5e6e06).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
