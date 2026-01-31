"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Testimonial {
    id: string;
    name: string;
    role: string;
    institution: string;
    avatar?: string;
    quote: string;
    rating: number;
    researchArea?: string;
}

const testimonials: Testimonial[] = [
    {
        id: "1",
        name: "Dr. Nguyễn Văn Minh",
        role: "Associate Professor",
        institution: "University of Economics HCMC",
        quote: "NCSKIT đã giúp tôi tiết kiệm được hàng tuần làm việc với SPSS. Từ khi dùng hệ thống này, quy trình phân tích SEM của tôi nhanh hơn 70%.",
        rating: 5,
        researchArea: "Marketing Research",
    },
    {
        id: "2",
        name: "ThS. Trần Thị Lan",
        role: "PhD Candidate",
        institution: "Foreign Trade University",
        quote: "Trước đây mất 2 tuần để clean data và chạy EFA/CFA, giờ chỉ cần 2 ngày. NCSKIT thực sự là game-changer cho nghiên cứu sinh.",
        rating: 5,
        researchArea: "Consumer Behavior",
    },
    {
        id: "3",
        name: "TS. Lê Hoàng Nam",
        role: "Senior Researcher",
        institution: "Vietnam National University",
        quote: "Tính năng auto-generate báo cáo theo chuẩn APA giúp tôi tập trung vào phân tích thay vì format. Highly recommended!",
        rating: 5,
        researchArea: "Econometrics",
    },
    {
        id: "4",
        name: "Phạm Thùy Dương",
        role: "Master Student",
        institution: "Banking University",
        quote: "Là người sợ thống kê, NCSKIT giúp tôi hiểu được từng bước phân tích. Interface rất user-friendly và hướng dẫn chi tiết.",
        rating: 5,
        researchArea: "Finance",
    },
];

const stats = [
    { value: "500+", label: "Researchers" },
    { value: "1,200+", label: "Papers Analyzed" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "73%", label: "Time Saved" },
];

export function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-rotate testimonials
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <svg
                key={i}
                className={`star ${i < rating ? "filled" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={i < rating ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
            >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ));
    };

    return (
        <section id="testimonials" className="section testimonials-section">
            <div className="container">
                {/* Stats Row */}
                <div className="testimonials-stats">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="stat-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Section Header */}
                <div className="section-head" style={{ textAlign: "center", margin: "3rem auto" }}>
                    <p className="eyebrow">Trusted by Researchers</p>
                    <h2>What Our Users Say</h2>
                    <p>Join hundreds of researchers who have transformed their workflow</p>
                </div>

                {/* Testimonials Carousel */}
                <div
                    className="testimonials-carousel"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            className="testimonial-card featured"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="testimonial-quote-mark">&ldquo;</div>
                            <blockquote className="testimonial-quote">
                                {testimonials[activeIndex].quote}
                            </blockquote>
                            <div className="testimonial-rating">
                                {renderStars(testimonials[activeIndex].rating)}
                            </div>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">
                                    {testimonials[activeIndex].avatar ? (
                                        <Image
                                            src={testimonials[activeIndex].avatar!}
                                            alt={testimonials[activeIndex].name}
                                            width={64}
                                            height={64}
                                        />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {testimonials[activeIndex].name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="testimonial-info">
                                    <strong>{testimonials[activeIndex].name}</strong>
                                    <span>{testimonials[activeIndex].role}</span>
                                    <span className="testimonial-institution">
                                        {testimonials[activeIndex].institution}
                                    </span>
                                    {testimonials[activeIndex].researchArea && (
                                        <span className="testimonial-area">
                                            {testimonials[activeIndex].researchArea}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Dots */}
                    <div className="testimonials-nav">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                className={`nav-dot ${index === activeIndex ? "active" : ""}`}
                                onClick={() => setActiveIndex(index)}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Arrow Navigation */}
                    <button
                        className="testimonial-arrow prev"
                        onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                        aria-label="Previous testimonial"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                    <button
                        className="testimonial-arrow next"
                        onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
                        aria-label="Next testimonial"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>

                {/* University Logos */}
                <div className="trusted-by">
                    <p className="trusted-label">Trusted by researchers from</p>
                    <div className="university-logos">
                        <span className="university-name">UEH</span>
                        <span className="university-name">FTU</span>
                        <span className="university-name">VNU</span>
                        <span className="university-name">NEU</span>
                        <span className="university-name">HUST</span>
                        <span className="university-name">BUH</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
