/**
 * Realistic Data Sources
 * Contains all mock data for generating realistic threat events
 * Sourced from real-world cybersecurity scenarios and patterns
 */

// ============================================================
// CORPORATE USERS DATABASE
// ============================================================

export const corporateUsers = [
  // IT Department
  { userId: 'USR-001', username: 'john.smith', email: 'john.smith@aegis-corp.com', department: 'IT Security', role: 'Security Analyst', clearanceLevel: 4, isPrivileged: true, isContractor: false },
  { userId: 'USR-002', username: 'sarah.chen', email: 'sarah.chen@aegis-corp.com', department: 'IT Security', role: 'SOC Lead', clearanceLevel: 5, isPrivileged: true, isContractor: false },
  { userId: 'USR-003', username: 'mike.rodriguez', email: 'mike.rodriguez@aegis-corp.com', department: 'IT Infrastructure', role: 'System Admin', clearanceLevel: 4, isPrivileged: true, isContractor: false },
  { userId: 'USR-004', username: 'emily.watson', email: 'emily.watson@aegis-corp.com', department: 'IT Development', role: 'DevOps Engineer', clearanceLevel: 3, isPrivileged: false, isContractor: false },
  
  // Finance Department
  { userId: 'USR-010', username: 'david.jones', email: 'david.jones@aegis-corp.com', department: 'Finance', role: 'CFO', clearanceLevel: 4, isPrivileged: true, isContractor: false },
  { userId: 'USR-011', username: 'lisa.anderson', email: 'lisa.anderson@aegis-corp.com', department: 'Finance', role: 'Financial Analyst', clearanceLevel: 2, isPrivileged: false, isContractor: false },
  { userId: 'USR-012', username: 'james.wilson', email: 'james.wilson@aegis-corp.com', department: 'Finance', role: 'Accountant', clearanceLevel: 2, isPrivileged: false, isContractor: false },
  
  // HR Department
  { userId: 'USR-020', username: 'nancy.taylor', email: 'nancy.taylor@aegis-corp.com', department: 'HR', role: 'HR Director', clearanceLevel: 3, isPrivileged: false, isContractor: false },
  { userId: 'USR-021', username: 'mark.brown', email: 'mark.brown@aegis-corp.com', department: 'HR', role: 'HR Specialist', clearanceLevel: 2, isPrivileged: false, isContractor: false },
  
  // Engineering
  { userId: 'USR-030', username: 'alex.kim', email: 'alex.kim@aegis-corp.com', department: 'Engineering', role: 'Senior Engineer', clearanceLevel: 3, isPrivileged: false, isContractor: false },
  { userId: 'USR-031', username: 'ryan.garcia', email: 'ryan.garcia@aegis-corp.com', department: 'Engineering', role: 'Junior Engineer', clearanceLevel: 2, isPrivileged: false, isContractor: false },
  { userId: 'USR-032', username: 'jennifer.lee', email: 'jennifer.lee@aegis-corp.com', department: 'Engineering', role: 'QA Engineer', clearanceLevel: 2, isPrivileged: false, isContractor: false },
  
  // Executive
  { userId: 'USR-040', username: 'robert.clark', email: 'robert.clark@aegis-corp.com', department: 'Executive', role: 'CEO', clearanceLevel: 5, isPrivileged: true, isContractor: false },
  { userId: 'USR-041', username: 'maria.martinez', email: 'maria.martinez@aegis-corp.com', department: 'Executive', role: 'CTO', clearanceLevel: 5, isPrivileged: true, isContractor: false },
  
  // Contractors
  { userId: 'USR-050', username: 'temp.contractor1', email: 'contractor1@external-vendor.com', department: 'Facilities', role: 'Contractor', clearanceLevel: 1, isPrivileged: false, isContractor: true },
  { userId: 'USR-051', username: 'vendor.support', email: 'support@vendor-tech.com', department: 'IT Support', role: 'Vendor Support', clearanceLevel: 2, isPrivileged: false, isContractor: true },
  
  // Suspicious/Insider Threats
  { userId: 'USR-060', username: 'alex.morgan', email: 'alex.morgan@aegis-corp.com', department: 'Engineering', role: 'Disgruntled Developer', clearanceLevel: 3, isPrivileged: false, isContractor: false },
  { userId: 'USR-061', username: 'chris.taylor', email: 'chris.taylor@aegis-corp.com', department: 'Finance', role: 'Departing Employee', clearanceLevel: 3, isPrivileged: false, isContractor: false },
];

