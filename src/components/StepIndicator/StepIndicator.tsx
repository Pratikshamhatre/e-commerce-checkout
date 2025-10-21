    "use client";

    import React from "react";
    import styles from "./StepIndicator.module.scss";

    interface StepIndicatorProps {
    steps: string[];
    currentStep: number;
    onStepClick?: (stepIndex: number) => void; 
    }

    export default function StepIndicator({
    steps,
    currentStep,
    onStepClick,
    }: StepIndicatorProps) {
    return (
        <div className={styles.stepIndicators} data-testid="step-indicator">
        {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep >= stepNumber;

            return (
            <div
                key={index}
                className={`${styles.step} ${isActive ? styles.active : ""}`}
                onClick={() => onStepClick?.(stepNumber)}
                role="button"
                aria-current={isActive ? "step" : undefined}
                aria-label={`Step ${stepNumber}: ${label}`}
                tabIndex={0}
            >{label}
            </div>
            );
        })}
        </div>
    );
    }
