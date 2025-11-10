import React from 'react';
import type { GroundingSource } from '../types';

interface SourceLinkProps {
    source: GroundingSource;
}

const SourceLink: React.FC<SourceLinkProps> = ({ source }) => {
    const linkData = source.web || source.maps;
    if (!linkData || !linkData.uri) return null;

    const hostname = new URL(linkData.uri).hostname;

    return (
        <a 
            href={linkData.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-cyan-100 text-cyan-800 hover:bg-cyan-200 rounded-full px-2.5 py-1 transition-colors duration-200"
        >
            {hostname}
        </a>
    )
}

export default SourceLink;
