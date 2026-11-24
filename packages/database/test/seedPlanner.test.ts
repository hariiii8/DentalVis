// packages/database/test/seedPlanner.test.ts
// Architecture Baseline v1.9.1 — Phase B3.4.3 Seed Planning & Safeguards Test Suite

import { describe, expect, it, vi } from 'vitest';
import {
  ALLOWED_DEVELOPMENT_DATABASES,
  ALLOWED_DEVELOPMENT_HOSTS,
  ALLOWED_DEVELOPMENT_PORTS,
  ALLOWED_DEVELOPMENT_USERS,
  buildDesiredSeedPayload,
  classifyPrismaError,
  computeSnapshotContentHash,
  DatabaseConnectivityError,
  DatabaseIdentity,
  DENTALVIS_SEED_ADVISORY_LOCK_BIGINT,
  executeSeed,
  inspectDatabaseIdentity,
  isAuthorizedDevelopmentAddress,
  isIpInCidr,
  isSubnetInRfc1918,
  planSeed,
  SeedCliOptions,
  SYSTEM_AUTHOR_EMAIL,
  SYSTEM_AUTHOR_ID,
  SYSTEM_AUTHOR_PASSWORD_SENTINEL,
  validateDatabaseIdentity,
} from '../src/seed';

describe('Seed Planning & Catalogue Payload Verification', () => {
  it('builds exact reconciled catalogue payload counts', () => {
    const payload = buildDesiredSeedPayload();

    expect(payload.departments).toHaveLength(15);
    expect(payload.exploreCategories).toHaveLength(6);
    expect(payload.procedures).toHaveLength(48);

    // Relationships verification (100 procedure-department relationships after adding SLPA to custom-night-guard-bruxism; 65 category relationships after M6.7 integrity alignment)
    expect(payload.totalExpectedProcedureDepartments).toBe(100);
    expect(payload.totalExpectedProcedureExploreCategories).toBe(65);
    expect(payload.totalExpectedTranslations).toBe(96);
    expect(payload.totalExpectedRevisions).toBe(96);
  });

  it('preserves reconciled category tags in snapshotData and foreign keys', () => {
    const payload = buildDesiredSeedPayload();

    // 1. Check reconciled procedure: pediatric-pulpotomy
    const pulpotomy = payload.procedures.find((p) => p.slug === 'pediatric-pulpotomy');
    expect(pulpotomy).toBeDefined();
    expect(pulpotomy?.canonicalExploreCategorySlugs).toEqual(['pain-and-sensitivity']);
    expect(pulpotomy?.rawExploreCategorySlugs).toEqual(['pain-and-sensitivity']);
    expect(pulpotomy?.snapshotDataEn.exploreCategorySlugs).toEqual([
      'pain-and-sensitivity',
    ]);

    // 2. Check mixed procedure: gingival-recontouring
    const recontouring = payload.procedures.find((p) => p.slug === 'gingival-recontouring');
    expect(recontouring).toBeDefined();
    expect(recontouring?.canonicalExploreCategorySlugs).toEqual(['dental-appearance', 'gums-and-bleeding']);
    expect(recontouring?.rawExploreCategorySlugs).toEqual([
      'dental-appearance',
      'gums-and-bleeding',
    ]);
  });

  it('guarantees complete English and Tamil translation separation', () => {
    const payload = buildDesiredSeedPayload();

    for (const proc of payload.procedures) {
      expect(proc.titleEn).toBeTruthy();
      expect(proc.titleTa).toBeTruthy();
      expect(proc.summaryEn).toBeTruthy();
      expect(proc.summaryTa).toBeTruthy();
      expect(proc.overviewHtmlEn).toBeTruthy();
      expect(proc.overviewHtmlTa).toBeTruthy();

      // Ensure distinct scripts
      expect(proc.titleEn).not.toEqual(proc.titleTa);
      expect(proc.summaryEn).not.toEqual(proc.summaryTa);

      // Verify hashes are calculated and distinct
      expect(proc.contentHashEn).toHaveLength(64);
      expect(proc.contentHashTa).toHaveLength(64);
      expect(proc.contentHashEn).not.toEqual(proc.contentHashTa);
    }
  });

  it('computes deterministic RFC 8785-like snapshot content hashes', () => {
    const objA = { b: 2, a: 1, c: { y: 'bar', x: 'foo' } };
    const objB = { a: 1, c: { x: 'foo', y: 'bar' }, b: 2 };

    const hashA = computeSnapshotContentHash(objA);
    const hashB = computeSnapshotContentHash(objB);

    expect(hashA).toBe(hashB);
    expect(hashA).toHaveLength(64);
  });

  it('verifies dedicated inactive system author identity constants', () => {
    expect(SYSTEM_AUTHOR_ID).toBe('00000000-0000-4000-a000-000000000001');
    expect(SYSTEM_AUTHOR_EMAIL).toBe('system-migration@dentalvis.internal');
    expect(SYSTEM_AUTHOR_PASSWORD_SENTINEL).toContain('DISABLED_SYSTEM_ACCOUNT');
    expect(SYSTEM_AUTHOR_PASSWORD_SENTINEL).not.toContain('$2a$');
    expect(SYSTEM_AUTHOR_PASSWORD_SENTINEL).not.toContain('$argon2');
  });
});

