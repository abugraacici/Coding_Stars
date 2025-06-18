import { Outlet } from 'react-router-dom';
import AccountSidebar from '../../components/account-sidebar/AccountSidebar';

const AccountPage = () => {
    return (
        <div style={{ display: 'flex' }}>
            <AccountSidebar />
            <main style={{ flex: 1, padding: '2rem' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AccountPage;
