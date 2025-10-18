import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SupabaseService } from '@app/services/supabase/supabase.services';
import { MockDataService } from '@app/services/mock/mock-data.service';
import { GraphClusteringService } from '@app/services/cluster/graph-clustering.service';
import { RegisterData, Node, Link, GraphData } from '@app/models/graph.model';
import { CommonModule } from '@angular/common';

declare const ForceGraph3D: any;

@Component({
  selector: 'app-graph',
  imports: [CommonModule],
  templateUrl: './graph.html',
  styleUrls: ['./graph.scss'],
  standalone: true,
})
export class Graph implements OnInit {
  @ViewChild('graph', { static: true }) graphContainer!: ElementRef;
  private graph: any;
  private rawData: RegisterData[] = [];
  private colorMap: { [key: string]: string } = {};

  public readonly clusterFields: Array<{ key: keyof RegisterData; label: string }> = [
    { key: 'country', label: 'País' },
    { key: 'department', label: 'Departamento' },
    { key: 'city', label: 'Ciudad' },
    { key: 'gender', label: 'Género' },
    { key: 'age', label: 'Edad' },
  ];

  constructor(
    private supabaseService: SupabaseService,
    private graphClusteringService: GraphClusteringService,
    private mockDataService: MockDataService
  ) {}

  private initializeGraph(container: HTMLElement, data: GraphData, ForceGraphCtor: any): any {
    return new ForceGraphCtor(container, {
      controlType: 'orbit',
      backgroundColor: '#1a1a1a',
    })
      .graphData(data)
      .nodeAutoColorBy('group')
      .nodeRelSize(6)
      .nodeVal((node: Node) => node.value || 1)
      .nodeLabel((n: Node) => this.getNodeLabel(n))
      .linkOpacity(0.4)
      .linkWidth((link: any) => link.value || 1)
      .linkDirectionalParticles(4)
      .linkDirectionalParticleSpeed(0.006)
      .onNodeClick((node: Node) => this.showDetails(node))
      .onNodeHover((node: Node) => {
        container.style.cursor = node ? 'pointer' : 'default';
      });
  }

  async ngOnInit() {
    if (typeof window === 'undefined') return;

    try {
      // Intentar obtener datos reales
      const { data, error } = await this.supabaseService.getListRegisterUsers();

      this.rawData = this.mockDataService.generateMockData(50);
      // if (error || !data || data.length === 0) {
      // }

      console.log('Datos cargados:', this.rawData);

      // Procesar los datos y actualizar el gráfico
      await this.processDataAndUpdateGraph();
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      // En caso de error, intentar usar datos de prueba como fallback
      this.rawData = this.mockDataService.generateMockData(50);
      await this.processDataAndUpdateGraph();
    }
  }

  private async processDataAndUpdateGraph(): Promise<void> {
    console.log('Procesando datos y actualizando gráfico...');

    this.graph = this.initializeGraph(
      this.graphContainer.nativeElement,
      {
        nodes: [],
        links: [],
      },
      ForceGraph3D
    );

    // Clusterizar inicialmente por país
    this.clusterBy('country');
  }

  clusterBy(field: keyof RegisterData) {
    if (!this.rawData.length || !this.graph) return;

    const graphData = this.graphClusteringService.generateClusterData(
      this.rawData,
      field,
      'id',
      'full_name'
    );

    this.graph
      .graphData(graphData)
      .nodeColor((node: Node) => this.getNodeColor(node))
      .linkWidth((link: any) => link.value * 2)
      .linkOpacity(0.3)
      .nodeLabel((node: Node) => this.getNodeLabel(node));
  }

  private showDetails(node: Node): void {
    if (!node.data) return;
    console.log('Detalles del nodo:', node.data);

    if (node.__threeObj && node.__baseColor) {
      node.__threeObj.material.color.set('#ff4444');
      setTimeout(() => {
        node.__threeObj.material.color.set(node.__baseColor);
      }, 800);
    }
  }

  private getNodeColor(node: Node): string {
    if (!node.group) return '#cccccc';

    if (node.id.startsWith('group-')) {
      return '#FFD700';
    }

    if (!this.colorMap[node.group]) {
      const colors = [
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#96CEB4',
        '#FFEEAD',
        '#D4A5A5',
        '#9B59B6',
        '#3498DB',
      ];
      this.colorMap[node.group] = colors[Object.keys(this.colorMap).length % colors.length];
    }

    return this.colorMap[node.group];
  }

  private getNodeLabel(node: Node): string {
    if (!node.data) {
      return `${node.name}`;
    }

    return `
      <div style="
        background: rgba(0,0,0,0.8);
        padding: 10px;
        border-radius: 4px;
        color: white;
        font-family: Arial;
        max-width: 200px;
      ">
        <strong>${node.data.full_name}</strong><br/>
        Ciudad: ${node.data.city}<br/>
        Departamento: ${node.data.department}<br/>
        País: ${node.data.country}<br/>
        Edad: ${node.data.age}<br/>
        Género: ${node.data.gender}
      </div>
    `;
  }
}
