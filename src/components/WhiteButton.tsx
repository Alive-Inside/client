import { Button, MantineSize } from "@mantine/core";

export default function WhiteButton({ children, size }: { children: any, size: MantineSize }) {
    return <Button variant="filled" radius={'xl'} style={{ backgroundColor: 'white', border: '1px solid rgb(114,114,114)', color: 'black' }} size={size}>{children}</Button>
}