// ============================================================
// DEVICE DATABASE
// ============================================================

export const corporateDevices = [
  // Workstations
  { deviceId: 'WS-001', deviceType: 'workstation' as const, hostname: 'WS-FINANCE-01', department: 'Finance', trustLevel: 'trusted' as const },
  { deviceId: 'WS-002', deviceType: 'workstation' as const, hostname: 'WS-ENGINE-03', department: 'Engineering', trustLevel: 'trusted' as const },
  { deviceId: 'WS-003', deviceType: 'workstation' as const, hostname: 'WS-HR-02', department: 'HR', trustLevel: 'trusted' as const },
  { deviceId: 'WS-004', deviceType: 'workstation' as const, hostname: 'WS-EXEC-01', department: 'Executive', trustLevel: 'trusted' as const },
  { deviceId: 'WS-005', deviceType: 'workstation' as const, hostname: 'WS-IT-SEC-01', department: 'IT Security', trustLevel: 'trusted' as const },
  
  // Laptops
  { deviceId: 'LP-001', deviceType: 'laptop' as const, hostname: 'LP-JSMITH', department: 'IT Security', trustLevel: 'managed' as const },
  { deviceId: 'LP-002', deviceType: 'laptop' as const, hostname: 'LP-DEV-02', department: 'Engineering', trustLevel: 'managed' as const },
  { deviceId: 'LP-003', deviceType: 'laptop' as const, hostname: 'LP-REMOTE-01', department: 'Finance', trustLevel: 'managed' as const },
  
  // Servers
  { deviceId: 'SRV-001', deviceType: 'server' as const, hostname: 'DC-PRIMARY', department: 'IT Infrastructure', trustLevel: 'trusted' as const },
  { deviceId: 'SRV-002', deviceType: 'server' as const, hostname: 'DC-BACKUP', department: 'IT Infrastructure', trustLevel: 'trusted' as const },
  { deviceId: 'SRV-003', deviceType: 'server' as const, hostname: 'APP-WEB-01', department: 'IT Infrastructure', trustLevel: 'trusted' as const },
  { deviceId: 'SRV-004', deviceType: 'server' as const, hostname: 'APP-DB-01', department: 'IT Infrastructure', trustLevel: 'trusted' as const },
  { deviceId: 'SRV-005', deviceType: 'server' as const, hostname: 'FILE-SERVER', department: 'IT Infrastructure', trustLevel: 'trusted' as const },
  { deviceId: 'SRV-006', deviceType: 'server' as const, hostname: 'MAIL-SERVER', department: 'IT Infrastructure', trustLevel: 'trusted' as const },
  
  // IoT/Camera
  { deviceId: 'CAM-001', deviceType: 'camera' as const, hostname: 'CAM-LOBBY-01', department: 'Facilities', trustLevel: 'managed' as const },
  { deviceId: 'CAM-002', deviceType: 'camera' as const, hostname: 'CAM-SERVER-01', department: 'Facilities', trustLevel: 'managed' as const },
  { deviceId: 'CAM-003', deviceType: 'camera' as const, hostname: 'CAM-PARKING-01', department: 'Facilities', trustLevel: 'managed' as const },
  { deviceId: 'CAM-004', deviceType: 'camera' as const, hostname: 'CAM-EXIT-01', department: 'Facilities', trustLevel: 'managed' as const },
  
  // Badge Readers
  { deviceId: 'BADGE-001', deviceType: 'badge_reader' as const, hostname: 'BADGE-LOBBY', department: 'Facilities', trustLevel: 'managed' as const },
  { deviceId: 'BADGE-002', deviceType: 'badge_reader' as const, hostname: 'BADGE-SERVER-ROOM', department: 'Facilities', trustLevel: 'managed' as const },
  { deviceId: 'BADGE-003', deviceType: 'badge_reader' as const, hostname: 'BADGE-EXEC-FLOOR', department: 'Facilities', trustLevel: 'managed' as const },
  
  // Vehicles
  { deviceId: 'VEH-001', deviceType: 'vehicle' as const, hostname: 'VEH-EXEC-01', department: 'Executive', trustLevel: 'trusted' as const },
  { deviceId: 'VEH-002', deviceType: 'vehicle' as const, hostname: 'VEH-FLEET-03', department: 'Facilities', trustLevel: 'managed' as const },
  { deviceId: 'VEH-003', deviceType: 'vehicle' as const, hostname: 'VEH-UNKNOWN-01', department: 'Unknown', trustLevel: 'unknown' as const },
  
  // Network Devices
  { deviceId: 'NET-001', deviceType: 'network_device' as const, hostname: 'FW-EDGE-01', department: 'IT Infrastructure', trustLevel: 'trusted' as const },
  { deviceId: 'NET-002', deviceType: 'network_device' as const, hostname: 'SW-CORE-01', department: 'IT Infrastructure', trustLevel: 'trusted' as const },
  { deviceId: 'NET-003', deviceType: 'network_device' as const, hostname: 'AP-FLOOR3-01', department: 'IT Infrastructure', trustLevel: 'trusted' as const },
];

