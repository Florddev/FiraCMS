import React from 'react';

import { Head } from '@inertiajs/react';
import Navbar from '../Sections/Navbar';
import Footer from '../Sections/Footer';

export default function PageAbout() {

    return (
        <>
            <Head title="About" />

            <Navbar />
            <p>About page</p>
            <Footer />
        </>
    );

}