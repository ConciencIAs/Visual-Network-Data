import { Injectable } from '@angular/core';

export interface ClusterNode {
  id: string;
  name: string;
  group?: string;
  value?: number;
  data?: any;
  fx?: number | null;
  fy?: number | null;
  fz?: number | null;
  __threeObj?: any;
  __baseColor?: string;
}

export interface ClusterLink {
  source: string;
  target: string;
  value?: number;
}

export interface ClusterData {
  nodes: ClusterNode[];
  links: ClusterLink[];
}

@Injectable({
  providedIn: 'root'
})
export class GraphClusteringService {
  private colorMap: { [key: string]: string } = {};
  private readonly colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
  ];

  generateClusterData<T>(
    data: T[],
    field: keyof T,
    nodeIdField: keyof T,
    nodeLabelField: keyof T
  ): ClusterData {
    if (!data.length) return { nodes: [], links: [] };

    // Agrupar por el campo seleccionado
    const groups = data.reduce((acc, item) => {
      const key = String(item[field]);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as { [key: string]: T[] });

    const nodes: ClusterNode[] = [];
    const links: ClusterLink[] = [];

    // Crear nodos y enlaces
    Object.entries(groups).forEach(([groupName, items]) => {
      // Nodo central del grupo
      const groupNode: ClusterNode = {
        id: `group-${groupName}`,
        name: `${String(field)}: ${groupName}`,
        group: groupName,
        value: items.length * 2
      };
      nodes.push(groupNode);

      // Nodos individuales
      items.forEach((item, index) => {
        const node: ClusterNode = {
          id: String(item[nodeIdField]),
          name: String(item[nodeLabelField]),
          group: groupName,
          data: item,
          value: 1
        };
        nodes.push(node);

        // Enlace al nodo central
        links.push({
          source: node.id,
          target: groupNode.id,
          value: 1
        });

        // Enlaces entre elementos del mismo grupo
        if (index > 0) {
          links.push({
            source: node.id,
            target: String(items[index - 1][nodeIdField]),
            value: 0.5
          });
        }
      });
    });

    // Posicionar grupos en círculo
    this.arrangeNodesInCircle(nodes, groups);

    return { nodes, links };
  }

  getNodeColor(node: ClusterNode): string {
    if (!node.group) return '#cccccc';

    if (node.id.startsWith('group-')) {
      return '#FFD700'; // Color dorado para nodos centrales
    }

    if (!this.colorMap[node.group]) {
      this.colorMap[node.group] = this.colors[
        Object.keys(this.colorMap).length % this.colors.length
      ];
    }

    return this.colorMap[node.group];
  }

  private arrangeNodesInCircle(nodes: ClusterNode[], groups: { [key: string]: any[] }): void {
    const numGroups = Object.keys(groups).length;
    const angleStep = (2 * Math.PI) / numGroups;
    const radius = 200;

    Object.keys(groups).forEach((groupName, index) => {
      const angle = angleStep * index;
      const groupNode = nodes.find(n => n.id === `group-${groupName}`);
      if (groupNode) {
        groupNode.fx = radius * Math.cos(angle);
        groupNode.fy = radius * Math.sin(angle);
        groupNode.fz = 0;
      }
    });
  }

  generateNodeLabel(node: ClusterNode): string {
    if (!node.data) {
      return `${node.name}`;
    }

    const fields = Object.entries(node.data)
      .filter(([key]) =>
        !['id', 'user_id', 'created_at'].includes(key) &&
        node.data[key] !== null &&
        node.data[key] !== undefined
      )
      .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
      .join('<br/>');

    return `
      <div style="
        background: rgba(0,0,0,0.8);
        padding: 10px;
        border-radius: 4px;
        color: white;
        font-family: Arial;
        max-width: 200px;
      ">
        <strong>${node.name}</strong><br/>
        ${fields}
      </div>
    `;
  }
}