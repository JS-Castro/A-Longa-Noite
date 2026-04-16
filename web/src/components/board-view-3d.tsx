"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Line, useGLTF } from "@react-three/drei";
import { useRef, useState, useMemo, Suspense } from "react";
import * as THREE from "three";
import type { LocationDefinition, SurvivorSummary, ItemCardData } from "@/lib/game-data";

// ─── Location positions in 3D space ───────────────────────────────────────────

const locationPositions3D: Record<string, [number, number, number]> = {
  loc_farmacia_encosta:   [-3.8, 0,  -2.8],
  loc_torre_observacao:   [ 0,   0,  -4.2],
  loc_capela_velha:       [ 3.6, 0,  -2.2],
  loc_porta_norte:        [ 3.2, 0,   2.4],
};

const survivorOffsets: [number, number, number][] = [
  [-0.7,  0,  0.5],
  [ 0.7,  0,  0.5],
  [-0.7,  0, -0.5],
  [ 0.7,  0, -0.5],
];

const statePalette = {
  seguro:   { base: "#065f46", border: "#34d399", label: "text-emerald-200" },
  instavel: { base: "#78350f", border: "#fbbf24", label: "text-amber-200"   },
  hostil:   { base: "#7f1d1d", border: "#f87171", label: "text-rose-200"    },
} as const;

// ─── Snow particles ────────────────────────────────────────────────────────────

function Snow() {
  const count = 400;
  const mesh = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = Math.random() * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] -= delta * (0.4 + Math.sin(i) * 0.2);
      pos.array[i * 3]     += Math.sin(Date.now() * 0.0004 + i) * 0.002;
      if (pos.array[i * 3 + 1] < -0.5) {
        pos.array[i * 3 + 1] = 13;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#c8d8f0"
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Pine tree ─────────────────────────────────────────────────────────────────

function PineTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0, 0.7, 1.6, 7]} />
        <meshStandardMaterial color="#0c1a0e" roughness={1} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0, 0.55, 1.3, 7]} />
        <meshStandardMaterial color="#0f1f10" roughness={1} />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0, 0.38, 1.1, 7]} />
        <meshStandardMaterial color="#121f12" roughness={1} />
      </mesh>
      {/* Snow cap */}
      <mesh position={[0, 2.2, 0]}>
        <coneGeometry args={[0.22, 0.35, 7]} />
        <meshStandardMaterial color="#c8d8f0" roughness={0.9} opacity={0.7} transparent />
      </mesh>
      {/* Trunk */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.6, 6]} />
        <meshStandardMaterial color="#1a0f06" roughness={1} />
      </mesh>
    </group>
  );
}

function Forest() {
  const trees: { pos: [number, number, number]; scale: number }[] = [
    { pos: [-7.5, 0, -5.5], scale: 1.2 },
    { pos: [-6.2, 0, -6.0], scale: 0.9 },
    { pos: [-8.2, 0, -3.5], scale: 1.4 },
    { pos: [-9.0, 0, -1.0], scale: 1.1 },
    { pos: [-8.5, 0,  1.5], scale: 0.85 },
    { pos: [-7.0, 0,  4.0], scale: 1.3 },
    { pos: [-6.0, 0,  5.5], scale: 1.0 },
    { pos: [-5.0, 0,  6.5], scale: 1.1 },
    { pos:  [7.5, 0, -5.5], scale: 1.2 },
    { pos:  [6.0, 0, -6.2], scale: 1.0 },
    { pos:  [8.5, 0, -2.5], scale: 1.35 },
    { pos:  [9.0, 0,  0.5], scale: 0.9 },
    { pos:  [8.0, 0,  3.0], scale: 1.2 },
    { pos:  [6.5, 0,  5.5], scale: 1.0 },
    { pos:  [5.0, 0,  6.5], scale: 0.85 },
    { pos: [-2.0, 0, -6.8], scale: 0.95 },
    { pos:  [1.5, 0, -6.5], scale: 1.05 },
    { pos:  [3.5, 0, -7.0], scale: 1.1 },
    { pos: [-4.5, 0, -7.0], scale: 0.9 },
    { pos: [-1.0, 0,  6.8], scale: 1.0 },
    { pos:  [2.5, 0,  7.2], scale: 0.9 },
  ];

  return (
    <>
      {trees.map((t, i) => (
        <PineTree key={i} position={t.pos} scale={t.scale} />
      ))}
    </>
  );
}

