# Active Context: Homeo PMS Application

## Current State

**Application Status**: ✅ Complete Homeopathy Clinic Management System

A complete Homeopathy Clinic Patient Management System built with Next.js 16, TypeScript, and Tailwind CSS 4. Uses localStorage for demo data persistence.

## Recently Completed

- [x] Complete database schema with all entity types (patients, appointments, visits, medicines, etc.)
- [x] localStorage-based data persistence with demo initialization
- [x] Authentication system with role-based access (doctor, admin, receptionist)
- [x] Dashboard with statistics and quick actions
- [x] Patient management (list, add, view, edit, visits, tags, import)
- [x] Appointments module (list, schedule, manage)
- [x] Doctor Panel with smart prescription parsing
- [x] Queue management system (main and doctor view)
- [x] Internal messaging system
- [x] Settings pages (general, fees, registration, slots, smart-parsing)
- [x] Smart Parsing Settings for prescription recognition
- [x] Enhanced smart parsing system with configurable rules
- [x] Combination medicine dropdown handling
- [x] Admin module (users, activity log)
- [x] UI Components library (Button, Card, Input, Badge, PhotoUpload)
- [x] Layout components (Header, Sidebar)

## Current Structure

| Module | Path | Status |
|--------|------|--------|
| Authentication | `/login` | ✅ Complete |
| Dashboard | `/dashboard` | ✅ Complete |
| Patients | `/patients`, `/patients/new`, `/patients/[id]` | ✅ Complete |
| Patients | `/patients/[id]/edit`, `/patients/[id]/visits/new` | ✅ Complete |
| Patients | `/patients/tags`, `/patients/import` | ✅ Complete |
| Appointments | `/appointments`, `/appointments/new`, `/appointments/[id]` | ✅ Complete |
| Doctor Panel | `/doctor-panel` | ✅ Complete |
| Queue | `/queue`, `/queue/doctor` | ✅ Complete |
| Messages | `/messages` | ✅ Complete |
| Settings | `/settings`, `/settings/fees`, `/settings/registration`, `/settings/slots`, `/settings/smart-parsing` | ✅ Complete |
| Admin | `/admin/users`, `/admin/activity-log` | ✅ Complete |

## API Routes

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/patients` | GET, POST, PUT, DELETE | Patient CRUD |
| `/api/appointments` | GET, POST, PUT, DELETE | Appointment CRUD |
| `/api/visits` | GET, POST, PUT, DELETE | Visit/Prescription CRUD |
| `/api/medicines` | GET, POST, PUT, DELETE | Medicine CRUD |
| `/api/combinations` | GET, POST, PUT, DELETE | Combination medicines |
| `/api/fees` | GET, POST, PUT, DELETE | Consultation fees |
| `/api/slots` | GET, POST, PUT, DELETE | Time slots |
| `/api/queue` | GET, POST, PUT, DELETE | Queue management |
| `/api/messages` | GET, POST, PUT, DELETE | Internal messaging |
| `/api/users` | GET, POST, PUT, DELETE | User management |
| `/api/patient-tags` | GET, POST, PUT, DELETE | Patient tags |
| `/api/settings` | GET, POST, PUT | App settings |
| `/api/smart-parsing` | GET, POST, PUT | Smart parsing config |

## Demo Credentials

- **Doctor**: doctor / doctor123
- **Admin**: admin / admin123
- **Reception**: reception / reception123

## Key Features

### Smart Prescription Parsing
- Natural language input for prescriptions
- Auto-detects: quantities, dose forms, dosage patterns, durations
- Configurable rules in Settings → Smart Parsing
- **Enhanced Parsing**: Press Ctrl+Enter to parse
- **Quantity patterns**: 1dr, 2dr, 1/2oz, 1oz, 100ml, etc.
- **Dose forms**: pills, tablet, liquid, drops, sachet, powder, ointment, etc.
- **Dose patterns**: OD, BD, TDS (auto-generates 4-4-4), QID, SOS, HS, etc.
- **Combination medicines**: Dropdown below field, displays details when saved

### Role-Based Access
- Admin: Full access to all modules including user management
- Doctor: Access to patients, appointments, prescriptions, queue
- Receptionist: Patients, appointments, queue (read-only for sensitive data)

### UI Components
- Button (variants: primary, secondary, danger, ghost, outline)
- Card (with Header, Title, Content, Footer variants)
- Input (with label, error, helperText support)
- Select and Textarea components
- Badge (with StatusBadge helper)
- PhotoUpload (with preview and remove)

## Session History

| Date | Changes |
|------|---------|
| 2024-02-06 | Complete Homeo PMS application rebuilt from scratch after git sync issue |
| 2024-02-06 | Added all missing pages: patient edit, visits, tags, import; appointment detail; queue doctor; settings pages (fees, registration, slots); UI components; layout components; comprehensive CSS styling |
