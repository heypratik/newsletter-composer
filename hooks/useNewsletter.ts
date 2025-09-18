import { useLocalStorage } from "./useLocalStorage";
import { Newsletter, AppState } from "@/types/newsletter";
import { v4 as uuidv4 } from "uuid";

const initialState: AppState = {
  newsletters: [],
  currentNewsletter: null,
};

export function useNewsletter() {
  const [state, setState] = useLocalStorage<AppState>(
    "newsletter-app-state",
    initialState
  );

  const saveNewsletter = (newsletter: Newsletter) => {
    setState((prevState) => {
      const existingIndex = prevState.newsletters.findIndex(
        (n) => n.id === newsletter.id
      );
      const updatedNewsletter = { ...newsletter, updatedAt: new Date() };

      if (existingIndex >= 0) {
        const updatedNewsletters = [...prevState.newsletters];
        updatedNewsletters[existingIndex] = updatedNewsletter;
        return {
          ...prevState,
          newsletters: updatedNewsletters,
          currentNewsletter: updatedNewsletter,
        };
      } else {
        return {
          ...prevState,
          newsletters: [...prevState.newsletters, updatedNewsletter],
          currentNewsletter: updatedNewsletter,
        };
      }
    });
  };

  const getNewsletters = () => {
    return state.newsletters;
  };

  const deleteNewsletter = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      newsletters: prevState.newsletters.filter((n) => n.id !== id),
      currentNewsletter:
        prevState.currentNewsletter?.id === id
          ? null
          : prevState.currentNewsletter,
    }));
  };

  const duplicateNewsletter = (id: string) => {
    const newsletter = state.newsletters.find((n) => n.id === id);
    if (newsletter) {
      const duplicated: Newsletter = {
        ...newsletter,
        id: uuidv4(),
        subject: `${newsletter.subject} (Copy)`,
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
        scheduledDate: undefined,
      };
      saveNewsletter(duplicated);
      return duplicated;
    }
  };

  const setCurrentNewsletter = (newsletter: Newsletter | null) => {
    setState((prevState) => ({
      ...prevState,
      currentNewsletter: newsletter,
    }));
  };

  const createNewNewsletter = (templateId: 1 | 2 | 3): Newsletter => {
    const now = new Date();
    return {
      id: uuidv4(),
      subject: "New Newsletter",
      templateId,
      sections: getDefaultSections(templateId),
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };
  };

  return {
    newsletters: state.newsletters,
    currentNewsletter: state.currentNewsletter,
    saveNewsletter,
    getNewsletters,
    deleteNewsletter,
    duplicateNewsletter,
    setCurrentNewsletter,
    createNewNewsletter,
  };
}

