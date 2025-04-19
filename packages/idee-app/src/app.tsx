import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

import { HelloWorld } from './hello_world.js';

const Router = BrowserRouter;

const element = document.getElementById('root');
const root = createRoot(element!);
root.render(
    <Router>
        <Routes>
            <Route index Component={HelloWorld} />
        </Routes>
    </Router>
);
