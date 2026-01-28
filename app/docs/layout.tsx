import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
    title: 'ncsStat Documentation | Statistical Analysis Guide',
    description: 'Comprehensive guide to ncsStat analysis tools and methods.',
};

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header hideNav={false} />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
