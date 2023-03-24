export const graph = {
  nodes: [
    {
      id: '0a',
      x: 358.5,
      y: 248,
      width: 254,
      height: 90,
      draggable: false,
      connectable: false,
      selectable: true,
    },
    {
      id: 'a',
      x: 358.5,
      y: 448,
      width: 254,
      height: 90,
      draggable: true,
      connectable: true,
      selectable: true,
    },
    {
      id: 'b',
      x: 758.5,
      y: 448,
      width: 254,
      height: 90,
      draggable: true,
      connectable: true,
      selectable: true,
    },
    {
      id: 'c',
      x: 758.5,
      y: 748,
      width: 254,
      height: 90,
      draggable: true,
      connectable: true,
      selectable: true,
    },
  ],
  edges: [
    {
      id: '0a-a',
      source: '0a',
      target: 'a',
    },
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
    {
      id: 'o1',
      source: '-',
      target: '-',
    },
    {
      id: 'o2',
      source: '-',
      target: '-',
    },
    {
      id: 'o3',
      target: 'b',
    },
  ],
}
