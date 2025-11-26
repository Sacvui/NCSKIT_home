"use client";

import Image from "next/image";
import { useLanguageContext } from "./LanguageProvider";
import { motion } from "framer-motion";

export function CoreTeam() {
    const { copy } = useLanguageContext();
    const { coreTeam } = copy;

    const leads = coreTeam.members.filter(m => m.isLead);
    const members = coreTeam.members.filter(m => !m.isLead);

    return (
        <section id="team" className="section">
            <div className="container">
                <div className="section-head">
                    <p className="eyebrow">{coreTeam.eyebrow}</p>
                    <h2>{coreTeam.title}</h2>
                    <p>{coreTeam.description}</p>
                </div>

                {/* Core Team Leads */}
                <div className="team-leads-grid">
                    {leads.map((member, index) => (
                        <motion.div
                            key={member.name}
                            className="component-card team-lead-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                        >
                            <div className="team-lead-header">
                                <div className="team-lead-avatar">
                                    {member.image ? (
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            style={{ objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div className="fallback-icon">
                                            <GraduationCapIcon />
                                        </div>
                                    )}
                                </div>
                                <h3>{member.name}</h3>
                                <div className="team-role">{member.role}</div>
                                <div className="team-subtitle">{member.subtitle}</div>
                            </div>

                            <div className="team-lead-body">
                                <div className="team-expertise">
                                    <div className="tags">
                                        {member.expertise?.slice(0, 4).map((tag) => (
                                            <span key={tag} className={`tag tag-${index}`}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Other Members */}
                {members.length > 0 && (
                    <div className="team-members-section">
                        <motion.h3
                            className="team-section-title"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            Research & Development Team
                        </motion.h3>
                        <div className="team-members-grid">
                            {members.map((member, index) => (
                                <motion.div
                                    key={member.name}
                                    className="component-card team-member-card"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="team-member-avatar">
                                        {member.image ? (
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                style={{ objectFit: "cover" }}
                                            />
                                        ) : (
                                            <div className="fallback-icon-small">
                                                <UsersIcon />
                                            </div>
                                        )}
                                    </div>
                                    <div className="team-member-info">
                                        <h4>{member.name}</h4>
                                        <div className="team-member-role">{member.role}</div>
                                        <div className="team-member-expertise">
                                            {member.expertise?.[0]} • {member.expertise?.[1]}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function GraduationCapIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    )
}

function UsersIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}

function BriefcaseIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    )
}

