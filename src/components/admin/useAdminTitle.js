import { useContext, useEffect } from 'react';
import { AdminPageTitleContext } from './AdminPageTitleContext';

export const useAdminTitle = (title) => {
  const { setPageTitle } = useContext(AdminPageTitleContext);
  useEffect(() => {
    setPageTitle(title);
    // Also set the browser tab title with the brand name
    const brand = window.__COMPANY_NAME__;
    document.title = brand ? `${brand} — ${title}` : title;
  }, [setPageTitle, title]);
};

// Inject controls into the shared admin header bar (right side).
// Pass a React node; it clears automatically on unmount.
export const useAdminActions = (node, deps = []) => {
  const { setHeaderActions } = useContext(AdminPageTitleContext);
  useEffect(() => {
    setHeaderActions(node);
    return () => setHeaderActions(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setHeaderActions, ...deps]);
};

export default useAdminTitle;
