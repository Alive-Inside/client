import { Container } from "@mantine/core";
import Link from "next/link";
import useStyles from "../styles";

export default function NavbarLinkItem({ children, href }: { href: string, children: JSX.Element }) {
    const { classes } = useStyles();
    return (
        <Link className={classes.navbarLink} href={href}>
            <Container className={classes.navbarLink} p={'xs'}>
                {children}
            </Container>
        </Link>
    )
}