import { Component, ElementRef, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
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

  selectedNode: WritableSignal<RegisterData | undefined> = signal(undefined);

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
      .nodeResolution(16)
      .linkDirectionalParticles(6) // Más partículas
      .linkDirectionalParticleSpeed(0.008)
      .linkDirectionalParticleWidth(2.5)
      .enableNodeDrag(true)
      .enableNavigationControls(true)
      .showNavInfo(false)
      .linkWidth((link: any) => link.value || 1)
      .onNodeRightClick((node: Node) => {
        // Centrar cámara en el nodo
        const distance = 200;
        const distRatio = 1 + distance / Math.hypot(node.fx!, node.fy!, node.fz!);
        this.graph.cameraPosition(
          { x: node.fx! * distRatio, y: node.fy! * distRatio, z: node.fz! * distRatio },
          node,
          1000
        );
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

      await this.processDataAndUpdateGraph();
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      // En caso de error, intentar usar datos de prueba como fallback
      this.rawData = this.mockDataService.generateMockData(50);
      await this.processDataAndUpdateGraph();
    }
  }

  private async processDataAndUpdateGraph(): Promise<void> {
    this.graph = this.initializeGraph(
      this.graphContainer.nativeElement,
      {
        nodes: [],
        links: [],
      },
      ForceGraph3D
    );

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
      .nodeLabel((node: Node) => this.getNodeLabel(node))
      .onNodeClick((node: Node) => this.showDetails(node))
      .onNodeHover((node: Node) => {
        if (node) {
          this.graph.nodeRelSize(8);
        }
      })
  }

  private showDetails(node: Node): void {
    this.selectedNode.set(node.data);
  }

  closeDetails() {
    this.selectedNode.set(undefined);
  }

  get isSelectedNode(): boolean {
    return this.selectedNode() !== undefined;
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
      <div style="background: rgba(0,0,0,0.9); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);">
        <div style="color: white; font-weight: bold; margin-bottom: 4px;">${node.name}</div>
        <div style="color: rgba(255,255,255,0.7); font-size: 12px;">${node.data.age} años • ${node.data.gender}</div>
      </div>
    `;
  }
}