// ============================================================
// GEOLOCATION DATABASE
// ============================================================

export const geolocations = {
  internal: [
    { country: 'United States', countryCode: 'US', region: 'California', city: 'San Francisco', latitude: 37.7749, longitude: -122.4194, isp: 'Internal Network', timezone: 'America/Los_Angeles', isInternal: true },
    { country: 'United States', countryCode: 'US', region: 'New York', city: 'New York City', latitude: 40.7128, longitude: -74.0060, isp: 'Internal Network', timezone: 'America/New_York', isInternal: true },
    { country: 'United States', countryCode: 'US', region: 'Texas', city: 'Austin', latitude: 30.2672, longitude: -97.7431, isp: 'Internal Network', timezone: 'America/Chicago', isInternal: true },
  ],
  external: [
    { country: 'Russia', countryCode: 'RU', region: 'Moscow', city: 'Moscow', latitude: 55.7558, longitude: 37.6173, isp: 'PJSC Rostelecom', timezone: 'Europe/Moscow', isInternal: false },
    { country: 'China', countryCode: 'CN', region: 'Beijing', city: 'Beijing', latitude: 39.9042, longitude: 116.4074, isp: 'China Telecom', timezone: 'Asia/Shanghai', isInternal: false },
    { country: 'North Korea', countryCode: 'KP', region: 'Pyongyang', city: 'Pyongyang', latitude: 39.0392, longitude: 125.7625, isp: 'Star Joint Venture', timezone: 'Asia/Pyongyang', isInternal: false },
    { country: 'Iran', countryCode: 'IR', region: 'Tehran', city: 'Tehran', latitude: 35.6892, longitude: 51.3890, isp: 'Iran Telecom', timezone: 'Asia/Tehran', isInternal: false },
    { country: 'Brazil', countryCode: 'BR', region: 'São Paulo', city: 'São Paulo', latitude: -23.5505, longitude: -46.6333, isp: 'Vivo', timezone: 'America/Sao_Paulo', isInternal: false },
    { country: 'Germany', countryCode: 'DE', region: 'Berlin', city: 'Berlin', latitude: 52.5200, longitude: 13.4050, isp: 'Deutsche Telekom', timezone: 'Europe/Berlin', isInternal: false },
    { country: 'Netherlands', countryCode: 'NL', region: 'Amsterdam', city: 'Amsterdam', latitude: 52.3676, longitude: 4.9041, isp: 'KPN', timezone: 'Europe/Amsterdam', isInternal: false },
    { country: 'Romania', countryCode: 'RO', region: 'Bucharest', city: 'Bucharest', latitude: 44.4268, longitude: 26.1025, isp: 'RDS', timezone: 'Europe/Bucharest', isInternal: false },
    { country: 'Ukraine', countryCode: 'UA', region: 'Kyiv', city: 'Kyiv', latitude: 50.4501, longitude: 30.5234, isp: 'Kyivstar', timezone: 'Europe/Kiev', isInternal: false },
    { country: 'Vietnam', countryCode: 'VN', region: 'Ho Chi Minh City', city: 'Ho Chi Minh City', latitude: 10.8231, longitude: 106.6297, isp: 'Viettel', timezone: 'Asia/Ho_Chi_Minh', isInternal: false },
  ],
  suspicious: [
    { country: 'Russia', countryCode: 'RU', region: 'St. Petersburg', city: 'St. Petersburg', latitude: 59.9311, longitude: 30.3609, isp: 'Bulletproof Hosting Inc', timezone: 'Europe/Moscow', isInternal: false },
    { country: 'China', countryCode: 'CN', region: 'Shanghai', city: 'Shanghai', latitude: 31.2304, longitude: 121.4737, isp: 'Aliyun Computing', timezone: 'Asia/Shanghai', isInternal: false },
  ],
};