describe('Database Identity Verification Suite (B3.4.5 Exact Network Trust Boundary)', () => {
  const validIdentity: DatabaseIdentity = {
    currentDatabase: 'dentalvis_dev',
    currentUser: 'dentalvis_user',
    serverAddr: '127.0.0.1',
    serverPort: 5432,
  };

  it('accepts valid authorized local development database identity on loopback (127.0.0.1, ::1, localhost)', () => {
    expect(isAuthorizedDevelopmentAddress('127.0.0.1').isAuthorized).toBe(true);
    expect(isAuthorizedDevelopmentAddress('::1').isAuthorized).toBe(true);
    expect(isAuthorizedDevelopmentAddress('localhost').isAuthorized).toBe(true);

    const result = validateDatabaseIdentity(validIdentity);
    expect(result.isValid).toBe(true);
    expect(result.rejectionReason).toBeUndefined();
  });

  it('accepts address within explicitly configured DENTALVIS_DOCKER_SUBNET', () => {
    const configuredSubnet = '172.20.0.0/16';
    expect(isAuthorizedDevelopmentAddress('172.20.0.2', configuredSubnet).isAuthorized).toBe(true);
    expect(isAuthorizedDevelopmentAddress('172.20.254.254', configuredSubnet).isAuthorized).toBe(true);

    const dockerIdentity: DatabaseIdentity = {
      ...validIdentity,
      serverAddr: '172.20.0.5',
    };
    const result = validateDatabaseIdentity(dockerIdentity, configuredSubnet);
    expect(result.isValid).toBe(true);
    expect(result.rejectionReason).toBeUndefined();
  });

  it('rejects addresses outside explicitly configured DENTALVIS_DOCKER_SUBNET', () => {
    const configuredSubnet = '172.20.0.0/16';
    expect(isAuthorizedDevelopmentAddress('172.21.0.2', configuredSubnet).isAuthorized).toBe(false);
    expect(isAuthorizedDevelopmentAddress('172.18.0.2', configuredSubnet).isAuthorized).toBe(false);
    expect(isAuthorizedDevelopmentAddress('10.0.0.1', configuredSubnet).isAuthorized).toBe(false);
    expect(isAuthorizedDevelopmentAddress('192.168.1.1', configuredSubnet).isAuthorized).toBe(false);

    const outsideIdentity: DatabaseIdentity = {
      ...validIdentity,
      serverAddr: '172.21.0.5',
    };
    const result = validateDatabaseIdentity(outsideIdentity, configuredSubnet);
    expect(result.isValid).toBe(false);
    expect(result.rejectionReason).toContain("does not belong to the explicitly configured DentalVis Docker subnet (172.20.0.0/16)");
  });

  it('fails closed when DENTALVIS_DOCKER_SUBNET is absent and address is not loopback', () => {
    // Neither loopback nor configured subnet -> must fail closed
    expect(isAuthorizedDevelopmentAddress('172.20.0.5', undefined).isAuthorized).toBe(false);
    expect(isAuthorizedDevelopmentAddress('172.17.0.1', undefined).isAuthorized).toBe(false);

    const dockerIdentity: DatabaseIdentity = {
      ...validIdentity,
      serverAddr: '172.20.0.5',
    };
    const result = validateDatabaseIdentity(dockerIdentity, undefined);
    expect(result.isValid).toBe(false);
    expect(result.rejectionReason).toContain('no explicit DENTALVIS_DOCKER_SUBNET is configured. Fails closed');
  });

  it('fails closed on null, undefined, or empty serverAddr', () => {
    expect(isAuthorizedDevelopmentAddress(null).isAuthorized).toBe(false);
    expect(isAuthorizedDevelopmentAddress(undefined).isAuthorized).toBe(false);
    expect(isAuthorizedDevelopmentAddress('').isAuthorized).toBe(false);

    const nullIdentity: DatabaseIdentity = {
      ...validIdentity,
      serverAddr: null,
    };
    const result = validateDatabaseIdentity(nullIdentity);
    expect(result.isValid).toBe(false);
    expect(result.rejectionReason).toContain('Server address is missing or unverifiable (null/empty)');
  });

  it('rejects malformed IPv4 addresses', () => {
    expect(isAuthorizedDevelopmentAddress('172.20.0.256', '172.20.0.0/16').isAuthorized).toBe(false);
    expect(isAuthorizedDevelopmentAddress('172.20.01.1', '172.20.0.0/16').isAuthorized).toBe(false);
    expect(isAuthorizedDevelopmentAddress('172.20.0', '172.20.0.0/16').isAuthorized).toBe(false);
    expect(isAuthorizedDevelopmentAddress('172.20.0.0.1', '172.20.0.0/16').isAuthorized).toBe(false);
    expect(isAuthorizedDevelopmentAddress('not.an.ip.address', '172.20.0.0/16').isAuthorized).toBe(false);
  });

  describe('CIDR Parser & Normalization Verification (B3.4.6 & B3.4.7 Security Policy)', () => {
    const testSubnet = '172.20.0.0/16';

    it('verifies exact boundary addresses (first, last, and immediate outside)', () => {
      // First address in 172.20.0.0/16
      expect(isIpInCidr('172.20.0.0', testSubnet)).toBe(true);
      // First usable host in 172.20.0.0/16
      expect(isIpInCidr('172.20.0.1', testSubnet)).toBe(true);
      // Last usable host in 172.20.0.0/16
      expect(isIpInCidr('172.20.255.254', testSubnet)).toBe(true);
      // Broadcast address in 172.20.0.0/16
      expect(isIpInCidr('172.20.255.255', testSubnet)).toBe(true);

      // Immediately preceding outside address
      expect(isIpInCidr('172.19.255.255', testSubnet)).toBe(false);
      // Immediately succeeding outside address
      expect(isIpInCidr('172.21.0.0', testSubnet)).toBe(false);
    });

    it('enforces permitted prefix bounds: accepts /16, /24, /30; rejects /15, /31, /32', () => {
      // Permitted prefixes (/16 through /30)
      expect(isIpInCidr('172.20.0.1', '172.20.0.0/16')).toBe(true);
      expect(isIpInCidr('172.20.10.5', '172.20.10.0/24')).toBe(true);
      expect(isIpInCidr('172.20.10.1', '172.20.10.0/30')).toBe(true);

      // Prohibited prefix lengths (<16 or >30)
      expect(isIpInCidr('172.20.0.1', '172.20.0.0/15')).toBe(false);
      expect(isIpInCidr('172.20.10.1', '172.20.10.0/31')).toBe(false);
      expect(isIpInCidr('172.20.5.10', '172.20.5.10/32')).toBe(false);
    });

    it('strictly rejects overly broad prefixes such as 0.0.0.0/0 and 10.0.0.0/8', () => {
      expect(isIpInCidr('1.2.3.4', '0.0.0.0/0')).toBe(false);
      expect(isIpInCidr('10.0.0.1', '10.0.0.0/8')).toBe(false);
      expect(isIpInCidr('10.0.0.1', '10.0.0.0/12')).toBe(false);
    });

    it('rejects invalid or out-of-range prefix lengths', () => {
      expect(isIpInCidr('172.20.0.1', '172.20.0.0/33')).toBe(false);
      expect(isIpInCidr('172.20.0.1', '172.20.0.0/-1')).toBe(false);
      expect(isIpInCidr('172.20.0.1', '172.20.0.0/abc')).toBe(false);
      expect(isIpInCidr('172.20.0.1', '172.20.0.0/016')).toBe(false); // Leading zero in prefix rejected
    });

    it('rejects unnormalized CIDR where host bits are set in the network portion', () => {
      // In a /16, the last two octets are host bits. If host bits are non-zero, it is unnormalized and must be rejected
      expect(isIpInCidr('172.20.0.5', '172.20.1.0/16')).toBe(false);
      expect(isIpInCidr('172.20.0.5', '172.20.0.1/16')).toBe(false);
    });

    it('rejects malformed, empty, or non-string CIDR expressions', () => {
      expect(isIpInCidr('172.20.0.1', '')).toBe(false);
      expect(isIpInCidr('172.20.0.1', '   ')).toBe(false);
      expect(isIpInCidr('172.20.0.1', '172.20.0.0')).toBe(false); // Missing slash
      expect(isIpInCidr('172.20.0.1', '172.20.0.0/16/extra')).toBe(false); // Multiple slashes
      expect(isIpInCidr('172.20.0.1', '172.20.0.0/')).toBe(false); // Missing prefix
      expect(isIpInCidr('172.20.0.1', '/16')).toBe(false); // Missing network
      expect(isIpInCidr('172.20.0.1', null as any)).toBe(false);
      expect(isIpInCidr('172.20.0.1', undefined as any)).toBe(false);
    });

    it('fails closed in validateDatabaseIdentity when configured subnet uses disallowed prefix', () => {
      const dockerIdentity: DatabaseIdentity = {
        ...validIdentity,
        serverAddr: '172.20.0.5',
      };
      // Overly broad /8
      const broadResult = validateDatabaseIdentity(dockerIdentity, '172.0.0.0/8');
      expect(broadResult.isValid).toBe(false);
      expect(broadResult.rejectionReason).toContain('prefix /8 is not permitted');

      // Disallowed /32
      const hostResult = validateDatabaseIdentity(dockerIdentity, '172.20.0.5/32');
      expect(hostResult.isValid).toBe(false);
      expect(hostResult.rejectionReason).toContain('prefix /32 is not permitted');
    });

    describe('RFC1918 Private Network Restriction Suite (Phase B3.4.8)', () => {
      it('accepts explicitly configured subnets entirely contained within RFC1918 private spaces', () => {
        // 10.0.0.0/8 children
        expect(isSubnetInRfc1918('10.20.0.0/16')).toBe(true);
        expect(isSubnetInRfc1918('10.20.10.0/24')).toBe(true);
        expect(isAuthorizedDevelopmentAddress('10.20.0.5', '10.20.0.0/16').isAuthorized).toBe(true);
        expect(isAuthorizedDevelopmentAddress('10.20.10.5', '10.20.10.0/24').isAuthorized).toBe(true);

        // 172.16.0.0/12 children (172.16.x.x - 172.31.x.x)
        expect(isSubnetInRfc1918('172.20.0.0/16')).toBe(true);
        expect(isSubnetInRfc1918('172.20.10.0/24')).toBe(true);
        expect(isSubnetInRfc1918('172.16.0.0/16')).toBe(true);
        expect(isSubnetInRfc1918('172.31.255.0/24')).toBe(true);
        expect(isAuthorizedDevelopmentAddress('172.20.0.5', '172.20.0.0/16').isAuthorized).toBe(true);
        expect(isAuthorizedDevelopmentAddress('172.20.10.5', '172.20.10.0/24').isAuthorized).toBe(true);

        // 192.168.0.0/16 children
        expect(isSubnetInRfc1918('192.168.0.0/16')).toBe(true);
        expect(isSubnetInRfc1918('192.168.10.0/24')).toBe(true);
        expect(isAuthorizedDevelopmentAddress('192.168.10.5', '192.168.10.0/24').isAuthorized).toBe(true);
      });

      it('strictly rejects public IPv4 address spaces', () => {
        expect(isSubnetInRfc1918('8.8.0.0/16')).toBe(false);
        expect(isSubnetInRfc1918('1.2.3.0/24')).toBe(false);
        expect(isSubnetInRfc1918('203.0.113.0/24')).toBe(false);

        const publicResult = validateDatabaseIdentity(
          { ...validIdentity, serverAddr: '8.8.0.5' },
          '8.8.0.0/16'
        );
        expect(publicResult.isValid).toBe(false);
        expect(publicResult.rejectionReason).toContain('is not contained within RFC1918 private IPv4 space');
      });

      it('strictly rejects non-RFC1918 reserved, loopback, link-local, and multicast ranges', () => {
        expect(isSubnetInRfc1918('127.0.0.0/16')).toBe(false); // Loopback
        expect(isSubnetInRfc1918('169.254.0.0/16')).toBe(false); // Link-local
        expect(isSubnetInRfc1918('224.0.0.0/16')).toBe(false); // Multicast

        const loopbackSubnetResult = validateDatabaseIdentity(
          { ...validIdentity, serverAddr: '127.0.0.5' },
          '127.0.0.0/16'
        );
        expect(loopbackSubnetResult.isValid).toBe(false);
        expect(loopbackSubnetResult.rejectionReason).toContain('is not contained within RFC1918 private IPv4 space');
      });

      it('strictly rejects subnets immediately outside RFC1918 boundaries', () => {
        expect(isSubnetInRfc1918('172.15.0.0/16')).toBe(false); // Below 172.16.0.0
        expect(isSubnetInRfc1918('172.32.0.0/16')).toBe(false); // Above 172.31.255.255
        expect(isSubnetInRfc1918('192.167.0.0/16')).toBe(false); // Below 192.168.0.0
        expect(isSubnetInRfc1918('192.169.0.0/16')).toBe(false); // Above 192.168.255.255
        expect(isSubnetInRfc1918('9.255.0.0/16')).toBe(false); // Below 10.0.0.0
        expect(isSubnetInRfc1918('11.0.0.0/16')).toBe(false); // Above 10.255.255.255
      });

      it('strictly rejects private subnets that cross the boundary of their permitted RFC1918 range', () => {
        // e.g. 172.31.0.0/15 crosses into 172.32.x.x
        expect(isSubnetInRfc1918('172.31.0.0/15')).toBe(false);
        // e.g. 192.168.0.0/15 crosses into 192.169.x.x
        expect(isSubnetInRfc1918('192.168.0.0/15')).toBe(false);
      });

      it('verifies that addresses inside a valid configured RFC1918 subnet pass and outside fail', () => {
        const subnet = '10.20.0.0/16';
        expect(isAuthorizedDevelopmentAddress('10.20.0.1', subnet).isAuthorized).toBe(true);
        expect(isAuthorizedDevelopmentAddress('10.20.255.254', subnet).isAuthorized).toBe(true);
        expect(isAuthorizedDevelopmentAddress('10.21.0.1', subnet).isAuthorized).toBe(false);
        expect(isAuthorizedDevelopmentAddress('172.20.0.1', subnet).isAuthorized).toBe(false);
      });
    });
  });

  it('rejects unexpected database names', () => {
    const invalid = { ...validIdentity, currentDatabase: 'production_dental' };
    const result = validateDatabaseIdentity(invalid);
    expect(result.isValid).toBe(false);
    expect(result.rejectionReason).toContain("Database 'production_dental' is not an authorized");
  });

  it('enforces dedicated dentalvis_user and strictly rejects superusers (postgres, root)', () => {
    const superuserRoot = { ...validIdentity, currentUser: 'root' };
    const resultRoot = validateDatabaseIdentity(superuserRoot);
    expect(resultRoot.isValid).toBe(false);
    expect(resultRoot.rejectionReason).toContain('Must use dedicated development user');

    const superuserPostgres = { ...validIdentity, currentUser: 'postgres' };
    const resultPostgres = validateDatabaseIdentity(superuserPostgres);
    expect(resultPostgres.isValid).toBe(false);
    expect(resultPostgres.rejectionReason).toContain('Superuser connections are prohibited');
  });

  it('rejects unexpected database ports', () => {
    const invalid = { ...validIdentity, serverPort: 5433 };
    const result = validateDatabaseIdentity(invalid);
    expect(result.isValid).toBe(false);
    expect(result.rejectionReason).toContain('port 5433 is not the expected');
  });

  it('rejects remote database hosts outside local and configured Docker networks', () => {
    const invalid = { ...validIdentity, serverAddr: '198.51.100.24' };
    const result = validateDatabaseIdentity(invalid, '172.20.0.0/16');
    expect(result.isValid).toBe(false);
    expect(result.rejectionReason).toContain("does not belong to the explicitly configured DentalVis Docker subnet (172.20.0.0/16)");
  });
});

