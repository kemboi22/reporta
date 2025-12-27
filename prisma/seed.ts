import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const shouldReset = process.argv.includes('--reset')

  if (shouldReset) {
    console.log('🗑️  Resetting database...')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "user_role_assignments" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "role_permissions" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "permissions" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "roles" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "integration_syncs" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "integrations" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "invoices" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "payment_methods" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "subscriptions" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "plans" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "login_attempts" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "user_invitations" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "ip_whitelist_entries" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "audit_logs" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "task_checklists" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "time_logs" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "task_comments" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "task_assignees" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "tasks" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "team_calendars" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "documents" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "milestones" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "project_members" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "projects" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "reports" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "report_templates" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "appraisals" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "leave_requests" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "attendance" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "shift_assignments" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "shifts" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "devices" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "staff" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "user_departments" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "departments" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "notifications" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "notification_preferences" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "two_factor_backup_codes" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "user_invitations" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "workspace_users" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "organization_users" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "workspaces" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "organization_settings" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "billing_addresses" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "organizations" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "passkey" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "twoFactor" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "account" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "session" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "verification" RESTART IDENTITY CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE')
    console.log('✓ Database cleared')
  }

  console.log('🌱 Starting database seed...')

  if (!shouldReset) {
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: 'acme-corp' },
    })

    if (existingOrg) {
      console.log('⚠️  Database already seeded. Skipping...')
      console.log('💡 Run `bun run prisma/seed.ts --reset` to reset and re-seed')
      return
    }
  }

  const organization = await prisma.organization.create({
    data: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
      description: 'A leading technology company',
      website: 'https://acme.com',
      industry: 'Technology',
      size: 'large',
      logo: '/placeholder-logo.svg',
      settings: {
        create: {
          subdomain: 'acme',
          organizationType: 'corporate',
          timezone: 'UTC',
          currency: 'USD',
          locale: 'en-US',
          primaryColor: '#3b82f6',
          workingHoursStart: '09:00',
          workingHoursEnd: '17:00',
          weekendDays: ['saturday', 'sunday'],
          enableAutoAssignTasks: false,
          enableOvertimeTracking: true,
          enablePublicPortal: false,
          enableAuditLogging: true,
          enableTwoFactorAuth: false,
          enableIPWhitelist: false,
          passwordMinLength: 8,
          passwordRequireUppercase: true,
          passwordRequireLowercase: true,
          passwordRequireNumbers: true,
          passwordRequireSpecial: true,
          passwordReuseHistory: 5,
          sessionTimeoutMinutes: 60,
          maxFailedLoginAttempts: 5,
          lockoutDurationMinutes: 30,
          allowedIpRanges: [],
          customDomains: [],
          apiRateLimit: 1000,
        },
      },
      billingAddress: {
        create: {
          line1: '123 Business St',
          line2: 'Suite 100',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94105',
          country: 'USA',
          vatNumber: 'US123456789',
        },
      },
    },
  })

  console.log(`✓ Created organization: ${organization.name}`)

  const workspace = await prisma.workspace.create({
    data: {
      organizationId: organization.id,
      name: 'Main Workspace',
      slug: 'main-workspace',
      description: 'Primary workspace for Acme Corporation',
      color: '#3b82f6',
    },
  })

  console.log(`✓ Created workspace: ${workspace.name}`)

  const user = await prisma.user.create({
    data: {
      id: 'user-001',
      name: 'John Doe',
      email: 'john.doe@acme.com',
      emailVerified: true,
      phoneNumber: '+1234567890',
      phoneNumberVerified: true,
      role: 'ADMIN',
      firstName: 'John',
      lastName: 'Doe',
      avatar: '/placeholder-user.jpg',
      isActive: true,
      lastLoginAt: new Date(),
      notificationPreferences: {
        create: {
          emailEnabled: true,
          emailFrequency: 'instant',
          emailNewTask: true,
          emailTaskAssigned: true,
          emailTaskCompleted: false,
          emailCommentMention: true,
          emailDeadlineReminder: true,
          emailWeeklyDigest: true,
          emailMarketing: false,
          pushEnabled: true,
          pushNewTask: true,
          pushTaskAssigned: true,
          pushTaskCompleted: true,
          pushCommentMention: true,
          pushDeadlineReminder: true,
          pushDailySummary: false,
          smsEnabled: true,
          smsUrgentOnly: true,
          smsDeadlineReminder: false,
          smsShiftReminder: true,
          dndEnabled: false,
          dndStartTime: '22:00',
          dndEndTime: '08:00',
          dndAllowUrgentTasks: true,
          dndAllowMentions: true,
          dndAllowSystemAlerts: true,
          soundEnabled: true,
          soundType: 'default',
        },
      },
    },
  })

  console.log(`✓ Created user: ${user.name}`)

  await prisma.organizationUser.create({
    data: {
      userId: user.id,
      organizationId: organization.id,
      role: 'OWNER',
    },
  })

  console.log('✓ Created organization user relation')

  await prisma.workspaceUser.create({
    data: {
      userId: user.id,
      workspaceId: workspace.id,
      role: 'OWNER',
    },
  })

  console.log('✓ Created workspace user relation')

  const departments = await Promise.all([
    prisma.department.create({
      data: {
        organizationId: organization.id,
        name: 'Engineering',
        description: 'Software development and engineering',
        color: '#3b82f6',
      },
    }),
    prisma.department.create({
      data: {
        organizationId: organization.id,
        name: 'Marketing',
        description: 'Marketing and sales',
        color: '#10b981',
      },
    }),
    prisma.department.create({
      data: {
        organizationId: organization.id,
        name: 'Human Resources',
        description: 'HR and people operations',
        color: '#f59e0b',
      },
    }),
  ])

  console.log(`✓ Created ${departments.length} departments`)

  await Promise.all(
    departments.map((dept) =>
      prisma.userDepartment.create({
        data: {
          userId: user.id,
          departmentId: dept.id,
          isPrimary: dept.name === 'Engineering',
        },
      }),
    ),
  )

  console.log('✓ Created user department relations')

  const staff = await prisma.staff.create({
    data: {
      organizationId: organization.id,
      departmentId: departments[0].id,
      userId: user.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@acme.com',
      phone: '+1234567890',
      position: 'Senior Software Engineer',
      employeeId: 'EMP001',
      avatar: '/placeholder-user.jpg',
      isActive: true,
      hireDate: new Date('2022-01-15'),
      birthDate: new Date('1990-05-20'),
      address: '456 Main St, Apt 10B',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94102',
      emergencyContact: 'Jane Doe - +1987654321',
      salary: 120000,
      currency: 'USD',
      employmentType: 'FULL_TIME',
    },
  })

  console.log(`✓ Created staff: ${staff.firstName} ${staff.lastName}`)

  const devices = await Promise.all([
    prisma.device.create({
      data: {
        organizationId: organization.id,
        name: 'Main Entrance Biometric',
        deviceId: 'DEV-001',
        location: 'Main Entrance',
        type: 'BIOMETRIC',
        isActive: true,
        lastSync: new Date(),
      },
    }),
    prisma.device.create({
      data: {
        organizationId: organization.id,
        name: 'Floor 2 RFID Reader',
        deviceId: 'DEV-002',
        location: 'Floor 2',
        type: 'RFID',
        isActive: true,
        lastSync: new Date(),
      },
    }),
  ])

  console.log(`✓ Created ${devices.length} devices`)

  const shifts = await Promise.all([
    prisma.shift.create({
      data: {
        organizationId: organization.id,
        name: 'Morning Shift',
        startTime: '08:00',
        endTime: '16:00',
        breakDuration: 60,
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        isActive: true,
        color: '#10b981',
      },
    }),
    prisma.shift.create({
      data: {
        organizationId: organization.id,
        name: 'Afternoon Shift',
        startTime: '14:00',
        endTime: '22:00',
        breakDuration: 60,
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        isActive: true,
        color: '#f59e0b',
      },
    }),
  ])

  console.log(`✓ Created ${shifts.length} shifts`)

  await prisma.shiftAssignment.create({
    data: {
      staffId: staff.id,
      shiftId: shifts[0].id,
      startDate: new Date('2022-01-15'),
      isActive: true,
    },
  })

  console.log('✓ Created shift assignment')

  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  await Promise.all([
    prisma.attendance.create({
      data: {
        organizationId: organization.id,
        staffId: staff.id,
        deviceId: devices[0].id,
        checkIn: new Date(new Date(yesterday).setHours(8, 30, 0)),
        checkOut: new Date(new Date(yesterday).setHours(17, 0, 0)),
        breakStart: new Date(new Date(yesterday).setHours(12, 30, 0)),
        breakEnd: new Date(new Date(yesterday).setHours(13, 30, 0)),
        location: 'Main Office',
        notes: 'Normal working day',
        status: 'PRESENT',
      },
    }),
    prisma.attendance.create({
      data: {
        organizationId: organization.id,
        staffId: staff.id,
        deviceId: devices[0].id,
        checkIn: new Date(new Date(today).setHours(8, 45, 0)),
        location: 'Main Office',
        status: 'LATE',
      },
    }),
  ])

  console.log('✓ Created attendance records')

  await prisma.leaveRequest.create({
    data: {
      organizationId: organization.id,
      staffId: staff.id,
      type: 'VACATION',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-19'),
      reason: 'Family vacation',
      status: 'PENDING',
    },
  })

  console.log('✓ Created leave request')

  await prisma.appraisal.create({
    data: {
      organizationId: organization.id,
      staffId: staff.id,
      period: '2025-Q1',
      goals: 'Complete project migration, mentor junior developers',
      achievements: 'Successfully led team project, improved code coverage by 15%',
      rating: 4,
      feedback: 'Excellent performance, strong leadership skills',
      status: 'REVIEWED',
    },
  })

  console.log('✓ Created appraisal')

  const reportTemplate = await prisma.reportTemplate.create({
    data: {
      workspaceId: workspace.id,
      name: 'Weekly Status Report',
      description: 'Template for weekly project status updates',
      fields: {
        fields: [
          {
            name: 'summary',
            type: 'text',
            label: 'Summary',
            required: true,
          },
          {
            name: 'accomplishments',
            type: 'textarea',
            label: 'Key Accomplishments',
            required: true,
          },
          {
            name: 'blockers',
            type: 'textarea',
            label: 'Blockers & Challenges',
            required: false,
          },
          {
            name: 'nextWeekPlan',
            type: 'textarea',
            label: 'Plans for Next Week',
            required: true,
          },
        ],
      },
      isActive: true,
      createdBy: user.id,
    },
  })

  console.log('✓ Created report template')

  await prisma.report.create({
    data: {
      workspaceId: workspace.id,
      templateId: reportTemplate.id,
      staffId: staff.id,
      title: 'Weekly Status Report - Week 1',
      content: {
        summary: 'Made significant progress on the main project',
        accomplishments: 'Completed 3 major features, fixed 5 critical bugs',
        blockers: 'Waiting for API documentation from external team',
        nextWeekPlan: 'Continue development, start integration testing',
      },
      status: 'SUBMITTED',
      submittedBy: user.id,
      submittedAt: new Date(),
    },
  })

  console.log('✓ Created report')

  const project = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      departmentId: departments[0].id,
      name: 'Project Alpha',
      slug: 'project-alpha',
      description: 'Next generation platform development',
      status: 'ACTIVE',
      priority: 'HIGH',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-06-30'),
      budget: 500000,
      currency: 'USD',
      color: '#8b5cf6',
      icon: 'rocket',
      createdBy: user.id,
    },
  })

  console.log(`✓ Created project: ${project.name}`)

  await prisma.projectMember.create({
    data: {
      projectId: project.id,
      userId: user.id,
      role: 'OWNER',
    },
  })

  console.log('✓ Created project member')

  const milestone = await prisma.milestone.create({
    data: {
      projectId: project.id,
      name: 'Milestone 1: Core Features',
      description: 'Complete all core features implementation',
      dueDate: new Date('2025-03-31'),
      status: 'IN_PROGRESS',
    },
  })

  console.log('✓ Created milestone')

  const task = await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      projectId: project.id,
      milestoneId: milestone.id,
      title: 'Implement user authentication',
      description: 'Implement secure user authentication with JWT tokens',
      assignedBy: user.id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date('2025-02-15'),
      estimatedHours: 8,
      actualHours: 5,
      startedAt: new Date(),
      tags: ['backend', 'security', 'authentication'],
      attachments: ['/specs/auth-spec.pdf'],
      position: 1,
    },
  })

  console.log(`✓ Created task: ${task.title}`)

  await prisma.taskAssignee.create({
    data: {
      taskId: task.id,
      userId: user.id,
    },
  })

  console.log('✓ Created task assignee')

  await prisma.taskComment.create({
    data: {
      taskId: task.id,
      userId: user.id,
      content: 'Started working on the authentication flow. JWT implementation is in progress.',
    },
  })

  console.log('✓ Created task comment')

  await prisma.timeLog.create({
    data: {
      taskId: task.id,
      userId: user.id,
      description: 'Working on JWT token generation',
      startTime: new Date(new Date(today).setHours(9, 0, 0)),
      endTime: new Date(new Date(today).setHours(12, 0, 0)),
      duration: 3,
    },
  })

  console.log('✓ Created time log')

  await Promise.all([
    prisma.taskChecklist.create({
      data: {
        taskId: task.id,
        title: 'Design authentication schema',
        isCompleted: true,
        order: 1,
      },
    }),
    prisma.taskChecklist.create({
      data: {
        taskId: task.id,
        title: 'Implement JWT token generation',
        isCompleted: true,
        order: 2,
      },
    }),
    prisma.taskChecklist.create({
      data: {
        taskId: task.id,
        title: 'Add token validation middleware',
        isCompleted: false,
        order: 3,
      },
    }),
    prisma.taskChecklist.create({
      data: {
        taskId: task.id,
        title: 'Write unit tests',
        isCompleted: false,
        order: 4,
      },
    }),
  ])

  console.log('✓ Created task checklist items')

  await prisma.document.create({
    data: {
      workspaceId: workspace.id,
      projectId: project.id,
      name: 'Project Requirements.pdf',
      description: 'Complete project requirements document',
      filePath: '/documents/project-requirements.pdf',
      fileSize: 2048576,
      mimeType: 'application/pdf',
      category: 'Requirements',
      tags: ['requirements', 'planning'],
      visibility: 'PROJECT',
      uploadedBy: user.id,
      downloadedBy: [],
      isPinned: true,
      version: 1,
    },
  })

  console.log('✓ Created document')

  const calendarEvent = await prisma.teamCalendar.create({
    data: {
      workspaceId: workspace.id,
      title: 'Sprint Planning Meeting',
      description: 'Plan tasks for the upcoming sprint',
      type: 'MEETING',
      startDate: new Date('2025-01-30T09:00:00Z'),
      endDate: new Date('2025-01-30T10:30:00Z'),
      allDay: false,
      location: 'Conference Room A',
      attendees: [user.id],
      color: '#3b82f6',
      createdBy: user.id,
    },
  })

  console.log('✓ Created team calendar event')

  await Promise.all([
    prisma.notification.create({
      data: {
        userId: user.id,
        title: 'New Task Assigned',
        message: 'You have been assigned to "Implement user authentication"',
        type: 'INFO',
        isRead: false,
        data: { taskId: task.id },
      },
    }),
    prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Meeting Reminder',
        message: 'Sprint Planning Meeting starts in 1 hour',
        type: 'WARNING',
        isRead: true,
        data: { calendarId: calendarEvent.id },
      },
    }),
    prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome!',
        message: 'Welcome to Reporta! Get started by exploring your workspace.',
        type: 'SUCCESS',
        isRead: true,
      },
    }),
  ])

  console.log('✓ Created notifications')

  const plan = await prisma.plan.create({
    data: {
      name: 'Professional',
      price: 29,
      billingCycle: 'MONTHLY',
      usersLimit: 50,
      storageLimit: 100,
      features: [
        'Unlimited projects',
        'Advanced reporting',
        'Priority support',
        'Custom integrations',
        'Audit logs',
      ],
      isActive: true,
      sortOrder: 1,
    },
  })

  console.log('✓ Created subscription plan')

  const subscription = await prisma.subscription.create({
    data: {
      organizationId: organization.id,
      planId: plan.id,
      status: 'ACTIVE',
      billingCycle: 'MONTHLY',
      usersLimit: 50,
      storageLimit: 100,
      usersUsed: 1,
      storageUsed: 2,
      currentPeriodStart: new Date('2025-01-01'),
      currentPeriodEnd: new Date('2025-02-01'),
      cancelAtPeriodEnd: false,
    },
  })

  console.log('✓ Created subscription')

  await prisma.paymentMethod.create({
    data: {
      subscriptionId: subscription.id,
      provider: 'STRIPE',
      type: 'card',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2026,
      brand: 'Visa',
      isDefault: true,
      providerToken: 'pm_1234567890',
    },
  })

  console.log('✓ Created payment method')

  await prisma.invoice.create({
    data: {
      subscriptionId: subscription.id,
      number: 'INV-2025-001',
      amount: 29,
      currency: 'USD',
      status: 'PAID',
      dueDate: new Date('2025-01-15'),
      paidAt: new Date('2025-01-15'),
    },
  })

  console.log('✓ Created invoice')

  const integration = await prisma.integration.create({
    data: {
      organizationId: organization.id,
      name: 'Biometric Attendance System',
      provider: 'BIOMETRIC',
      status: 'CONNECTED',
      category: 'Attendance',
      configuration: {
        apiKey: 'encrypted_api_key',
        endpoint: 'https://api.biometric.com',
      },
      autoSyncEnabled: true,
      syncInterval: 60,
      lastSyncAt: new Date(),
      lastSyncStatus: 'success',
      isEnabled: true,
    },
  })

  console.log('✓ Created integration')

  await prisma.integrationSync.create({
    data: {
      integrationId: integration.id,
      status: 'success',
      recordsProcessed: 150,
      recordsCreated: 5,
      recordsUpdated: 145,
      completedAt: new Date(),
      duration: 2500,
    },
  })

  console.log('✓ Created integration sync')

  await Promise.all([
    prisma.auditLog.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        action: 'CREATE',
        entityType: 'Project',
        entityId: project.id,
        newValue: { name: 'Project Alpha', status: 'ACTIVE' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        action: 'LOGIN',
        entityType: 'User',
        entityId: user.id,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
      },
    }),
  ])

  console.log('✓ Created audit logs')

  await prisma.iPWhitelistEntry.create({
    data: {
      organizationId: organization.id,
      ipRange: '192.168.1.0/24',
      description: 'Office network',
      isAllowed: true,
    },
  })

  console.log('✓ Created IP whitelist entry')

  await prisma.userInvitation.create({
    data: {
      organizationId: organization.id,
      email: 'jane.smith@example.com',
      role: 'ADMIN',
      departmentId: departments[0].id,
      invitedBy: user.id,
      token: 'invite-token-123456',
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  console.log('✓ Created user invitation')

  await prisma.loginAttempt.create({
    data: {
      userId: user.id,
      email: user.email,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'SUCCESS',
      location: { city: 'San Francisco', country: 'USA' },
      device: { type: 'Desktop', browser: 'Chrome' },
    },
  })

  console.log('✓ Created login attempt')

  const permissions = await Promise.all([
    prisma.permission.create({
      data: {
        name: 'users.create',
        description: 'Create new users',
        category: 'users',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'users.read',
        description: 'Read user information',
        category: 'users',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'users.update',
        description: 'Update user information',
        category: 'users',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'users.delete',
        description: 'Delete users',
        category: 'users',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'tasks.create',
        description: 'Create tasks',
        category: 'tasks',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'tasks.read',
        description: 'Read tasks',
        category: 'tasks',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'tasks.update',
        description: 'Update tasks',
        category: 'tasks',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'tasks.delete',
        description: 'Delete tasks',
        category: 'tasks',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'reports.create',
        description: 'Create reports',
        category: 'reports',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'reports.read',
        description: 'Read reports',
        category: 'reports',
      },
    }),
  ])

  console.log(`✓ Created ${permissions.length} permissions`)

  const role = await prisma.role.create({
    data: {
      name: 'Project Manager',
      displayName: 'Project Manager',
      description: 'Can manage projects and tasks',
      isSystem: false,
      isDefault: false,
      level: 2,
    },
  })

  console.log('✓ Created role')

  await Promise.all(
    permissions.slice(4, 8).map((perm) =>
      prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: perm.id,
        },
      }),
    ),
  )

  console.log('✓ Created role permissions')

  await prisma.userRoleAssignment.create({
    data: {
      userId: user.id,
      roleId: role.id,
      assignedBy: user.id,
    },
  })

  console.log('✓ Created user role assignment')

  console.log('\n✨ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
