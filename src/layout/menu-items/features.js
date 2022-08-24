import { IconBuildingFactory, IconPaperBag } from '@tabler/icons';

const icons = {
    IconBuildingFactory
};

const features = {
    id: 'features',
    title: 'Features',
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

export default features;
