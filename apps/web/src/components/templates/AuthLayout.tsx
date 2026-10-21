import type { ReactNode } from "react";
import { Logo } from "../atoms/Logo";
import { ServerStatusBanner } from "../molecules/ServerStatusBanner";
import Lightfall from "../atoms/Lightfall";
import styles from "./AuthLayout.module.css";


interface AuthLayoutProps {
    title: string;
    subtitle:string;
    children:ReactNode;
}

export function AuthLayout({title,subtitle,children}:AuthLayoutProps){
    return(
        <main className={styles.page}>
            <div className={styles.background}>
                <Lightfall
                    colors={["#ffffff"]}
                    backgroundColor="#ffffff"
                    speed={0.3}
                    streakCount={2}
                    streakWidth={0.8}
                    twinkle={0.25}
                    backgroundGlow={0.1}
                    headGlow={0.35}
                    bloom={0.35}
                    mouseInteraction
                    holdToWarp
                    intro
                    streakLength={1}
                    density={0.6}
                    glow={1}
                    depth={0.5}
                    zoom={3}
                    mouseStrength={0.4}
                    mouseRadius={0.45}
                    lens={0.5}
                    fade={0}
                    lightMode={false}
                />
            </div>

            <div className={styles.card}>
                <Logo size={56}/>
                <h1>{title}</h1>
                <p className={styles.subtitle}>{subtitle}</p>
                <ServerStatusBanner/>
                {children}
            </div>
        </main>
    );
}