// ─── Ground with snow ──────────────────────────────────────────────────────────

function Ground() {
  return (
    <group>
      {/* Snow ground extending beyond board */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0c1118" roughness={1} metalness={0} />
      </mesh>
      {/* Board surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial color="#111820" roughness={0.85} metalness={0.05} />
      </mesh>
      <gridHelper args={[14, 14, "#1a2535", "#1a2535"]} position={[0, -0.04, 0]} />
      {/* Board border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
        <planeGeometry args={[14.5, 12.5]} />
        <meshStandardMaterial color="#1e2d40" roughness={1} />
      </mesh>
    </group>
  );
}

// ─── GLB model loader with dark recolor ───────────────────────────────────────

function GLBModel({
  url,
  scale = 1,
  emissive = "#000000",
  emissiveIntensity = 0,
  position,
  rotation,
}: {
  url: string;
  scale?: number | [number, number, number];
  emissive?: string;
  emissiveIntensity?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    const emissiveColor = new THREE.Color(emissive);
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#1a1e24"),
          roughness: 0.85,
          metalness: 0.12,
          emissive: emissiveColor,
          emissiveIntensity,
        });
        mesh.material = mat;
      }
    });
    return c;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, emissive, emissiveIntensity]);

  return (
    <primitive
      object={cloned}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  );
}

// ─── Shared materials ──────────────────────────────────────────────────────────

const MAT = {
  concrete: { color: "#1a1e24", roughness: 0.9, metalness: 0.05 },
  stone:    { color: "#171c1f", roughness: 1.0, metalness: 0.0  },
  metal:    { color: "#1c2430", roughness: 0.5, metalness: 0.6  },
  wood:     { color: "#1a1208", roughness: 0.95, metalness: 0.0 },
  plaster:  { color: "#1e1f1c", roughness: 0.85, metalness: 0.0 },
} as const;

// ─── Colony — central fortified settlement ─────────────────────────────────────

function ColonyBuilding({ name }: { name: string }) {
  const flagRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.3;
    }
  });

  return (
    <group>
      {/* Warm interior glow */}
      <pointLight position={[0, 0.8, 0]} intensity={1.4} color="#f59e0b" distance={5} decay={2} />
      <pointLight position={[1.2, 1.8, -1.2]} intensity={0.4} color="#fbbf24" distance={3} decay={2} />

      {/* Base platform */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.0, 4.0]} />
        <meshStandardMaterial {...MAT.concrete} />
      </mesh>

      {/* Main building — GLB model */}
      <GLBModel
        url="/assets/models/building-type-a.glb"
        scale={0.9}
        emissive="#f59e0b"
        emissiveIntensity={0.07}
        position={[0, 0, -0.4]}
      />

      {/* Secondary building */}
      <GLBModel
        url="/assets/models/building-type-c.glb"
        scale={0.55}
        emissive="#f59e0b"
        emissiveIntensity={0.05}
        position={[-0.9, 0, 0.8]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* Fortified fences — perimeter */}
      <GLBModel url="/assets/models/fence-fortified.glb" scale={0.65} position={[-1.7, 0, -1.5]} rotation={[0, 0, 0]} />
      <GLBModel url="/assets/models/fence-fortified.glb" scale={0.65} position={[ 0.3, 0, -1.5]} rotation={[0, 0, 0]} />
      <GLBModel url="/assets/models/fence-fortified.glb" scale={0.65} position={[-1.7, 0,  0.5]} rotation={[0, Math.PI / 2, 0]} />
      <GLBModel url="/assets/models/fence-fortified.glb" scale={0.65} position={[ 1.7, 0, -0.5]} rotation={[0, Math.PI / 2, 0]} />

      {/* Gate (south entrance) */}
      <GLBModel url="/assets/models/fence-doorway.glb" scale={0.65} position={[0, 0, 1.7]} emissive="#fbbf24" emissiveIntensity={0.15} />

      {/* Survival props */}
      <GLBModel url="/assets/models/barrel.glb" scale={0.35} position={[1.2, 0, 0.8]} />
      <GLBModel url="/assets/models/campfire-pit.glb" scale={0.4} position={[0.3, 0, 0.9]} emissive="#f97316" emissiveIntensity={0.4} />
      <pointLight position={[0.3, 0.4, 0.9]} intensity={0.6} color="#f97316" distance={2} decay={2} />

      {/* Corner watchtower (NE) */}
      <mesh position={[1.7, 0.9, -1.7]} castShadow>
        <cylinderGeometry args={[0.22, 0.25, 1.8, 8]} />
        <meshStandardMaterial {...MAT.concrete} />
      </mesh>
      <mesh position={[1.7, 1.92, -1.7]}>
        <cylinderGeometry args={[0.35, 0.35, 0.12, 8]} />
        <meshStandardMaterial {...MAT.metal} />
      </mesh>

      {/* Flagpole */}
      <mesh position={[0, 2.8, -0.4]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.0, 6]} />
        <meshStandardMaterial {...MAT.metal} />
      </mesh>
      <mesh ref={flagRef} position={[0.2, 3.1, -0.4]}>
        <boxGeometry args={[0.36, 0.2, 0.02]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.8} emissive="#b91c1c" emissiveIntensity={0.2} />
      </mesh>

      {/* Label */}
      <Html position={[0, 3.8, 0]} center distanceFactor={10} zIndexRange={[10, 0]}>
        <div className="pointer-events-none select-none rounded-2xl border border-amber-400/25 bg-[rgba(8,12,18,0.92)] px-3 py-2 text-center shadow-xl shadow-black/60 backdrop-blur-sm">
          <p className="text-[0.5rem] uppercase tracking-[0.3em] text-amber-400/60">Abrigo central</p>
          <p className="mt-1 font-serif text-sm text-stone-50 whitespace-nowrap">{name}</p>
        </div>
      </Html>
    </group>
  );
}

