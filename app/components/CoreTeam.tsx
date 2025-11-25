"use client";

import { useLanguageContext } from "./LanguageProvider";
import { motion } from "framer-motion";

export function CoreTeam() {
    const { copy } = useLanguageContext();
    const { coreTeam } = copy;

    return (
        <section id="team" className="section">
            <div className="container">
                <div className="section-head">
                    <p className="eyebrow">{coreTeam.eyebrow}</p>
                    <h2>{coreTeam.title}</h2>
                    <p>{coreTeam.description}</p>
                </div>

                <div className="team-grid">
                    {coreTeam.members.map((member, index) => (
                        <motion.div
                            key={member.name}
                            className="component-card team-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="team-header-content">
                                <div className={`team-icon icon-${index}`}>
                                    {index === 0 && <GraduationCapIcon />}
                                    {index === 1 && <UsersIcon />}
                                    {index === 2 && <BriefcaseIcon />}
                                </div>
                                <h3>{member.name}</h3>
                                <div className="team-role">{member.role}</div>
                                <div className="team-subtitle">{member.subtitle}</div>
                            </div>

                            <div className="team-body">
                                <h4>Key Responsibilities:</h4>
                                <ul>
                                    {member.responsibilities?.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>

                                <div className="team-expertise">
                                    <h4>Expertise:</h4>
                                    <div className="tags">
                                        {member.expertise?.map((tag) => (
                                            <span key={tag} className={`tag tag-${index}`}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="team-others-section">
                    <div className="others-grid">
                        {coreTeam.otherMembers.map((group, index) => (
                            <motion.div
                                key={group.role}
                                className="other-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                <span className="count">{group.count}</span>
                                <span className="role">{group.role}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function GraduationCapIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function BriefcaseIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
}
