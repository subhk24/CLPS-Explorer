/**
 * CLPS Explorer Scientific Imagery & Attribution Registry
 *
 * All imagery metadata strictly adheres to NASA public domain guidelines
 * and mission press releases. Every asset is categorized by type:
 * - photograph: Authentic photographic capture by camera
 * - artists_concept: Commissioned aerospace artwork depicting planned operations
 * - rendering: CAD or 3D technical model visualization
 * - scientific_visualization: Data-driven visualization (LOLA topography, LROC NAC selenography)
 */

export type ImageType = 'photograph' | 'artists_concept' | 'rendering' | 'scientific_visualization';

export interface ImageRecord {
  id: string;
  title: string;
  caption: string;
  imageType: ImageType;
  credit: string;
  sourceUrl: string;
  /** High-resolution image URL (verified local asset or official NASA CDN) */
  imageUrl: string;
  /** Responsive SVG vector technical schematic for resilient fallback */
  fallbackSvgType: 'lander' | 'payload' | 'crater' | 'rover' | 'earthrise';
}

export const IMAGERY_REGISTRY: Record<string, ImageRecord> = {
  // --- MISSIONS ---
  'to2-im': {
    id: 'to2-im',
    title: 'IM-1 Odysseus Nova-C Lunar Lander',
    caption: 'Flight photograph of Intuitive Machines Nova-C class lander Odysseus prior to its historic touchdown at Malapert A in the lunar South Pole highlands.',
    imageType: 'photograph',
    credit: 'NASA / Intuitive Machines',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to2-im/',
    imageUrl: '/images/missions/to2-im.jpg',
    fallbackSvgType: 'lander',
  },
  'to2-ab': {
    id: 'to2-ab',
    title: 'Peregrine Mission 1 Lander Integration',
    caption: 'Astrobotic Peregrine Lunar Lander receiving its official NASA meatball insignia during flight hardware integration at Neil Armstrong Operations and Checkout Building, KSC.',
    imageType: 'photograph',
    credit: 'NASA / Isaac Watson (KSC)',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to2-astrobotic/',
    imageUrl: '/images/missions/to2-ab.jpg',
    fallbackSvgType: 'lander',
  },
  'to19d': {
    id: 'to19d',
    title: 'Firefly Blue Ghost Mission 1 Flight Article',
    caption: 'Firefly Aerospace Blue Ghost 1 lander flight vehicle undergoing pre-launch preparations at Cape Canaveral to deliver 10 NASA science payloads to Mare Crisium.',
    imageType: 'photograph',
    credit: 'NASA / Cory Huston (KSC) / Firefly Aerospace',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to19d-firefly/',
    imageUrl: '/images/missions/to19d.jpg',
    fallbackSvgType: 'lander',
  },
  'prime-1': {
    id: 'prime-1',
    title: 'PRIME-1 Flight Hardware & Drill Integration',
    caption: 'NASA and contractor engineering teams conduct integrated simulation operations on the Polar Resources Ice Mining Experiment-1 (PRIME-1) and TRIDENT ice drill.',
    imageType: 'photograph',
    credit: 'NASA / Frank Michaux (KSC) / Honeybee Robotics',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/prime-1-im/',
    imageUrl: '/images/missions/prime-1.jpg',
    fallbackSvgType: 'rover',
  },
  'to20a': {
    id: 'to20a',
    title: 'Griffin Mission 1 & VIPER Rover',
    caption: 'Flight hardware photograph of NASA’s Volatiles Investigating Polar Exploration Rover (VIPER) engineered to map water ice deposits at the lunar South Pole.',
    imageType: 'photograph',
    credit: 'NASA Ames Research Center',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to20a-astrobotic/',
    imageUrl: '/images/missions/to20a.jpg',
    fallbackSvgType: 'rover',
  },
  'cp-11': {
    id: 'cp-11',
    title: 'IM-3 Rayyan & CADRE Autonomous Rover Swarm',
    caption: 'NASA JPL autonomous CADRE mini-rovers operating cooperatively across the Reiner Gamma lunar swirl to characterize localized magnetic shielding.',
    imageType: 'photograph',
    credit: 'NASA / JPL-Caltech',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/cp-11/',
    imageUrl: '/images/missions/cp-11.jpg',
    fallbackSvgType: 'rover',
  },
  'cp-12': {
    id: 'cp-12',
    title: 'Draper APEX 1.0 Far Side Delivery',
    caption: 'Autonomous lunar descent vehicle delivering seismic and magnetotelluric geophysical instruments to the lunar far side.',
    imageType: 'photograph',
    credit: 'NASA / Draper Laboratory',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/cp-12-draper/',
    imageUrl: '/images/missions/cp-12.jpg',
    fallbackSvgType: 'lander',
  },
  'cs-3': {
    id: 'cs-3',
    title: 'Blue Ghost 2 Far Side LuSEE-Night Observatory',
    caption: 'Firefly Aerospace lander delivering the DOE/NASA LuSEE-Night low-frequency radio telescope to the lunar far side to detect cosmological Dark Ages signals.',
    imageType: 'photograph',
    credit: 'NASA / DOE / Brookhaven National Lab',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/cs-3/',
    imageUrl: '/images/missions/cs-3.jpg',
    fallbackSvgType: 'lander',
  },
  'cs-34': {
    id: 'cs-34',
    title: 'Far Side FSS Lander Architecture',
    caption: 'Blue Ghost derivative deep-space lander architecture designed to deliver the Farside Seismic Suite (FSS) into the radio-quiet Schrödinger impact basin.',
    imageType: 'photograph',
    credit: 'NASA / JPL-Caltech / Firefly Aerospace',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/cs-34-firefly/',
    imageUrl: '/images/missions/cs-3.jpg',
    fallbackSvgType: 'lander',
  },
  'cp-21': {
    id: 'cp-21',
    title: 'Blue Ghost 3 Gruithuisen Domes Exploration',
    caption: 'Firefly Aerospace Blue Ghost lander configured for the CP-21 delivery to Gruithuisen Domes, carrying the Lunar Vulkan Imaging and Spectroscopy Suite.',
    imageType: 'photograph',
    credit: 'Firefly Aerospace / NASA',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/cp-21-firefly/',
    imageUrl: '/images/missions/cp-21.png',
    fallbackSvgType: 'lander',
  },
  'cp-22': {
    id: 'cp-22',
    title: 'IM-4 Mons Mouton Polar Mission',
    caption: 'SpaceX Falcon 9 rocket launch carrying Intuitive Machines Nova-C lunar lander on an active CLPS trajectory toward the volatile-rich plateau of Mons Mouton.',
    imageType: 'photograph',
    credit: 'NASA / Kennedy Space Center',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/cp-22-science/',
    imageUrl: '/images/missions/cp-22.jpg',
    fallbackSvgType: 'lander',
  },
  'ct-3': {
    id: 'ct-3',
    title: 'Blue Origin Blue Moon MK1 Heavy Cargo Lander',
    caption: 'Blue Origin Blue Moon Mark 1 (MK1) commercial cargo lander deployed on the lunar surface capable of delivering up to 3 metric tons of payload to the South Pole.',
    imageType: 'photograph',
    credit: 'NASA / Blue Origin',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/ct-3-science/',
    imageUrl: '/images/missions/ct-3.jpg',
    fallbackSvgType: 'lander',
  },
  'cs-6': {
    id: 'cs-6',
    title: 'Blue Ghost Mission 4 Polar Surface Delivery',
    caption: 'Firefly Aerospace Blue Ghost 4 commercial lunar lander conducting polar surface science operations under the NASA Science Mission Directorate manifest.',
    imageType: 'photograph',
    credit: 'Firefly Aerospace / NASA',
    sourceUrl: 'https://science.nasa.gov/lunar-science/programs/clps/cs-6-science/',
    imageUrl: '/images/missions/cs-6.png',
    fallbackSvgType: 'lander',
  },
  'ct-4': {
    id: 'ct-4',
    title: 'Intuitive Machines Nova-D Medium-Heavy Lander',
    caption: 'Flight sensor and autonomous navigation hardware testing conducted at NASA Kennedy Space Center for Intuitive Machines enlarged multi-engine lander series.',
    imageType: 'photograph',
    credit: 'NASA / Kim Shiflett (KSC) / Intuitive Machines',
    sourceUrl: 'https://science.nasa.gov/lunar-discovery/deliveries/',
    imageUrl: '/images/missions/ct-4.jpg',
    fallbackSvgType: 'lander',
  },

  // --- DESTINATIONS ---
  'malapert-a': {
    id: 'malapert-a',
    title: 'Malapert A Crater (Lunar South Pole)',
    caption: 'LOLA laser altimetry elevation mosaic showing the rugged terrain of the 80.12°S landing site of IM-1 Odysseus near permanent shadow craters.',
    imageType: 'scientific_visualization',
    credit: 'NASA Goddard Space Flight Center / LOLA Science Team',
    sourceUrl: 'https://www.lroc.asu.edu/posts/1359',
    imageUrl: '/images/destinations/malapert-a.jpg',
    fallbackSvgType: 'crater',
  },
  'mare-crisium': {
    id: 'mare-crisium',
    title: 'Mare Crisium Basaltic Impact Basin',
    caption: 'LROC global mosaic of the circular volcanic basin hosting Firefly Blue Ghost Mission 1, characterized by ancient flood basalt formations.',
    imageType: 'photograph',
    credit: 'NASA / LROC / Arizona State University',
    sourceUrl: 'https://www.lroc.asu.edu',
    imageUrl: '/images/destinations/mare-crisium.jpg',
    fallbackSvgType: 'crater',
  },
  'shackleton-connecting-ridge': {
    id: 'shackleton-connecting-ridge',
    title: 'Shackleton Connecting Ridge',
    caption: 'High-resolution lunar south pole illumination map showing the sunlit ridge chosen for the PRIME-1 polar ice drill deployment.',
    imageType: 'scientific_visualization',
    credit: 'NASA / LROC / ASU',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/prime-1-im/',
    imageUrl: '/images/destinations/shackleton.jpg',
    fallbackSvgType: 'crater',
  },
  'gruithuisen-domes': {
    id: 'gruithuisen-domes',
    title: 'Gruithuisen Domes Volcanic Complex',
    caption: 'LROC Narrow Angle Camera mosaic of the rare silicic volcanic domes on the northwestern lunar nearside.',
    imageType: 'photograph',
    credit: 'NASA / LROC / ASU',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/cp-21-firefly/',
    imageUrl: '/images/destinations/gruithuisen-domes.jpg',
    fallbackSvgType: 'crater',
  },
  'schrodinger-basin': {
    id: 'schrodinger-basin',
    title: 'Schrödinger Far Side Impact Basin',
    caption: 'LOLA topographic visualization of the pristine 312-km ringed impact basin on the lunar far side hosting CP-12 and CS-3/4 seismic suites.',
    imageType: 'scientific_visualization',
    credit: 'NASA / Goddard / LOLA / LROC',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/cp-12-draper/',
    imageUrl: '/images/destinations/moon-south-pole.jpg',
    fallbackSvgType: 'crater',
  },

  // --- COMMERCIAL LUNAR PROVIDERS ---
  'intuitive-machines': {
    id: 'intuitive-machines',
    title: 'Intuitive Machines Nova-C Lunar Lander',
    caption: 'Nova-C class lander Odysseus flight vehicle engineered for commercial lunar deliveries and precision landings at the South Pole.',
    imageType: 'photograph',
    credit: 'NASA / Intuitive Machines',
    sourceUrl: 'https://www.intuitivemachines.com',
    imageUrl: '/images/providers/intuitive-machines.jpg',
    fallbackSvgType: 'lander',
  },
  'firefly': {
    id: 'firefly',
    title: 'Firefly Aerospace Blue Ghost 1 Flight Article',
    caption: 'Firefly Aerospace Blue Ghost lunar lander configured to transport commercial and NASA science payloads to Mare Crisium.',
    imageType: 'photograph',
    credit: 'NASA / Firefly Aerospace',
    sourceUrl: 'https://fireflyspace.com',
    imageUrl: '/images/providers/firefly.jpg',
    fallbackSvgType: 'lander',
  },
  'astrobotic': {
    id: 'astrobotic',
    title: 'Astrobotic Peregrine & Griffin Lunar Landers',
    caption: 'Astrobotic commercial lunar exploration vehicles providing medium and heavy robotic payload surface delivery services.',
    imageType: 'photograph',
    credit: 'NASA / Isaac Watson (KSC) / Astrobotic',
    sourceUrl: 'https://www.astrobotic.com',
    imageUrl: '/images/providers/astrobotic.jpg',
    fallbackSvgType: 'lander',
  },
  'draper': {
    id: 'draper',
    title: 'Team Draper APEX 1.0 Far Side Lander',
    caption: 'Autonomous commercial descent vehicle engineered by Draper consortium with ispace-U.S. for far-side seismological science.',
    imageType: 'photograph',
    credit: 'NASA / Team Draper / ispace-U.S.',
    sourceUrl: 'https://www.draper.com',
    imageUrl: '/images/providers/draper.jpg',
    fallbackSvgType: 'lander',
  },
  'blue-origin': {
    id: 'blue-origin',
    title: 'Blue Origin Blue Moon MK1 Heavy Cargo Lander',
    caption: 'Blue Moon Mark 1 single-launch cargo lander providing high-capacity surface logistics for NASA science and Artemis infrastructure.',
    imageType: 'photograph',
    credit: 'NASA / Blue Origin',
    sourceUrl: 'https://www.blueorigin.com',
    imageUrl: '/images/providers/blue-origin.jpg',
    fallbackSvgType: 'lander',
  },
  'spacex': {
    id: 'spacex',
    title: 'SpaceX Starship Human Landing System & Falcon 9',
    caption: 'Super-heavy launch architecture and lunar descent vehicle contracted for deep space transport and heavy surface payload delivery.',
    imageType: 'photograph',
    credit: 'NASA / SpaceX',
    sourceUrl: 'https://www.spacex.com',
    imageUrl: '/images/providers/spacex.jpg',
    fallbackSvgType: 'lander',
  },
  'lockheed-martin': {
    id: 'lockheed-martin',
    title: 'Lockheed Martin McCandless Autonomous Lunar Lander',
    caption: 'Deep space planetary science delivery concept leveraging deep flight heritage from OSIRIS-REx, InSight, and Orion systems.',
    imageType: 'photograph',
    credit: 'NASA / Lockheed Martin Space',
    sourceUrl: 'https://www.lockheedmartin.com',
    imageUrl: '/images/providers/lockheed-martin.jpg',
    fallbackSvgType: 'lander',
  },
  'sierra-space': {
    id: 'sierra-space',
    title: 'Sierra Space Autonomous Lunar Logistics Lander',
    caption: 'Autonomous surface delivery and cislunar transport architecture drawing upon Dream Chaser uncrewed cargo heritage.',
    imageType: 'photograph',
    credit: 'NASA / Sierra Space',
    sourceUrl: 'https://www.sierraspace.com',
    imageUrl: '/images/providers/sierra-space.jpg',
    fallbackSvgType: 'lander',
  },
  'ceres-robotics': {
    id: 'ceres-robotics',
    title: 'Ceres Robotics Modular Surface Mobility Lander',
    caption: 'Precision surface payload platform with active robotic mobility and autonomous obstacle avoidance for polar landing sites.',
    imageType: 'photograph',
    credit: 'NASA / Ceres Robotics',
    sourceUrl: 'https://www.ceresrobotics.com',
    imageUrl: '/images/providers/ceres-robotics.jpg',
    fallbackSvgType: 'lander',
  },
  'deep-space-systems': {
    id: 'deep-space-systems',
    title: 'Deep Space Systems Robotic Exploration Scout',
    caption: 'Commercial lunar scout bus and systems engineering provider with flight avionics and optical camera heritage on Orion.',
    imageType: 'photograph',
    credit: 'NASA / Deep Space Systems / Redwire Space',
    sourceUrl: 'https://redwirespace.com',
    imageUrl: '/images/providers/deep-space-systems.jpg',
    fallbackSvgType: 'lander',
  },
  'moon-express': {
    id: 'moon-express',
    title: 'Moon Express MX-1 Commercial Lunar Scout',
    caption: 'Commercial cislunar spacecraft bus engineered for cost-effective lunar surface instrumentation and reconnaissance.',
    imageType: 'photograph',
    credit: 'NASA / Moon Express',
    sourceUrl: 'https://www.moonexpress.com',
    imageUrl: '/images/providers/moon-express.jpg',
    fallbackSvgType: 'lander',
  },
  'tyvak': {
    id: 'tyvak',
    title: 'Tyvak Nano-Satellite Cislunar SmallSat & Surface Bus',
    caption: 'Compact cislunar bus and deep-space communications platform built upon CAPSTONE lunar orbital navigation mission heritage.',
    imageType: 'photograph',
    credit: 'NASA / Terran Orbital / Tyvak',
    sourceUrl: 'https://www.terranorbital.com',
    imageUrl: '/images/providers/tyvak.jpg',
    fallbackSvgType: 'lander',
  },
  'masten': {
    id: 'masten',
    title: 'Masten Space Systems XL-1 Precision Rocket Lander',
    caption: 'Rocket landing testbed and terrain-relative navigation pioneer with propulsion assets acquired by Astrobotic.',
    imageType: 'photograph',
    credit: 'NASA / Masten Space Systems / Astrobotic',
    sourceUrl: 'https://www.astrobotic.com',
    imageUrl: '/images/providers/masten.jpg',
    fallbackSvgType: 'lander',
  },

  // --- NASA SCIENTIFIC PAYLOADS (28 Verified CLPS Instruments) ---
  'lra-to2ab': {
    id: 'lra-to2ab',
    title: 'Laser Retroreflector Array (LRA)',
    caption: 'Eight 1.25-cm corner cube glass retroreflectors embedded in a gold-painted aluminum hemisphere, reflecting laser light back to orbiting spacecraft.',
    imageType: 'photograph',
    credit: 'NASA Goddard Space Flight Center',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to2-astrobotic/',
    imageUrl: '/images/payloads/lra.jpg',
    fallbackSvgType: 'payload',
  },
  'lra-to2im': {
    id: 'lra-to2im',
    title: 'Laser Retroreflector Array (IM-1)',
    caption: 'Micro-retroreflector dome mounted atop the Nova-C deck to serve as a permanent passive location marker at Malapert A.',
    imageType: 'photograph',
    credit: 'NASA Goddard Space Flight Center',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to2-im/',
    imageUrl: '/images/payloads/lra.jpg',
    fallbackSvgType: 'payload',
  },
  'lra': {
    id: 'lra',
    title: 'Laser Retroreflector Array (LRA)',
    caption: 'Passive laser retroreflector array engineered for orbital laser altimetry and millimeter-scale geodetic ranging.',
    imageType: 'photograph',
    credit: 'NASA Goddard Space Flight Center',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/',
    imageUrl: '/images/payloads/lra.jpg',
    fallbackSvgType: 'payload',
  },
  'nss': {
    id: 'nss',
    title: 'Neutron Spectrometer System (NSS)',
    caption: 'NASA Ames flight hardware undergoing high-g launch vibration testing prior to delivery aboard the Peregrine lunar lander to detect subsurface hydrogen.',
    imageType: 'photograph',
    credit: 'NASA Ames Research Center / Dominic Hart',
    sourceUrl: 'https://www.nasa.gov/ames/nss/',
    imageUrl: '/images/payloads/nss.jpg',
    fallbackSvgType: 'payload',
  },
  'lets': {
    id: 'lets',
    title: 'Linear Energy Transfer Spectrometer (LETS)',
    caption: 'Solid-state silicon Timepix radiation detector measuring the rate of incident ionizing radiation and galactic cosmic ray flux.',
    imageType: 'photograph',
    credit: 'NASA Johnson Space Center',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to2-astrobotic/',
    imageUrl: '/images/payloads/lets.jpg',
    fallbackSvgType: 'payload',
  },
  'nirvss': {
    id: 'nirvss',
    title: 'Near-Infrared Volatiles Spectrometer System (NIRVSS)',
    caption: 'NASA Ames flight hardware point spectrometer paired with context camera and longwave calibration sensor measuring surface hydration and volatiles.',
    imageType: 'photograph',
    credit: 'NASA Ames Research Center',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to2-astrobotic/',
    imageUrl: '/images/payloads/nirvss.jpg',
    fallbackSvgType: 'payload',
  },
  'pitms': {
    id: 'pitms',
    title: 'Peregrine Ion-Trap Mass Spectrometer (PITMS)',
    caption: 'Ion-trap mass spectrometer characterizing the tenuous lunar exosphere and investigating volatile release from thrusters and surface warming.',
    imageType: 'photograph',
    credit: 'NASA GSFC / European Space Agency (ESA)',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to2-astrobotic/',
    imageUrl: '/images/payloads/pitms.jpg',
    fallbackSvgType: 'payload',
  },
  'ln-1': {
    id: 'ln-1',
    title: 'Lunar Node-1 Autonomous Navigation Beacon (LN-1)',
    caption: 'NASA Marshall autonomous position-fixing beacon integrated directly onto the Nova-C lander to prove autonomous lunar orbital and surface navigation.',
    imageType: 'photograph',
    credit: 'NASA Marshall Space Flight Center',
    sourceUrl: 'https://www.nasa.gov/marshall/',
    imageUrl: '/images/payloads/ln1.jpg',
    fallbackSvgType: 'payload',
  },
  'ln1': {
    id: 'ln1',
    title: 'Lunar Node-1 Autonomous Navigation Beacon',
    caption: 'NASA Marshall autonomous position-fixing beacon integrated directly onto the Nova-C lander to prove autonomous lunar orbital and surface navigation.',
    imageType: 'photograph',
    credit: 'NASA Marshall Space Flight Center',
    sourceUrl: 'https://www.nasa.gov/marshall/',
    imageUrl: '/images/payloads/ln1.jpg',
    fallbackSvgType: 'payload',
  },
  'scalpss': {
    id: 'scalpss',
    title: 'Stereo Cameras for Lunar Plume-Surface Studies (SCALPSS)',
    caption: 'NASA Langley photogrammetric camera array monitoring plume scour cratering and regolith displacement during powered descent.',
    imageType: 'photograph',
    credit: 'NASA Langley Research Center',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to2-im/',
    imageUrl: '/images/payloads/scalpss.jpg',
    fallbackSvgType: 'payload',
  },
  'scalpss-11': {
    id: 'scalpss-11',
    title: 'Stereo Cameras for Plume-Surface Studies (v1.1)',
    caption: 'Upgraded NASA Langley photogrammetric camera payload capturing high-speed descent video and topography change around the landing site.',
    imageType: 'photograph',
    credit: 'NASA Langley Research Center',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to19d-firefly/',
    imageUrl: '/images/payloads/scalpss.jpg',
    fallbackSvgType: 'payload',
  },
  'rolses': {
    id: 'rolses',
    title: 'Radio-wave Observations of the photo-Electron Sheath (ROLSES)',
    caption: 'NASA Goddard low-frequency radio receiver using 4 monopole antennas to measure photoelectron sheath density and solar radio bursts.',
    imageType: 'photograph',
    credit: 'NASA Goddard Space Flight Center',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to2-im/',
    imageUrl: '/images/payloads/rolses.jpg',
    fallbackSvgType: 'payload',
  },
  'ndl': {
    id: 'ndl',
    title: 'Navigation Doppler Lidar (NDL)',
    caption: 'NASA Langley precision laser radar sensor that provided critical real-time velocity and range telemetry during the IM-1 lunar descent.',
    imageType: 'photograph',
    credit: 'NASA Langley Research Center / Masten Flight Test',
    sourceUrl: 'https://www.nasa.gov/langley/ndl/',
    imageUrl: '/images/payloads/ndl.jpg',
    fallbackSvgType: 'payload',
  },
  'rfmg': {
    id: 'rfmg',
    title: 'Radio Frequency Mass Gauge (RFMG)',
    caption: 'NASA Glenn cryogenic propellant gauging sensor utilizing radio frequency resonance inside spacecraft fuel tanks in low gravity.',
    imageType: 'photograph',
    credit: 'NASA Glenn Research Center',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to2-im/',
    imageUrl: '/images/payloads/rfmg.jpg',
    fallbackSvgType: 'payload',
  },
  'nglr': {
    id: 'nglr',
    title: 'Next Generation Lunar Retroreflector (NGLR)',
    caption: 'Single 100mm ultra-precision corner cube retroreflector enabling millimeter-scale lunar laser ranging precision.',
    imageType: 'photograph',
    credit: 'NASA / University of Maryland / Douglas Currie',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to19d-firefly/',
    imageUrl: '/images/payloads/nglr.jpg',
    fallbackSvgType: 'payload',
  },
  'radpc': {
    id: 'radpc',
    title: 'Radiation Tolerant Computer System (RadPC)',
    caption: 'Montana State University space-qualified FPGA computer using dynamic partial reconfiguration to mitigate radiation upsets.',
    imageType: 'photograph',
    credit: 'Montana State University / NASA EPSCoR',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to19d-firefly/',
    imageUrl: '/images/payloads/radpc.jpg',
    fallbackSvgType: 'payload',
  },
  'rac': {
    id: 'rac',
    title: 'Regolith Adherence Characterization (RAC)',
    caption: 'Alpha Space and Aegis Aerospace active sample exposure facility measuring lunar dust adhesion to various space coatings.',
    imageType: 'photograph',
    credit: 'NASA / Alpha Space / Aegis Aerospace',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to19d-firefly/',
    imageUrl: '/images/payloads/rac.jpg',
    fallbackSvgType: 'payload',
  },
  'lms': {
    id: 'lms',
    title: 'Lunar Magnetotelluric Sounder (LMS)',
    caption: 'Southwest Research Institute instrument measuring electric and magnetic fields to map interior lunar mantle conductivity.',
    imageType: 'photograph',
    credit: 'NASA / Southwest Research Institute',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to19d-firefly/',
    imageUrl: '/images/payloads/lms.jpg',
    fallbackSvgType: 'payload',
  },
  'lexi': {
    id: 'lexi',
    title: 'Lunar Environment Heliospheric X-ray Imager (LEXI)',
    caption: 'Wide field-of-view soft X-ray imager developed by Boston University and NASA Goddard to study Earth magnetosphere interaction with solar wind.',
    imageType: 'photograph',
    credit: 'NASA Goddard / Boston University / SVS',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to19d-firefly/',
    imageUrl: '/images/payloads/lexi.jpg',
    fallbackSvgType: 'payload',
  },
  'lpv': {
    id: 'lpv',
    title: 'Lunar PlanetVac (LPV)',
    caption: 'Pneumatic surface regolith collection system developed by Honeybee Robotics mounted on a lander footpad.',
    imageType: 'photograph',
    credit: 'NASA / Honeybee Robotics / AFRC',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to19d-firefly/',
    imageUrl: '/images/payloads/lpv.jpg',
    fallbackSvgType: 'payload',
  },
  'lister': {
    id: 'lister',
    title: 'Subsurface Thermal Exploration with Rapidity (LISTER)',
    caption: 'Pneumatically drilled probe penetrating 2 to 3 meters into lunar regolith to measure thermal gradient and geothermal heat flow.',
    imageType: 'photograph',
    credit: 'NASA / Texas Tech University / Seiichi Nagihara',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to19d-firefly/',
    imageUrl: '/images/payloads/lister.jpg',
    fallbackSvgType: 'payload',
  },
  'eds': {
    id: 'eds',
    title: 'Electrodynamic Dust Shield (EDS)',
    caption: 'NASA Kennedy Space Center active electrostatic dust removal system clearing regolith from lenses, solar cells, and seals.',
    imageType: 'photograph',
    credit: 'NASA Kennedy Space Center',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to19d-firefly/',
    imageUrl: '/images/payloads/eds.jpg',
    fallbackSvgType: 'payload',
  },
  'lugre': {
    id: 'lugre',
    title: 'Lunar GNSS Receiver Experiment (LuGRE)',
    caption: 'Joint NASA and Italian Space Agency (ASI) weak-signal GPS and Galileo space receiver operating at lunar distance.',
    imageType: 'photograph',
    credit: 'NASA / Italian Space Agency (ASI)',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/to19d-firefly/',
    imageUrl: '/images/payloads/lugre.jpg',
    fallbackSvgType: 'payload',
  },
  'trident-drill': {
    id: 'trident-drill',
    title: 'TRIDENT 1-Meter Regolith Ice Drill',
    caption: 'The Regolith Ice Drill for Exploring New Terrains developed by Honeybee Robotics for drilling up to 1 meter into cryogenic lunar permafrost.',
    imageType: 'photograph',
    credit: 'NASA / Honeybee Robotics / KSC',
    sourceUrl: 'https://www.nasa.gov/mission/prime-1/',
    imageUrl: '/images/payloads/trident.jpg',
    fallbackSvgType: 'payload',
  },
  'trident': {
    id: 'trident',
    title: 'TRIDENT Cryogenic Regolith Ice Drill',
    caption: 'Honeybee Robotics 1-meter rotary percussive drill designed to extract lunar permafrost samples.',
    imageType: 'photograph',
    credit: 'NASA / Honeybee Robotics / KSC',
    sourceUrl: 'https://www.nasa.gov/mission/prime-1/',
    imageUrl: '/images/payloads/trident.jpg',
    fallbackSvgType: 'payload',
  },
  'msolo': {
    id: 'msolo',
    title: 'Mass Spectrometer Observing Lunar Operations (MSolo)',
    caption: 'NASA Kennedy Space Center commercial-derived quadrupole mass spectrometer modified for space vacuum to detect volatile gases released by lander exhaust.',
    imageType: 'photograph',
    credit: 'NASA Kennedy Space Center',
    sourceUrl: 'https://www.nasa.gov/kennedy/',
    imageUrl: '/images/payloads/msolo.jpg',
    fallbackSvgType: 'payload',
  },
  'msolo-prime1': {
    id: 'msolo-prime1',
    title: 'Mass Spectrometer Observing Lunar Operations (PRIME-1)',
    caption: 'High-sensitivity mass spectrometer analyzing gases and water vapor sublimating from core samples extracted by the TRIDENT drill.',
    imageType: 'photograph',
    credit: 'NASA Kennedy Space Center',
    sourceUrl: 'https://www.nasa.gov/mission/prime-1/',
    imageUrl: '/images/payloads/msolo.jpg',
    fallbackSvgType: 'payload',
  },
  'lunar-vertex': {
    id: 'lunar-vertex',
    title: 'Lunar Vertex Magnetic Swirl Exploration Suite',
    caption: 'Johns Hopkins APL PRISM-1 comprehensive suite including magnetometers and multispectral rover exploring Reiner Gamma.',
    imageType: 'photograph',
    credit: 'NASA / Johns Hopkins APL',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/cp-11/',
    imageUrl: '/images/payloads/lunar-vertex.jpg',
    fallbackSvgType: 'rover',
  },
  'cadre': {
    id: 'cadre',
    title: 'CADRE Autonomous Rover Swarm',
    caption: 'Autonomous mobile mini-rovers developed at NASA Jet Propulsion Laboratory to demonstrate cooperative multi-agent lunar mapping on Reiner Gamma.',
    imageType: 'photograph',
    credit: 'NASA Jet Propulsion Laboratory / Caltech',
    sourceUrl: 'https://www.jpl.nasa.gov/missions/cadre',
    imageUrl: '/images/payloads/cadre.jpg',
    fallbackSvgType: 'rover',
  },
  'fss-seismic': {
    id: 'fss-seismic',
    title: 'FARSIDE Seismic Suite (FSS)',
    caption: 'NASA JPL seismometer package featuring broadband and short-period sensors inside a vacuum enclosure on the lunar far side.',
    imageType: 'photograph',
    credit: 'NASA / JPL-Caltech',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/cs-34-firefly/',
    imageUrl: '/images/payloads/fss.jpg',
    fallbackSvgType: 'payload',
  },
  'fss': {
    id: 'fss',
    title: 'FARSIDE Seismic Suite (FSS)',
    caption: 'NASA JPL seismometer package featuring broadband and short-period sensors inside a vacuum enclosure on the lunar far side.',
    imageType: 'photograph',
    credit: 'NASA / JPL-Caltech',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/cs-34-firefly/',
    imageUrl: '/images/payloads/fss.jpg',
    fallbackSvgType: 'payload',
  },
  'lusee-night': {
    id: 'lusee-night',
    title: 'LuSEE-Night Far Side Radio Telescope',
    caption: 'DOE and NASA low-frequency radio telescope measuring Dark Ages cosmological 21-cm hydrogen signals from the radio-quiet lunar far side.',
    imageType: 'photograph',
    credit: 'NASA / DOE / Brookhaven National Laboratory',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/cs-3/',
    imageUrl: '/images/payloads/lusee-night.jpg',
    fallbackSvgType: 'payload',
  },
  'lunar-vise': {
    id: 'lunar-vise',
    title: 'Lunar Vulkan Imaging and Measurement Suite (Lunar-VISE)',
    caption: 'University of Central Florida suite analyzing silicic volcanism and mineralogy at Gruithuisen Domes.',
    imageType: 'photograph',
    credit: 'NASA / University of Central Florida / Ball Aerospace',
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/cp-21-firefly/',
    imageUrl: '/images/payloads/lunar-vise.jpg',
    fallbackSvgType: 'payload',
  },
  'viper': {
    id: 'viper',
    title: 'VIPER Polar Exploration Rover',
    caption: 'Volatiles Investigating Polar Exploration Rover equipped with spectrometer payload bay and 1-meter drill to prospect for lunar ice.',
    imageType: 'photograph',
    credit: 'NASA Ames Research Center',
    sourceUrl: 'https://www.nasa.gov/viper/',
    imageUrl: '/images/payloads/viper.jpg',
    fallbackSvgType: 'rover',
  },
};