// ─── Pharmacy ─────────────────────────────────────────────────────────────────

function PharmacyBuilding({ emissive, emissiveIntensity }: { emissive: string; emissiveIntensity: number }) {
  return (
    <group>
      <GLBModel
        url="/assets/models/building-type-e.glb"
        scale={0.7}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity * 0.8}
      />
      {/* Red cross — horizontal */}
      <mesh position={[0, 1.4, 0.72]}>
        <boxGeometry args={[0.45, 0.1, 0.025]} />
        <meshStandardMaterial color="#7f1d1d" emissive="#dc2626" emissiveIntensity={0.5} />
      </mesh>
      {/* Red cross — vertical */}
      <mesh position={[0, 1.4, 0.72]}>
        <boxGeometry args={[0.1, 0.45, 0.025]} />
        <meshStandardMaterial color="#7f1d1d" emissive="#dc2626" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// ─── Watchtower ───────────────────────────────────────────────────────────────

function WatchtowerBuilding({ emissive, emissiveIntensity }: { emissive: string; emissiveIntensity: number }) {
  return (
    <group>
      {/* Survival structure as base */}
      <GLBModel
        url="/assets/models/structure-metal.glb"
        scale={0.8}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity * 0.5}
      />
      {/* Tower body above */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.32, 1.2, 8]} />
        <meshStandardMaterial color="#141c22" roughness={0.7} metalness={0.4} emissive={emissive} emissiveIntensity={emissiveIntensity} />
      </mesh>
      {/* Observation deck */}
      <mesh position={[0, 2.28, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.3, 0.12, 8]} />
        <meshStandardMaterial {...MAT.metal} />
      </mesh>
      {/* Spotlight */}
      <mesh position={[0, 2.44, 0]}>
        <cylinderGeometry args={[0.1, 0.07, 0.16, 8]} />
        <meshStandardMaterial color="#1a2530" metalness={0.8} roughness={0.3} emissive="#fbbf24" emissiveIntensity={0.6} />
      </mesh>
      <pointLight position={[0, 2.6, 0]} intensity={0.6} color="#fbbf24" distance={5} decay={2} />
    </group>
  );
}

// ─── Chapel ───────────────────────────────────────────────────────────────────

