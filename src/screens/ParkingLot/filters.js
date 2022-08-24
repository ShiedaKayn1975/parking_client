import Resource from "../../resources/Resource/resource"

export const filters = [
  {
    label: 'Car type',
    childs: [
      {
        type: 'select',
        id: 'car_type',
        name: 'car_type_id',
        label: 'Car type',
        loadOptions: (inputValue) => {
          return new Promise(resolve => {
            const resource = new Resource('car_types')

            resource.client.fetchItems({
              filters: { name: inputValue },
              done: (response, meta) => {
                resolve(response.map(item => {
                  return {
                    id: item.id, 
                    name: item.name
                  }
                }))
              },
              error: (error) => {
                resolve([])
              }
            })
          })
        }
      }
    ]
  },
  {
    label: 'Status',
    childs: [
      {
        type: 'select',
        id: 'status',
        name: 'status',
        label: 'Status',
        loadOptions: (inputValue) => {
          return new Promise(resolve => {
            resolve([
              {id: 1, name: "Active"},
              {id: 2, name: "Ordered"},
              {id: 3, name: "Parked"},
            ])
          })
        }
      }
    ]
  },
]