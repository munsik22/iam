/**
 * 모든 페이지에서 공통으로 사용하는 Tailwind CSS 테마 설정
 */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        slate: {
          50: "#F1F5F9",
          100: "#E2E8F0",
          800: "#1E293B",
          900: "#0F172A",
        },
        butter: {
          100: "#FEF3C7",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        offwhite: "#F8FAFC",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
};
