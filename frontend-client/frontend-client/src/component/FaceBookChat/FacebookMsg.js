import React from "react";
import { FacebookProvider, CustomChat } from "react-facebook";
const FacebookMsg = () => {
  return (
    <FacebookProvider appId="1201930321301187" chatSupport>
      <CustomChat pageId="628370747025311" minimized={true} />
    </FacebookProvider>
  );
};

export default FacebookMsg;
