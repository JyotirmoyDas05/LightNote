import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

interface VerificationEmailProps {
  userName: string;
  verificationUrl: string;
}

const VerificationEmail = ({
  userName,
  verificationUrl,
}: VerificationEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Preview>Verify your LightNote account to get started</Preview>
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[32px] font-bold text-gray-900 m-0 mb-[8px]">
                LightNote
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                Welcome to your note-taking journey
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Heading className="text-[24px] font-bold text-gray-900 mb-[16px] mt-0">
                Verify Your Account
              </Heading>
              
              <Text className="text-[16px] text-gray-700 mb-[16px] mt-0 leading-[24px]">
                Hi {userName},
              </Text>
              
              <Text className="text-[16px] text-gray-700 mb-[16px] mt-0 leading-[24px]">
                Thank you for signing up for LightNote! We&apos;re excited to have you on board. 
                To complete your registration and start organizing your thoughts with our powerful 
                note-taking platform, please verify your email address by clicking the button below.
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px] mt-0 leading-[24px]">
                This verification link will expire in 24 hours for security purposes.
              </Text>

              {/* Verification Button */}
              <Section className="text-center mb-[24px]">
                <Button
                  href={verificationUrl}
                  className="bg-blue-600 text-white px-[32px] py-[12px] rounded-[6px] text-[16px] font-medium no-underline box-border"
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[16px] mt-0 leading-[20px]">
                If the button above doesn&apos;t work, you can copy and paste the following link into your browser:
              </Text>
              
              <Text className="text-[14px] text-blue-600 mb-[24px] mt-0 break-all">
                {verificationUrl}
              </Text>

              <Text className="text-[14px] text-gray-600 mb-[0px] mt-0 leading-[20px]">
                If you didn&apos;t create a LightNote account, you can safely ignore this email.
              </Text>
            </Section>

            {/* Features Preview */}
            <Section className="border-t border-gray-200 pt-[24px] mb-[32px]">
              <Text className="text-[16px] font-medium text-gray-900 mb-[12px] mt-0">
                What you can do with LightNote:
              </Text>
              <Text className="text-[14px] text-gray-700 mb-[8px] mt-0">
                • Create and organize notes with powerful search capabilities
              </Text>
              <Text className="text-[14px] text-gray-700 mb-[8px] mt-0">
                • Sync your notes across all your devices seamlessly
              </Text>
              <Text className="text-[14px] text-gray-700 mb-[8px] mt-0">
                • Collaborate with others on shared notebooks
              </Text>
              <Text className="text-[14px] text-gray-700 mb-[0px] mt-0">
                • Access your notes offline whenever you need them
              </Text>
              <Text className="text-[14px] text-gray-700 mb-[0px] mt-0">
                • Have AI-powered features to enhance your note-taking experience
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px]">
              <Text className="text-[12px] text-gray-500 mb-[8px] mt-0">
                Best regards,<br />
                The LightNote Team (aka TechTeamkobulao Inc.) 😋
              </Text>
              
              <Text className="text-[12px] text-gray-500 mb-[8px] mt-0 m-0">
                TechTeamkobulao Inc.<br />
                123, TechDrive Road
                Mumbai, 400001<br />
              </Text>
              
              <Text className="text-[12px] text-gray-500 mb-[0px] mt-0 m-0">
                <a href="#" className="text-gray-500 underline">Unsubscribe</a> | 
                <a href="#" className="text-gray-500 underline ml-[4px]">Privacy Policy</a><br />
                © 2025 LightNote Inc. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmail;