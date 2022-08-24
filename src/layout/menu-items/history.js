import { IconZoomMoney, IconParking } from '@tabler/icons';

const icons = { IconZoomMoney, IconParking };

const history = {
    id: 'history',
    title: 'History',
    type: 'group',
    children: [
        {
            id: 'buying',
            title: 'Ordered lots',
            type: 'item',
            url: `/history/rented`,
            icon: icons.IconParking,
            breadcrumbs: false
        },
        {
            id: 'add_money',
            title: 'Actions',
            type: 'item',
            url: `/history/actions`,
            icon: icons.IconZoomMoney,
            breadcrumbs: false
        }
    ]
};

export default history;
