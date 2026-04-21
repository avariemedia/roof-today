import AudiencePageTemplate from "@/components/AudiencePageTemplate";

export const metadata = {
  title: "Roof Measurements for Solar Installers — Instant Pitch & Facet Data",
  description:
    "Solar installers: get accurate roof pitch, facet orientation, and square footage for solar array design. From $5 per report. No subscription.",
  alternates: { canonical: "/for/solar-installers" },
};

export default function Page() {
  return (
    <AudiencePageTemplate
      h1="Roof data for solar. Minutes, not meetings."
      subhead="Pitch, facets, and orientation for every array you design."
      intro="Solar installers don't have time to wait on hours-long roof reports. Roof Today delivers the pitch, facet breakdown, and orientation data you need to design an accurate array — before your first site visit."
      useCases={[
        { title: "Pre-site-visit feasibility", body: "Confirm roof viability on leads before driving out." },
        { title: "Array design", body: "Facet-level square footage and orientation for sun modeling." },
        { title: "Proposal generation", body: "Slot accurate roof data into your proposal software, same day." },
      ]}
      benefits={[
        "Pitch data for every facet",
        "Facet orientation detection",
        "Total + individual facet squares",
        "No site visit required for a first pass",
        "Insurance-ready format if needed",
      ]}
    />
  );
}
