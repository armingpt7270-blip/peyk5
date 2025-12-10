
import React, { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    noPadding?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', noPadding = false }) => {
    return (
        <div
            className={`glass-panel rounded-2xl shadow-xl transition-all duration-300 ${noPadding ? '' : 'p-6'} ${className}`}
        >
            {children}
        </div>
    );
};

export default GlassCard;
