/**
 * The global MDX component registry.
 *
 * Any component exported here is usable in every `.mdx` content file without an
 * import statement. This is the contract an AI agent or course author relies
 * on: "these names always work".
 *
 * Interactive entries are Astro wrappers, not the raw React islands. MDX renders
 * a bare React component to static HTML only, so `<Quiz />` imported straight
 * from `src/islands/` would look right but never respond to clicks. The wrapper
 * is what carries the `client:*` directive.
 */
import Callout from '../components/educational/Callout.astro';
import Confused from '../components/educational/Confused.astro';
import Definition from '../components/educational/Definition.astro';
import Misconception from '../components/educational/Misconception.astro';
import Formula from '../components/educational/Formula.astro';
import FormulaBreakdown from '../components/educational/FormulaBreakdown.astro';
import InteractiveFigure from '../components/educational/InteractiveFigure.astro';
import WorkedExample from '../components/educational/WorkedExample.astro';
import Prerequisite from '../components/educational/Prerequisite.astro';
import GlossaryTerm from '../components/educational/GlossaryTerm.astro';
import Quiz from '../components/educational/Quiz.astro';
import StepReveal from '../components/educational/StepReveal.astro';
import ParamLab from '../components/educational/ParamLab.astro';
import PhysicsCoulombLab from '../components/educational/PhysicsCoulombLab.astro';
import PhysicsVectorTrainer from '../components/educational/PhysicsVectorTrainer.astro';
import PhysicsRightHandTrainer from '../components/educational/PhysicsRightHandTrainer.astro';
import PhysicsChargedParticleLab from '../components/educational/PhysicsChargedParticleLab.astro';
import PhysicsCircuitBuilder from '../components/educational/PhysicsCircuitBuilder.astro';
import PhysicsRCSandbox from '../components/educational/PhysicsRCSandbox.astro';
import PhysicsGaussTrainer from '../components/educational/PhysicsGaussTrainer.astro';
import PhysicsCapacitorLab from '../components/educational/PhysicsCapacitorLab.astro';

export const mdxComponents = {
  Callout,
  Confused,
  Definition,
  Misconception,
  Formula,
  FormulaBreakdown,
  InteractiveFigure,
  WorkedExample,
  Prerequisite,
  GlossaryTerm,
  StepReveal,
  ParamLab,
  Quiz,
  PhysicsCoulombLab,
  PhysicsVectorTrainer,
  PhysicsRightHandTrainer,
  PhysicsChargedParticleLab,
  PhysicsCircuitBuilder,
  PhysicsRCSandbox,
  PhysicsGaussTrainer,
  PhysicsCapacitorLab,
};