// ============================================================
// THREAT EVENT TEMPLATES
// ============================================================

export const eventTemplates = {
  suspicious_vehicle: {
    titles: [
      'Unknown vehicle detected in restricted parking area',
      'Vehicle with expired access credentials at gate',
      'Unauthorized vehicle loitering near loading dock',
      'Unrecognized license plate flagged by ANPR system',
      'Vehicle tailgating through security gate',
    ],
    descriptions: [
      'Security cameras detected an unregistered vehicle in the restricted parking zone. The vehicle has been present for over 15 minutes without valid credentials.',
      'Automatic Number Plate Recognition (ANPR) system flagged a vehicle with expired facility access. The vehicle was denied entry at Gate 3.',
      'A suspicious vehicle was observed circling the parking structure multiple times. License plate could not be verified against known databases.',
    ],
    sourceType: 'vehicle_system' as const,
    category: 'physical' as const,
  },
  abnormal_badge_access: {
    titles: [
      'Badge access outside normal working hours',
      'Multiple failed badge attempts at secure area',
      'Badge used at two distant locations simultaneously',
      'Terminated employee badge still active',
      'Badge access to unauthorized floor',
    ],
    descriptions: [
      'Badge reader detected access attempt at 02:47 AM, outside the employee\'s normal working hours pattern. Alert triggered based on behavioral baseline.',
      'Failed badge authentication attempts exceeded threshold at Server Room entrance. Badge presented 5 times in 2 minutes.',
      'Impossible travel detected: same badge used in Building A and Building B within 3-minute window, 2.5 miles apart.',
    ],
    sourceType: 'badge_system' as const,
    category: 'physical' as const,
  },
  unauthorized_login: {
    titles: [
      'Multiple failed login attempts detected',
      'Login from impossible travel location',
      'Privilege escalation attempt detected',
      'Service account authentication anomaly',
      'Credential stuffing attack pattern detected',
    ],
    descriptions: [
      'Authentication system detected 15 failed login attempts for user account in 5-minute window. Source IP identified as suspicious.',
      'User account logged in from New York, followed by London login 20 minutes later. Geographic impossibility suggests credential compromise.',
      'Regular user account attempted to access domain controller administrative interface without proper authorization.',
    ],
    sourceType: 'siem' as const,
    category: 'cyber' as const,
  },
  server_room_breach: {
    titles: [
      'Unauthorized server room access detected',
      'Motion sensor triggered in secure area',
      'Temperature anomaly in server room',
      'Physical security breach attempt',
      'Tailgating detected at secure entrance',
    ],
    descriptions: [
      'Environmental sensors detected motion in Server Room 3 without corresponding badge authentication event. Individual spotted on camera without badge visible.',
      'Server room temperature spiked 15°F in 10 minutes. Possible unauthorized hardware installation or cooling system tampering.',
      'Camera footage shows individual following authorized personnel through secure door without badge presentation.',
    ],
    sourceType: 'camera' as const,
    category: 'physical' as const,
  },
  malware_activity: {
    titles: [
      'Ransomware behavior detected on endpoint',
      'Trojan horse quarantined on workstation',
      'Keylogger activity identified',
      'Cryptominer detected consuming resources',
      'Polymorphic malware evading detection',
    ],
    descriptions: [
      'Endpoint Detection and Response (EDR) agent detected ransomware encryption behavior. Files being systematically encrypted with .locked extension.',
      'Heuristic analysis identified trojan horse attempting to establish persistence through scheduled tasks and registry modifications.',
      'Behavioral analysis detected keystroke logging driver being loaded. Potential credential harvesting in progress.',
    ],
    sourceType: 'edr' as const,
    category: 'cyber' as const,
  },
  network_intrusion: {
    titles: [
      'Lateral movement detected in network',
      'Command and control communication identified',
      'Port scanning activity detected',
      'Data staging activity on compromised host',
      'DNS tunneling detected',
    ],
    descriptions: [
      'Network Detection and Response (NDR) identified SMB lateral movement from compromised workstation to file server. Pass-the-hash attack suspected.',
      'Outbound traffic analysis detected communication with known command and control server. Beacon interval suggests Cobalt Strike implant.',
      'Internal host performing rapid port scans across multiple subnets. Port scan pattern suggests reconnaissance activity.',
    ],
    sourceType: 'ndr' as const,
    category: 'cyber' as const,
  },
  phishing_attempt: {
    titles: [
      'Credential harvesting phishing email blocked',
      'Spear phishing targeting executive team',
      'Business email compromise attempt',
      'Malicious link in email attachment',
      'QR code phishing in document',
    ],
    descriptions: [
      'Email security gateway blocked phishing email impersonating IT helpdesk. Email contained link to fake O365 login page for credential harvesting.',
      'Targeted phishing email sent to multiple executives using compromised vendor email account. Email contained reconnaissance questionnaire.',
      'Finance department received invoice from spoofed CEO email requesting urgent wire transfer to attacker-controlled account.',
    ],
    sourceType: 'siem' as const,
    category: 'cyber' as const,
  },
  ransomware_indicator: {
    titles: [
      'Ransomware note detected on system',
      'Mass file modification anomaly',
      'Shadow copy deletion detected',
      'Ransomware extension pattern identified',
      'Backup service disruption attempt',
    ],
    descriptions: [
      'File integrity monitoring detected ransomware readme file (HOW_TO_DECRYPT.txt) created on multiple file shares simultaneously.',
      'File system monitoring detected 10,000+ file modifications in 5 minutes with consistent extension changes. Pattern matches known ransomware.',
      'Volume Shadow Copy service disabled across multiple servers. This is a common ransomware precursor technique.',
    ],
    sourceType: 'edr' as const,
    category: 'cyber' as const,
  },
  insider_threat: {
    titles: [
      'Anomalous data access by departing employee',
      'Bulk data download by privileged user',
      'After-hours access to sensitive files',
      'USB device connected to classified system',
      'Unusual email forwarding rules configured',
    ],
    descriptions: [
      'HR system flagged employee resignation. Behavioral analytics show 500% increase in file downloads since notification. Potential data exfiltration.',
      'Privileged user downloaded entire customer database (2.3GB) outside of normal job function. No change ticket or approval found.',
      'Employee accessing R&D intellectual property files at 3 AM on weekend. Access pattern inconsistent with role and historical behavior.',
    ],
    sourceType: 'siem' as const,
    category: 'insider' as const,
  },
  data_exfiltration: {
    titles: [
      'Large outbound data transfer detected',
      'Cloud storage sync anomaly',
      'Email attachment size anomaly',
      'DNS exfiltration attempt detected',
      'Steganography in image files suspected',
    ],
    descriptions: [
      'Network monitoring detected 5GB outbound transfer to foreign cloud storage service. Transfer initiated outside business hours.',
      'User syncing 15GB of corporate data to personal Dropbox account. Data classification tags indicate sensitive financial information.',
      'Email gateway detected 50MB encrypted attachment to personal email address. Attachment size and encryption inconsistent with normal behavior.',
    ],
    sourceType: 'ndr' as const,
    category: 'cyber' as const,
  },
  privilege_escalation: {
    titles: [
      'Local privilege escalation exploit detected',
      'Service account abuse attempt',
      'Domain admin credential compromise suspected',
      'Group Policy modification detected',
      'Golden ticket attack indicators',
    ],
    descriptions: [
      'EDR detected exploitation of CVE-2024-1234 for local privilege escalation on Windows workstation. Process spawned with SYSTEM privileges.',
      'Service account with domain admin privileges used from unusual workstation. Kerberos ticket anomalies suggest pass-the-ticket attack.',
      'Security event logs show unauthorized modification to Domain Admins group membership. Potentially forged Kerberos tickets detected.',
    ],
    sourceType: 'edr' as const,
    category: 'cyber' as const,
  },
  lateral_movement: {
    titles: [
      'SMB lateral movement detected',
      'RDP hopping pattern identified',
      'WMI remote execution detected',
      'PsExec usage from unusual source',
      'DCOM lateral movement attempt',
    ],
    descriptions: [
      'Network flow analysis shows workstation communicating with 15 other hosts via SMB within 10 minutes. Pass-the-hash attack pattern detected.',
      'RDP session chain identified: User → WS-01 → SRV-01 → SRV-03. Multi-hop pattern suggests lateral movement.',
      'WMI remote process execution detected from compromised workstation to database server. Potential data staging activity.',
    ],
    sourceType: 'ids' as const,
    category: 'cyber' as const,
  },
  credential_theft: {
    titles: [
      'Credential dumping tool detected',
      'LSASS memory access detected',
      'Kerberoasting attack detected',
      'Mimikatz behavior identified',
      'Password spray attack detected',
    ],
    descriptions: [
      'EDR detected credential dumping activity targeting LSASS process. Process memory accessed by suspicious parent process.',
      'Multiple Kerberos TGS requests for service accounts detected within short timeframe. Potential Kerberoasting attack in progress.',
      'Mimikatz signature patterns detected in memory. Credential harvesting module attempting to extract NTLM hashes.',
    ],
    sourceType: 'edr' as const,
    category: 'cyber' as const,
  },
  physical_security: {
    titles: [
      'Tailgating detected at building entrance',
      'Unknown individual in restricted area',
      'Security camera tampering detected',
      'Lock picking attempt on server room',
      'Propped door detected',
    ],
    descriptions: [
      'Video analytics detected unauthorized individual following employee through secured entrance. Individual did not badge in.',
      'Facial recognition system identified unknown individual in executive floor hallway. No badge or visitor credentials detected.',
      'Camera 7 feed interrupted for 15 seconds. Possible tampering or obstruction detected by health monitoring system.',
    ],
    sourceType: 'camera' as const,
    category: 'physical' as const,
  },
  anomalous_behavior: {
    titles: [
      'Behavioral baseline deviation detected',
      'Unusual application usage pattern',
      'Anomalous network traffic pattern',
      'Time-series anomaly in access logs',
      'Peer group deviation detected',
    ],
    descriptions: [
      'UEBA system detected significant deviation from user behavioral baseline. Access patterns, timing, and data volumes are statistically anomalous.',
      'User accessing rare applications outside their normal toolset. Application usage pattern suggests potential account compromise.',
      'Network traffic volume from workstation 300% above peer group average. Data transfer patterns inconsistent with job function.',
    ],
    sourceType: 'siem' as const,
    category: 'insider' as const,
  },
};

