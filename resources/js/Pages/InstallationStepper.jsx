import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {Stepper, Step, useStepper} from '@/Components/ui/stepper';
import { Button } from '@/Components/ui/button';
import axios from 'axios';
import { WelcomeStep } from "@/Pages/Install/WelcomeStep.jsx";
import { RequirementsStep } from "@/Pages/Install/RequirementsStep.jsx";
import { PermissionsStep } from "@/Pages/Install/PermissionsStep.jsx";
import { DatabaseStep } from "@/Pages/Install/DatabaseStep.jsx";
import { MigrationsStep } from "@/Pages/Install/MigrationsStep.jsx";
import { AdminStep } from "@/Pages/Install/AdminStep.jsx";
import { FinishStep } from "@/Pages/Install/FinishStep.jsx";
import {
    Home,
    User,
    Database,
    ScanSearch,
    ShieldQuestion
} from "lucide-react";
import {cn} from "@/lib/utils";

const steps = [
    { label: "Bienvenue", description: "Accueil", Composent: WelcomeStep, icon: Home },
    { label: "Prérequis", description: "Vérification des prérequis", Composent: RequirementsStep, icon: ScanSearch },
    { label: "Permissions", description: "Vérification des permissions", Composent: PermissionsStep, icon: ShieldQuestion },
    { label: "Base de données", description: "Configuration de la base de données", Composent: DatabaseStep, icon: Database },
    { label: "Compte", description: "Création de l'administrateur", Composent: AdminStep, icon: User },
]

export default function InstallationStepper({ requirements, permissions }) {
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

    const submit = () => {
        console.log(data);
    }

    const clickStep = (step, setStep) => {
        setStep(step);
    }

    return (
        <div className="flex w-full flex-col gap-4 container mt-12">
            <Stepper
                initialStep={0}
                steps={steps}
                onClickStep={clickStep}
                styles={{
                    "step-button-container": cn(
                        "text-primary",
                        "data-[current=true]:border-primary data-[current=true]:bg-primary-foreground",
                        "data-[active=true]:bg-primary data-[active=true]:border-primary"
                    ),
                    "horizontal-step": "data-[completed=true]:[&:not(:last-child)]:after:bg-primary",
                }}
            >
                {steps.map(({ label, Composent, icon, description }, index) => (
                    <Step key={label} label={label} icon={icon} color="red" description={description}>
                        <Composent data={data} setData={setData} errors={errors} requirements={requirements} permissions={permissions} />
                    </Step>
                ))}
                <Footer submit={submit} />
            </Stepper>
        </div>
    )
}

const Footer = ({submit}) => {
    const {
        nextStep,
        prevStep,
        resetSteps,
        isDisabledStep,
        hasCompletedAllSteps,
        isLastStep,
        isOptionalStep,
    } = useStepper()
    return (
        <>
            {hasCompletedAllSteps && (
                <div className="h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
                    <h1 className="text-xl">Récapitulatif des données..</h1>
                </div>
            )}
            <div className="w-full flex justify-end gap-2">
                {hasCompletedAllSteps ? (
                    <Button size="sm" onClick={submit}>
                        Valider la configuration
                    </Button>
                ) : (
                    <>
                        <Button
                            disabled={isDisabledStep}
                            onClick={prevStep}
                            size="sm"
                            variant="secondary"
                        >
                            Prev
                        </Button>
                        <Button size="sm" onClick={nextStep}>
                            {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
                        </Button>
                    </>
                )}
            </div>
        </>
    )
}