function getDefaultSections(templateId: 1 | 2 | 3) {
  const baseStyle = {
    textColor: "#333333",
    backgroundColor: "#ffffff",
    buttonColor: "#007bff",
    fontSize: "md" as const,
    alignment: "center" as const,
  };

  switch (templateId) {
    case 1: // Classic Newsletter
      return [
        {
          id: uuidv4(),
          type: "header" as const,
          content: {
            title: "Weekly Newsletter",
            subtitle: "Stay updated with our latest news and insights",
          },
          order: 0,
          styling: { ...baseStyle, paddingTop: 40, paddingBottom: 40 },
        },
        {
          id: uuidv4(),
          type: "image" as const,
          content: {
            url: "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
            alt: "Newsletter hero image",
          },
          order: 1,
          styling: {
            ...baseStyle,
            imageRadius: 8,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 20,
            paddingRight: 20,
          },
        },
        {
          id: uuidv4(),
          type: "body" as const,
          content: {
            markdown: `## Welcome to Our Newsletter

Lorem ipsum dolor sit amet, **consectetur adipiscing elit**. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

### What's Inside This Issue:

- Important updates from our team
- *Exciting* new features and improvements
- Community highlights and stories
- Upcoming events and announcements

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. [Learn more about our mission](https://example.com/about) and how we're making a difference.

**Thank you** for being part of our community!`,
          },
          order: 2,
          styling: {
            ...baseStyle,
            paddingTop: 40,
            paddingBottom: 0,
            paddingLeft: 20,
            paddingRight: 20,
          },
        },
        {
          id: uuidv4(),
          type: "footer" as const,
          content: {
            copyright: "© 2024 Your Company. All rights reserved.",
            links: [
              { text: "Privacy Policy", url: "https://example.com/privacy" },
              { text: "Unsubscribe", url: "https://example.com/unsubscribe" },
            ],
          },
          order: 3,
          styling: { ...baseStyle, paddingTop: 0, paddingBottom: 20 },
        },
      ];

    case 2: // Marketing Newsletter
      return [
        {
          id: uuidv4(),
          type: "image" as const,
          content: {
            url: "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
            alt: "Marketing campaign hero image",
          },
          order: 0,
          styling: {
            ...baseStyle,
            imageRadius: 8,
            paddingTop: 20,
            paddingBottom: 0,
          },
        },
        {
          id: uuidv4(),
          type: "header" as const,
          content: {
            title: "Exclusive Summer Sale",
            subtitle: "Up to 50% off on selected items - Limited time offer!",
          },
          order: 1,
          styling: {
            ...baseStyle,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 25,
            marginBottom: 25,
          },
        },
        {
          id: uuidv4(),
          type: "body" as const,
          content: {
            markdown: `# Don't Miss Our Biggest Sale! 🔥

**Limited time offer** - Up to 50% off on selected items!

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue lacinia metus, sed cursus libero facilisis eu. Donec auctor blandit quam, ac sollicitudin urna cursus at.

## ✨ Featured Deals:

- **Premium products** at 50% off
- **Free shipping** on orders over $99
- **Exclusive member-only** discounts
- Special bundle offers

### ⏰ Hurry! Sale ends in 3 days.

[Shop now](https://example.com/sale) and save big on your favorite items. Don't let this amazing opportunity slip away!

*Terms and conditions apply. See website for details.*`,
          },
          order: 2,
          styling: {
            ...baseStyle,
            paddingTop: 0,
            paddingBottom: 14,
            paddingLeft: 24,
            paddingRight: 24,
          },
        },
        {
          id: uuidv4(),
          type: "signup" as const,
          content: {
            heading: "Get Exclusive Deals First!",
            placeholder: "Enter your email address",
            buttonText: "Subscribe & Save",
          },
          order: 3,
          styling: {
            ...baseStyle,
            buttonRadius: 4,
            backgroundColor: "#f8f9fa",
            paddingTop: 30,
            paddingBottom: 30,
            paddingLeft: 24,
            paddingRight: 24,
          },
        },
        {
          id: uuidv4(),
          type: "footer" as const,
          content: {
            copyright: "© 2024 Your Store. All rights reserved.",
            links: [
              { text: "Shop Now", url: "https://example.com/shop" },
              { text: "Contact Us", url: "https://example.com/contact" },
              { text: "Unsubscribe", url: "https://example.com/unsubscribe" },
            ],
          },
          order: 4,
          styling: { ...baseStyle, paddingTop: 0, paddingBottom: 20 },
        },
      ];

    case 3: // Simple Newsletter
      return [
        {
          id: uuidv4(),
          type: "header" as const,
          content: {
            title: "Monthly Update",
            subtitle: "Simple, focused, and meaningful content",
          },
          order: 0,
          styling: { ...baseStyle, paddingTop: 40, paddingBottom: 24 },
        },
        {
          id: uuidv4(),
          type: "body" as const,
          content: {
            markdown: `## Hello there! 👋

Welcome to our **monthly update**. We believe in keeping things simple and focused on what matters most to you.

This month, we're excited to share some important updates and insights that we think you'll find valuable:

### Recent Highlights:

- New feature releases
- Community feedback integration
- Performance improvements
- Upcoming roadmap items

Our team has been working hard to bring you the best content and experiences. We're constantly learning and improving based on your feedback.

*Thank you* for being part of our community. Your support means everything to us.

---

**Stay connected:** Follow us on social media for daily updates and behind-the-scenes content.`,
          },
          order: 1,
          styling: {
            ...baseStyle,
            paddingTop: 20,
            paddingBottom: 30,
            paddingLeft: 24,
            paddingRight: 24,
          },
        },
        {
          id: uuidv4(),
          type: "cta" as const,
          content: { text: "Read More", url: "https://example.com/blog" },
          order: 2,
          styling: {
            ...baseStyle,
            buttonRadius: 6,
            paddingTop: 30,
            paddingBottom: 30,
          },
        },
        {
          id: uuidv4(),
          type: "social" as const,
          content: {
            facebook: "https://facebook.com/yourpage",
            twitter: "https://twitter.com/youraccount",
            instagram: "https://instagram.com/youraccount",
          },
          order: 3,
          styling: { ...baseStyle, paddingTop: 30, paddingBottom: 20 },
        },
        {
          id: uuidv4(),
          type: "footer" as const,
          content: {
            copyright: "© 2024 Your Brand. Keep it simple.",
            links: [
              { text: "Website", url: "https://example.com" },
              { text: "Unsubscribe", url: "https://example.com/unsubscribe" },
            ],
          },
          order: 4,
          styling: {
            ...baseStyle,
            backgroundColor: "#f8f9fa",
            paddingTop: 30,
            paddingBottom: 20,
          },
        },
      ];

    default:
      return [];
  }
}
