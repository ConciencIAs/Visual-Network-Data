export interface RegisterData {
  age: number;
  city: string;
  country: string;
  created_at: string;
  department: string;
  full_name: string;
  gender: string;
  id: string;
  message: string;
  phone: number;
  user_id: string;
}

export interface Node {
  id: string;
  name: string;
  group?: string;
  value?: number;
  data?: RegisterData;
  fx?: number | null;
  fy?: number | null;
  fz?: number | null;
  __threeObj?: any;
  __baseColor?: string;
}

export interface Link {
  source: string;
  target: string;
  value?: number;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}
