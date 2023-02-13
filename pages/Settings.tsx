import { Container, Button } from "@nextui-org/react"
import { useState, useEffect } from "react"

import CustomNavbar from "@/components/CustomNavbar"

import ISettings from "@/interfaces/ISettings"

export default function Settings() {
    const [originalSettings, setOriginalSettings] = useState<ISettings>({} as ISettings)
    const [settings, setSettings] = useState<ISettings>({} as ISettings)

    return (
        <Container>
            <CustomNavbar current="Settings" />
        </Container>
    )
}