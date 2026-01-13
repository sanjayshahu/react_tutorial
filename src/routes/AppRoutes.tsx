import { Routes, Route } from 'react-router-dom';

// Pages
import Accordion from '../pages/accordion/Accordion';


const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Accordion />} />
      {/* <Route path="/about" element={<About />} /> */}

      {/* Redirect example */}
      {/* <Route path="/home" element={<Navigate to="/" replace />} /> */}

      {/* 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;
