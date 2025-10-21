'use client';
import HeroSection from '@/components/HeroSection';
import StandardCurriculum from '@/components/StandardCurriculum';
import ChooseUs from '@/components/ChooseUs';
import ClientsTestimonials from '@/components/ClientsTestimonials';
import HomeNew from '@/components/HomeNews';
import OurPartners from '@/components/OurPartners';

export default function Home({ params }: { params: { lang: string } }) {
    return (
        <>
            <HeroSection params={params} />
            <StandardCurriculum params={params} />
            <ChooseUs params={params} />
            <ClientsTestimonials params={params} />
            <HomeNew params={params} />
            <OurPartners params={params} />
        </>
    );
}
