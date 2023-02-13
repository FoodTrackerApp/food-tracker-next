import { Text, Navbar } from "@nextui-org/react";
import { FaCog, FaHome, FaShoppingBag } from "react-icons/fa";

export default function CustomNavbar({ current } : { current: string}) {

    return (
        <Navbar variant={"sticky"} shouldHideOnScroll isBordered >
          <Navbar.Content>
            <Navbar.Link isActive={current == "Home"} href="/" icon={null}><FaHome style={{ marginRight: "5px" }} /> Home</Navbar.Link>
            <Navbar.Link isActive={current == "List"} href="/List" icon={null}><FaShoppingBag style={{ marginRight: "5px" }} /> List</Navbar.Link>
            <Navbar.Link isActive={current == "Settings"} href="/Settings" icon={null}><FaCog style={{ marginRight: "5px" }} /> Settings</Navbar.Link>
          </Navbar.Content>
        </Navbar>
    )
}