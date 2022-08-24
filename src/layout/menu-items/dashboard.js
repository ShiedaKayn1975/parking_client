import { IconDashboard, IconUser } from '@tabler/icons';

const icons = { IconDashboard, IconUser };

const dashboard = {
    id: 'dashboard',
    title: 'Admin',
    type: 'group',
    children: [
        {
            id: 'users',
            title: 'Users',
            type: 'item',
            url: '/admin/users',
            icon: icons.IconUser,
        },
        {
            id: 'parking_lots',
            title: 'Parking lots',
            type: 'item',
            url: '/admin/parking_lots',
            icon: icons.IconDashboard,
        }
    ]
};

export default dashboard;
