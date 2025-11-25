export enum ElementType {
  BUILDING = 'BUILDING',
  ROAD = 'ROAD',
  FIELD = 'FIELD',
  TREE = 'TREE'
}

export interface SchoolElement {
  id: string;
  type: ElementType;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
}

export interface GenerationResponse {
  elements: Omit<SchoolElement, 'id'>[];
}