// ============================================================
// TAGS DATABASE
// ============================================================

export const eventTags = [
  'apt', 'ransomware', 'phishing', 'insider-threat', 'credential-theft',
  'lateral-movement', 'data-exfiltration', 'c2-communication', 'exploit',
  'reconnaissance', 'persistence', 'privilege-escalation', 'defense-evasion',
  'collection', 'exfiltration', 'impact', 'physical-security', 'anomaly',
  'behavioral-analysis', 'network-anomaly', 'endpoint-anomaly', 'email-threat',
  'malware', 'trojan', 'backdoor', 'rootkit', 'worm', 'apt28', 'apt29',
  'lazarus', 'cobalt-strike', 'mimikatz', 'bloodhound', 'empire',
  'brute-force', 'password-spray', 'credential-stuffing', 'session-hijacking',
  'supply-chain', 'zero-day', 'patch-exploitation', 'misconfiguration',
];

// ============================================================
// MITRE ATT&CK TECHNIQUES
// ============================================================

export const mitreTactics = [
  { tacticId: 'TA0043', name: 'Reconnaissance', description: 'Gathering information to plan future operations' },
  { tacticId: 'TA0042', name: 'Resource Development', description: 'Establishing resources to support operations' },
  { tacticId: 'TA0001', name: 'Initial Access', description: 'Gaining entry to the network' },
  { tacticId: 'TA0002', name: 'Execution', description: 'Running malicious code' },
  { tacticId: 'TA0003', name: 'Persistence', description: 'Maintaining access to systems' },
  { tacticId: 'TA0004', name: 'Privilege Escalation', description: 'Gaining higher-level permissions' },
  { tacticId: 'TA0005', name: 'Defense Evasion', description: 'Avoiding detection' },
  { tacticId: 'TA0006', name: 'Credential Access', description: 'Stealing account credentials' },
  { tacticId: 'TA0007', name: 'Discovery', description: 'Mapping the environment' },
  { tacticId: 'TA0008', name: 'Lateral Movement', description: 'Moving through the network' },
  { tacticId: 'TA0009', name: 'Collection', description: 'Gathering target data' },
  { tacticId: 'TA0011', name: 'Command and Control', description: 'Communicating with compromised systems' },
  { tacticId: 'TA0010', name: 'Exfiltration', description: 'Stealing data' },
  { tacticId: 'TA0040', name: 'Impact', description: 'Disrupting availability or integrity' },
];

