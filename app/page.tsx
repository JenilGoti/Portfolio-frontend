import { profile } from "@/lib/profile";
import { PortfolioAgentChat } from "@/components/portfolio-agent-chat";
import {
  Certifications,
  ContactForm,
  ContactBar,
  Education,
  Experience,
  Hero,
  Languages,
  NavBar,
  Projects,
  Publications,
  Skills,
  Testimonials
} from "@/components/portfolio-sections";

export default function Home() {
  return (
    <>
      <NavBar info={profile.personal_info} />
      <main>
        <Hero profile={profile} />
        <ContactBar info={profile.personal_info} />
        <PortfolioAgentChat />
        <Skills skills={profile.skills} />
        <Experience experience={profile.experience} />
        <Projects projects={profile.projects} />
        <Testimonials testimonials={profile.testimonials ?? []} />
        <Education education={profile.education} />
        <Publications publications={profile.publications} />
        <Certifications certifications={profile.certifications} />
        <Languages languages={profile.languages} />
        <ContactForm info={profile.personal_info} />
      </main>
    </>
  );
}
