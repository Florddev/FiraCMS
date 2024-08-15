import React from 'react';

import { Head } from '@inertiajs/react';
import Navbar from '../Sections/Navbar';
import Footer from '../Sections/Footer';
import Contact from '../Sections/Contact';

export default function PageContact() {

    return (
        <>
            <Head title="Contact" />

            <Navbar />
            <p>Page contact</p>
            <Contact />
            <Footer />
        </>
    );

}