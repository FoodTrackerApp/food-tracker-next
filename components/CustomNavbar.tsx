import { Text, Navbar } from "@nextui-org/react";
import { FaCog, FaHome, FaShoppingBag } from "react-icons/fa";

export default function CustomNavbar({ current, online=false } : { current: string, online?: boolean }) {

    return (
        <Navbar variant={"sticky"} shouldHideOnScroll isBordered >
          <Navbar.Content>
            <Navbar.Link isActive={current == "Home"} href="/" ><FaHome style={{ marginRight: "5px" }} /> Home</Navbar.Link>
            <Navbar.Link isActive={current == "List"} href="/List"><FaShoppingBag style={{ marginRight: "5px" }} /> List</Navbar.Link>
            <Navbar.Link isActive={current == "Settings"} href="/Settings" ><FaCog style={{ marginRight: "5px" }} /> Settings</Navbar.Link>
          </Navbar.Content>
          <Navbar.Content
            css={{
              "@ws": {
                w: "12%",
                jc: "flex-end"
              }
            }}
          >
            <Navbar.Item>
              <Text small>{online ? "Online" : "Offline"}</Text>
            </Navbar.Item>
          </Navbar.Content>
        </Navbar>
    )
}