function ChapelBuilding({ emissive, emissiveIntensity }: { emissive: string; emissiveIntensity: number }) {
  return (
    <group>
      <GLBModel
        url="/assets/models/building-type-b.glb"
        scale={0.75}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity * 0.7}
      />
      {/* Bell tower steeple */}
      <mesh position={[0, 2.6, -0.5]} castShadow>
        <cylinderGeometry args={[0, 0.22, 0.7, 4]} />
        <meshStandardMaterial {...MAT.stone} />
      </mesh>
      {/* Cross — horizontal */}
      <mesh position={[0, 3.05, -0.5]}>
        <boxGeometry args={[0.28, 0.055, 0.055]} />
        <meshStandardMaterial color="#0f1210" emissive={emissive} emissiveIntensity={emissiveIntensity * 2} />
      </mesh>
      {/* Cross — vertical */}
      <mesh position={[0, 3.18, -0.5]}>
        <boxGeometry args={[0.055, 0.28, 0.055]} />
        <meshStandardMaterial color="#0f1210" emissive={emissive} emissiveIntensity={emissiveIntensity * 2} />
      </mesh>
    </group>
  );
}

// ─── Gate / North entrance ────────────────────────────────────────────────────

function GateBuilding({ emissive, emissiveIntensity }: { emissive: string; emissiveIntensity: number }) {
  return (
    <group>
      {/* Fortified fence sections */}
      <GLBModel url="/assets/models/fence-fortified.glb" scale={0.7} position={[-0.8, 0, 0]} emissive={emissive} emissiveIntensity={emissiveIntensity * 0.4} />
      <GLBModel url="/assets/models/fence-fortified.glb" scale={0.7} position={[ 0.8, 0, 0]} emissive={emissive} emissiveIntensity={emissiveIntensity * 0.4} />
      {/* Gate opening */}
      <GLBModel url="/assets/models/fence-doorway.glb" scale={0.7} position={[0, 0, 0]} emissive={emissive} emissiveIntensity={emissiveIntensity * 0.6} />
      {/* Gate lamps */}
      <mesh position={[-0.6, 1.5, 0.18]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial emissive="#fbbf24" emissiveIntensity={0.8} color="#1a1a10" />
      </mesh>
      <pointLight position={[-0.6, 1.5, 0.3]} intensity={0.5} color="#fbbf24" distance={2.5} decay={2} />
      <mesh position={[0.6, 1.5, 0.18]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial emissive="#fbbf24" emissiveIntensity={0.8} color="#1a1a10" />
      </mesh>
      <pointLight position={[0.6, 1.5, 0.3]} intensity={0.5} color="#fbbf24" distance={2.5} decay={2} />
      {/* Sandbags */}
      <mesh position={[0, 0.12, 0.4]} castShadow>
        <boxGeometry args={[1.8, 0.22, 0.4]} />
        <meshStandardMaterial color="#2a2318" roughness={1} />
      </mesh>
    </group>
  );
}

// ─── Location building selector ───────────────────────────────────────────────

function LocationBuilding({ locationId, emissive, emissiveIntensity }: {
  locationId: string;
  emissive: string;
  emissiveIntensity: number;
}) {
  switch (locationId) {
    case "loc_farmacia_encosta":
      return <PharmacyBuilding emissive={emissive} emissiveIntensity={emissiveIntensity} />;
    case "loc_torre_observacao":
      return <WatchtowerBuilding emissive={emissive} emissiveIntensity={emissiveIntensity} />;
    case "loc_capela_velha":
      return <ChapelBuilding emissive={emissive} emissiveIntensity={emissiveIntensity} />;
    case "loc_porta_norte":
      return <GateBuilding emissive={emissive} emissiveIntensity={emissiveIntensity} />;
    default:
      return (
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.2, 0.8, 1.2]} />
          <meshStandardMaterial color="#141a20" roughness={0.85} emissive={emissive} emissiveIntensity={emissiveIntensity} />
        </mesh>
      );
  }
}

// ─── Colony tile ───────────────────────────────────────────────────────────────

function ShelterTile({ name }: { name: string }) {
  return (
    <group position={[0, 0, 0]}>
      <ColonyBuilding name={name} />
    </group>
  );
}

// ─── Location tile ─────────────────────────────────────────────────────────────

