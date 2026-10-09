import { createTheme, MantineColorsTuple } from "@mantine/core";

const brand: MantineColorsTuple = [
  "#fff0e6",
  "#ffe0cf",
  "#fdbf9e",
  "#fb9b69",
  "#fa7d3c",
  "#f96a1f",
  "#f9600f",
  "#de4f02",
  "#c64500",
  "#ad3800",
];

export const theme = createTheme({
  primaryColor: "brand",
  primaryShade: { light: 6, dark: 5 },
  colors: { brand },
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontFamilyMonospace: "'JetBrains Mono', ui-monospace, monospace",
  headings: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontWeight: "700",
  },
  defaultRadius: "md",
  cursorType: "pointer",
  components: {
    Tooltip: { defaultProps: { withArrow: true, openDelay: 300 } },
  },
});
