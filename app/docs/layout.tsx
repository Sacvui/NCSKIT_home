import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DocNav from '@/components/docs/DocNav';

export const metadata: Metadata = {
    title: {
        template: '%s | ncsStat Documentation',
        default: 'ncsStat Documentation | Statistical Analysis Guide',
    },
    description: 'Comprehensive guide to ncsStat analysis tools, statistical theory, and research workflows.',
};

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header hideNav={false} />
            <DocNav />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
