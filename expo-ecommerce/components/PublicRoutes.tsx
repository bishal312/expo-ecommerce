import { Redirect } from "expo-router";
import React, { ReactNode } from "react";

type Props = {
    isLoggedIn: boolean;
    children: ReactNode;
};

export default function PublicRoutes({ isLoggedIn, children }: Props) {
    if (isLoggedIn) {
        return <Redirect href={'/(tabs)/home'} />
    }

    return <>{children}</>
}
