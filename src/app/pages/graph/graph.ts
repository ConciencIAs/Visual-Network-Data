import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SupabaseService } from '@app/services/supabase/supabase.services';

interface Node {
  id: string;
  name: string;
}

interface Link {
  source: string;
  target: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}



@Component({
  selector: 'app-graph',
  imports: [],
  templateUrl: './graph.html',
  styleUrls: ['./graph.scss'],
  standalone: true,
})
export class Graph implements OnInit {

  @ViewChild('graph', { static: true }) graphContainer!: ElementRef;

  constructor(
    private supabaseService: SupabaseService
  ) {}


  initializeGraph(container: HTMLElement, data: GraphData, ForceGraphCtor: any) {
    const Graph = new ForceGraphCtor(container, { controlType: 'trackball' })
      .graphData({ nodes: data.nodes, links: data.links })
      .nodeAutoColorBy('name')
      .nodeLabel((n: any) => `${n.name}<br>${n.id || ''}`)
      .linkOpacity(0.25)
      .linkDirectionalParticles(2)
      .onNodeClick((node: any) => this.showDetails(node))
    Graph?.d3Force('link').distance(80);
    Graph?.d3Force('charge').strength(-100);
    Graph?.cameraPosition({ z: 420 });
  }

  showDetails(node: any) {


  }

  async ngOnInit() {
    if (typeof window === 'undefined') return;
    const { data, error } = await this.supabaseService.getListRegisterUsers()
    console.log({data, error})

    import('3d-force-graph').then((mod) => {
      const ForceGraph3D = mod?.default ?? mod;
      this.initializeGraph(this.graphContainer.nativeElement, {
      nodes: [
        { id: '1', name: 'Node 1' },
        { id: '2', name: 'Node 2' },
        { id: '3', name: 'Node 3' },
        { id: '4', name: 'Node 4' },
        { id: '5', name: 'Node 5' }
      ],
      links: [
        { source: '1', target: '2' },
        { source: '1', target: '3' },
        { source: '2', target: '4' },
        { source: '3', target: '5' },
      ]
    }, ForceGraph3D);
    }).catch(err => console.error('No se pudo cargar 3d-force-graph:', err));
  }

  clusterBY(type: string) {

  }
}
