import { Grid } from "@aws-amplify/ui-react";
import React from "react";

// Layout component using AWS Amplify's Grid.
// Props:
// - children: React nodes to be rendered inside the grid.

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <Grid
            className="main-grid-layout" // Renamed class for clarity
            gap="1rem"
            templateRows="auto 1fr"
            height="100%"
            justifyContent="center"
        >
            {children}
        </Grid>
    );
}
