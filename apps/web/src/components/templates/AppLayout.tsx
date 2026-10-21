import type { ReactNode } from "react";
import { AppHeader } from "../organisms/AppHeader";
import styles from "./AppLayout.module.css";


export function AppLayout({children} : {children:ReactNode}) {
    return(
        <div className={styles.shell}>
            <AppHeader />
            <main className={styles.content}>{children}</main>
        </div>
    );
}