describe('Connectivity & Diagnostic Error Handling Suite', () => {
  it('classifies unreachable PostgreSQL error as NOT_RUNNING with actionable diagnostic', () => {
    const error = new Error("Can't reach database server at `localhost:5432`");
    const classified = classifyPrismaError(error);
    expect(classified).toBeInstanceOf(DatabaseConnectivityError);
    expect(classified.reason).toBe('NOT_RUNNING');
    expect(classified.message).toContain('PostgreSQL server is not reachable at localhost:5432');
  });

  it('classifies authentication failure as AUTH_FAILED', () => {
    const error = new Error('password authentication failed for user dentalvis_user');
    const classified = classifyPrismaError(error);
    expect(classified.reason).toBe('AUTH_FAILED');
    expect(classified.message).toContain('PostgreSQL authentication failed');
  });

  it('classifies missing database error as CONNECTION_REFUSED', () => {
    const error = new Error('database "dentalvis_unknown" does not exist');
    const classified = classifyPrismaError(error);
    expect(classified.reason).toBe('CONNECTION_REFUSED');
    expect(classified.message).toContain('Target database does not exist');
  });
});

describe('Read-Only Seed Planning Execution', () => {
  it('executes planning in purely read-only mode and reports creates on empty database', async () => {
    const mockPrisma: any = {
      $queryRaw: vi.fn().mockResolvedValue([
        {
          current_database: 'dentalvis_dev',
          current_user: 'dentalvis_user',
          inet_server_addr: '127.0.0.1',
          inet_server_port: 5432,
        },
      ]),
      user: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
      department: {
        findMany: vi.fn().mockResolvedValue([]),
      },
      exploreCategory: {
        findMany: vi.fn().mockResolvedValue([]),
      },
      procedure: {
        findMany: vi.fn().mockResolvedValue([]),
      },
    };

    const plan = await planSeed(mockPrisma);

    expect(plan.mode).toBe('plan');
    expect(plan.systemAuthorStatus).toBe('NEEDS_CREATION');
    expect(plan.departments.toCreate).toBe(15);
    expect(plan.exploreCategories.toCreate).toBe(6);
    expect(plan.procedures.toCreate).toBe(48);
    expect(plan.procedureDepartments.toCreate).toBe(100);
    expect(plan.procedureExploreCategories.toCreate).toBe(65);
    expect(plan.translations.toCreate).toBe(96);
    expect(plan.revisions.toCreate).toBe(96);
    expect(plan.conflicts).toHaveLength(0);
    expect(plan.isExecutable).toBe(true);

    // Verify zero write calls were invoked
    expect(mockPrisma.procedure.create).toBeUndefined();
    expect(mockPrisma.procedure.update).toBeUndefined();
    expect(mockPrisma.procedure.upsert).toBeUndefined();
  });

  it('detects identity mismatch conflicts when slug matches but UUID differs', async () => {
    const mockPrisma: any = {
      $queryRaw: vi.fn().mockResolvedValue([
        {
          current_database: 'dentalvis_dev',
          current_user: 'dentalvis_user',
          inet_server_addr: '127.0.0.1',
          inet_server_port: 5432,
        },
      ]),
      user: { findUnique: vi.fn().mockResolvedValue(null) },
      department: { findMany: vi.fn().mockResolvedValue([]) },
      exploreCategory: { findMany: vi.fn().mockResolvedValue([]) },
      procedure: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: '99999999-9999-9999-9999-999999999999', // Differing UUID
            slug: 'root-canal-treatment',
            code: 'ENDO-RCT-01',
            departments: [],
            exploreCategories: [],
            translations: [],
          },
        ]),
      },
    };

    const plan = await planSeed(mockPrisma);

    expect(plan.isExecutable).toBe(false);
    expect(plan.conflicts.some((c) => c.type === 'IDENTITY_MISMATCH')).toBe(true);
  });

  it('detects existing published state and manual revision modifications as warnings', async () => {
    const mockPrisma: any = {
      $queryRaw: vi.fn().mockResolvedValue([
        {
          current_database: 'dentalvis_dev',
          current_user: 'dentalvis_user',
          inet_server_addr: '127.0.0.1',
          inet_server_port: 5432,
        },
      ]),
      user: { findUnique: vi.fn().mockResolvedValue({ id: SYSTEM_AUTHOR_ID, isActive: false }) },
      department: { findMany: vi.fn().mockResolvedValue([{ id: 'd1', code: 'ENDO' }]) },
      exploreCategory: { findMany: vi.fn().mockResolvedValue([{ id: 'c1', slug: 'pain-and-sensitivity' }]) },
      procedure: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: '33333333-3333-4333-a333-333333333301',
            slug: 'root-canal-treatment',
            code: 'ENDO-RCT-01',
            departments: [{ departmentId: 'd1', isPrimary: true }],
            exploreCategories: [{ exploreCategoryId: 'c1' }],
            translations: [
              {
                language: 'en',
                currentStatus: 'PUBLISHED',
                publishedRevisionId: 'rev-uuid-1',
                revisions: [
                  {
                    id: 'rev-uuid-1',
                    revisionNumber: 1,
                    contentHash: 'custom-editorial-hash-different',
                    authorId: 'doctor-user-id',
                  },
                  {
                    id: 'rev-uuid-2',
                    revisionNumber: 2,
                    contentHash: 'second-rev-hash',
                    authorId: 'doctor-user-id',
                  },
                ],
              },
            ],
          },
        ]),
      },
    };

    const plan = await planSeed(mockPrisma);

    expect(plan.isExecutable).toBe(true);
    expect(plan.conflicts.some((c) => c.type === 'ALREADY_PUBLISHED')).toBe(true);
    expect(plan.conflicts.some((c) => c.type === 'MANUAL_REVISION_MODIFIED')).toBe(true);
    expect(plan.conflicts.some((c) => c.type === 'HIGHER_REVISION_EXISTS')).toBe(true);
  });
});

