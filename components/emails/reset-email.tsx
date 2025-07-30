import * as React from "react";
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
} from "@react-email/components";

interface PasswordResetEmailProps {
  userName: string;
  resetUrl: string;
  requestTime: string; // Time when the reset request was made
}

const PasswordResetEmail = ({
  userName,
  resetUrl,
  requestTime,
}: PasswordResetEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Preview>Reset your LightNote password - Action required</Preview>
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
                Secure your account
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Heading className="text-[24px] font-bold text-gray-900 mb-[16px] mt-0">
                Password Reset Request
              </Heading>

              <Text className="text-[16px] text-gray-700 mb-[16px] mt-0 leading-[24px]">
                Hi {userName},
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[16px] mt-0 leading-[24px]">
                We received a request to reset the password for your LightNote
                account. If you made this request, click the button below to
                create a new password.
              </Text>

              {/* Reset Button */}
              <Section className="text-center mb-[24px]">
                <Button
                  href={resetUrl}
                  className="bg-red-600 text-white px-[32px] py-[12px] rounded-[6px] text-[16px] font-medium no-underline box-border"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[16px] mt-0 leading-[20px]">
                If the button above doesn&apos;t work, you can copy and paste
                the following link into your browser:
              </Text>

              <Text className="text-[14px] text-blue-600 mb-[24px] mt-0 break-all">
                {resetUrl}
              </Text>

              {/* Security Information */}
              <Section className="bg-yellow-50 border border-yellow-200 rounded-[6px] p-[16px] mb-[24px]">
                <Text className="text-[14px] font-medium text-yellow-800 mb-[8px] mt-0">
                  ⚠️ Important Security Information
                </Text>
                <Text className="text-[14px] text-yellow-700 mb-[4px] mt-0">
                  • This password reset link will expire in 1 hour
                </Text>
                <Text className="text-[14px] text-yellow-700 mb-[4px] mt-0">
                  • The link can only be used once
                </Text>
                <Text className="text-[14px] text-yellow-700 mb-[0px] mt-0">
                  • Request was made on {requestTime}
                </Text>
              </Section>

              <Text className="text-[16px] font-medium text-gray-900 mb-[8px] mt-0">
                Didn&apos;t request this reset?
              </Text>

              <Text className="text-[14px] text-gray-700 mb-[16px] mt-0 leading-[20px]">
                If you didn&apos;t request a password reset, you can safely
                ignore this email. Your password will remain unchanged. However,
                if you&apos;re concerned about the security of your account,
                please contact our support team immediately.
              </Text>

              <Text className="text-[14px] text-gray-700 mb-[0px] mt-0 leading-[20px]">
                For additional security, consider enabling two-factor
                authentication on your LightNote account after resetting your
                password.
              </Text>
            </Section>

            {/* Help Section */}
            <Section className="border-t border-gray-200 pt-[24px] mb-[32px]">
              <Text className="text-[16px] font-medium text-gray-900 mb-[12px] mt-0">
                Need Help?
              </Text>
              <Text className="text-[14px] text-gray-700 mb-[8px] mt-0">
                • Visit our{" "}
                <a href="#" className="text-blue-600 underline">
                  Help Center
                </a>{" "}
                for password tips
              </Text>
              <Text className="text-[14px] text-gray-700 mb-[8px] mt-0">
                • Contact{" "}
                <a
                  href="mailto:support@lightnote.com"
                  className="text-blue-600 underline"
                >
                  support@lightnote.com
                </a>{" "}
                for assistance
              </Text>
              <Text className="text-[14px] text-gray-700 mb-[0px] mt-0">
                • Call our support line: +1 (555) 123-4567
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px]">
              <Text className="text-[12px] text-gray-500 mb-[8px] mt-0">
                Best regards,
                <br />
                The LightNote Team (aka TechTeamkobulao Inc.) 😋
              </Text>

              <Text className="text-[12px] text-gray-500 mb-[8px] mt-0 m-0">
                TechTeamkobulao Inc.
                <br />
                123, TechDrive Road Mumbai, 400001
                <br />
              </Text>

              <Text className="text-[12px] text-gray-500 mb-[0px] mt-0 m-0">
                <a href="#" className="text-gray-500 underline">
                  Unsubscribe
                </a>{" "}
                |
                <a href="#" className="text-gray-500 underline ml-[4px]">
                  Privacy Policy
                </a>
                <br />© 2025 LightNote Inc. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetEmail;