export const mitreTechniques = [
  { techniqueId: 'T1566', name: 'Phishing', tacticId: 'TA0001' },
  { techniqueId: 'T1190', name: 'Exploit Public-Facing Application', tacticId: 'TA0001' },
  { techniqueId: 'T1078', name: 'Valid Accounts', tacticId: 'TA0001' },
  { techniqueId: 'T1059', name: 'Command and Scripting Interpreter', tacticId: 'TA0002' },
  { techniqueId: 'T1053', name: 'Scheduled Task/Job', tacticId: 'TA0003' },
  { techniqueId: 'T1547', name: 'Boot or Logon Autostart Execution', tacticId: 'TA0003' },
  { techniqueId: 'T1068', name: 'Exploitation for Privilege Escalation', tacticId: 'TA0004' },
  { techniqueId: 'T1548', name: 'Abuse Elevation Control Mechanism', tacticId: 'TA0004' },
  { techniqueId: 'T1027', name: 'Obfuscated Files or Information', tacticId: 'TA0005' },
  { techniqueId: 'T1070', name: 'Indicator Removal', tacticId: 'TA0005' },
  { techniqueId: 'T1003', name: 'OS Credential Dumping', tacticId: 'TA0006' },
  { techniqueId: 'T1110', name: 'Brute Force', tacticId: 'TA0006' },
  { techniqueId: 'T1087', name: 'Account Discovery', tacticId: 'TA0007' },
  { techniqueId: 'T1018', name: 'Remote System Discovery', tacticId: 'TA0007' },
  { techniqueId: 'T1021', name: 'Remote Services', tacticId: 'TA0008' },
  { techniqueId: 'T1570', name: 'Lateral Tool Transfer', tacticId: 'TA0008' },
  { techniqueId: 'T1005', name: 'Data from Local System', tacticId: 'TA0009' },
  { techniqueId: 'T1560', name: 'Archive Collected Data', tacticId: 'TA0009' },
  { techniqueId: 'T1071', name: 'Application Layer Protocol', tacticId: 'TA0011' },
  { techniqueId: 'T1572', name: 'Protocol Tunneling', tacticId: 'TA0011' },
  { techniqueId: 'T1041', name: 'Exfiltration Over C2 Channel', tacticId: 'TA0010' },
  { techniqueId: 'T1048', name: 'Exfiltration Over Alternative Protocol', tacticId: 'TA0010' },
  { techniqueId: 'T1486', name: 'Data Encrypted for Impact', tacticId: 'TA0040' },
  { techniqueId: 'T1489', name: 'Service Stop', tacticId: 'TA0040' },
];

