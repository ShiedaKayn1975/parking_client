import { IconBuildingFactory, IconPaperBag } from '@tabler/icons';

const icons = {
    IconBuildingFactory
};

const utilities = {
    id: 'utilities',
    title: 'Resources',
    type: 'group',
    children: [
        {
            id: 'products',
            title: 'Parking lots',
            type: 'item',
            url: '/parking_lots',
            icon: icons.IconBuildingFactory,
        }
    ]
};

export default utilities;
