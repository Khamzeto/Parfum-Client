'use client';

import { createTheme } from '@mantine/core';

export const theme = createTheme({
  fontFamily: 'Manrope, sans-serif',
  breakpoints: {
    xs: '576px',    // Extra small devices (phones)
    sm: '801px',    // Custom small breakpoint at 790px
    md: '960px',    // Medium devices (tablets)
    lg: '1200px',   // Large devices (desktops)
    xl: '1440px', 
    customBreakpoint: '770px',  // Extra large devices (large desktops)
  },
  
});