describe('Execution Safeguards & Advisory Lock Verification (B3.4.3)', () => {
  it('blocks execution when mode is not execute', async () => {
    const mockPrisma: any = {};
    const options: SeedCliOptions = {
      mode: 'plan',
      allowSeedEnv: true,
      isProduction: false,
      yes: false,
    };

    await expect(executeSeed(mockPrisma, options)).rejects.toThrow(
      'Cannot execute seed when mode is not "execute".'
    );
  });

  it('blocks execution when DENTALVIS_ALLOW_SEED=true is missing', async () => {
    const mockPrisma: any = {};
    const options: SeedCliOptions = {
      mode: 'execute',
      allowSeedEnv: false,
      isProduction: false,
      yes: true,
    };

    await expect(executeSeed(mockPrisma, options)).rejects.toThrow(
      'DENTALVIS_ALLOW_SEED=true environment variable is required.'
    );
  });

  it('blocks execution when in production environment', async () => {
    const mockPrisma: any = {};
    const options: SeedCliOptions = {
      mode: 'execute',
      allowSeedEnv: true,
      isProduction: true,
      yes: true,
    };

    await expect(executeSeed(mockPrisma, options)).rejects.toThrow(
      'Seed execution is strictly prohibited in production environment.'
    );
  });

  it('blocks execution when database identity validation fails', async () => {
    const mockPrisma: any = {
      $queryRaw: vi.fn().mockResolvedValue([
        {
          current_database: 'dentalvis_prod',
          current_user: 'admin',
          inet_server_addr: '54.210.12.34', // Remote IP
          inet_server_port: 5432,
        },
      ]),
      user: { findUnique: vi.fn().mockResolvedValue(null) },
      department: { findMany: vi.fn().mockResolvedValue([]) },
      exploreCategory: { findMany: vi.fn().mockResolvedValue([]) },
      procedure: { findMany: vi.fn().mockResolvedValue([]) },
    };

    const options: SeedCliOptions = {
      mode: 'execute',
      allowSeedEnv: true,
      isProduction: false,
      yes: true,
    };

    await expect(executeSeed(mockPrisma, options)).rejects.toThrow(
      'Database identity rejected'
    );
  });

  it('acquires pg_advisory_xact_lock with BigInt inside transaction BEFORE any seed mutations', async () => {
    const executionOrder: string[] = [];

    const mockTx: any = {
      $queryRaw: vi.fn().mockImplementation((query) => {
        executionOrder.push('advisory_lock');
        return Promise.resolve([{ pg_advisory_xact_lock: '' }]);
      }),
      user: {
        upsert: vi.fn().mockImplementation(() => {
          executionOrder.push('user_upsert');
          return Promise.resolve({ id: SYSTEM_AUTHOR_ID });
        }),
      },
      department: {
        upsert: vi.fn().mockImplementation((args) => {
          executionOrder.push(`dept_${args.where.code}`);
          return Promise.resolve({ id: 'dept-id' });
        }),
      },
      exploreCategory: {
        upsert: vi.fn().mockImplementation((args) => {
          executionOrder.push(`cat_${args.where.slug}`);
          return Promise.resolve({ id: 'cat-id' });
        }),
      },
      procedure: {
        upsert: vi.fn().mockImplementation((args) => {
          executionOrder.push(`proc_${args.where.slug}`);
          return Promise.resolve({ id: 'proc-id' });
        }),
      },
      procedureDepartment: { upsert: vi.fn().mockResolvedValue({}) },
      procedureExploreCategory: { upsert: vi.fn().mockResolvedValue({}) },
      procedureTranslation: {
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockImplementation(() => {
          executionOrder.push('translation_create');
          return Promise.resolve({});
        }),
      },
      procedureRevision: {
        create: vi.fn().mockImplementation(() => {
          executionOrder.push('revision_create');
          return Promise.resolve({});
        }),
      },
    };

    const mockPrisma: any = {
      $queryRaw: vi.fn().mockResolvedValue([
        {
          current_database: 'dentalvis_dev',
          current_user: 'dentalvis_user',
          inet_server_addr: '127.0.0.1',
          inet_server_port: 5432,
        },
      ]),
      user: { findUnique: vi.fn().mockResolvedValue(null) },
      department: { findMany: vi.fn().mockResolvedValue([]) },
      exploreCategory: { findMany: vi.fn().mockResolvedValue([]) },
      procedure: { findMany: vi.fn().mockResolvedValue([]) },
      $transaction: vi.fn().mockImplementation(async (callback) => {
        return callback(mockTx);
      }),
    };

    const options: SeedCliOptions = {
      mode: 'execute',
      allowSeedEnv: true,
      isProduction: false,
      yes: true,
    };

    await executeSeed(mockPrisma, options);

    // Verify BigInt lock was passed
    expect(DENTALVIS_SEED_ADVISORY_LOCK_BIGINT).toBe(739201948572019481n);

    // Assert that advisory_lock is strictly the VERY FIRST operation executed inside tx
    expect(executionOrder[0]).toBe('advisory_lock');
    expect(executionOrder.indexOf('advisory_lock')).toBeLessThan(executionOrder.indexOf('user_upsert'));
    expect(executionOrder.indexOf('user_upsert')).toBeLessThan(executionOrder.indexOf('translation_create'));
  });

  it('aborts transaction and fails closed when advisory lock acquisition fails', async () => {
    const mockTx: any = {
      $queryRaw: vi.fn().mockRejectedValue(new Error('deadlock detected or lock timeout')),
      user: { upsert: vi.fn() },
      department: { upsert: vi.fn() },
    };

    const mockPrisma: any = {
      $queryRaw: vi.fn().mockResolvedValue([
        {
          current_database: 'dentalvis_dev',
          current_user: 'dentalvis_user',
          inet_server_addr: '127.0.0.1',
          inet_server_port: 5432,
        },
      ]),
      user: { findUnique: vi.fn().mockResolvedValue(null) },
      department: { findMany: vi.fn().mockResolvedValue([]) },
      exploreCategory: { findMany: vi.fn().mockResolvedValue([]) },
      procedure: { findMany: vi.fn().mockResolvedValue([]) },
      $transaction: vi.fn().mockImplementation(async (callback) => {
        return callback(mockTx);
      }),
    };

    const options: SeedCliOptions = {
      mode: 'execute',
      allowSeedEnv: true,
      isProduction: false,
      yes: true,
    };

    await expect(executeSeed(mockPrisma, options)).rejects.toThrow(
      'Failed to acquire PostgreSQL advisory transaction lock'
    );
    // Ensure no mutations were executed
    expect(mockTx.user.upsert).not.toHaveBeenCalled();
    expect(mockTx.department.upsert).not.toHaveBeenCalled();
  });

  it('ensures transaction failure rolls back all seed mutations', async () => {
    const mockTx: any = {
      $queryRaw: vi.fn().mockResolvedValue([{ pg_advisory_xact_lock: '' }]),
      user: {
        upsert: vi.fn().mockRejectedValue(new Error('Simulated database write error during user upsert')),
      },
    };

    const mockPrisma: any = {
      $queryRaw: vi.fn().mockResolvedValue([
        {
          current_database: 'dentalvis_dev',
          current_user: 'dentalvis_user',
          inet_server_addr: '127.0.0.1',
          inet_server_port: 5432,
        },
      ]),
      user: { findUnique: vi.fn().mockResolvedValue(null) },
      department: { findMany: vi.fn().mockResolvedValue([]) },
      exploreCategory: { findMany: vi.fn().mockResolvedValue([]) },
      procedure: { findMany: vi.fn().mockResolvedValue([]) },
      $transaction: vi.fn().mockImplementation(async (callback) => {
        return callback(mockTx);
      }),
    };

    const options: SeedCliOptions = {
      mode: 'execute',
      allowSeedEnv: true,
      isProduction: false,
      yes: true,
    };

    await expect(executeSeed(mockPrisma, options)).rejects.toThrow(
      'Simulated database write error during user upsert'
    );
  });
});

