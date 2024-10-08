import React, {useEffect, useState} from 'react';
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
    ShieldQuestion,
    X
} from "lucide-react";
import {cn} from "@/lib/utils";

const steps = [
    { id: 0, tag: "start", label: "Bienvenue", description: "Accueil", Composent: WelcomeStep, icon: Home },
    { id: 1, tag: "requirements", label: "Prérequis", description: "Vérification des prérequis", Composent: RequirementsStep, icon: ScanSearch },
    { id: 2, tag: "permissions", label: "Permissions", description: "Vérification des permissions", Composent: PermissionsStep, icon: ShieldQuestion },
    { id: 3, tag: "database", label: "Base de données", description: "Configuration de la base de données", Composent: DatabaseStep, icon: Database },
    { id: 4, tag: "admin", label: "Compte", description: "Création de l'administrateur", Composent: AdminStep, icon: User },
]
const getStepByPropName = (prop) => {
    return steps.find(step => step.tag === prop);
}

export default function InstallationStepper({ requirements, permissions, current_step = 'start' }) {
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        setCurrentStep(getStepByPropName(current_step));
    }, [current_step]);

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

    const hasDbError =
        errors.db_host !== undefined ||
        errors.db_port !== undefined ||
        errors.db_database !== undefined ||
        errors.db_username !== undefined ||
        errors.db_password !== undefined

    const submit = async () => {
        await post('/install');
    };

    // const clickStep = (step, setStep) => {
    //     setStep(step);
    // }

    return (
        <div className="flex w-full flex-col gap-4 container mt-12">
            <Stepper
                initialStep={currentStep.id}
                steps={steps}
                // onClickStep={clickStep}
                styles={{
                    "step-button-container": cn(
                        "text-primary",
                        "data-[active=false]:text-muted-foreground/40 data-[active=false]:bg-white",
                        "data-[active=true]:bg-primary data-[active=true]:border-primary",

                        "data-[current=true]:border-primary data-[current=true]:text-primary data-[current=true]:bg-primary-foreground",
                    ),
                    "horizontal-step": "data-[completed=true]:[&:not(:last-child)]:after:bg-primary",
                }}
            >
                {steps.map(({ label, Composent, icon, description, id }, index) => (
                    <Step key={label} label={label} icon={icon} color="red" description={description}>
                        <Composent data={data} setData={setData} errors={errors} requirements={requirements} permissions={permissions} />
                    </Step>
                ))}
                <Footer submit={submit} errors={errors} currentStep={currentStep} />
            </Stepper>
        </div>
    )
}

const Footer = ({submit, errors, currentStep}) => {
    const {
        nextStep,
        prevStep,
        resetSteps,
        isDisabledStep,
        hasCompletedAllSteps,
        isLastStep,
        isOptionalStep,
        setStep,
        activeStep
    } = useStepper()

    useEffect(() => {
        setStep(currentStep.id)
    }, [errors, currentStep]);

    const handlNextStep = (e) => {
        if(activeStep === getStepByPropName('database').id
            || activeStep === getStepByPropName('admin').id
        ){
            submit(e);
        } else {
            nextStep();
        }
    }

    return (
        <>
            {hasCompletedAllSteps && (
                <div className="h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
                    {Object.keys(errors).length === 0
                        ? <h1 className="text-xl">Récapitulatif des données..</h1>
                        : <h1 className="text-xl">Des erreurs sont survenu..</h1>
                    }
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
                            Précédent
                        </Button>
                        <Button size="sm" onClick={handlNextStep}>
                            {isLastStep ? "Récapitulatif" : isOptionalStep ? "Skip" : "Suivant"}
                        </Button>
                    </>
                )}
            </div>
        </>
    )
}
