import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Tailwind,
  Text,
} from "@react-email/components";

interface SignInEmailProps {
  appName?: string;
  magicLink?: string;
  loginCode?: string;
  accentColor?: string;
  logo?: string;
  name?: string;
  appDescription?: string;
}

export const SignInEmail = ({
  appName = "Sign in to Coding Dodo - Odoo, Python & JavaScript Tutorials",
  magicLink = "https://codingdodo.com",
  loginCode = "GV4FQG",
  accentColor = "#c61bb2",
  logo = "https://codingdodo.com/content/images/size/w300/2021/04/Coding-Dodo.png",
  appDescription = "CodingDodo is a platform for developers to share their knowledge and connect with other developers.",
}: SignInEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome back to {appName}!</Preview>
    <Tailwind>
      <Body className="bg-white">
        <Container className="margin-auto px-[12px]">
          <Heading className="my-12 font-sans text-2xl font-bold text-slate-950">
            Hey there!
          </Heading>
          <Text className="text-md my-7 font-sans text-slate-800">
            Welcome back! If you are on the same device, use this link to
            securely sign in to your {appName} account:
          </Text>
          <Row>
            <Column align="center">
              <Link
                href={magicLink}
                target="_blank"
                className="rounded-md px-6 py-3 font-sans text-xs font-bold text-white"
                style={{
                  backgroundColor: accentColor,
                }}
              >
                Sign in
              </Link>
            </Column>
          </Row>

          <Text className="text-md my-7 font-sans text-slate-800">
            Or, copy and paste this temporary login code:
          </Text>
          <code
            style={{
              display: "inline-block",
              textAlign: "center" as const,
              padding: "16px 4.5%",
              width: "90.5%",
              backgroundColor: "#f4f4f4",
              borderRadius: "5px",
              border: "1px solid #eee",
              color: "#333",
              fontSize: "26px",
              fontWeight: "bold",
            }}
          >
            {loginCode}
          </code>
          <Text className="text-md my-4 font-sans text-slate-500">
            For your security, the link will expire in 24 hours time. If you
            didn&apos;t try to login, you can safely ignore this email.
          </Text>
          <Img src={logo} height="32" alt={`${appName}'s logo`} />
          <Text className="my-4 font-sans text-xs text-slate-400">
            {appDescription}
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default SignInEmail;