describe('Root .env Loading Precedence & IP Normalization Verification (B3.5.2)', () => {
  it('normalizes server address removing /32 host masks via host(inet_server_addr())', async () => {
    // When PostgreSQL executes host(inet_server_addr()), it returns e.g. '172.18.0.2' without '/32'
    const mockPrisma: any = {
      $queryRaw: vi.fn().mockResolvedValue([
        {
          current_database: 'dentalvis_dev',
          current_user: 'dentalvis_user',
          inet_server_addr: '172.18.0.2',
          inet_server_port: 5432,
        },
      ]),
    };

    const identity = await inspectDatabaseIdentity(mockPrisma);
    expect(identity.serverAddr).toBe('172.18.0.2');
    expect(identity.serverAddr).not.toContain('/32');
  });

  it('fails closed when inspectDatabaseIdentity encounters NULL server address', async () => {
    const mockPrisma: any = {
      $queryRaw: vi.fn().mockResolvedValue([
        {
          current_database: 'dentalvis_dev',
          current_user: 'dentalvis_user',
          inet_server_addr: null,
          inet_server_port: 5432,
        },
      ]),
    };

    const identity = await inspectDatabaseIdentity(mockPrisma);
    expect(identity.serverAddr).toBeNull();

    const validation = validateDatabaseIdentity(identity, '172.18.0.0/16');
    expect(validation.isValid).toBe(false);
    expect(validation.rejectionReason).toContain('Server address is missing or unverifiable (null/empty)');
  });

  it('validates actual Docker network bridge address against configured subnet', () => {
    // Actual Docker bridge IP from inspect: 172.18.0.2, Subnet: 172.18.0.0/16
    const identity: DatabaseIdentity = {
      currentDatabase: 'dentalvis_dev',
      currentUser: 'dentalvis_user',
      serverAddr: '172.18.0.2',
      serverPort: 5432,
    };

    // Valid when matched against actual subnet
    const valid = validateDatabaseIdentity(identity, '172.18.0.0/16');
    expect(valid.isValid).toBe(true);

    // Rejected when subnet is mismatched
    const mismatched = validateDatabaseIdentity(identity, '172.20.0.0/16');
    expect(mismatched.isValid).toBe(false);
    expect(mismatched.rejectionReason).toContain("does not belong to the explicitly configured DentalVis Docker subnet (172.20.0.0/16)");

    // Fails closed when subnet is missing
    const missingSubnet = validateDatabaseIdentity(identity, undefined);
    expect(missingSubnet.isValid).toBe(false);
    expect(missingSubnet.rejectionReason).toContain('no explicit DENTALVIS_DOCKER_SUBNET is configured. Fails closed');
  });
});
