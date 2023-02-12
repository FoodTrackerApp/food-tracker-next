import { Button, Loading } from "@nextui-org/react";
import { ReactNode } from "react";
import { useState } from "react";

export default function CustomButton({ type, text, func, errorState="primary" } : 
{
    type: any,
    text: ReactNode,
    func: () => void,
    errorState?: any
}) {
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    const renderButton : ReactNode = isLoading ? (<Loading color="currentColor" />) : text

    return (
        <Button color={errorState == type ? type : "error"} onPress={(e) => {func(); setIsLoading(true)}}>{renderButton}</Button>
    )
}