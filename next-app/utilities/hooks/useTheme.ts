import { useState, useEffect } from 'react'

const useThemeDetector = () => {
    // const getCurrentTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (typeof window !== "undefined") {
        const getCurrentTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());
    const mqListener = (e => {
        setIsDarkTheme(e.matches);
    });

    useEffect(() => {
        const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
        darkThemeMq.addEventListener("change", mqListener);
        return () => darkThemeMq.removeEventListener("change", mqListener);
    }, []);

    if(isDarkTheme){
        return 'dark';
    }
    
    return 'default';
}
 return 'default'
}

export default useThemeDetector