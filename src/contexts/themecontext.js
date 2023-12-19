import React from 'react';

const DarkmodeContext = React.createContext(false);
export const DarkmodeProvider = DarkmodeContext.Provider;
export const DarkmodeConsumer = DarkmodeContext.Consumer;
export default DarkmodeContext;
