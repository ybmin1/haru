import "@testing-library/jest-dom";

// Pages Router - useRouter mocking
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
    isFallback: false,
  }),
}));