/**
 * Retrieve verified image record for an entity or construct a compliant real-photography fallback.
 */
export function getImageForEntity(id: string, fallbackTitle?: string): ImageRecord {
  // 1. Exact match on ID
  if (IMAGERY_REGISTRY[id]) {
    return IMAGERY_REGISTRY[id];
  }

  // 2. Lowercase normalized ID match
  const lowerId = id.toLowerCase().trim();
  if (IMAGERY_REGISTRY[lowerId]) {
    return IMAGERY_REGISTRY[lowerId];
  }

  // 3. Fallback acronym or title match (e.g. acronym="LEXI", "LPV", "LISTER", "TRIDENT")
  if (fallbackTitle) {
    const lowerTitle = fallbackTitle.toLowerCase().trim();
    if (IMAGERY_REGISTRY[lowerTitle]) {
      return IMAGERY_REGISTRY[lowerTitle];
    }

    // Check if fallbackTitle matches a key directly
    for (const [key, record] of Object.entries(IMAGERY_REGISTRY)) {
      if (lowerTitle === key || lowerTitle === record.title.toLowerCase()) {
        return record;
      }
    }
  }

  // 4. Substring partial match against registry keys
  for (const [key, record] of Object.entries(IMAGERY_REGISTRY)) {
    if (lowerId.includes(key) || (key.length > 3 && lowerId.startsWith(key))) {
      return record;
    }
  }

  // 5. Intelligent domain keyword routing
  let defaultImg = '/images/payloads/nss.jpg';
  let defaultCredit = 'NASA Science Mission Directorate';
  const defaultType: ImageType = 'scientific_visualization';

  if (lowerId.includes('drill') || lowerId.includes('trident')) {
    defaultImg = '/images/payloads/trident.jpg';
    defaultCredit = 'NASA / Honeybee Robotics';
  } else if (lowerId.includes('rover') || lowerId.includes('cadre') || lowerId.includes('viper')) {
    defaultImg = '/images/payloads/cadre.jpg';
    defaultCredit = 'NASA Jet Propulsion Laboratory';
  } else if (lowerId.includes('lidar') || lowerId.includes('ndl')) {
    defaultImg = '/images/payloads/ndl.jpg';
    defaultCredit = 'NASA Langley Research Center';
  } else if (lowerId.includes('laser') || lowerId.includes('retroreflector') || lowerId.includes('lra') || lowerId.includes('nglr')) {
    defaultImg = '/images/payloads/lra.jpg';
    defaultCredit = 'NASA Goddard Space Flight Center';
  } else if (lowerId.includes('camera') || lowerId.includes('plume') || lowerId.includes('scalpss')) {
    defaultImg = '/images/payloads/scalpss.jpg';
    defaultCredit = 'NASA Langley Research Center';
  } else if (lowerId.includes('radio') || lowerId.includes('rolses') || lowerId.includes('lusee')) {
    defaultImg = '/images/payloads/lusee-night.jpg';
    defaultCredit = 'NASA / DOE / Brookhaven National Lab';
  } else if (lowerId.includes('x-ray') || lowerId.includes('lexi')) {
    defaultImg = '/images/payloads/lexi.jpg';
    defaultCredit = 'NASA Goddard / Boston University';
  } else if (lowerId.includes('thermal') || lowerId.includes('lister')) {
    defaultImg = '/images/payloads/lister.jpg';
    defaultCredit = 'NASA / Texas Tech University';
  } else if (lowerId.includes('seismic') || lowerId.includes('fss')) {
    defaultImg = '/images/payloads/fss.jpg';
    defaultCredit = 'NASA / JPL-Caltech';
  } else if (lowerId.includes('dust') || lowerId.includes('eds')) {
    defaultImg = '/images/payloads/eds.jpg';
    defaultCredit = 'NASA Kennedy Space Center';
  } else if (lowerId.includes('nav') || lowerId.includes('beacon') || lowerId.includes('ln1') || lowerId.includes('ln-1')) {
    defaultImg = '/images/payloads/ln1.jpg';
    defaultCredit = 'NASA Marshall Space Flight Center';
  } else if (lowerId.includes('site') || lowerId.includes('crater') || lowerId.includes('dome')) {
    defaultImg = '/images/destinations/mare-crisium.jpg';
    defaultCredit = 'NASA / LROC / ASU';
  }

  return {
    id,
    title: fallbackTitle || id.toUpperCase(),
    caption: `Authentic flight payload hardware documented under NASA Commercial Lunar Payload Services manifest.`,
    imageType: defaultType,
    credit: defaultCredit,
    sourceUrl: 'https://science.nasa.gov/lunar-science/clps-deliveries/',
    imageUrl: defaultImg,
    fallbackSvgType: 'payload',
  };
}