function LocationTile({
  location,
  highlighted,
}: {
  location: LocationDefinition;
  highlighted: boolean;
}) {
  const pos = locationPositions3D[location.id];
  if (!pos) return null;

  const palette = statePalette[location.estado];
  const [hovered, setHovered] = useState(false);
  const emissiveIntensity = hovered || highlighted ? 0.45 : 0.14;

  const routeFrom: [number, number, number] = [pos[0], 0.15, pos[2]];
  const routeTo: [number, number, number] = [0, 0.15, 0];

  return (
    <group position={pos}>
      {/* Route line */}
      <Line
        points={[routeFrom, routeTo]}
        color={highlighted ? "#fbbf24" : "#2d3f55"}
        lineWidth={highlighted ? 2 : 1}
        dashed={!highlighted}
        dashSize={0.3}
        gapSize={0.2}
      />

      {/* Base platform */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <planeGeometry args={[2.2, 2.2]} />
        <meshStandardMaterial
          color={palette.base}
          roughness={0.9}
          emissive={palette.border}
          emissiveIntensity={emissiveIntensity * 0.3}
        />
      </mesh>

      {/* Building */}
      <LocationBuilding
        locationId={location.id}
        emissive={palette.border}
        emissiveIntensity={emissiveIntensity}
      />

      {/* Highlight ring */}
      {highlighted && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <ringGeometry args={[1.0, 1.2, 32]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Label */}
      <Html position={[0, 3.4, 0]} center distanceFactor={10} zIndexRange={[5, 0]}>
        <div
          className={`pointer-events-none select-none rounded-xl border px-3 py-2 text-center shadow-lg shadow-black/60 backdrop-blur-sm ${
            highlighted
              ? "border-amber-300/50 bg-[rgba(35,22,5,0.94)]"
              : "border-white/12 bg-[rgba(8,12,18,0.90)]"
          }`}
          style={{ minWidth: "8rem" }}
        >
          <p className="text-[0.5rem] uppercase tracking-[0.25em] text-stone-500">{location.distancia}</p>
          <p className={`mt-0.5 font-serif text-sm whitespace-nowrap ${palette.label}`}>{location.nome}</p>
          <p className="mt-1 text-[0.5rem] uppercase tracking-[0.2em] text-stone-600">{location.tipo}</p>
        </div>
      </Html>
    </group>
  );
}

// ─── Survivor token ────────────────────────────────────────────────────────────

function SurvivorToken({ survivor, index }: { survivor: SurvivorSummary; index: number }) {
  const offset = survivorOffsets[index] ?? [0, 0, 0];
  const initials = survivor.nome.split(" ").map((p) => p[0]).join("").slice(0, 2);

  return (
    <group position={offset}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.44, 24]} />
        <meshStandardMaterial color="#451a03" roughness={0.5} metalness={0.4} emissive="#92400e" emissiveIntensity={0.2} />
      </mesh>
      <Html position={[0, 0.7, 0]} center distanceFactor={12} zIndexRange={[2, 0]}>
        <div className="pointer-events-none select-none flex h-7 w-7 items-center justify-center rounded-full border border-amber-400/40 bg-[rgba(35,16,4,0.92)] text-[0.55rem] font-medium text-amber-100 shadow-md shadow-black/60">
          {initials}
        </div>
      </Html>
    </group>
  );
}

// ─── Camera setup ──────────────────────────────────────────────────────────────

function CameraSetup() {
  const { camera } = useThree();
  const done = useRef(false);
  if (!done.current) {
    camera.position.set(0, 10, 12);
    camera.lookAt(0, 0, 0);
    done.current = true;
  }
  return null;
}

// ─── Scene ─────────────────────────────────────────────────────────────────────

function Scene({
  locations,
  shelterName,
  survivors,
  highlightedLocationIds,
}: {
  locations: LocationDefinition[];
  shelterName: string;
  survivors: SurvivorSummary[];
  highlightedLocationIds: string[];
}) {
  return (
    <>
      <fog attach="fog" args={["#080c14", 14, 32]} />
      <ambientLight intensity={0.35} color="#8ab0d0" />
      <directionalLight position={[4, 12, 6]} intensity={1.0} castShadow color="#c8ddf0" shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#38bdf8" distance={8} />
      {/* Distant cold moonlight */}
      <pointLight position={[-8, 16, -10]} intensity={0.4} color="#a0c4e8" distance={40} />

      <Ground />
      <Forest />
      <Snow />

      <Suspense fallback={null}>
        <ShelterTile name={shelterName} />
        {locations.map((loc) => (
          <LocationTile key={loc.id} location={loc} highlighted={highlightedLocationIds.includes(loc.id)} />
        ))}
      </Suspense>

      {survivors.slice(0, 4).map((s, i) => (
        <SurvivorToken key={s.id} survivor={s} index={i} />
      ))}

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={5}
        maxDistance={22}
        maxPolarAngle={Math.PI / 2.05}
        makeDefault
      />
    </>
  );
}

