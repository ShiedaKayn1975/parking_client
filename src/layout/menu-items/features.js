import { IconBuildingFactory, IconCar } from '@tabler/icons';

const icons = {
    IconBuildingFactory,
    IconCar
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
        },
        {
            id: 'my_cars',
            title: 'My cars',
            type: 'item',
            url: '/my_cars',
            icon: icons.IconCar,
        }
    ]
};

export default features;
