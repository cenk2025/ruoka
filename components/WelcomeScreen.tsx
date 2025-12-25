
import React from 'react';
import { CameraIcon } from './Icons';
import { Strings } from '../localization/strings';

interface WelcomeScreenProps {
    strings: Strings;
    userName?: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ strings, userName }) => {
    const title = userName 
        ? strings.welcomeUserTitle.replace('{name}', userName)
        : strings.welcomeTitle;

    return (
        <div className="text-center bg-gradient-to-b from-white to-indigo-50/50 p-8 md:p-12 mb-6 rounded-3xl shadow-soft border border-white/50">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full text-app-primary mb-6 shadow-lg shadow-indigo-100">
                <CameraIcon />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-app-dark mb-4 tracking-tight">{title}</h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed text-lg">
                {strings.welcomeMessage}
            </p>
        </div>
    );
};

export default WelcomeScreen;
