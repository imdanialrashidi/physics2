import type { ComponentType } from 'react';
import Quiz from './common/Quiz';
import SearchIsland from './common/SearchIsland';
import StepReveal from './common/StepReveal';
import ProgressToggle from './common/ProgressToggle';
import CommandPalette from './common/CommandPalette';
import ParamLab, { Slider, Toggle, Tabs, Reveal, LiveReadout, FunctionPlot } from './common/Controls';
import CoulombLab from './course/CoulombLab';
import VectorTrainer from './course/VectorTrainer';
import RightHandTrainer from './course/RightHandTrainer';
import ChargedParticleLab from './course/ChargedParticleLab';
import CircuitBuilder from './course/CircuitBuilder';
import RCSandbox from './course/RCSandbox';
import GaussTrainer from './course/GaussTrainer';
import CapacitorLab from './course/CapacitorLab';

/**
 * React island registry.
 *
 * The core layout never imports an island directly. Instead, an island is
 * registered here and referenced from MDX (via the MDX component map) or from a
 * page that genuinely needs client-side interaction.
 *
 * This pattern lets a future course add a new interactive component **without
 * touching any core layout or UI file**: drop the component in
 * `src/islands/course/`, register it here, and add it to the MDX map. The
 * engine gains a new capability without being rewritten.
 *
 * Guidelines:
 * - An island must earn its place: no island for something achievable with
 *   static HTML + a few lines of CSS.
 * - Interactive content should ship its own copy in the static HTML so the
 *   island adds behaviour, not information.
 * - Keep islands dependency-light; React is already present, heavy libraries are not.
 */

export interface IslandMeta {
  /** Stable name used in content/MDX. */
  name: string;
  /** Why this needs the client (used to prevent gratuitous hydration). */
  reason: string;
  component: ComponentType<never>;
}

/** Islands available to every course. */
const commonIslands: IslandMeta[] = [
  { name: 'Quiz', reason: 'multi-step state + grading', component: Quiz as ComponentType<never> },
  { name: 'SearchIsland', reason: 'query state over a client index', component: SearchIsland as ComponentType<never> },
  { name: 'StepReveal', reason: 'progressive disclosure state', component: StepReveal as ComponentType<never> },
  { name: 'ProgressToggle', reason: 'localStorage-backed state', component: ProgressToggle as ComponentType<never> },
  { name: 'CommandPalette', reason: 'global shortcut + query state', component: CommandPalette as ComponentType<never> },
  { name: 'ParamLab', reason: 'parameter + visualization state', component: ParamLab as ComponentType<never> },
  { name: 'Slider', reason: 'parameter input state', component: Slider as unknown as ComponentType<never> },
  { name: 'Toggle', reason: 'switch state', component: Toggle as unknown as ComponentType<never> },
  { name: 'Tabs', reason: 'tab selection state', component: Tabs as unknown as ComponentType<never> },
  { name: 'Reveal', reason: 'disclosure state', component: Reveal as unknown as ComponentType<never> },
  { name: 'LiveReadout', reason: 'announced derived state', component: LiveReadout as unknown as ComponentType<never> },
  { name: 'FunctionPlot', reason: 'parameter-driven visualization', component: FunctionPlot as unknown as ComponentType<never> },
];

// Course-specific islands are appended by the course repository.
// Physics II interactive laboratories: each one earns its place with real
// state and real calculation (Coulomb force, vector sums, cross products,
// cyclotron orbits, equivalent R/C, RC transients, Gauss-law fields).

const courseIslands: IslandMeta[] = [
  { name: 'CoulombLab', reason: 'charge/distance state + force calculation', component: CoulombLab as ComponentType<never> },
  { name: 'VectorTrainer', reason: 'vector parameter state + resultant', component: VectorTrainer as ComponentType<never> },
  { name: 'RightHandTrainer', reason: 'axis selection + cross-product direction', component: RightHandTrainer as ComponentType<never> },
  { name: 'ChargedParticleLab', reason: 'particle/field state + orbit calculation', component: ChargedParticleLab as ComponentType<never> },
  { name: 'CircuitBuilder', reason: 'resistor/topology state + equivalent circuit', component: CircuitBuilder as ComponentType<never> },
  { name: 'RCSandbox', reason: 'time-parameter state + transient plot', component: RCSandbox as ComponentType<never> },
  { name: 'GaussTrainer', reason: 'symmetry/charge state + Gauss-law field', component: GaussTrainer as ComponentType<never> },
  { name: 'CapacitorLab', reason: 'geometry/dielectric state + capacitance', component: CapacitorLab as ComponentType<never> },
];

export const islands: IslandMeta[] = [...commonIslands, ...courseIslands];

export function getIsland(name: string): IslandMeta | undefined {
  return islands.find((island) => island.name === name);
}