import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Mode = 'tutor' | 'exam';

interface PlamaConfig {
    grade: string | null;
    topic: string | null;
    mode: Mode;
}

interface PlamaConfigContextType extends PlamaConfig {
    setPlamaConfig: (grade: string, topic: string) => void;
    setMode: React.Dispatch<React.SetStateAction<Mode>>;
    isLoading: boolean;
}

export const PlamaConfigContext = createContext<PlamaConfigContextType | undefined>(undefined);

const CONFIG_KEY = 'plamaConfig';

export const PlamaConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [grade, setGrade] = useState<string | null>(null);
    const [topic, setTopic] = useState<string | null>(null);
    const [mode, setMode] = useState<Mode>('tutor');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const savedConfig = localStorage.getItem(CONFIG_KEY);
            if (savedConfig) {
                const { grade, topic, mode } = JSON.parse(savedConfig);
                setGrade(grade || null);
                setTopic(topic || null);
                setMode(mode || 'tutor');
            }
        } catch (error) {
            console.error("Failed to load PLAMA config from localStorage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const setPlamaConfig = useCallback((newGrade: string, newTopic: string) => {
        setGrade(newGrade);
        setTopic(newTopic);
        try {
            const configToSave = { grade: newGrade, topic: newTopic, mode };
            localStorage.setItem(CONFIG_KEY, JSON.stringify(configToSave));
        } catch (error) {
            console.error("Failed to save PLAMA config", error);
        }
    }, [mode]);

    useEffect(() => {
        // Update localStorage when mode changes
        if (!isLoading) {
             try {
                const configToSave = { grade, topic, mode };
                localStorage.setItem(CONFIG_KEY, JSON.stringify(configToSave));
            } catch (error) {
                console.error("Failed to save PLAMA config on mode change", error);
            }
        }
    }, [mode, grade, topic, isLoading]);


    const value = {
        grade,
        topic,
        mode,
        setPlamaConfig,
        setMode,
        isLoading,
    };

    return (
        <PlamaConfigContext.Provider value={value}>
            {children}
        </PlamaConfigContext.Provider>
    );
};