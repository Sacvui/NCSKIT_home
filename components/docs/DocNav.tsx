'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, BookOpen, GraduationCap, Microscope, PanelsTopLeft } from 'lucide-react';
import { getStoredLocale, t, type Locale } from '@/lib/i18n';

export default function DocNav() {
    const pathname = usePathname();
    const [locale, setLocale] = useState<Locale>('vi');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLocale(getStoredLocale());
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            window.removeEventListener('localeChange', handleLocaleChange);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const sections = [
        { id: 'theory', href: '/docs/theory', icon: GraduationCap, label: t(locale, 'docs.tabs.theory') },
        { id: 'case-study', href: '/docs/case-study', icon: Microscope, label: t(locale, 'docs.tabs.casestudy') },
        { id: 'user-guide', href: '/docs/user-guide', icon: BookOpen, label: t(locale, 'docs.tabs.userguide') },
    ];

    const isVi = locale === 'vi';
    const currentSection = sections.find(s => pathname.startsWith(s.href)) || { label: isVi ? 'Tổng quan' : 'Overview', icon: PanelsTopLeft };

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm py-2">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <PanelsTopLeft className="w-4 h-4" />
                        <span>Documentation</span>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all text-sm font-bold text-slate-800 shadow-sm"
                        >
                            <currentSection.icon className="w-4 h-4 text-indigo-600" />
                            {currentSection.label}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                                <div className="p-2 border-b border-slate-50 bg-slate-50/50">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3">Danh mục tài liệu</span>
                                </div>
                                <div className="p-1">
                                    {sections.map((item) => {
                                        const isActive = pathname.startsWith(item.href);
                                        return (
                                            <Link
                                                key={item.id}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center gap-4 px-4 py-3.5 text-sm rounded-xl transition-all ${
                                                    isActive 
                                                    ? 'bg-indigo-50 text-indigo-700 font-bold' 
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    <item.icon className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold">{item.label}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        {item.id === 'theory' ? (isVi ? 'Kiến thức học thuật' : 'Academic Knowledge') : 
                                                         item.id === 'case-study' ? (isVi ? 'Mẫu báo cáo khoa học' : 'Scientific Reporting') : 
                                                         (isVi ? 'Hướng dẫn hệ thống' : 'System Operations')}
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
