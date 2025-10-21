import HeroSection from '@/components/HeroSection';
import StandardCurriculum from '@/components/StandardCurriculum';
import ChooseUs from '@/components/ChooseUs';
import ClientsTestimonials from '@/components/ClientsTestimonials';
import HomeNew from '@/components/HomeNews';
import OurPartners from '@/components/OurPartners';

export default async function Home({ params }: { params: Promise<{ lang: 'vi' | 'en' }> }) {
    const { lang } = await params;

    return (
        <>
            <HeroSection lang={lang} />
            <StandardCurriculum lang={lang} />
            <ChooseUs lang={lang} />
            <ClientsTestimonials lang={lang} />
            <HomeNew lang={lang} />
            <OurPartners lang={lang} />
        </>
    );
}
