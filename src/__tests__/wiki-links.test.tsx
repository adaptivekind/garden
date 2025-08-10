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

describe("Wiki Links Rendering", () => {
  const content =
    "Check out the [[foo]] page and [bar display text](/bar) for more info. Also see [[baz]] examples.";

  it("renders wiki links as HTML links", () => {
    render(<DocumentPage content={content} hasGraph={false} nodeNames={[]} />);

    const fooLink = screen.getByRole("link", { name: "foo" });
    expect(fooLink).toHaveAttribute("href", "/foo");

    const kitchenSinkLink = screen.getByRole("link", { name: "baz" });
    expect(kitchenSinkLink).toHaveAttribute("href", "/baz");
  });

  it("renders markdown links as HTML link", () => {
    render(<DocumentPage content={content} hasGraph={false} nodeNames={[]} />);

    const barLink = screen.getByRole("link", { name: "bar display text" });
    expect(barLink).toHaveAttribute("href", "/bar");
    expect(barLink).toHaveTextContent("bar display text");
  });
});
