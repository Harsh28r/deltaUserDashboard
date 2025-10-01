# Team Hierarchy Module

## Overview
The Team Hierarchy module displays the organizational reporting structure for the logged-in user. It shows all subordinates who report to the user, either directly or indirectly.

## Features
- **View Team Members**: Display all team members in the user's reporting hierarchy
- **Reporting Structure**: Show who each team member reports to
- **Team Types**: Display different team types (project, functional, department)
- **Organization Levels**: Show the hierarchical level of each team member
- **Project Information**: Display associated projects for each reporting relationship
- **Pagination Support**: Handle large teams with pagination
- **Responsive Design**: Works on desktop and mobile devices
- **Permission-Based Access**: Requires `user:read` permission

## Files Created/Modified

### New Files
1. **`src/app/(DashboardLayout)/apps/team-hierarchy/page.tsx`**
   - Main page component for Team Hierarchy
   - Fetches data from the backend API
   - Displays team members in a table format
   - Shows summary statistics

### Modified Files
1. **`src/lib/config.ts`**
   - Added `TEAM_HIERARCHY` endpoint configuration
   - Endpoint: `/api/user-reporting/hierarchy/:userId`

2. **`src/app/components/auth/ModuleSidebar.tsx`**
   - Added Team Hierarchy module to sidebar navigation
   - Icon: `solar:users-group-two-rounded-line-duotone`
   - Color: `text-teal-600`
   - Route: `/apps/team-hierarchy`

3. **`src/app/(DashboardLayout)/layout/vertical/sidebar/MobileSidebar.tsx`**
   - Added Team Hierarchy module to mobile sidebar
   - Added routing functionality for all modules

## API Integration

### Endpoint
```
GET http://localhost:5000/api/user-reporting/hierarchy/:userId
```

### Request Headers
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>",
  "Accept": "application/json"
}
```

### Response Format
```json
{
  "subordinates": [
    {
      "_id": "68d6816020475defae7a84ed",
      "user": {
        "_id": "68d6815f20475defae7a84e1",
        "name": "preeti",
        "email": "preeti@deltayards.com"
      },
      "reportsTo": [
        {
          "user": {
            "_id": "68d6801f20475defae7a83f4",
            "name": "harsh",
            "email": "harsh@deltayards.com"
          },
          "teamType": "project",
          "project": {
            "_id": "68d67ac620475defae7a8271",
            "name": "Sky Hights"
          },
          "context": "text",
          "path": "/68d64284e659aaf9b87e7e25/68d6801f20475defae7a83f4/",
          "_id": "68dbb314cef625146f6d9fbf"
        }
      ],
      "level": 4,
      "createdAt": "2025-09-26T12:04:48.035Z",
      "updatedAt": "2025-09-30T10:38:12.720Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "limit": 10
  }
}
```

## Usage

### Navigation
1. **Desktop**: Click on "Team Hierarchy" in the left sidebar
2. **Mobile**: Open the mobile menu and select "Team Hierarchy"

### Permissions Required
- `user:read` - Basic permission to view team hierarchy
- Users will only see their own team hierarchy (subordinates)

### Features in the UI

#### Summary Cards
- **Total Team Members**: Total count of all subordinates
- **Direct Reports**: Count of people reporting directly to the user
- **Organization Levels**: Maximum depth of the reporting hierarchy

#### Team Members Table
Displays the following information:
- **Team Member**: Name, email, and avatar
- **Level**: Hierarchical level in the organization
- **Reports To**: Name(s) of the manager(s)
- **Team Type**: Type of team (project, functional, department)
- **Project**: Associated project name
- **Actions**: View details button

#### Pagination
- Shows current page and total pages
- Previous/Next navigation buttons
- Displays total item count

## Component Structure

```
TeamHierarchyPage
├── Header Section
│   ├── Title and Icon
│   └── Refresh Button
├── Summary Stats (3 Cards)
│   ├── Total Team Members
│   ├── Direct Reports
│   └── Organization Levels
└── Team Members Card
    ├── Table Header
    ├── Table Body (Team Members)
    └── Pagination Controls
```

## Styling
- Uses Flowbite React components
- Supports dark mode
- Responsive design with Tailwind CSS
- Color-coded badges for team types and levels

## Error Handling
- Loading spinner while fetching data
- Error display with retry button
- Empty state when no team members exist
- API error messages displayed to user

## Future Enhancements
- [ ] Export team hierarchy to CSV/PDF
- [ ] Visual tree diagram of reporting structure
- [ ] Filter by team type or project
- [ ] Search functionality
- [ ] Drill-down into subordinate's subordinates
- [ ] Comparison view across different projects

