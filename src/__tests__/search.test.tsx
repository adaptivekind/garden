import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Search from "../components/Search";

// Mock fetch to simulate graph data
global.fetch = jest.fn();

const mockGraphData = {
  nodes: {
    "readme": { label: "README" },
    "foo": { label: "Foo Page" },
    "foo#section1": { label: "Foo Section 1" },
    "foo#section2": { label: "Foo Section 2" },
    "bar": { label: "Bar Page" },
    "bar#intro": { label: "Bar Introduction" },
    "baz": { label: "Baz Page" }
  },
  links: []
};

// Mock useRouter
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
    };
  },
}));

describe("Search Fragment Filtering", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock console.error to suppress error output during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockGraphData),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    consoleErrorSpy.mockRestore();
  });

  it("should remove fragments and combine duplicates in search results", async () => {
    render(<Search />);
    
    // Wait for the search component to load graph data
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search pages...")).toBeInTheDocument();
    });
    
    // Verify fetch was called with correct URL
    expect(fetch).toHaveBeenCalledWith('/garden.json');

    const searchInput = screen.getByTestId("search-input");
    
    // Type "foo" to search for items with fragments
    fireEvent.change(searchInput, { target: { value: "foo" } });

    // Wait for search results to appear
    await waitFor(() => {
      expect(screen.getByTestId("search-results")).toBeVisible();
    });

    // Should show only one "foo" result, not the fragment duplicates
    const searchResults = screen.getByTestId("search-results");
    const resultItems = searchResults.querySelectorAll('[data-testid^="search-result-"]');
    
    expect(resultItems).toHaveLength(1);
    expect(resultItems[0]).toHaveTextContent("foo");
    
    // Verify no fragment results are shown
    expect(screen.queryByText("foo#section1")).not.toBeInTheDocument();
    expect(screen.queryByText("foo#section2")).not.toBeInTheDocument();
  });

  it("should handle mixed fragment and non-fragment results", async () => {
    render(<Search />);
    
    // Wait for the search component to load graph data
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search pages...")).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId("search-input");
    
    // Search for "bar" (more than 2 characters) which should match "bar" and "bar#intro"
    fireEvent.change(searchInput, { target: { value: "bar" } });

    // Wait for search results to appear
    await waitFor(() => {
      expect(screen.getByTestId("search-results")).toBeVisible();
    });

    const searchResults = screen.getByTestId("search-results");
    const resultItems = searchResults.querySelectorAll('[data-testid^="search-result-"]');
    
    // Should show only "bar", with "bar#intro" combined into it
    expect(resultItems).toHaveLength(1);
    expect(resultItems[0]).toHaveTextContent("bar");
    
    // Verify fragment is not shown as separate result
    expect(screen.queryByText("bar#intro")).not.toBeInTheDocument();
  });

  it("should show loading state while fetching graph data", () => {
    // Mock fetch to delay response
    (fetch as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<Search />);
    
    // Should show loading state initially
    expect(screen.getByPlaceholderText("Loading...")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeDisabled();
  });

  it("should not render when no graph data is available and log error", async () => {
    const networkError = new Error("Network error");
    
    // Mock fetch to return error
    (fetch as jest.Mock).mockRejectedValue(networkError);
    
    const { container } = render(<Search />);
    
    // Wait for fetch to complete and component to decide not to render
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
    
    // Verify fetch was called with correct URL
    expect(fetch).toHaveBeenCalledWith('/garden.json');
    
    // Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch graph data:', networkError);
  });
});