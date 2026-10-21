import type { ReactNode } from "react";
import { Logo } from "../atoms/Logo";
import { ServerStatusBanner } from "../molecules/ServerStatusBanner";
import styles from "./AuthLayout.module.css";


interface AuthLayoutProps {
    title: string;
    subtitle:string;
    children:ReactNode;
}

export function AuthLayout({title,subtitle,children}:AuthLayoutProps){
    return(
        <main className={styles.page}>
            {/* floating white glows behind the card */}
            <span className={`${styles.blob} ${styles.blobOne}`} aria-hidden="true" />
            <span className={`${styles.blob} ${styles.blobTwo}`} aria-hidden="true" />
            <span className={`${styles.blob} ${styles.blobThree}`} aria-hidden="true" />

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