import React from 'react';
import { AutoPilotPreset } from '@/lib/auto-pilot-presets';
import { AcademicConfig } from './AcademicConfig';
import { CompareConfig } from './CompareConfig';
import { ScaleConfig } from './ScaleConfig';

interface AutoPilotConfigPanelProps {
    preset: AutoPilotPreset;
    groups: any[];
    paths: any[];
    newPathFrom: string;
    newPathTo: string;
    setNewPathFrom: (val: string) => void;
    setNewPathTo: (val: string) => void;
    handleAddPath: () => void;
    handleRemovePath: (idx: number) => void;
    bootstrapSamples: number;
    setBootstrapSamples: (val: number) => void;
    categoricalCols: string[];
    compareGroupVar: string;
    setCompareGroupVar: (val: string) => void;
    compareTestVars: string[];
    setCompareTestVars: (val: string[] | ((prev: string[]) => string[])) => void;
}

export function AutoPilotConfigPanel(props: AutoPilotConfigPanelProps) {
    const { preset } = props;

    if (preset.id === 'compare') {
        return (
            <CompareConfig 
                categoricalCols={props.categoricalCols}
                groups={props.groups}
                compareGroupVar={props.compareGroupVar}
                setCompareGroupVar={props.setCompareGroupVar}
                compareTestVars={props.compareTestVars}
                setCompareTestVars={props.setCompareTestVars}
            />
        );
    }

    if (preset.id === 'scale') {
        return <ScaleConfig groups={props.groups} />;
    }

    if (preset.requiresPaths) {
        return (
            <AcademicConfig
                groups={props.groups}
                paths={props.paths}
                newPathFrom={props.newPathFrom}
                newPathTo={props.newPathTo}
                setNewPathFrom={props.setNewPathFrom}
                setNewPathTo={props.setNewPathTo}
                handleAddPath={props.handleAddPath}
                handleRemovePath={props.handleRemovePath}
                bootstrapSamples={props.bootstrapSamples}
                setBootstrapSamples={props.setBootstrapSamples}
                requiresBootstrap={!!preset.bootstrapDefault}
            />
        );
    }

    return null;
}
