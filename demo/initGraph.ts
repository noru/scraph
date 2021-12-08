export const graph = {
  nodes: [
    {
      id: 'a',
      x: 458.5,
      y: 448,
      width: 90,
      height: 90,
      draggable: true,
      connectable: true,
      selectable: true,
      selected: false,
    },
    {
      id: 'b',
      x: 758.5,
      y: 448,
      width: 90,
      height: 90,
      draggable: true,
      connectable: true,
      selectable: true,
      selected: false,
    },
    {
      id: 'c',
      x: 758.5,
      y: 748,
      width: 90,
      height: 90,
      draggable: true,
      connectable: true,
      selectable: true,
      selected: false,
    },
  ],
  edges: [
    {
      id: 'a-b',
      source: 'a',
      target: 'b',
    },
    {
      id: 'a-c',
      source: 'a',
      target: 'c',
    },
  ],
}
