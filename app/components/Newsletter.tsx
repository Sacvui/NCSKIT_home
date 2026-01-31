"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface NewsletterProps {
    variant?: "inline" | "modal" | "footer";
}

export function Newsletter({ variant = "inline" }: NewsletterProps) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes("@")) {
            setStatus("error");
            setMessage("Please enter a valid email address");
            return;
        }

        setStatus("loading");

        try {
            // Simulate API call - replace with actual newsletter service
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // In production, call your newsletter API:
            // await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });

            setStatus("success");
            setMessage("Welcome aboard! Check your inbox for confirmation.");
            setEmail("");
        } catch {
            setStatus("error");
            setMessage("Something went wrong. Please try again.");
        }
    };

    if (variant === "footer") {
        return (
            <div className="newsletter-footer">
                <h4>Stay Updated</h4>
                <p>Get the latest research tips and NCSKIT updates</p>
                <form onSubmit={handleSubmit} className="newsletter-form-inline">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        disabled={status === "loading" || status === "success"}
                    />
                    <button type="submit" disabled={status === "loading" || status === "success"}>
                        {status === "loading" ? (
                            <span className="spinner" />
                        ) : status === "success" ? (
                            "✓"
                        ) : (
                            "Subscribe"
                        )}
                    </button>
                </form>
                {message && (
                    <p className={`newsletter-message ${status}`}>{message}</p>
                )}
            </div>
        );
    }

    return (
        <motion.section
            className="newsletter-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <div className="newsletter-content">
                <div className="newsletter-icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                </div>
                <div className="newsletter-text">
                    <h3>Join the Research Community</h3>
                    <p>
                        Get weekly insights on statistical analysis, academic writing tips,
                        and exclusive NCSKIT updates delivered to your inbox.
                    </p>
                    <ul className="newsletter-benefits">
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Free research templates & checklists
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Early access to new features
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Expert tips from published researchers
                        </li>
                    </ul>
                </div>
                <form onSubmit={handleSubmit} className="newsletter-form">
                    <div className="form-group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (status === "error") setStatus("idle");
                            }}
                            placeholder="you@university.edu"
                            disabled={status === "loading" || status === "success"}
                            className={status === "error" ? "error" : ""}
                        />
                        <button
                            type="submit"
                            disabled={status === "loading" || status === "success"}
                            className="primary-btn"
                        >
                            {status === "loading" ? (
                                <>
                                    <span className="spinner" />
                                    Subscribing...
                                </>
                            ) : status === "success" ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Subscribed!
                                </>
                            ) : (
                                "Subscribe for Free"
                            )}
                        </button>
                    </div>
                    {message && (
                        <motion.p
                            className={`newsletter-message ${status}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {message}
                        </motion.p>
                    )}
                    <p className="newsletter-privacy">
                        No spam, ever. Unsubscribe anytime. Read our{" "}
                        <a href="/privacy">Privacy Policy</a>.
                    </p>
                </form>
            </div>
        </motion.section>
    );
}
