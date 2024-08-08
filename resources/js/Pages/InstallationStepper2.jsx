import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Stepper, Step } from '@/Components/ui/stepper';
import { Button } from '@/Components/ui/button';
import axios from 'axios';
import { WelcomeStep } from "@/Pages/Install/WelcomeStep.jsx";
import { RequirementsStep } from "@/Pages/Install/RequirementsStep.jsx";
import { PermissionsStep } from "@/Pages/Install/PermissionsStep.jsx";
import { DatabaseStep } from "@/Pages/Install/DatabaseStep.jsx";
import { MigrationsStep } from "@/Pages/Install/MigrationsStep.jsx";
import { AdminStep } from "@/Pages/Install/AdminStep.jsx";
import { FinishStep } from "@/Pages/Install/FinishStep.jsx";

const steps = [
    { label: "Bienvenue" },
    { label: "Vérification des prérequis" },
    { label: "Vérification des permissions" },
    { label: "Configuration de la base de données" },
    { label: "Migrations" },
    { label: "Création de l'administrateur" },
    { label: "Finalisation" },
];

export default function InstallationStepper({ requirements, permissions }) {
    const [activeStep, setActiveStep] = useState(0);
    const { data, setData, post, processing, errors, reset } = useForm({
        db_host: '',
        db_port: '',
        db_database: '',
        db_username: '',
        db_password: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const nextStep = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(prevStep => prevStep + 1);
        }
    };

    const prevStep = () => {
        if (activeStep > 0) {
            setActiveStep(prevStep => prevStep - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (activeStep === steps.length - 1) {
            try {
                const response = await axios.post('/api/install', data);
                if (response.data.success) {
                    // Redirection ou affichage d'un message de succès
                    window.location.href = '/';
                }
            } catch (error) {
                console.error('Error during installation:', error);
            }
        } else {
            nextStep();
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return <WelcomeStep />;
            case 1:
                return <RequirementsStep requirements={requirements} />;
            case 2:
                return <PermissionsStep permissions={permissions} />;
            case 3:
                return <DatabaseStep data={data} setData={setData} errors={errors} />;
            case 4:
                return <MigrationsStep />;
            case 5:
                return <AdminStep data={data} setData={setData} errors={errors} />;
            case 6:
                return <FinishStep />;
            default:
                return null;
        }
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <Stepper initialStep={activeStep} steps={steps}>
                {steps.map(({ label }, index) => (
                    <Step key={label} label={label} />
                ))}
            </Stepper>

            {renderStepContent()}

            <div className="w-full flex justify-between mt-4">
                <Button
                    onClick={prevStep}
                    disabled={activeStep === 0}
                    variant="secondary"
                >
                    Précédent
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={processing}
                >
                    {activeStep === steps.length - 1 ? "Terminer" : "Suivant"}
                </Button>
            </div>
        </div>
    );
}
