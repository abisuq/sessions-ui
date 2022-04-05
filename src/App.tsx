import {
  ChakraProvider,
  extendTheme,
  localStorageManager,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import "./App.css";
import { TimezoneProvider } from "./context/TimezoneContext";
import Router from "./Router";
import Setup from "./Setup";
import { ConnectProvider } from "./web3/components/ConnectProvider";

const theme = extendTheme({
  config: {
    cssVarPrefix: "ck",
  },
  colors: {
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode("#f5f5f5", "#292929")(props),
      },
    }),
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <div className="App">
      <div className="text-gray-700 dark:text-white">
        <RecoilRoot>
          <ConnectProvider>
            <TimezoneProvider>
              <ChakraProvider
                theme={theme}
                colorModeManager={localStorageManager}
              >
                <QueryClientProvider client={queryClient}>
                  <Setup>
                    <Router />
                  </Setup>
                </QueryClientProvider>
              </ChakraProvider>
            </TimezoneProvider>
          </ConnectProvider>
        </RecoilRoot>
      </div>
    </div>
  );
}

export default App;
