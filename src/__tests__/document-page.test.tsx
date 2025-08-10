import { render, screen } from "@testing-library/react";
import DocumentPage from "../pages/[[...name]]";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
    };
  },
}));

describe("DocumentPage", () => {
  it("renders markdown content correctly", () => {
    const content =
      "# Hello World\n\nThis is a **test** markdown page with *italic* text.";
    render(<DocumentPage content={content} />);

    const article = screen.getByRole("article");
    expect(article.innerHTML).toContain("Hello World");
    expect(article.innerHTML).toContain("test");
  });

  it("renders fallback when no content", () => {
    render(<DocumentPage content={null} />);

    expect(screen.getByText("Not Found")).toBeInTheDocument();
  });
});
