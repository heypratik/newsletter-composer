import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Img,
  Button,
  Link,
  Hr,
} from "@react-email/components";
import { Markdown } from "@react-email/markdown";
import {
  Newsletter,
  HeaderContent,
  BodyContent,
  CTAContent,
  SocialContent,
  FooterContent,
} from "@/types/newsletter";
import { getFontSizeClass, getAlignmentStyle } from "@/utils/emailRenderer";

interface Template3Props {
  newsletter: Newsletter;
}

export default function Template3({ newsletter }: Template3Props) {
  const sortedSections = newsletter.sections.sort((a, b) => a.order - b.order);

  const renderSection = (section: any) => {
    const style = {
      color: section.styling.textColor || "#333333",
      backgroundColor: section.styling.backgroundColor || "#ffffff",
      fontSize: getFontSizeClass(section.styling.fontSize || "md"),
      ...getAlignmentStyle(section.styling.alignment || "center"),
    };

    const paddingTop = section.styling.paddingTop ?? 24;
    const paddingRight = section.styling.paddingRight ?? 24;
    const paddingBottom = section.styling.paddingBottom ?? 24;
    const paddingLeft = section.styling.paddingLeft ?? 24;

    const marginTop = section.styling.marginTop ?? 0;
    const marginBottom = section.styling.marginBottom ?? 0;

    const renderWithSpacing = (content: React.ReactNode) => (
      <>
        {marginTop > 0 && (
          <Section
            style={{ height: `${marginTop}px`, lineHeight: `${marginTop}px` }}
          >
            <Text
              style={{
                fontSize: "1px",
                lineHeight: `${marginTop}px`,
                margin: 0,
              }}
            >
              &nbsp;
            </Text>
          </Section>
        )}
        <Section
          style={{
            backgroundColor: style.backgroundColor,
            padding: 0,
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
                    backgroundColor: style.backgroundColor,
                  }}
                >
                  {content}
                </td>
              </tr>
            </tbody>
          </table>
        </Section>
        {marginBottom > 0 && (
          <Section
            style={{
              height: `${marginBottom}px`,
              lineHeight: `${marginBottom}px`,
            }}
          >
            <Text
              style={{
                fontSize: "1px",
                lineHeight: `${marginBottom}px`,
                margin: 0,
              }}
            >
              &nbsp;
            </Text>
          </Section>
        )}
      </>
    );

    switch (section.type) {
      case "header":
        const headerContent = section.content as HeaderContent;
        return (
          <div key={section.id}>
            {renderWithSpacing(
              <>
                <Heading
                  style={{
                    ...style,
                    margin: "0 0 8px 0",
                    fontWeight: "normal",
                    fontSize: "32px",
                  }}
                >
                  {headerContent.title}
                </Heading>
                <Text
                  style={{
                    ...style,
                    margin: "0",
                    opacity: 0.7,
                    fontSize: "16px",
                  }}
                >
                  {headerContent.subtitle}
                </Text>
              </>
            )}
          </div>
        );

      case "body":
        const bodyContent = section.content as BodyContent;
        return (
          <div key={section.id}>
            {renderWithSpacing(
              <Markdown
                markdownCustomStyles={{
                  p: { ...style, margin: "0 0 16px 0", lineHeight: "1.6" },
                  h1: {
                    ...style,
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "0 0 16px 0",
                  },
                  h2: {
                    ...style,
                    fontSize: "20px",
                    fontWeight: "bold",
                    margin: "0 0 12px 0",
                  },
                  h3: {
                    ...style,
                    fontSize: "18px",
                    fontWeight: "bold",
                    margin: "0 0 8px 0",
                  },
                  li: { ...style, margin: "0 0 4px 0", lineHeight: "1.6" },
                  ul: { ...style, margin: "0 0 16px 0", paddingLeft: "20px" },
                  ol: { ...style, margin: "0 0 16px 0", paddingLeft: "20px" },
                }}
                markdownContainerStyles={{
                  wordWrap: "break-word",
                }}
              >
                {bodyContent.markdown || bodyContent.html || ""}
              </Markdown>
            )}
          </div>
        );

      case "cta":
        const ctaContent = section.content as CTAContent;
        return (
          <div key={section.id}>
            {renderWithSpacing(
              <div style={{ textAlign: "center" }}>
                <Button
                  href={ctaContent.url}
                  style={{
                    backgroundColor: section.styling.buttonColor || "#007bff",
                    color: "#ffffff",
                    padding: "16px 32px",
                    fontSize: "18px",
                    border: "none",
                    borderRadius: `${section.styling.buttonRadius || 6}px`,
                    cursor: "pointer",
                    display: "inline-block",
                    textDecoration: "none",
                    fontWeight: "bold",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {ctaContent.text}
                </Button>
              </div>
            )}
          </div>
        );

      case "social":
        const socialContent = section.content as SocialContent;
        const socialLinks = [
          { platform: "Facebook", url: socialContent.facebook, icon: "📘" },
          { platform: "Twitter", url: socialContent.twitter, icon: "🐦" },
          { platform: "Instagram", url: socialContent.instagram, icon: "📸" },
        ].filter((link) => link.url);

        if (socialLinks.length === 0) return null;

        return (
          <div key={section.id}>
            {renderWithSpacing(
              <div style={{ textAlign: "center" }}>
                <Text
                  style={{
                    ...style,
                    margin: "0 0 16px 0",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Follow Us
                </Text>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                  }}
                >
                  {socialLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.url}
                      style={{
                        display: "inline-block",
                        padding: "8px",
                        textDecoration: "none",
                        fontSize: "24px",
                      }}
                    >
                      {link.icon}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "footer":
        const footerContent = section.content as FooterContent;
        return (
          <div key={section.id}>
            {renderWithSpacing(
              <>
                <Hr style={{ margin: "0 0 24px 0", borderColor: "#e5e5e5" }} />
                <Text
                  style={{
                    ...style,
                    fontSize: "14px",
                    margin: "0 0 16px 0",
                    color: "#666",
                  }}
                >
                  {footerContent.copyright}
                </Text>
                {footerContent.links.length > 0 && (
                  <div style={{ ...style, fontSize: "14px" }}>
                    {footerContent.links.map((link, index) => (
                      <React.Fragment key={index}>
                        <Link
                          href={link.url}
                          style={{ color: "#666", textDecoration: "underline" }}
                        >
                          {link.text}
                        </Link>
                        {index < footerContent.links.length - 1 && (
                          <span style={{ margin: "0 8px", color: "#666" }}>
                            |
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#ffffff",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e5e5",
          }}
        >
          {sortedSections.map(renderSection)}
        </Container>
      </Body>
    </Html>
  );
}