// ============================================================
// THREAT CAMPAIGNS
// ============================================================

export const threatCampaigns = [
  {
    campaignId: 'CAMP-001',
    name: 'Operation Shadow Vault',
    threatActor: 'APT-29 (Cozy Bear)',
    sophistication: 'expert' as const,
    targets: ['Finance', 'Executive', 'IT Infrastructure'],
    objectives: ['Intellectual property theft', 'Financial fraud', 'Long-term persistence'],
  },
  {
    campaignId: 'CAMP-002',
    name: 'Red Dragon Rising',
    threatActor: 'Lazarus Group',
    sophistication: 'advanced' as const,
    targets: ['Finance', 'Cryptocurrency', 'Technology'],
    objectives: ['Cryptocurrency theft', 'Espionage', 'Destruction of evidence'],
  },
  {
    campaignId: 'CAMP-003',
    name: 'Insider Risk Alpha',
    threatActor: 'Malicious Insider',
    sophistication: 'intermediate' as const,
    targets: ['Engineering', 'R&D', 'IP Assets'],
    objectives: ['Data theft', 'Competitive advantage', 'Revenge'],
  },
  {
    campaignId: 'CAMP-004',
    name: 'Frostbite Campaign',
    threatActor: 'APT-28 (Fancy Bear)',
    sophistication: 'advanced' as const,
    targets: ['Government', 'Defense', 'Critical Infrastructure'],
    objectives: ['Espionage', 'Disruption', 'Influence operations'],
  },
  {
    campaignId: 'CAMP-005',
    name: 'Ghost Protocol',
    threatActor: 'Unknown (Emerging)',
    sophistication: 'emerging' as const,
    targets: ['IT Security', 'SOC', 'Detection Systems'],
    objectives: ['Detection evasion', 'Tool development', 'Reconnaissance'],
  },
];

