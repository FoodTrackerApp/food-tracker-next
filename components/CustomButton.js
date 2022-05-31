import { Button, Loading } from "@nextui-org/react";

export default function CustomButton({ type, text, func }) {
    const [isLoading, setIsLoading] = useState(false);

    const renderButton = isLoading ? (<Loading color="currentColor" />) : ({text})

    return (
        <Button color={errorState == type ? type : "error"} onPress={(e) => {func(); setIsLoading(true)}}>{renderButton}</Button>
    )
}