import React, { useState } from 'react';
import * as F from '../styles/frame.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from './AppAppBar.js';

const Frame = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <F.FrameWrapper>

      <CssBaseline enableColorScheme />
      <AppAppBar />
      <div>

        {/* <LogoCollection />
        <Features />
        <Divider />
        <Testimonials />
        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
        <Divider />
        <Footer /> */}
      </div>
    </F.FrameWrapper >
  );
};

export default Frame;