// ============================================================
// ATTACK CHAIN SEQUENCES
// ============================================================

export const attackChains = [
  {
    name: 'Ransomware Attack',
    phases: [
      { killChainPhase: 'reconnaissance' as const, eventType: 'network_intrusion' as const, attackVector: 'network' as const },
      { killChainPhase: 'weaponization' as const, eventType: 'malware_activity' as const, attackVector: 'email' as const },
      { killChainPhase: 'delivery' as const, eventType: 'phishing_attempt' as const, attackVector: 'email' as const },
      { killChainPhase: 'exploitation' as const, eventType: 'malware_activity' as const, attackVector: 'email' as const },
      { killChainPhase: 'installation' as const, eventType: 'malware_activity' as const, attackVector: 'network' as const },
      { killChainPhase: 'command_control' as const, eventType: 'network_intrusion' as const, attackVector: 'network' as const },
      { killChainPhase: 'actions_objectives' as const, eventType: 'ransomware_indicator' as const, attackVector: 'network' as const },
    ],
  },
  {
    name: 'Insider Data Theft',
    phases: [
      { killChainPhase: 'reconnaissance' as const, eventType: 'anomalous_behavior' as const, attackVector: 'insider' as const },
      { killChainPhase: 'collection' as const, eventType: 'insider_threat' as const, attackVector: 'insider' as const },
      { killChainPhase: 'exfiltration' as const, eventType: 'data_exfiltration' as const, attackVector: 'insider' as const },
    ],
  },
  {
    name: 'Credential Compromise',
    phases: [
      { killChainPhase: 'reconnaissance' as const, eventType: 'network_intrusion' as const, attackVector: 'network' as const },
      { killChainPhase: 'credential_access' as const, eventType: 'credential_theft' as const, attackVector: 'network' as const },
      { killChainPhase: 'lateral_movement' as const, eventType: 'lateral_movement' as const, attackVector: 'network' as const },
      { killChainPhase: 'privilege_escalation' as const, eventType: 'privilege_escalation' as const, attackVector: 'network' as const },
    ],
  },
  {
    name: 'Physical Breach',
    phases: [
      { killChainPhase: 'reconnaissance' as const, eventType: 'physical_security' as const, attackVector: 'physical' as const },
      { killChainPhase: 'initial_access' as const, eventType: 'abnormal_badge_access' as const, attackVector: 'physical' as const },
      { killChainPhase: 'lateral_movement' as const, eventType: 'server_room_breach' as const, attackVector: 'physical' as const },
    ],
  },
];

// ============================================================
// IOCS (Indicators of Compromise)
// ============================================================

export const suspiciousIPs = [
  '185.220.101.34', '45.33.32.156', '198.51.100.23', '103.224.182.251',
  '176.111.174.26', '91.215.85.142', '195.176.3.23', '185.100.87.41',
  '23.129.64.100', '104.244.72.115', '171.25.193.9', '62.102.148.68',
];

export const maliciousDomains = [
  'evil-phishing.com', 'malware-c2.net', 'data-steal.org', 'ransom-pay.biz',
  'apt-callback.ru', 'darkleech.cc', 'exploit-kit.info', 'botnet-ctrl.xyz',
  'credential-harvest.top', 'exfil-server.com', 'backdoor-drop.net', 'keylogger-host.org',
];

export const maliciousFileHashes = [
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  'a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a',
  '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
  '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  'd41d8cd98f00b204e9800998ecf8427e',
];
