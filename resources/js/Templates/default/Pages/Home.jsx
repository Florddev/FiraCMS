import React from 'react';

import { Head } from '@inertiajs/react';
import Navbar from '../Sections/Navbar';
import Footer from '../Sections/Footer';
import Hero from '../Sections/Hero';
import Contact from '../Sections/Contact';

export default function PageHome() {

    return (
        <>
            <Head title="Accueil" />

            <Navbar/>
            <Hero />
            <Contact />
            <Footer />
        </>
    );

}