import React from 'react';

import { Head } from '@inertiajs/react';
import HeroSection from '../Sections/HeroSection.jsx';
import Features from "@/Templates/default/Sections/Features.jsx";
import Stats from "@/Templates/default/Sections/Stats.jsx";
import Blog from "@/Templates/default/Sections/Blog.jsx";
import CallToActions from "@/Templates/default/Sections/CallToActions.jsx";
import Testimonials from "@/Templates/default/Sections/Testimonials.jsx";
import Header from "@/Templates/default/Sections/Header.jsx";
import Footer from "@/Templates/default/Sections/Footer.jsx";

export default function PageHome() {

    return (
        <>
            <Head title="Accueil">
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            <div style={{"font-family": "Urbanist, sans-serif;"}}>
                <Header/>
                <main className="space-y-40 mb-40">
                    <HeroSection/>
                    <Features/>
                    <Stats/>
                    <Testimonials/>
                    <CallToActions/>
                    <Blog/>
                </main>
                <Footer/>
            </div>
        </>
    );

}
