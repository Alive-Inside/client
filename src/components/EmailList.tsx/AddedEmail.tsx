import { ActionIcon, Container, Text } from "@mantine/core";
import { IconX } from "@tabler/icons";

export default function AddedEmail({ onRemove, email }: { onRemove: Function, email: string }) {
    return (
        <Container mb={'xs'} style={{ display: 'flex', alignContent: 'center', backgroundColor: 'rgb(44, 46, 51)', border: '1px rgb(53, 58, 60) solid', width: '225px', borderRadius: '100px', overflowX: 'hidden' }}>
            <Text size="sm" truncate>{email}</Text>
            <ActionIcon variant="default" radius={"xl"} color="dark" style={{ marginLeft: 'auto' }} onClick={() => { onRemove() }}><IconX size={20} /></ActionIcon>
        </Container>
    )
}