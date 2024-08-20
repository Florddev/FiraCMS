import React from 'react';

import { Head } from '@inertiajs/react';
import HeroSection from '../Sections/HeroSection.jsx';
import Footer from '../Sections/Footer';
import Contact from '../Sections/Contact';

export default function PageContact() {

    return (
        <>
            <Head title="Contact" />

            <HeroSection />
            <p>Page contact</p>
            <Contact />
            <Footer />
        </>
    );

}
