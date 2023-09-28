import { Button, Center, Container, ScrollArea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAt } from "@tabler/icons";
import { useEffect, useState } from "react";
import AddedEmail from "./AddedEmail";

export default function EmailList({ initialEmails, onSubmit }: { initialEmails: string[], onSubmit: Function }) {

    const [emails, setEmails] = useState(initialEmails ?? [])
    const form = useForm<{ email: string }>({
        initialValues: { email: '' },
        validate: {
            email: (value) => {
                if (!/^\S+@\S+$/.test(value)) return 'Not an email';
                if (emails.includes(value)) return 'Email exists';
                return null
            }
        }
    })

    useEffect(() => {
    }, []);

    function addEmail() {
        // form.setFieldValue('email', form.values['email'].trim());
        if (!form.validateField('email').hasError) {
            setEmails([...emails, form.values.email]);
            form.setFieldValue('email', '')
        }
    }

    function onRemove(email: string) {
        setEmails(emails.filter(e => e !== email));
    }

    return (
        <Container p={'md'} style={{ border: '1px solid rgb(53, 58, 60)', borderRadius: '5px', width: '350px' }}>
            <Container style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                <TextInput
                    w={250}
                    pb={"sm"}
                    icon={<IconAt />}
                    label="Add another email"
                    placeholder="Enter your email"
                    name="email"
                    variant="default"
                    autoComplete="off"
                    size="sm"
                    style={{}}
                    {...form.getInputProps('email')}
                    onKeyDown={e => e.key === 'Enter' && addEmail()}
                />
                <Button ml={'md'} onClick={addEmail} size='xs' radius='xl' variant="filled" style={{ backgroundColor: 'white', border: '1px solid rgb(114,114,114)', color: 'black', display: 'flex', alignContent: 'end', alignItems: 'end', marginTop: '1.5rem' }}>
                    Add
                </Button>
            </Container>
            <ScrollArea.Autosize maxHeight={250} p={"sm"} style={{ overflowX: 'hidden' }}>
                {emails.map(e => <AddedEmail key={e} email={e} onRemove={() => onRemove(e)} />)}
            </ScrollArea.Autosize>
            <Center>
                <Button disabled={emails.length === 0} onClick={() => { onSubmit(emails) }} size='sm' radius='xl' variant="filled" style={{ opacity: emails.length === 0 ? 0.5 : 1, backgroundColor: 'white', border: '1px solid rgb(114,114,114)', color: 'black' }}>
                    Submit
                </Button>
            </Center>
        </Container>
    )
}