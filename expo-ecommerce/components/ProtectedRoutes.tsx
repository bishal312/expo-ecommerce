import { Redirect } from "expo-router";
import React, { ReactNode } from "react";

type Props = {
    isLoggedIn: boolean;
    children: ReactNode;
};

export default function ProtectedRoute({ isLoggedIn, children }: Props) {
    if (!isLoggedIn) {
        return <Redirect href={'/login'} />
    }
}