// ─── Player zone ───────────────────────────────────────────────────────────────

const categoryIcon: Record<string, string> = {
  mantimentos: "🥫",
  medico:      "🩹",
  municao:     "🔫",
  ferramenta:  "🔧",
};

function PlayerZone({ items, playerName }: { items: ItemCardData[]; playerName: string }) {
  return (
    <div className="mt-0 border-t border-white/8 bg-[linear-gradient(180deg,rgba(6,10,16,0.0),rgba(6,10,16,0.95)_18%,rgba(4,7,12,0.98))] px-6 pb-6 pt-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.35em] text-stone-500">Zona do Jogador</p>
          <p className="mt-1 font-serif text-lg text-stone-200">{playerName}</p>
        </div>
        <p className="text-[0.6rem] uppercase tracking-[0.28em] text-stone-600">
          {items.length} carta{items.length !== 1 ? "s" : ""} em mão
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-6 text-center">
          <p className="text-sm text-stone-600">Nenhuma carta em mão</p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-36 rounded-2xl border border-white/10 bg-[rgba(12,16,22,0.9)] p-3 shadow-lg shadow-black/40"
              style={{ borderColor: `${item.accent}44` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-base">{categoryIcon[item.categoria] ?? "📦"}</span>
                <span
                  className="text-[0.6rem] font-medium px-1.5 py-0.5 rounded-full"
                  style={{ background: `${item.accent}22`, color: item.accent }}
                >
                  ×{item.quantidade}
                </span>
              </div>
              <p className="mt-2 font-serif text-sm leading-5 text-stone-100">{item.nome}</p>
              <p className="mt-1.5 text-[0.58rem] leading-4 text-stone-500 line-clamp-2">{item.efeito}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Public component ──────────────────────────────────────────────────────────

export type BoardView3DProps = {
  locations: LocationDefinition[];
  shelterName: string;
  survivors: SurvivorSummary[];
  highlightedLocationIds?: string[];
  playerItems?: ItemCardData[];
  playerName?: string;
  isActionPhase?: boolean;
  selectableLocationIds?: string[];
  onLocationSelect?: (locationId: string) => void;
};

export function BoardView3D({
  locations,
  shelterName,
  survivors,
  highlightedLocationIds = [],
  playerItems = [],
  playerName = "Jogador",
  isActionPhase: _isActionPhase,
  selectableLocationIds: _selectableLocationIds,
  onLocationSelect: _onLocationSelect,
}: BoardView3DProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 shadow-xl shadow-black/30" style={{ background: "linear-gradient(180deg,#080c14,#04070c)" }}>
      <div className="flex items-end justify-between gap-4 px-6 pt-6 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Tabuleiro 3D</p>
          <h2 className="mt-2 font-serif text-3xl text-stone-50">Serra e arredores</h2>
        </div>
        <p className="max-w-xs text-right text-xs leading-6 text-stone-600">
          Arrastar → rodar · Scroll → zoom · ⌥ drag → deslocar
        </p>
      </div>

      <div className="relative overflow-hidden" style={{ height: "36rem" }}>
        <Canvas
          shadows
          camera={{ position: [0, 10, 12], fov: 48 }}
          gl={{ antialias: true }}
          style={{
            background: "linear-gradient(180deg, #0d1520 0%, #060a10 60%, #030508 100%)",
          }}
        >
          <CameraSetup />
          <Scene
            locations={locations}
            shelterName={shelterName}
            survivors={survivors}
            highlightedLocationIds={highlightedLocationIds}
          />
        </Canvas>

        {/* Atmospheric vignette overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(3,5,8,0.6) 100%), radial-gradient(ellipse at 50% 100%, rgba(3,5,8,0.8) 0%, transparent 50%)",
          }}
        />
      </div>

      <PlayerZone items={playerItems} playerName={playerName} />
    </section>
  );
}

// Preload all GLB models
const GLB_MODELS = [
  "/assets/models/building-type-a.glb",
  "/assets/models/building-type-b.glb",
  "/assets/models/building-type-c.glb",
  "/assets/models/building-type-e.glb",
  "/assets/models/fence-fortified.glb",
  "/assets/models/fence-doorway.glb",
  "/assets/models/structure-metal.glb",
  "/assets/models/barrel.glb",
  "/assets/models/campfire-pit.glb",
];
GLB_MODELS.forEach((url) => useGLTF.preload(url));
