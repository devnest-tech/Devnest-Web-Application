import Link from "next/link";
import { Github, Linkedin, Instagram } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  designation: string;
  bio: string;
  image: string;
  socials: {
    github: string;
    linkedin: string;
    instagram: string;
  };
}

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

const isValidLink = (link: string | undefined): boolean => {
  return !!link && link !== "#" && link.trim() !== "";
};

export function TeamCard({ member, index }: TeamCardProps) {
  return (
    <div
      className="group relative"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
      }}
    >
      {/* Card Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />

      {/* Card */}
      <div className="relative glass-effect rounded-xl p-5 sm:p-6 hover-lift transition-all duration-300 overflow-hidden">
        {/* Profile Info - Always visible on mobile, hover effect on desktop */}
        <div className="lg:group-hover:translate-y-full transition-transform duration-300">
          <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 text-center">{member.image}</div>
          <h3 className="text-lg sm:text-xl font-poppins font-bold mb-1 text-center">
            {member.name}
          </h3>
          <p className="text-xs sm:text-sm text-primary font-semibold text-center mb-2">
            {member.designation}
          </p>
          <p className="text-xs text-muted-foreground text-center mb-3 sm:mb-4">
            {member.role}
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-3 sm:mb-4" />

          {/* Show bio on mobile, hide on desktop (shown on hover) */}
          <p className="text-xs sm:text-sm text-muted-foreground text-center mb-3 sm:mb-4 line-clamp-3 lg:hidden">
            {member.bio}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground text-center hidden lg:block">
            Hover to learn more
          </p>

          {/* Social Links - Always visible on mobile */}
          <div className="flex gap-2 sm:gap-3 justify-center mt-3 sm:mt-4 lg:hidden">
            {isValidLink(member.socials.github) && (
              <a
                href={member.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-primary/20 hover:bg-primary/40 active:scale-95 transition-all"
                title="GitHub"
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </a>
            )}
            {isValidLink(member.socials.linkedin) && (
              <a
                href={member.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-primary/20 hover:bg-primary/40 active:scale-95 transition-all"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </a>
            )}
            {isValidLink(member.socials.instagram) && (
              <a
                href={member.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-primary/20 hover:bg-primary/40 active:scale-95 transition-all"
                title="Instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </a>
            )}
          </div>
        </div>

        {/* Back Side - Bio & Socials (Desktop hover only) */}
        <div className="absolute inset-0 p-5 sm:p-6 hidden lg:flex flex-col justify-center items-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none group-hover:pointer-events-auto">
          <p className="text-sm text-muted-foreground text-center mb-6 line-clamp-3">
            {member.bio}
          </p>

          {/* Social Links */}
          <div className="flex gap-3 justify-center pointer-events-auto">
            {isValidLink(member.socials.github) && (
              <a
                href={member.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-primary/20 hover:bg-primary/40 transition-colors group/social"
                title="GitHub"
              >
                <Github className="w-5 h-5 text-primary group-hover/social:scale-110 transition-transform" />
              </a>
            )}
            {isValidLink(member.socials.linkedin) && (
              <a
                href={member.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-primary/20 hover:bg-primary/40 transition-colors group/social"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-primary group-hover/social:scale-110 transition-transform" />
              </a>
            )}
            {isValidLink(member.socials.instagram) && (
              <a
                href={member.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-primary/20 hover:bg-primary/40 transition-colors group/social"
                title="Instagram"
              >
                <Instagram className="w-5 h-5 text-primary group-hover/social:scale-110 transition-transform" />
              </a>
            )}
          </div>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
            backgroundSize: "200% 200%",
            animation: "shimmer 3s infinite",
          }}
        />
      </div>
    </div>
  );
}
