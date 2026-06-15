import { Routes, Route } from 'react-router-dom';

// Pages
import Mcoding from '../pages/mcoding/Mcoding';
import Finance from '../pages/finance/Finance'


const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Mcoding />} />
      <Route path="/finance" element={<Finance />} />

      {/* Redirect example */}
      {/* <Route path="/home" element={<Navigate to="/" replace />} /> */}

      {/* 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;
