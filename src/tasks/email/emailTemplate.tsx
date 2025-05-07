import { Html, Body, Container, Img, Text, Link } from "@react-email/components";
import * as React from "react";

type Props = {
  name: string;
  message: string;
};

export default function ReminderEmail({ name, message }: Props) {
  return (
    <Html>
      <Body style={{ backgroundColor: "#f3f0ec", padding: "20px" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Img
            src="https://www.neutroline.com/public/images/logo.png"
            alt="Neutroline"
            width="150"
            style={{ display: 'block' }}
          />
          <Text>Dear {name},</Text>
          <Text>{message}</Text>
          <Text>
            Thank you,
            <br />
            Team Neutroline
            <br />
            <Link href="mailto:info@neutroline.com">info@neutroline.com</Link>
          </Text>
          <Text>
            If you have any questions or need assistance, please contact us at{" "}
            <Link href="mailto:info@neutroline.com">info@neutroline.com</Link>.
          </Text>
          <Text style={{ color: "#888", fontSize: "12px" }}>
            This is an automated message and replies to this email will not be monitored.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
