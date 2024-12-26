import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";
import * as React from "react";

interface TeamInviteEmailProps {
    userImage?: string;
    invitedByUsername?: string;
    invitedByEmail?: string;
    teamName?: string;
    inviteLink?: string;
}

const TeamInviteEmail = ({
    invitedByUsername = "bekacru",
    invitedByEmail = "bekacru@gmail.com",
    teamName = "loglib",
    inviteLink = "https://loglib.io/dashbaord/team/invite/token",
}: TeamInviteEmailProps) => {
    const previewText = `Join ${invitedByUsername} on Loglib`;
    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="m-auto bg-white font-sans">
                    <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
                        <Section className="mt-[32px]">
                            <Img
                                src={
                                    "https://vgssydupjvshgeeeqjvo.supabase.co/storage/v1/object/public/images/Logo%20(5).png"
                                }
                                width="40"
                                height="37"
                                alt="Loglib"
                                className="mx-auto my-0"
                            />
                        </Section>
                        <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
                            Join <strong>{teamName}</strong> on <strong>Loglib</strong>
                        </Heading>
                        <Text className="text-[14px] leading-[24px] text-black">Hello there,</Text>
                        <Text className="text-[14px] leading-[24px] text-black">
                            <strong>{invitedByUsername}</strong> (
                            <Link
                                href={`mailto:${invitedByEmail}`}
                                className="text-blue-600 no-underline"
                            >
                                {invitedByEmail}
                            </Link>
                            ) has invited you to the <strong>{teamName}</strong> team on{" "}
                            <strong>Loglib</strong>.
                        </Text>

                        <Section className="my-[32px] text-center">
                            <Button
                                pX={20}
                                pY={12}
                                className="rounded bg-[#000000] text-center text-[12px] font-semibold text-white no-underline"
                                href={inviteLink}
                            >
                                Join the team
                            </Button>
                        </Section>
                        <Text className="text-[14px] leading-[24px] text-black">
                            or copy and paste this URL into your browser:{" "}
                            <Link href={inviteLink} className="text-blue-600 no-underline">
                                {inviteLink}
                            </Link>
                        </Text>
                        <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
                        <Text className="text-[12px] leading-[24px] text-[#666666]">
                            If you were not expecting this invitation, you can ignore this email. If
                            you are concerned about your account&apos;s safety, please reply to this
                            email to get in touch with us.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default TeamInviteEmail;
