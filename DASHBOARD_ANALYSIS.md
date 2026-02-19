# Dashboard Graphs Analysis - Issues Found

## Summary
The task is to verify if dashboard graphs align with actual bills and data. After analyzing all dashboard pages and the DataContext, several issues were found where graphs use hardcoded/mock data instead of actual bill data.

---

## Issues Found by Dashboard

### 1. ManagerDashboard (`src/app/pages/ManagerDashboard.tsx`)

#### ❌ Issues:
- **Approval Delay Tracking Chart**: Uses hardcoded mock data:
  ```javascript
  const delayData = [
    { day: 'Mon', hours: 2.1 },
    { day: 'Tue', hours: 1.8 },
    // ... more mock data
  ];
  ```
  Should calculate from actual `approvalHistory` timestamps.

- **Department-wise Expense Chart**: Uses hardcoded mock data:
  ```javascript
  const deptData = [
    { dept: 'Sales', amount: 45000 },
    { dept: 'Marketing', amount: 32000 },
    // ... more mock data
  ];
  ```
  Should derive from actual bills grouped by department/vendor.

#### ✅ Correct:
- Stats cards correctly use actual bill data (pendingFinalApprovals, highAmountBills, riskAlerts)

---

### 2. EmployeeDashboard (`src/app/pages/EmployeeDashboard.tsx`)

#### ❌ Issues:
- **No Charts**: Only has stats cards and a table. Could benefit from charts showing:
  - Personal expense trends over time
  - Category-wise spending breakdown

#### ✅ Correct:
- Stats cards correctly filter bills for the current user
- Table shows recent activity from actual data

---

### 3. AccountsDashboard (`src/app/pages/AccountsDashboard.tsx`)

#### ❌ Issues:
- **Monthly Expense Trend Chart**: Has hardcoded January data:
  ```javascript
  const monthlyData = [
    { month: 'Jan', amount: 85000 },  // Hardcoded!
    { month: 'Feb', amount: totalMonthlyExpense },  // Only Feb uses real data
  ];
  ```
  Should use actual bill data for multiple months (e.g., last 6 months).

#### ✅ Correct:
- Category-wise expense chart correctly filters bills by category
- Stats cards use actual bill data

---

### 4. AdminDashboard (`src/app/pages/AdminDashboard.tsx`)

#### ❌ Issues:
- **Total Users**: Hardcoded to 48
- **Vendor-wise Spending Chart**: Uses empty `vendors` array (mockVendors is empty in DataContext)
  ```javascript
  const mockVendors: Vendor[] = [];  // Empty!
  ```
- **Top 5 High Expense Vendors**: Same issue - vendors array is empty

#### ✅ Correct:
- Risk distribution chart correctly filters bills by riskLevel
- Expense growth trend correctly uses actual bills for current month
- Stats cards use actual bill data for most metrics

---

## Fix Plan

### Priority 1: ManagerDashboard
1. Replace hardcoded `delayData` with data derived from `approvalHistory` timestamps
2. Replace hardcoded `deptData` with actual vendor/category-wise expense data

### Priority 2: AccountsDashboard
1. Replace hardcoded `monthlyData` with actual monthly expense data from bills (last 6 months)

### Priority 3: AdminDashboard
1. Make Total Users dynamic (need to track users in system)
2. Vendor charts currently can't show data since vendors array is empty - this is a data model issue

### Priority 4: EmployeeDashboard (Optional Enhancement)
1. Add personal expense trend chart
2. Add category-wise spending pie chart

---

## Dependencies
- No new dependencies needed
- Uses existing Recharts library already imported in the project
- Uses existing bill data from DataContext

