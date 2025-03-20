// src/components/WorldMap.tsx
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { geoMercator, geoPath, geoCentroid, geoContains } from 'd3-geo';
import * as topojson from 'topojson-client';
import { FeatureCollection, Feature, Geometry, GeoJsonProperties } from 'geojson';
import IconButton from '@mui/material/IconButton';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import BarChartIcon from '@mui/icons-material/BarChart';
import { startSimulation, stopSimulation, setPreset } from '../modules/simulationEngine';
import { Node, addFixedNode, getNodes } from '../modules/nodeManager';

export interface Link {
  source: Node;
  target: Node;
  created: number;
}

interface WorldMapProps {
  simulationRunning: boolean;
  simulationSpeed: number;
  simulationDirection: number;
  setTotalNodes: React.Dispatch<React.SetStateAction<number>>;
  onNodeSelect?: (node: Node) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({
  simulationRunning,
  simulationSpeed,
  simulationDirection,
  setTotalNodes,
  onNodeSelect,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [countries, setCountries] = useState<Array<Feature<Geometry, GeoJsonProperties>>>([]);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const projectionRef = useRef<d3.GeoProjection | null>(null);

  // Initiales Laden: Länder und Knoten
  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    svg.selectAll("*").remove();
    const { width, height } = svgRef.current!.getBoundingClientRect();

    // Hauptgruppe (wird gezoomt)
    const g = svg.append('g');
    const gCountries = g.append('g').attr('class', 'countries');
    const gNodes = g.append('g').attr('class', 'nodes');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on('zoom', function (event) {
        g.attr('transform', event.transform.toString());
      });
    svg.call(zoom);
    zoomRef.current = zoom;

    const projection = geoMercator();
    const pathGenerator = geoPath().projection(projection);

    d3.json('/assets/world.topojson').then((topology: any) => {
      const featureResult = topojson.feature(topology, topology.objects.countries) as unknown;
      let allCountries: Array<Feature<Geometry, GeoJsonProperties>>;
      if ((featureResult as FeatureCollection<Geometry, GeoJsonProperties>).type === 'FeatureCollection') {
        allCountries = (featureResult as FeatureCollection<Geometry, GeoJsonProperties>).features;
      } else {
        allCountries = [featureResult as Feature<Geometry, GeoJsonProperties>];
      }
      // Filtere Länder (z.B. schließe Bereiche unter -60° aus)
      const filtered = allCountries.filter(feature => {
        const [[, minLat]] = d3.geoBounds(feature);
        return minLat > -60;
      });
      setCountries(filtered);
      projection.fitExtent([[0, 0], [width, height]], {
        type: 'FeatureCollection',
        features: filtered,
      });
      projectionRef.current = projection;
      gCountries.selectAll('path.country')
        .data(filtered)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator as any)
        .attr('fill', '#eee')
        .attr('stroke', '#999');
    });

    d3.json('/assets/nodes.json').then((data: any) => {
      if (data && data.nodes) {
        // Sobald Länder geladen sind, filtere die Knoten auf Landposition
        if (countries.length > 0) {
          const filteredNodes = data.nodes.filter((node: Node) =>
            countries.some(country => geoContains(country, [node.longitude, node.latitude]))
          );
          filteredNodes.forEach((node: Node) => {
            node.type = 'static';
            addFixedNode(node);
          });
          setNodes(getNodes());
        }
      }
    });
  }, [countries]);

  // Reagiere auf Fenstergrößenänderungen und passe die Projektion an
  useEffect(() => {
    function handleResize() {
      if (!svgRef.current || !projectionRef.current || countries.length === 0) return;
      const svg = d3.select(svgRef.current);
      const { width, height } = svgRef.current!.getBoundingClientRect();
      projectionRef.current.fitExtent([[0, 0], [width, height]], {
        type: 'FeatureCollection',
        features: countries,
      });
      const pathGenerator = geoPath().projection(projectionRef.current);
      svg.select('g.countries')
        .selectAll('path.country')
        .attr('d', pathGenerator as any);
      svg.select('g.nodes')
        .selectAll('circle.node')
        .attr('cx', function(d: Node) {
          const coords = projectionRef.current!([d.longitude, d.latitude]);
          return coords ? coords[0] : 0;
        })
        .attr('cy', function(d: Node) {
          const coords = projectionRef.current!([d.longitude, d.latitude]);
          return coords ? coords[1] : 0;
        });
      svg.select('g.nodes')
        .selectAll('path.link')
        .attr('d', function(datum: unknown) {
          const d = datum as Link;
          const sourcePos = projectionRef.current!([d.source.longitude, d.source.latitude])!;
          const targetPos = projectionRef.current!([d.target.longitude, d.target.latitude])!;
          return d3.line<number[]>()
            .x(p => p[0])
            .y(p => p[1])([sourcePos, targetPos])!;
        });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [countries, nodes, links]);

  useEffect(() => {
    setTotalNodes(nodes.length);
  }, [nodes, setTotalNodes]);

  useEffect(() => {
    setPreset({ simulationSpeed, simulationDirection });
  }, [simulationSpeed, simulationDirection]);

  // Simulation starten/stoppen
  useEffect(() => {
    if (simulationRunning) {
      startSimulation(setNodes, setLinks, getRandomLandCoordinate);
    } else {
      stopSimulation();
    }
    return () => stopSimulation();
  }, [simulationRunning]);

  const getRandomLandCoordinate = (): [number, number] | null => {
    if (countries.length === 0) return null;
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    return geoCentroid(randomCountry);
  };

  // Zeichne Knoten und Links (ohne Clustering)
  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    const projection = projectionRef.current;
    if (!projection) return;
    const gNodes = svg.select('g.nodes').raise();

    // Knoten zeichnen
    const circles = gNodes.selectAll<SVGCircleElement, Node>('circle.node')
      .data(nodes, function(d: unknown) {
        return (d as Node).id;
      });

    const enterCircles = circles.enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 3)
      .attr('fill', function(d: Node) {
        return d.fixed ? 'blue' : 'red';
      })
      .attr('cx', function(d: Node) {
        const coords = projection([d.longitude, d.latitude]);
        return coords ? coords[0] : 0;
      })
      .attr('cy', function(d: Node) {
        const coords = projection([d.longitude, d.latitude]);
        return coords ? coords[1] : 0;
      })
      .on('click', function(event, d: Node) {
        if (onNodeSelect) onNodeSelect(d);
      });

    circles.merge(enterCircles)
      .transition()
      .duration(500)
      .attr('cx', function(d: Node) {
        const coords = projection([d.longitude, d.latitude]);
        return coords ? coords[0] : 0;
      })
      .attr('cy', function(d: Node) {
        const coords = projection([d.longitude, d.latitude]);
        return coords ? coords[1] : 0;
      });
    circles.exit().remove();

    // Links zeichnen
    const lineGenerator = d3.line<number[]>()
      .x(p => p[0])
      .y(p => p[1]);

    const linkSelection = gNodes.selectAll<SVGPathElement, Link>('path.link')
      .data(links, function(d: unknown, i: number) {
        return String(i);
      });

    const enterLinks = linkSelection.enter()
      .append('path')
      .attr('class', 'link')
      .attr('stroke', 'green')
      .attr('stroke-width', 2)
      .attr('fill', 'none');

    linkSelection.merge(enterLinks)
      .attr('d', (function(d: Link) {
        const sourcePos = projection([d.source.longitude, d.source.latitude])!;
        const targetPos = projection([d.target.longitude, d.target.latitude])!;
        return lineGenerator([sourcePos, targetPos])!;
      }) as d3.ValueFn<SVGPathElement, Link, string>)
      .attr('opacity', function(d: Link) {
        const age = Date.now() - d.created;
        return Math.max(0, 1 - age / 30000);
      });
    linkSelection.exit().remove();
  }, [nodes, links, countries, onNodeSelect]);

  const zoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 1.2);
    }
  };

  const zoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 0.8);
    }
  };

  const resetZoom = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  const switchToHeatmap = () => {
    console.log('Switch to Heatmap');
  };

  const switchToStatistics = () => {
    console.log('Switch to Statistics');
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
      }}>
        <IconButton color="primary" size="small" onClick={zoomIn}>
          <ZoomInIcon />
        </IconButton>
        <IconButton color="primary" size="small" onClick={resetZoom}>
          <RestartAltIcon />
        </IconButton>
        <IconButton color="primary" size="small" onClick={zoomOut}>
          <ZoomOutIcon />
        </IconButton>
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <IconButton color="primary" size="small" onClick={switchToHeatmap}>
            <WhatshotIcon />
          </IconButton>
          <IconButton color="primary" size="small" onClick={switchToStatistics}>
            <BarChartIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
