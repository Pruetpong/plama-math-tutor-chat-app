import { useContext } from 'react';
import { PlamaConfigContext } from '../contexts/PlamaConfigContext';

export const usePlamaConfig = () => {
    const context = useContext(PlamaConfigContext);
    if (context === undefined) {
        throw new Error('usePlamaConfig must be used within a PlamaConfigProvider');
    }
    return context;
};
