import { IconShoppingCart, IconZoomMoney, IconParking } from '@tabler/icons';

const icons = { IconShoppingCart, IconZoomMoney, IconParking };

const history = {
    id: 'history',
    title: 'History',
    type: 'group',
    children: [
        {
            id: 'buying',
            title: 'Parking lots rented',
            type: 'item',
            url: `/history/buying`,
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
