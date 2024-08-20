import React from 'react';

import { Head } from '@inertiajs/react';
import HeroSection from '../Sections/HeroSection.jsx';
import Footer from '../Sections/Footer';

export default function PageAbout() {

    return (
        <>
            <Head title="About" />

            <HeroSection />
            <p>About page</p>
            <Footer />
        </>
    );

}
